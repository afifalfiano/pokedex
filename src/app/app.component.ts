import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, cubeOutline, bookmarkOutline } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class AppComponent {
  constructor() {
    addIcons({ list: library, detail: cubeOutline, favorite: bookmarkOutline });
  }
}
