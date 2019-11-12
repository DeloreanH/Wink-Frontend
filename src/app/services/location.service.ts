import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

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
    public toastController: ToastController,
    private diagnostic: Diagnostic
  ) { }


  async OpenP() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const position = await this.GetPosition2();
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
          if ( this.platform.is('mobile') ) {
            console.log('Mobile');
            this.locationAccuracy.canRequest().then(async (canRequest) => {
              console.log('canRequest',  `${canRequest}`, `${canRequest}` === '0');
              if (`${canRequest}` === '0') {
                /*const auth = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                console.log('auth', auth);
                if (auth.message === 'All location settings are satisfied.') {
                  const position = await this.GetPosition();
                  console.log('position', position);
                  resolve(position);
                } else {
                  reject(auth.message);
                }*/
                this.askToTurnOnGPS();
                resolve(true);
              } else {
                /*const auth = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                console.log('auth', auth);
                const position = await this.GetPosition();
                resolve(position);*/
                this.askToTurnOnGPS();
                resolve(true);
              }
            }
            );
          } else {
              const position = await this.GetPosition2();
              resolve(position);
          }
        } catch (err) {
          console.log('Error getting location: ' + err.message);
          reject(err);
        }
      }
    );
  }

  get Position() {
    return this.position;
  }

  async Alert(messageText: string) {
    const toast = await this.toastController.create({
      message: messageText,
      duration: 5000
    });
    toast.present();
  }

  GetPosition() {
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          if (this.platform.is('mobile')) {
            if (this.platform.is('ios')) {
              this.checkIOS().then(
                (response) => {
                  resolve(response);
                }
              ).catch(
                (err) => {
                  reject(err);
                }
              );
            } else if (this.platform.is('android')) {
              this.checkAndroid().then(
                (response) => {
                  resolve(response);
                }
              ).catch(
                (err) => {
                  reject(err);
                }
              );
            }
          } else {
            this.getLocationCoordinates().then(
              (response) => {
                resolve(response);
              }
            ).catch(
              (err) => {
                reject(err);
              }
            );
          }
        } catch (err) {

        }
      }
    );
  }

  async checkIOS() {
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          this.diagnostic.isLocationEnabled().then(
            (state) => {
              this.getLocationCoordinates().then(
                (response) => {
                  resolve(response);
                }
              ).catch(
                (err) => {
                  reject(err);
                }
              );
            }
          ).catch(
            (err) => {
              this.Alert('Activate the location of your device to continue.');
              reject(err);
            }
          );
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
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
            result => {
              if (result.hasPermission) {
                this.askToTurnOnGPS().then(
                  (response) => {
                    resolve(response);
                  }
                ).catch(
                  (err) => {
                    reject(err);
                  }
                );
              } else {
                this.requestGPSPermission().then(
                  (response) => {
                    resolve(response);
                  }
                ).catch(
                  (err) => {
                    reject(err);
                  }
                );
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

  private requestGPSPermission() {
    return new Promise<any> (
      async (resolve, reject) => {
        try {
          this.locationAccuracy.canRequest().then((canRequest) => {
            if (canRequest) {
              console.log('nada');
              reject(false);
            } else {
              console.log('aquiiii');
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                .then(
                  (response) => {
                    console.log('response', response);
                    if (response.hasPermission) {
                      this.askToTurnOnGPS().then(
                        (resp) => {
                          resolve(resp);
                        }
                      ).catch(
                        (err) => {
                          reject(err);
                        }
                      );
                    } else {
                      this.Alert('You must activate your location to use the service.');
                      reject(false);
                    }
                  },
                  error => {
                    reject(error);
                  }
                );
            }
          });
        } catch (err) {

        }
      }
    );
  }

  private askToTurnOnGPS() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (valor) => {
              console.log('valor', valor);
              this.getLocationCoordinates().then(
                (response) => {
                  resolve(response);
                }
              ).catch(
                (err) => {
                  reject(err);
                }
              );
            },
            error => reject(error)
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
          this.geolocation.getCurrentPosition().then((response) => {
            this.position = response;
            resolve(response);
          }).catch((error) => {
            resolve('Error getting location' + error);
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  private GetPosition2() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const position = await this.geolocation.getCurrentPosition();
          console.log('position', position);
          this.position = position;
          resolve(position);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
