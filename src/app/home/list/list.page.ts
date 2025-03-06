import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonList, IonItem, IonAvatar, IonSelect, IonSelectOption, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, InfiniteScrollCustomEvent, IonIcon, IonButton, IonSearchbar, IonLoading, IonText } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { IParams, IPokemonList, IResponse } from '../../common/models/pokemon';
import { map, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CONFIG, COPY, IMAGE } from '../../common/constants';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { addIcons } from 'ionicons';
import { library, heart, trash } from 'ionicons/icons';
import { getPokemonId, removeDuplicate } from '../../utils';
import { PxIonHeaderComponent } from "../../shared/components/px-ion-header/px-ion-header.component";
import { PxIonToastComponent } from "../../shared/components/px-ion-toast/px-ion-toast.component";
import { HttpErrorResponse } from '@angular/common/http';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { PxIonRefresherComponent } from "../../shared/components/px-ion-refresher/px-ion-refresher.component";
import { PxIonSkeletonComponent } from "../../shared/components/px-ion-skeleton/px-ion-skeleton.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  providers: [SearchPipe],
  imports: [IonText, SearchPipe, PxIonSkeletonComponent, IonSelect, IonSelectOption, IonLoading, IonSearchbar, IonButton, IonSearchbar, RouterLink, IonContent, IonIcon, IonList, IonLabel, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, CommonModule, FormsModule, PxIonHeaderComponent, PxIonToastComponent, PxIonRefresherComponent, PxIonSkeletonComponent]
})
export class ListPage implements OnInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService);
  private readonly dataService = inject(DataService);
  public urlImage = environment.imageUrl;
  private readonly searchPipe = inject(SearchPipe);
  public title = 'Pokedex';
  public Image = IMAGE;
  durationToast = CONFIG.duration;
  isLoading = true;
  triggerToast = CONFIG.home;
  keywordSearch = signal('');
  typeSelected = signal<IPokemonList>({name: '', url: ''});
  isAllType = computed(() => this.typeSelected().name === 'all');
  types = signal<IResponse<IPokemonList[]>>({
    count: 0, 
    next: '', 
    previous: '', 
    results: []
  })
  data = signal<IResponse<IPokemonList[]>>(
    {
      count: 0, 
      next: '', 
      previous: '', 
      results: []
    }
  )
  total = computed(() => this.searchPipe.transform(this.data().results, this.keywordSearch(), 'name').length);
  destroy$ = new Subject<void>();
  params = signal<IParams>({
    limit: 20,
    offset: 0
  });
  COPY = COPY;
  messageToast = '';

  constructor() {
        addIcons({trash,heart,library:library});
  }

  ngOnInit() {
    this.getPokemonTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  getPokemonTypes(): void {
    this.isLoading = true;
    this.pokemonService.getTypeOfPokemon().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        this.isLoading = false;
        const all = {name: 'All', url: ''};
        const store = {
          ...data,
          results: [all, ...data.results]
        }
        this.types.set(store);
        this.typeSelected.set(all);
        this.getPokemonList();
      },
      error: (err) => {
        this.isLoading = false;
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    })
  }

  getPokemonList(): void {
    if (this.total() === 0) {
      this.isLoading = true;
    }
    this.pokemonService.getPokemonList(this.params()).pipe(
      takeUntil(this.destroy$),
      map(item => {
        return {
          ...item,
          results: item.results.map(item => {
            return {
              ...item,
              isAddedFavorite: !!this.dataService.find(item.name),
              id: getPokemonId(item.url),
            }
          })
        }
      })
    ).subscribe({
      next: data => {
        this.isLoading = false;
        this.data.update(prev => {
          let finalData = [];
          if (this.params().offset === 0) {
            finalData = data.results;
          }
          finalData = removeDuplicate([...prev.results, ...data.results], 'name')
          return {
            ...prev,
            previous: data.previous,
            next: data.next,
            count: data.count,
            results: finalData
          }
        });

      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      }
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this.data().results.length < this.data().count) {
      this.params.update(prev => {
        return {
          limit: 20,
          offset: prev.offset + 20
        }
      })
      setTimeout(() => {
        this.getPokemonList();
        event.target.complete();
      }, 700);
    }
  }

  onSearch(event: any): void {
    const pokemon = event.detail.value;
    this.keywordSearch.set(pokemon);
  }

  private updateCurrentData(pokemon: IPokemonList, isFavorite = false): void {
    this.data.update(item => {
      const idx = item.results.findIndex((item: IPokemonList) => item.name === pokemon.name);
      if(idx > -1) {
        item.results[idx] = {
          ...item.results[idx],
          isAddedFavorite: isFavorite
        }
      }
      return {...item};
    })
  }

  onAddFavorite(pokemon: IPokemonList): void {
    this.updateCurrentData(pokemon, true);
    this.dataService.update(pokemon);
    this.messageToast = COPY.SUCCESS;
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.updateCurrentData(pokemon, false);
    this.dataService.delete(pokemon);
    this.messageToast = COPY.REMOVE;
  }


  getIDetailTypePokemon(): void {
    if (this.typeSelected().url.trim().length === 0) return;
    this.isLoading = true;
    this.pokemonService.getDetailTypeOfPokemon(this.typeSelected().url).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        this.isLoading = false;
        const list = data.pokemon.map((item) => {
          return {
            name: item.pokemon.name,
            url: item.pokemon.url,
            id: getPokemonId(item.pokemon.url),
            isAddedFavorite: !!this.dataService.find(item.pokemon.name)
          }
        });
        this.data.update(prev => {
          return {
            previous: null,
            next: null,
            count: list.length,
            results: list
          }
        });
      },error: (err) => {
        this.isLoading = false;
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
    })
  }

  handleChange(event: CustomEvent) {
    const selected = event.detail.value;
    this.typeSelected.set(selected);
    if (this.typeSelected().url.trim().length === 0) {
      this.getPokemonList();
      return;
    }
    this.getIDetailTypePokemon();
  }

  refreshPage(): void {
    this.params.update(prev => {
      return {
        offset: 0,
        limit: 20
      }
    })
    this.getPokemonTypes();
  }
}
