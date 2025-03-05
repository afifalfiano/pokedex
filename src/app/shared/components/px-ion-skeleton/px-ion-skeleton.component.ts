import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonLabel, IonThumbnail, IonItem, IonList, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-px-ion-skeleton',
  templateUrl: './px-ion-skeleton.component.html',
  styleUrls: ['./px-ion-skeleton.component.scss'],
  imports: [IonSkeletonText, IonThumbnail, IonLabel, IonList, IonItem, CommonModule, FormsModule]  
})
export class PxIonSkeletonComponent  implements OnInit {
  total = Array(10).fill(null);
  constructor() { }

  ngOnInit() {}

}
