import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, SearchbarCustomEvent, IonList, IonLoading, IonText, IonSearchbar } from '@ionic/angular/standalone';
import { DataService } from '../core/services/data.service';
import { environment } from 'src/environments/environment';
import { CONFIG, COPY, IMAGE_FORMAT } from '../common/constants';
import { IPokemonList } from '../common/models/pokemon';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { PxIonHeaderComponent } from "../shared/components/px-ion-header/px-ion-header.component";
import { PxIonToastComponent } from "../shared/components/px-ion-toast/px-ion-toast.component";
import { SearchPipe } from '../shared/pipes/search.pipe';
import { PxIonRefresherComponent } from "../shared/components/px-ion-refresher/px-ion-refresher.component";
import { PxIonSkeletonComponent } from "../shared/components/px-ion-skeleton/px-ion-skeleton.component";
import { PxIonPokemonListComponent } from '../shared/components/px-ion-pokemon-list/px-ion-pokemon-list.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [IonSearchbar, SearchPipe, IonText, PxIonPokemonListComponent, IonLoading, IonList, IonContent, IonTitle, CommonModule, FormsModule, PxIonHeaderComponent, PxIonToastComponent, PxIonRefresherComponent, PxIonSkeletonComponent]
})
export class FavoritePage implements OnInit, OnDestroy {
  private readonly dataService = inject(DataService);
  title = 'Favorite';
  data = this.dataService.get();
  total = computed(() => this.data().length);
  urlImage = environment.imageUrl;
  IMAGE_FORMAT = IMAGE_FORMAT;
  messageToast = '';
  durationToast = CONFIG.duration;
  triggerToast = CONFIG.favorite;
  isLoading = true;
  keywordSearch = signal('');
  COPY = COPY;

  constructor() { 
    addIcons({trash});
  }
  ngOnDestroy(): void {
    this.isLoading = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.dataService.delete(pokemon);
    this.messageToast = COPY.REMOVE;
  }

  onSearch(event: SearchbarCustomEvent): void {
    const pokemon = event.detail.value;
    if (pokemon) {
      this.keywordSearch.set(pokemon);
    }
  }

  onPretendEvent(): void {
    return;
  }

}
