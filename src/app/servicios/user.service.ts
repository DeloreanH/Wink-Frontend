import { Injectable } from '@angular/core';
import { User } from '../modelos/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../modelos/routes.enum';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/authuser.model';
import { VisibilityOption } from '../modelos/visibilityOptions.emun';
import { NearbyService } from '../service/nearby.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();

  constructor(
    private http: HttpClient,
    private nearbyService: NearbyService,
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

  async UpdateStatus(status: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!status) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_STATUS, status).toPromise();
          this.user.status = status;
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
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_PROFILES, value).toPromise();
          this.user.visibility = value;
          this.User(this.user, true);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async UpdateLocation() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.nearbyService.Open();
          this.user.location.latitud = response.location.latitude;
          this.user.location.longitud = response.location.longitude;
          this.User(this.user, true);
          resolve(response.users);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
