import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from './authuser.model';
import { User } from '../modelos/user.model';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<AuthUser>(null);
  usuario: User = null;
  private tokenExpiration: any;
  constructor(
    private slRouterService: SlRouterService,
  ) {
   }

   Metodo() {
    const ExpUser = 0; // tiempo de expiracion del token del usuario
    const expDate = new Date(new Date().getTime() + + ExpUser * 1000);
    const userx = new AuthUser('', ExpUser, new User({}));
    this.user.next(userx);
    this.AutoLogout(ExpUser * 1000);
    localStorage.setItem('userData', JSON.stringify(userx));
   }

  AuthoLogin() {
    const userData: {token: string, exp: number, user: User} = JSON.parse(localStorage.getItem('userData'));
    console.log('Usuario:', userData);
    if (!userData) {
      return;
    }
    // console.log('****', userData.exp);
    // console.log('HOy', new Date().getTime() / 1000);
    // console.log('Condicion', + userData.exp < new Date().getTime());
    const expDate = new Date(new Date().getTime() + +userData.exp );
    const loadedUser = new AuthUser(userData.token, userData.exp, userData.user);
    // console.log('expDate:', expDate);
    // console.log('loadedUser:', loadedUser);
    // console.log('loadedUser.Token:', loadedUser.Token);
    if (loadedUser.Token) {
      this.user.next(loadedUser);
      this.usuario = loadedUser.user;
      const expDuration =  userData.exp - (new Date().getTime() / 1000);
      // console.log('expDuration', expDuration);
      this.AutoLogout(expDuration);
    }
  }

  Logout() {
    this.user.next(null);
    this.usuario = null;
    this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
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
