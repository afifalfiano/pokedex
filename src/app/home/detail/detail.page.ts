import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonImg, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonText, IonLoading, IonButton, IonIcon, IonToast } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPokemonList, PokemonDetail } from '../../common/models/pokemon';
import { HttpErrorResponse } from '@angular/common/http';
import { heart, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DataService } from 'src/app/core/services/data.service';
import { API } from 'src/app/common/internal-path';
import { COPY } from 'src/app/common/constants';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [IonToast, IonIcon, IonButton, IonLoading, IonText, RouterLink, IonCol, IonRow, IonGrid, IonContent, IonImg, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TitleCasePipe]
})
export class DetailPage implements OnInit {
  private readonly pokemonService = inject(PokemonService)
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  public detail: PokemonDetail | undefined | null = null;
  isAddedFavorite = signal(false);
  isLoading = signal(false);
  messageToast = signal('');
  pokemonName = this.activatedRoute.snapshot.paramMap.get('id')!;
  constructor() { 
      addIcons({trash,heart});

      effect(() => {
        console.log(this.dataService.get()(), 'data');
      })
  }

  ngOnInit() {
    this.getPokemonDetail();
  }

  getPokemonDetail(): void {
    this.isLoading.update(prev => !prev);
    this.pokemonService.getPokemonDetail(this.pokemonName).subscribe({
      next: data => {
        console.log(data);
        this.detail = data
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.update(prev => !prev);
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading.update(prev => !prev);
        }, 1000);
      }
    });
  }

    onAddFavorite(): void {
      const data: IPokemonList = {
        name: this.detail!.name,
        url: `${API.POKEMON}/${this.detail!.id}`,
        isAddedFavorite: true
      }
      this.isAddedFavorite.update(prev => !prev);
      this.messageToast.set(COPY.SUCCESS);
      this.dataService.update(data);
    }

    onRemoveFavorite(): void {
      const data: IPokemonList = {
        name: this.detail!.name,
        url: `${API.POKEMON}/${this.detail!.id}`,
        isAddedFavorite: false 
      }
      this.isAddedFavorite.update(prev => !prev);
      this.messageToast.set(COPY.REMOVE);
      this.dataService.delete(data);
    }

}
