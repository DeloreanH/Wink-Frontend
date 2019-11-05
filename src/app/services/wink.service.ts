import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Routes } from '../config/enums/routes/routes.enum';
import { LocationService } from './location.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WinkService {

  nearbyUsers: User[] = [];

  constructor(
    private locationService: LocationService,
    private http: HttpClient,
    private userService: UserService
  ) { }

  GetNearby() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const location = await this.locationService.GetLocation();
          if (location) {
            const myLocation =  new Location({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            const response = await this.http.post<User[]>(Routes.BASE + Routes.NEARBY_USER, myLocation).toPromise();
            this.nearbyUsers = response;
            this.userService.UpdateLocation(myLocation);
            resolve(response);
          }
        } catch (err) {
          console.log('Error GetNearby: ' + err.message);
          reject(err);
        }
      }
    );
  }

  GetNearby2() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const location = await this.locationService.OpenP();
          if (location) {
            const myLocation =  new Location({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            const response = await this.http.post<User[]>(Routes.BASE + Routes.NEARBY_USER, myLocation).toPromise();
            this.nearbyUsers = response;
            this.userService.UpdateLocation(myLocation);
            resolve(response);
          }
        } catch (err) {
          console.log('Error GetNearby: ' + err.message);
          reject(err);
        }
      }
    );
  }

  GetUser(idUser: string): User {
    if (!idUser) {
      return ;
    }
    const user = this.nearbyUsers.filter(
      (userx: User) => {
        return userx._id === idUser;
      }
    );
    return user[0];
  }

  async GetPublicItems(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.SHOW_PUBLIC_PROFILE, { winkUserId: idUser}).toPromise();
          // console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error GetPublicItems: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async SendWink(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.SEND_WINK, { winkUserId: idUser}).toPromise();
          console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error SendWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async ApproveWink(idWink: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idWink) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.APPROVE_WINK, { wink_id: idWink}).toPromise();
          console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error ApproveWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async DeleteWink(idWink: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idWink) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.DELETE_WINK, { wink_id: idWink}).toPromise();
          console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error DeleteWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async GetWinks() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get(Routes.BASE + Routes.GET_WINKS).toPromise();
          console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error DeleteWink: ' + err.message);
          reject(err);
        }
      }
    );
  }
}
