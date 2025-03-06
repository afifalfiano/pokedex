import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonLabel, IonItem, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CONFIG } from 'src/app/common/constants';
import { IPokemonList } from 'src/app/common/models/pokemon';


@Component({
  selector: 'app-px-ion-pokemon-list',
  templateUrl: './px-ion-pokemon-list.component.html',
  styleUrls: ['./px-ion-pokemon-list.component.scss'],
  imports: [IonButton, RouterLink, IonIcon, IonLabel, IonItem, IonAvatar, CommonModule, FormsModule]
})
export class PxIonPokemonListComponent {
  @Input({required: true}) urlImage = '/assets/icon/default.png';
  @Input({required: true}) pokemonName = ''
  @Input({required: true}) isAddedFavorite = false;
  @Input({required: true}) pokemon: IPokemonList | null = null;
  @Input({required: false}) onRemoveFavorite: (pokemon: IPokemonList) => void = () => {};
  @Input({required: false}) onAddFavorite: (pokemon: IPokemonList) => void = () => {};
  @Input({required: true}) triggerToast = CONFIG.home
  constructor() { }

  doAddFavorite() {
    if (this.onAddFavorite && this.pokemon) {
      this.onAddFavorite(this.pokemon);
    }
  }

  doRemoveFavorite() {
    if (this.onRemoveFavorite && this.pokemon) {
      this.onRemoveFavorite(this.pokemon);
    }
  }

}
