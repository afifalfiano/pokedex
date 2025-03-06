import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, cubeOutline, bookmarkOutline } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class AppComponent implements OnInit {
  constructor() {
    addIcons({ list: library, detail: cubeOutline, favorite: bookmarkOutline });
  }

  ngOnInit(): void {
    this.setStatusBar();
  }

  async setStatusBar() {    
    if (Capacitor.isNativePlatform()) {
      try{
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({overlay: false});
        await StatusBar.show();
      } catch (error) {
        console.error('Failed to set status bar', error);
      }
    } else {
      console.log('StatusBar plugin not available on the web');
    }
  };
}
