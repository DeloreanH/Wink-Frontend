import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(
    private vibration: Vibration,
    private platform: Platform
  ) { }

  Vibrate() {
    try {
      if (this.platform.is('cordova')) {
        this.vibration.vibrate([1000, 500, 1000]);
      }
    } catch (err) {
      console.log('Error Vibrate', err);
    }
  }
}
