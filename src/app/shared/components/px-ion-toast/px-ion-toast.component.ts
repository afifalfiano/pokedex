import { Component, Input } from '@angular/core';
import { IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-px-ion-toast',
  templateUrl: './px-ion-toast.component.html',
  styleUrls: ['./px-ion-toast.component.scss'],
  imports: [IonToast]
})
export class PxIonToastComponent {
  @Input() message = '';
  @Input() duration = 3000;
  @Input() trigger = 'toast-info';
  constructor() { }

}
