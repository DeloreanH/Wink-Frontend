import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../config/enums/routes/routes.enum';
import { AuthUser } from '../auth/models/authuser.model';
import { VisibilityOption } from '../models/visibilityOptions.enum';
import { Location } from '../models/location.model';
import { LocationService } from './location.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();
  genders: { value: string, description: string}[] = [
    { value: 'femile', description: 'Mujer' },
    { value: 'male', description: 'Hombre'},
    { value: 'other', description: 'Otro'},
    { value: 'i prefer not to say', description: 'Prefiero no decirlo'}
  ];

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) { }

  User(data?: User, updateStorage?: boolean) {
    if (data) {
      this.user = data;
      this.userChanged.next(this.user);
      if (updateStorage) {
        this.UpdateStorage();
      }
    } else {
      return this.user;
    }

  }

  UpdateAvatar(link: string) {
    if (link) {
      this.user.avatarUrl = link;
      this.User(this.user, true);
    }
  }

  async UpdateDate(data) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!data) {
            reject(false);
          }
          const respuesta: any = await this.http.put(Routes.BASE + Routes.UPDATE_BASIC_DATE, data).toPromise();
          this.User(respuesta.user, true);
          console.log('Put', respuesta);
          resolve(respuesta);
        } catch (error) {
          console.log('error', error);
          reject(error);
        }
      }
    );
  }

  private UpdateStorage() {
    const userData: {token: string, exp: number, user: User} = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const loadedUser = new AuthUser(userData.token, userData.exp, this.user);
      localStorage.setItem('userData', JSON.stringify(loadedUser));
    }
  }

  async UpdateStatus(statusValue: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_STATUS, { status: statusValue }).toPromise();
          this.user.status = statusValue;
          this.socketService.UpdateUser(this.user);
          // this.socketService.emit('update-user', this.user);
          this.User(this.user, true);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async UpdateProfiles(value: VisibilityOption) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!value) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_PROFILES, {visibility: value}).toPromise();
          this.user.visibility = value;
          this.User(this.user, true);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async UpdateLocation(location: Location) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          this.user.location.latitude = location.latitude;
          this.user.location.longitude = location.longitude;
          this.User(this.user, true);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
