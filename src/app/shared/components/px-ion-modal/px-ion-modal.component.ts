import { Component, inject } from '@angular/core';
import { IonButton, ModalController, IonButtons, IonTitle, IonContent} from '@ionic/angular/standalone';
import { PxIonHeaderComponent } from '../px-ion-header/px-ion-header.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-px-ion-modal',
  templateUrl: './px-ion-modal.component.html',
  styleUrls: ['./px-ion-modal.component.scss'],
  imports: [PxIonHeaderComponent, TitleCasePipe, IonButton, IonButtons, IonTitle, IonContent]
})
export class PxIonModalComponent{
  private readonly modalCtrl: ModalController = inject(ModalController);
  public readonly image!: string;
  public readonly name!: string;
  constructor() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
