import { Component, input } from '@angular/core';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-px-ion-refresher',
  templateUrl: './px-ion-refresher.component.html',
  styleUrls: ['./px-ion-refresher.component.scss'],
  imports: [IonRefresher, IonRefresherContent]
})
export class PxIonRefresherComponent {
  eventRefresh = input.required<() => void>();
  constructor() { }

  handleRefresh(event: any): void {
    setTimeout(() => {
      if (this.eventRefresh) {
        this.eventRefresh()();
      }
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

}
