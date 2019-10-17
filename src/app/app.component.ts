import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { RoutesName } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  eventRouter = new Subscription();
  login = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private slRouterService: SlRouterService,
    private authServicie: AuthService,
    private router: Router
  ) {
    this.translateService.setDefaultLang('en');
    this.initializeApp();
    // this.eventRouter = this.router.events.subscribe(
    //   (valor) => {
    //     let ready = false;
    //     if (valor instanceof NavigationStart) {
    //       // Show loading indicator
    //       console.log('Router', valor.url.split('/'));
    //       if (valor.url.split('/')[1] === 'virtwoo-auth') {
    //         this.login = false;
    //       } else {
    //         this.login = true;
    //       }
    //       ready = true;
    //       console.log('Router', valor);
    //     }
    //     if (valor instanceof NavigationEnd) {
    //       // Hide loading indicator
    //       console.log('Router', valor.url.split('/'));
    //       if (valor.url.split('/')[1] === 'virtwoo-auth') {
    //         this.login = false;
    //       } else {
    //         this.login = true;
    //       }
    //       console.log('Router', valor);
    //     }
    //   }
    // );
    /*this.slRouterService.events$.subscribe(
      (valor) => {
        console.log('Router', valor);
      }
    );*/
  }

  // ngOnInit() {
  //   this.authServicie.AuthoLogin();
  // }

  initializeApp() {
    this.checkUser();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private checkUser(): void {
    const token = localStorage.getItem('userData');

    if (token) {
      // this.slRouterService.setRoot(RoutesName.Home, true);
      this.slRouterService.setRoot(RoutesName.APP, true);
    } else {
      // this.slRouterService.setRoot(RoutesName.ConfigurarPerfil, true);
      this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
    }
  }

  // Login() {
  //   console.log('login', this.authServicie.usuario ? true : false);
  //   return this.authServicie.usuario ? true : false;
  // }

  // Home() {
  //   this.slRouterService.setRoot(RoutesName.Home, true);
  // }

  // ConfiguracionPerfil() {
  //   this.slRouterService.setRoot(RoutesName.ConfigurarPerfil, true);
  // }
}
