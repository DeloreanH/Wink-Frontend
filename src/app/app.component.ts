import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { RoutesPrincipal } from './app-routing.module';
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
  }

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
      this.slRouterService.setRoot(RoutesPrincipal.APP, true);
    } else {
      // this.slRouterService.setRoot(RoutesName.ConfigurarPerfil, true);
      this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
    }
  }
}
