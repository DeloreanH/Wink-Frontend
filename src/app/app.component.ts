import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { AuthService } from './auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesPrincipal } from './common/enums/routes/routesPrincipal.enum';

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
    this.translateService.use('es');
    this.initializeApp();
  }

  initializeApp() {
    this.checkUser();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.backButton.subscribe(
      (resp) => {
      alert('atras');
      resp.register(0, () => alert('atras'));
    });
  }

  private checkUser(): void {
    const token = localStorage.getItem('userData');

    if (token) {
      // this.slRouterService.setRoot(RoutesName.Home, true);
      // this.slRouterService.setRoot(RoutesPrincipal.APP, true);
      this.router.navigate(['/' + RoutesPrincipal.APP]);
    } else {
      // this.slRouterService.setRoot(RoutesName.ConfigurarPerfil, true);
      // this.slRouterService.setRoot(VirtwooAuthPathName.Login, true);
      this.router.navigate(['/' + RoutesPrincipal.LOGIN]);
    }
  }
}
