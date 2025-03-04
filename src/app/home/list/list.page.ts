import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonLabel, IonList, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, IonToolbar, InfiniteScrollCustomEvent, IonIcon, IonButton, IonSearchbar, IonToast } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { IParams, IPokemonList, IResponse } from '../../common/models/pokemon';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Image } from '../../common/constants';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { addIcons } from 'ionicons';
import { library, heart } from 'ionicons/icons';
import { removeDuplicate } from '../../utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonToast, IonSearchbar, IonButton, IonSearchbar,
    RouterLink,
    IonContent, IonIcon, IonList, IonLabel, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListPage implements OnInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService);
  private readonly dataService = inject(DataService);
  public urlImage = environment.imageUrl;
  public Image = Image;
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
  constructor() {
        addIcons({heart,library:library});
   }

  ngOnInit() {
    this.getPokemonList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPokemonList(): void {
    this.pokemonService.getPokemonList(this.params()).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: data => {
        this.data.update(prev => {
          return {
            ...prev,
            previous: data.previous,
            next: data.next,
            count: data.count,
            results: removeDuplicate([...prev.results, ...data.results], 'name')
          }
        });
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

  onSearch(event: any): any {
    const pokemon = event.detail.value;
    if (pokemon.length === 0) {
      this.getPokemonList();
    } else {
      this.data.update(prev => {
        const findData = prev.results.filter(item => item.name.includes(pokemon.toLowerCase()))
        return {
          ...prev,
          results: findData
        }
      });
    }
  }

  onAddFavorite(pokemon: IPokemonList): void {
    this.dataService.update(pokemon);
  }
}
