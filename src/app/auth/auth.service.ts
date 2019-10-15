import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from './authuser.model';
import { User } from '../modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<AuthUser>(null);
  private tokenExpiration: any;
  constructor() {
   }

   Metodo() {
    const ExpUser = 0; // tiempo de expiracion del token del usuario
    const expDate = new Date(new Date().getTime() + + ExpUser * 1000);
    const userx = new AuthUser('', expDate, new User({}));
    this.user.next(userx);
    this.AutoLogout(ExpUser * 1000);
    localStorage.setItem('userData', JSON.stringify(userx));
   }

  AuthoLogin() {
    const userData: {token: string, exp: string, user: User} = JSON.parse(localStorage.getItem('userData'));
    console.log('Usuario:', userData);
    if (!userData) {
      return;
    }
    const loadedUser = new AuthUser(userData.token, new Date(userData.exp), userData.user);

    if (loadedUser.Token) {
      this.user.next(loadedUser);
      const expDuration =  new Date(userData.exp).getTime() - new Date().getTime();
      this.AutoLogout(expDuration);
    }
  }

  Logout() {
    this.user.next(null);
    // router auth
    localStorage.removeItem('userData');
    if (this.tokenExpiration) {
      clearTimeout(this.tokenExpiration);
    }
    this.tokenExpiration = null;
  }

  AutoLogout(expDuration: number) {
    this.tokenExpiration = setTimeout( () => {
      this.Logout();
    }, expDuration);
  }
}
