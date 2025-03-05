import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, cubeOutline, bookmarkOutline } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';

const setStatusBar = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: '#ffffff' });
  await StatusBar.setOverlaysWebView({overlay: false});
  await StatusBar.show();
};

setStatusBar();
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
