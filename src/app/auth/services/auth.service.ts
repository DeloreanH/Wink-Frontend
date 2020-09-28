import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SlRouterService } from '@virtwoo/sl-router';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from '../models/authuser.model';
import { User } from '../../common/models/user.model';
import { Routes } from '../../../app/common/enums/routes/routes.enum';
import { NavController } from '@ionic/angular';
import { RoutesPrincipal } from '../../../app/common/enums/routes/routesPrincipal.enum';
import { SocketService } from 'src/app/core/services/socket.service';
import { WinkService } from 'src/app/core/services/wink.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserData } from 'src/app/common/interfaces/userData.interfaces';

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
    private http: HttpClient,
    private navController: NavController,
    private socketService: SocketService,
    private winkService: WinkService,
    private storageService: StorageService,
  ) {
   }

   Metodo() {
    const ExpUser = 0; // tiempo de expiracion del token del usuario
    const expDate = new Date(new Date().getTime() + + ExpUser * 1000);
    const userx = new AuthUser('', ExpUser, new User({}));
    this.user.next(userx);
    // this.AutoLogout(ExpUser * 1000);
    localStorage.setItem('userData', JSON.stringify(userx));
   }

  AutoLogin() {
    const userData: UserData = this.storageService.apiAuthorization;
    // JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new AuthUser(userData.token, userData.exp, userData.user);
    if (loadedUser.Token) {
      this.user.next(loadedUser);
      this.userService.User(loadedUser.user);
      const expDuration =  userData.exp - (new Date().getTime() / 1000);
      this.AutoLogout(expDuration * 1000);
    }
  }

  async Logout() {
    try {
      const response: any = await this.http.post(Routes.BASE + Routes.LOGOUT, null).toPromise();
      // if (respuesta.status === 'logout successfully' ) {
      this.user.next(null);
      this.userService.User(null);
      this.storageService.DeleteAuthorization();
      this.socketService.Disconnect();
      this.navController.navigateRoot('/' + RoutesPrincipal.LOGIN);
      this.winkService.Destroy();
      // this.router.navigate(['/virtwoo-auth/login']);
      // this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
      if (this.tokenExpiration) {
        clearTimeout(this.tokenExpiration);
      }
      this.tokenExpiration = null;
    // }
    } catch (error) {

    }
  }

  tokenException() {
    try {

      this.user.next(null);
      this.userService.User(null);
      this.storageService.DeleteAuthorization();
      this.socketService.Disconnect();
      this.navController.navigateRoot('/' + RoutesPrincipal.LOGIN);
      this.winkService.Destroy();
      if (this.tokenExpiration) {
        clearTimeout(this.tokenExpiration);
      }
      this.tokenExpiration = null;
    } catch (error) {

    }
  }

  AutoLogout(expDuration: number) {
    this.tokenExpiration = setTimeout( () => {
      this.Logout();
    }, expDuration);
  }
}
