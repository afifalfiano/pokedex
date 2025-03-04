import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-px-ion-header',
  templateUrl: './px-ion-header.component.html',
  styleUrls: ['./px-ion-header.component.scss'],
  imports: [IonHeader, IonToolbar, CommonModule]
})
export class PxIonHeaderComponent {
  constructor() { }
}
