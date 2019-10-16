import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { RoutesName } from './app-routing.module';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private slRouterService: SlRouterService,
    private authServicie: AuthService
  ) {
    this.initializeApp();
    this.translateService.setDefaultLang('en');
    this.checkUser();
  }

  ngOnInit() {
    this.authServicie.AuthoLogin();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private checkUser(): void {
    const token = localStorage.getItem('userData');

    if (token) {
      // this.slRouterService.setRoot(RoutesName.Home, true);
      this.slRouterService.setRoot(RoutesName.Home, true);
    } else {
      // this.slRouterService.setRoot(RoutesName.ConfigurarPerfil, true);
      this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
    }
  }

  Login() {
    console.log('login', this.authServicie.usuario ? true : false);
    return this.authServicie.usuario ? true : false;
  }
}
