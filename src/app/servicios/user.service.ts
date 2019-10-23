import { Injectable } from '@angular/core';
import { User } from '../modelos/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../modelos/routes.enum';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../auth/authuser.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();

  constructor(
    private http: HttpClient,
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
      this.userChanged.next(this.user);
      this.UpdateStorage();
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
}
