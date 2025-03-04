import { Component, input } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-px-ion-toast',
  templateUrl: './px-ion-toast.component.html',
  styleUrls: ['./px-ion-toast.component.scss'],
  imports: [IonToast]
})
export class PxIonToastComponent {
  message = input.required<string>();
  duration = input.required<number>();
  trigger = input.required<string>();
  constructor() { }

}
