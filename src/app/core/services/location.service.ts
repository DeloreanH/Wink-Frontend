import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ToastService } from './toast.service';
import { MessagesServices } from 'src/app/common/enums/messagesServices.enum';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic,
    private toastService: ToastService
  ) { }

  GetPosition() {
    return new Promise<Geoposition> (
      async (resolve, reject) => {
        try {
          if (this.platform.is('cordova')) {
            if (this.platform.is('ios')) {
              const response = await this.checkIOS();
              resolve(response);
            } else if (this.platform.is('android')) {
              const response = await this.checkAndroid();
              resolve(response);
            }
          } else {
            const response = await this.getLocationCoordinates();
            resolve(response);
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async checkIOS() {
    return new Promise<Geoposition> (
      async (resolve, reject) => {
        try {
          const state = await this.diagnostic.isLocationEnabled();
          if (state) {
            const response = await this.getLocationCoordinates();
            resolve(response);
          } else {
            this.toastService.Toast(MessagesServices.ACTIVATE_LOCATION);
            const response = await this.askToTurnOnGPS();
            resolve(response);
            // reject({message: 'No LocationEnabled'});
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private async checkAndroid() {
    return new Promise<Geoposition> (
      async (resolve, reject) => {
        try {
          const result = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
          if (result.hasPermission) {
            // await this.locationAccuracy.canRequest();
            const response = await this.askToTurnOnGPS();
            resolve(response);
          } else {
            const response = await this.requestGPSPermission();
            resolve(response);
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private requestGPSPermission() {
    return new Promise<any>(async (resolve, reject) => {
      try {
        await this.locationAccuracy.canRequest();
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            async (response) => {
              if (response.hasPermission) {
                this.askToTurnOnGPS().then(
                  (resp) => {
                    resolve(resp);
                  }
                ).catch( error => reject(error));
              } else {
                reject({messge: 'No hasPermission'});
              }
            },
            (err) => {
              reject(err);
            }
          ).catch( error => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  private askToTurnOnGPS() {
    return new Promise<Geoposition>(async (resolve, reject) => {
      try {
        await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        const resp = await this.getLocationCoordinates();
        resolve(resp);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async getLocationCoordinates() {
    return new Promise<Geoposition>(async (resolve, reject) => {
      try {
        this.geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 3000,
        }).then(
          (geoposition) => {
            resolve(geoposition);
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

}
