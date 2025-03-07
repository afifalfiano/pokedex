import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, signal, computed, WritableSignal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonToggle, ModalController, ToastController, IonButtons, IonBackButton, IonFab, IonFabButton, IonLoading, IonSegmentContent, IonSegmentView, IonButton, IonIcon, IonicSlides, IonSegment, IonLabel, IonSegmentButton, IonList, IonItem } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { IPokemonList, PokemonDetail } from '../../common/models/pokemon';
import { HttpErrorResponse } from '@angular/common/http';
import { heart, trash,   } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DataService } from 'src/app/core/services/data.service';
import { API } from 'src/app/common/internal-path';
import { CONFIG, COPY } from 'src/app/common/constants';
import { PxIonHeaderComponent } from "../../shared/components/px-ion-header/px-ion-header.component";
import { PxIonRefresherComponent } from "../../shared/components/px-ion-refresher/px-ion-refresher.component";
import { register } from 'swiper/element/bundle';
import { getPokemonId } from 'src/app/utils';
import { PxIonModalComponent } from 'src/app/shared/components/px-ion-modal/px-ion-modal.component';

register();
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IonItem, IonFab, IonFabButton, IonToggle, IonButtons, IonBackButton, IonSegmentContent, IonSegmentView, IonList, IonSegmentButton, IonLabel, IonSegment, IonIcon, IonButton, IonLoading, IonContent, IonImg, CommonModule, FormsModule, TitleCasePipe, PxIonHeaderComponent, PxIonRefresherComponent]
})
export class DetailPage implements OnInit, OnDestroy{
  private readonly pokemonService = inject(PokemonService)
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  private readonly modalCtrl = inject(ModalController)
  private readonly toastController = inject(ToastController);


  detail = signal<PokemonDetail | undefined | null>(null);
  swiperModules = [IonicSlides];
  isPlayLatest = signal(false);
  isPlayLegacy = signal(false);
  statusLatest = computed(() => this.isPlayLatest() ? "Stop" : "Play");
  statusLegacy = computed(() => this.isPlayLegacy() ? "Stop" : "Play");
  pokemonImage = computed(() => {
    const detail = this.detail();
    let data = [];
    if (detail?.sprites) {
      data = (Object.values(detail.sprites).filter(item => item && typeof(item) === 'string'));
    }
    return data;
  })
  pokemonType = computed(() => this.detail()?.types.map(item => item.type.name))
  isAddedFavorite = false;
  isLoading = true;
  messageToast = '';
  durationToast = CONFIG.duration;
  triggerToast = CONFIG.detail;
  defaultImg = CONFIG.defaultImg;
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

  private doMapData(isFavorite = false): IPokemonList {
    const url = `${API.POKEMON}/${this.detail()?.id}/`;
    const data: IPokemonList = {
      name: this.detail()!.name,
      url: url,
      isAddedFavorite: isFavorite,
      id: getPokemonId(url)
    }
    return data;
  }

    onAddFavorite(): void {
      const data = this.doMapData(true);
      this.isAddedFavorite = true;
      this.messageToast = COPY.SUCCESS;
      this.dataService.update(data);
      this.presentToast('top');
    }

    onRemoveFavorite(): void {
      const data = this.doMapData(false);
      this.isAddedFavorite = false;
      this.messageToast = COPY.REMOVE;
      this.dataService.delete(data);
      this.presentToast('top');
    }

    async openModal(image: string) {
      const modal = await this.modalCtrl.create({
        component: PxIonModalComponent,
        showBackdrop: true,
        animated: true,
        mode: 'ios',
        componentProps: {
          name: this.pokemonName,
          image: image
        }
      });
      modal.present();

    }

    getStatusAudio(audioFile: string, isPlay: WritableSignal<boolean>): void {
      if (audioFile.trim().length === 0) return;
      const el = new Audio(audioFile);
      if (isPlay()) {
        el.pause();
        el.currentTime = 0;
        isPlay.set(false);
        return;
      }

      el.addEventListener('ended', () => {
        isPlay.set(false);
      });
      
      el.addEventListener('error', () => {
        console.error('Failed to play audio:', audioFile);
        isPlay.set(false);
      });
      
      isPlay.set(true);
      
      el.play().catch((err) => {
        console.error('Audio playback failed:', err);
        isPlay.set(false);
      });
    }

    async presentToast(position: 'top' | 'middle' | 'bottom') {
      const toast = await this.toastController.create({
        message: this.messageToast,
        duration: this.durationToast,
        position: position,
      });
  
      await toast.present();
    }

}
