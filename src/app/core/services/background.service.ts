import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';
import { LocalNotificationsService } from './local-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  constructor(
    private backgroundMode: BackgroundMode,
    private platform: Platform,
    private localNotificationsService: LocalNotificationsService,
  ) { 
    this.Listen();
  }

  Enable() {
    if (this.platform.is('cordova') && !this.backgroundMode.isEnabled()) {
      try {
        if (this.platform.is('android')) {
          this.backgroundMode.setDefaults({silent: true});
          this.backgroundMode.configure({silent: true});
        }
        // this.backgroundMode.setEnabled(true);
        this.backgroundMode.enable();
      } catch (error) {
        console.log('error activate back', error);
      }
    }
  }
  get isActive() {
    return this.backgroundMode.isActive();
  }

  get isEnabled() {
    return this.backgroundMode.isEnabled();
  }

  Listen() {
    if (this.platform.is('cordova')) {
      this.backgroundMode.on('activate').subscribe(
        (value) => {
          console.log('activado backgroundmode', value);
        }
      );
      this.backgroundMode.on('deactivate').subscribe(
        (value) => {
          console.log('desactivado backgroundmode', value);
          this.localNotificationsService.CloseAll();
        }
      );
    }
  }

}
