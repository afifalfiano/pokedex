import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonLabel, IonList, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, IonToolbar, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { PokemonService } from '../api/pokemon.service';
import { IParams, IResponse } from '../models/pokemon';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Image } from '../common/constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonContent, IonList, IonLabel, IonItem, IonAvatar, IonInfiniteScroll, IonInfiniteScrollContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListPage implements OnInit, OnDestroy {
  private readonly pokemonService = inject(PokemonService)
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
  destroy$ = new Subject<void>();
  params = signal<IParams>({
    limit: 20,
    offset: 0
  });
  constructor() { }

  ngOnInit() {
    this.getPokemonList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPokemonList(): void {
    this.pokemonService.getPokemonList(this.params()).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        this.data.update(prev => {
          return {
            ...prev,
            previous: data.previous,
            next: data.next,
            count: data.count,
            results: [...prev.results, ...data.results]
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


}
