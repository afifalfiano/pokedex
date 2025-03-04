import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonAvatar, IonLabel, IonButton, IonIcon, IonToast } from '@ionic/angular/standalone';
import { DataService } from '../core/services/data.service';
import { environment } from 'src/environments/environment';
import { Image } from '../common/constants';
import { RouterLink } from '@angular/router';
import { IPokemonList } from '../common/models/pokemon';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [IonToast, IonIcon, IonButton, IonLabel, RouterLink, IonAvatar, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FavoritePage  {
  private readonly dataService = inject(DataService);
  data = this.dataService.get();
  public urlImage = environment.imageUrl;
  public Image = Image;
  constructor() { 
    addIcons({trash});
  }

  onRemoveFavorite(pokemon: IPokemonList) {
    this.dataService.delete(pokemon);
  }
}
