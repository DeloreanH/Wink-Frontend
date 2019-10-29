import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private coords: Geoposition = null;

  constructor(
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private plataform: Platform
  ) { }


  async OpenP() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const position = await this.geolocation.getCurrentPosition();
          this.coords = position;
          resolve(position);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async GetLocation() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          let status = true;
          if ( this.plataform.is('mobile') ) {
            status = await this.locationAccuracy.canRequest();
            const respon = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
          }
          if (status) {
            const position = await this.geolocation.getCurrentPosition();
            this.coords = position;
            resolve(position);
          }
        } catch (err) {
          console.log('Error getting location: ' + err.message);
          reject(err);
        }
      }
    );
  }

  get Coords() {
    return this.coords;
  }
}
