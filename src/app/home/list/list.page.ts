import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonList, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, InfiniteScrollCustomEvent, IonIcon, IonButton, IonSearchbar, IonLoading } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { IParams, IPokemonList, IResponse } from '../../common/models/pokemon';
import { map, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { COPY, Image } from '../../common/constants';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { addIcons } from 'ionicons';
import { library, heart, trash } from 'ionicons/icons';
import { removeDuplicate } from '../../utils';
import { PxIonHeaderComponent } from "../../shared/components/px-ion-header/px-ion-header.component";
import { PxIonToastComponent } from "../../shared/components/px-ion-toast/px-ion-toast.component";
import { HttpErrorResponse } from '@angular/common/http';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { PxIonRefresherComponent } from "../../shared/components/px-ion-refresher/px-ion-refresher.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [SearchPipe, IonLoading, IonSearchbar, IonButton, IonSearchbar, RouterLink, IonContent, IonIcon, IonList, IonLabel, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, CommonModule, FormsModule, PxIonHeaderComponent, PxIonToastComponent, PxIonRefresherComponent]
})
export class ListPage implements OnInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService);
  private readonly dataService = inject(DataService);
  public urlImage = environment.imageUrl;
  public title = signal<string>('Pokedex');
  public Image = Image;
  durationToast = signal(3000);
  isLoading = signal(true);
  triggerToast = signal('toast-info');
  keywordSearch = signal('');
  data = signal<IResponse>(
    {
      count: 0, 
      next: '', 
      previous: '', 
      results: []
    }
  )
  total = computed(() => this.data().results.length);
  destroy$ = new Subject<void>();
  params = signal<IParams>({
    limit: 20,
    offset: 0
  });
  messageToast = signal('');
  constructor() {
        addIcons({trash,heart,library:library});
  }

  ngOnInit() {
    this.getPokemonList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPokemonList(): void {
    if (this.total() === 0) {
      this.isLoading.set(true);
    }
    this.pokemonService.getPokemonList(this.params()).pipe(
      takeUntil(this.destroy$),
      map(item => {
        return {
          ...item,
          results: item.results.map(item => {
            return {
              ...item,
              isAddedFavorite: false
            }
          })
        }
      })
    ).subscribe({
      next: data => {
        this.isLoading.set(false);
        this.data.update(prev => {
          const finalData = removeDuplicate([...prev.results, ...data.results], 'name')
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
        this.isLoading.set(false);
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading.set(false);
        }, 500);
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

  onAddFavorite(pokemon: IPokemonList): void {
    this.data.update(item => {
      const idx = item.results.findIndex(item => item.name === pokemon.name);
      if(idx > -1) {
        item.results[idx] = {
          ...item.results[idx],
          isAddedFavorite: true
        }
      }
      return {...item};
    })
    this.dataService.update(pokemon);
    this.messageToast.set(COPY.SUCCESS);
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.data.update(item => {
      const idx = item.results.findIndex(item => item.name === pokemon.name);
      if(idx > -1) {
        item.results[idx] = {
          ...item.results[idx],
          isAddedFavorite: false
        }
      }
      return {...item};
    })
    this.dataService.delete(pokemon);
    this.messageToast.set(COPY.REMOVE);
  }
}
