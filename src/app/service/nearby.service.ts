import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { Location } from '../modelos/location.model';
import { Routes } from '../modelos/routes.enum';
import { User } from '../modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class NearbyService {

  private coords: Geoposition = null;

  constructor(
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private http: HttpClient
  ) { }

  async Open() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const location = await this.Location();
          const nearby = this.GetNearby();
          resolve(nearby);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async OpenP() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const position2 = await this.geolocation.getCurrentPosition();
          this.coords = position2;
          console.log(position2);
          const nearby = await this.GetNearby();
          resolve(nearby.users);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async Location() {
    const position2 = await this.geolocation.getCurrentPosition();
    console.log(position2);
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const status = await this.locationAccuracy.canRequest();
          if (status) {
            const respon = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
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

  GetNearby(coords?: Location) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!this.coords) {
            reject(false);
          }
          coords = null;
          const response = await this.http.get<User[]>(Routes.BASE + Routes.NEARBY_USER).toPromise();
          resolve({
            users: response,
            location: this.coords ? this.coords.coords : coords
          });
        } catch (err) {
          console.log('Error GetNearby: ' + err.message);
          reject(err);
        }
      }
    );
  }

  get Coords() {
    return this.coords;
  }
}
