import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonTitle, IonGrid, IonRow, IonCol, IonText, IonLoading, IonButton, IonIcon } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPokemonList, PokemonDetail } from '../../common/models/pokemon';
import { HttpErrorResponse } from '@angular/common/http';
import { heart, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DataService } from 'src/app/core/services/data.service';
import { API } from 'src/app/common/internal-path';
import { COPY } from 'src/app/common/constants';
import { PxIonHeaderComponent } from "../../shared/components/px-ion-header/px-ion-header.component";
import { PxIonToastComponent } from "../../shared/components/px-ion-toast/px-ion-toast.component";
import { PxIonRefresherComponent } from "../../shared/components/px-ion-refresher/px-ion-refresher.component";
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular/standalone';

register();
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IonIcon, IonButton, IonLoading, IonText, RouterLink, IonCol, IonRow, IonGrid, IonContent, IonImg, IonTitle, CommonModule, FormsModule, TitleCasePipe, PxIonHeaderComponent, PxIonToastComponent, PxIonRefresherComponent]
})
export class DetailPage implements OnInit, OnDestroy{
  private readonly pokemonService = inject(PokemonService)
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  swiperModules = [IonicSlides];
  pokemonImage = computed(() => {
    const detail = this.detail();
    let data = [];
    if (detail?.sprites) {
      data = (Object.values(detail.sprites).filter(item => item && typeof(item) === 'string'));
    }
    return data;
  })

  public detail = signal<PokemonDetail | undefined | null>(null);
  isAddedFavorite = false;
  isLoading = true;
  messageToast = '';
  durationToast = 3000;
  triggerToast = 'toast-info';
  pokemonName = this.activatedRoute.snapshot.paramMap.get('id')!;
  constructor() { 
      addIcons({trash,heart});
  }
  ngOnDestroy(): void {
    this.detail.set(null);
    this.isLoading = false;
  }

  ngOnInit() {
    this.getPokemonDetail();
    this.onCheckAddedFavorite();
  }

  onCheckAddedFavorite(): void {
    const data = this.dataService.find(this.pokemonName);
    if (data) {
      this.isAddedFavorite = true;
    }
  }

  getPokemonDetail(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonDetail(this.pokemonName).subscribe({
      next: data => {
        this.isLoading = false;
        this.detail.set(data)
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

    onAddFavorite(): void {
      const data: IPokemonList = {
        name: this.detail()!.name,
        url: `${API.POKEMON}/${this.detail()?.id}`,
        isAddedFavorite: true
      }
      this.isAddedFavorite = true;
      this.messageToast = COPY.SUCCESS;
      this.dataService.update(data);
    }

    onRemoveFavorite(): void {
      const data: IPokemonList = {
        name: this.detail()!.name,
        url: `${API.POKEMON}/${this.detail()?.id}`,
        isAddedFavorite: false 
      }
      this.isAddedFavorite = false;
      this.messageToast = COPY.REMOVE;
      this.dataService.delete(data);
    }

}
