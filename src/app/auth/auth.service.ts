import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from './authuser.model';
import { User } from '../modelos/user.model';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { Router } from '@angular/router';
import { UserService } from '../servicios/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<AuthUser>(null);
  usuario: User = null;
  private tokenExpiration: any;
  constructor(
    private slRouterService: SlRouterService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
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
    if (!userData) {
      return;
    }
    const loadedUser = new AuthUser(userData.token, userData.exp, userData.user);
    if (loadedUser.Token) {
      this.user.next(loadedUser);
      this.userService.User(loadedUser.user);
      const expDuration =  userData.exp - (new Date().getTime() / 1000);
      this.AutoLogout(expDuration);
    }
  }

  async Logout() {
    try {
      // const respuesta: any = await this.http.post(Routes.BASE + Routes.LOGOUT, null).toPromise();
      console.log('Logout', );
      // if (respuesta.status === 'logout successfully' ) {
      this.user.next(null);
      this.userService.User(null);
      localStorage.removeItem('userData');
      // this.router.navigate(['/virtwoo-auth/login']);
      this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
      if (this.tokenExpiration) {
        clearTimeout(this.tokenExpiration);
      }
      this.tokenExpiration = null;
    // }
    } catch (error) {

    }
  }

  AutoLogout(expDuration: number) {
    this.tokenExpiration = setTimeout( () => {
      this.Logout();
    }, expDuration);
  }
}
