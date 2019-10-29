import { Injectable } from '@angular/core';
import { Location } from '../modelos/location.model';
import { LocationService } from './location.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../modelos/user.model';
import { Routes } from '../modelos/routes.enum';
import { UserService } from '../servicios/user.service';

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

  GetPublicItems(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.SHOW_PUBLIC_PROFILE, { userToCheckId: idUser}).toPromise();
          console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error GetPublicItems: ' + err.message);
          reject(err);
        }
      }
    );
  }
}
