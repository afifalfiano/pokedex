import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonLabel, IonItem, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { IPokemonList } from 'src/app/common/models/pokemon';


@Component({
  selector: 'app-px-ion-pokemon-list',
  templateUrl: './px-ion-pokemon-list.component.html',
  styleUrls: ['./px-ion-pokemon-list.component.scss'],
  imports: [IonButton, IonIcon, IonLabel, IonItem, IonAvatar, CommonModule, FormsModule]
})
export class PxIonPokemonListComponent {
  private readonly router = inject(Router);
  
  @Input({required: true}) urlImage = '/assets/icon/default.png';
  @Input({required: true}) pokemonName = ''
  @Input({required: true}) isAddedFavorite = false;
  @Input({required: true}) pokemon: IPokemonList | null = null;
  @Input({required: false}) onRemoveFavorite: (pokemon: IPokemonList) => void = () => {};
  @Input({required: false}) onAddFavorite: (pokemon: IPokemonList) => void = () => {};
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

  goNavigate() {
    const path = `/list/${this.pokemonName}`
    this.router.navigateByUrl(path, {replaceUrl: true});
  }

}
