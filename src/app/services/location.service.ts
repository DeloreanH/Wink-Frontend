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
          if ( this.plataform.is('mobile') ) {
            console.log('Mobile');
            const permissions = await this.locationAccuracy.canRequest().then(
              async (canRequest: boolean) => {
                if (canRequest) {
                  const response = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                  console.log('response', response);
                  if (response) {
                    const position = await this.geolocation.getCurrentPosition();
                    console.log('position', position);
                    this.coords = position;
                    resolve(position);
                  } else {
                    reject(false);
                  }
                }
              }
            );
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
