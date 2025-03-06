import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonSelect, IonSelectOption, IonInfiniteScroll, ToastController, IonInfiniteScrollContent, IonTitle, InfiniteScrollCustomEvent, IonSearchbar, IonLoading, IonText } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { IParams, IPokemonList, IResponse } from '../../common/models/pokemon';
import { map, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CONFIG, COPY, IMAGE_FORMAT } from '../../common/constants';
import { DataService } from '../../core/services/data.service';
import { addIcons } from 'ionicons';
import { library, heart, trash } from 'ionicons/icons';
import { getPokemonId, removeDuplicate } from '../../utils';
import { PxIonHeaderComponent } from "../../shared/components/px-ion-header/px-ion-header.component";
import { HttpErrorResponse } from '@angular/common/http';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { PxIonRefresherComponent } from "../../shared/components/px-ion-refresher/px-ion-refresher.component";
import { PxIonSkeletonComponent } from "../../shared/components/px-ion-skeleton/px-ion-skeleton.component";
import { PxIonPokemonListComponent } from "../../shared/components/px-ion-pokemon-list/px-ion-pokemon-list.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  providers: [SearchPipe],
  imports: [IonText, SearchPipe, PxIonPokemonListComponent, PxIonSkeletonComponent, IonSelect, IonSelectOption, IonLoading, IonSearchbar, IonSearchbar, IonContent, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, CommonModule, FormsModule, PxIonHeaderComponent, PxIonRefresherComponent, PxIonSkeletonComponent, PxIonPokemonListComponent]
})
export class ListPage implements OnInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService);
  private readonly dataService = inject(DataService);
  private readonly searchPipe = inject(SearchPipe);
  private readonly toastController = inject(ToastController);

  urlImage = environment.imageUrl;
  title = 'Pokedex';
  IMAGE_FORMAT = IMAGE_FORMAT;
  durationToast = CONFIG.duration;
  isLoading = true;
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
    this.messageToast = COPY.SUCCESS;
    this.dataService.update({...pokemon, isAddedFavorite: true});
    this.presentToast('top');
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.updateCurrentData(pokemon, false);
    this.dataService.delete(pokemon);
    this.messageToast = COPY.REMOVE;
    this.presentToast('top');
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: this.messageToast,
      duration: this.durationToast,
      position: position,
    });

    await toast.present();
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
