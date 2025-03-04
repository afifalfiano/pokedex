import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonImg, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonText, IonLoading, IonButton, IonIcon, IonToast } from '@ionic/angular/standalone';
import { PokemonService } from '../../core/api/pokemon.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPokemonList, PokemonDetail } from '../../common/models/pokemon';
import { HttpErrorResponse } from '@angular/common/http';
import { heart } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DataService } from 'src/app/core/services/data.service';
import { API } from 'src/app/common/internal-path';

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
  isLoading = false;
  pokemonName = this.activatedRoute.snapshot.paramMap.get('id')!;
  constructor() { 
      addIcons({heart});
  }

  ngOnInit() {
    this.getPokemonDetail();
  }

  getPokemonDetail(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonDetail(this.pokemonName).subscribe({
      next: data => {
        console.log(data);
        this.detail = data
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading = false
        }, 1000);
      }
    });
  }

    onAddFavorite(): void {
      const data: IPokemonList = {
        name: this.detail!.name,
        url: `${API.POKEMON}/${this.detail!.id}` 
      }
      this.dataService.update(data);
    }

}
