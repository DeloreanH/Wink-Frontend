import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private position: Geoposition = null;

  constructor(
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic,
    private toastService: ToastService
  ) { }

  GetPosition() {
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          if (this.platform.is('mobile')) {
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
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          const state = await this.diagnostic.isLocationEnabled();
          if (state) {
            const response = await this.getLocationCoordinates();
            resolve(response);
          } else {
            this.toastService.Toast('Activate the location of your device to continue.');
            reject(null);
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private async checkAndroid() {
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          const result = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
          if (result.hasPermission) {
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
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          await this.locationAccuracy.canRequest();
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            async (response) => {
              if (response.hasPermission) {
                const resp = await this.askToTurnOnGPS();
                resolve(resp);
              } else {
                this.toastService.Toast('You must activate your location to use the service.');
                reject(null);
              }
            },
            err => {
              reject(err);
            }
          );
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private askToTurnOnGPS() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            async (value) => {
              const resp = await this.getLocationCoordinates();
              resolve(resp);
            },
            err => reject(err)
          );
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private async getLocationCoordinates() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const geoposition = await this.geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 3000
          });
          resolve(geoposition);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

}
