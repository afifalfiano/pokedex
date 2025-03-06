import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonTitle } from '@ionic/angular/standalone';
import { PxIonHeaderComponent } from "../shared/components/px-ion-header/px-ion-header.component";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, CommonModule, PxIonHeaderComponent]
})
export class NotFoundPage  {

  constructor() { }
}
