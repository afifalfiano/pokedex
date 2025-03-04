import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonList, IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonLoading, IonText, IonSearchbar } from '@ionic/angular/standalone';
import { DataService } from '../core/services/data.service';
import { environment } from 'src/environments/environment';
import { COPY, Image } from '../common/constants';
import { RouterLink } from '@angular/router';
import { IPokemonList } from '../common/models/pokemon';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { PxIonHeaderComponent } from "../shared/components/px-ion-header/px-ion-header.component";
import { PxIonToastComponent } from "../shared/components/px-ion-toast/px-ion-toast.component";
import { SearchPipe } from '../shared/pipes/search.pipe';
import { PxIonRefresherComponent } from "../shared/components/px-ion-refresher/px-ion-refresher.component";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [IonSearchbar, SearchPipe, IonText, IonLoading, IonIcon, IonButton, IonLabel, RouterLink, IonAvatar, IonItem, IonList, IonContent, IonTitle, CommonModule, FormsModule, PxIonHeaderComponent, PxIonToastComponent, PxIonRefresherComponent]
})
export class FavoritePage implements OnInit, OnDestroy {
  private readonly dataService = inject(DataService);
  public title = signal<string>('Favorite');
  data = this.dataService.get();
  public urlImage = environment.imageUrl;
  public Image = Image;
  messageToast = signal('');
  durationToast = signal(3000);
  triggerToast = signal('toast-info');
  isLoading = signal(true);
  keywordSearch = signal('');
  COPY = COPY;
  constructor() { 
    addIcons({trash});
  }
  ngOnDestroy(): void {
    this.isLoading.set(false);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.dataService.delete(pokemon);
    this.messageToast.set(COPY.REMOVE);
  }

  onSearch(event: any): void {
    const pokemon = event.detail.value;
    this.keywordSearch.set(pokemon);
  }

  onPretendEvent(): void {
    return;
  }

}
