import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(
    private vibration: Vibration
  ) { }

  Vibrate() {
    this.vibration.vibrate([2000, 1000, 2000]);
  }
}
