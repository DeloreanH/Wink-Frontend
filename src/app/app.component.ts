import { Component, OnInit, ViewChildren, QueryList, ViewChild, OnDestroy } from '@angular/core';

import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SlRouterService } from '@virtwoo/sl-router';
import { VirtwooAuthPathName } from '@virtwoo/auth';
import { AuthService } from './auth/services/auth.service';
import { Subscription, fromEvent } from 'rxjs';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { RoutesPrincipal } from './common/enums/routes/routesPrincipal.enum';
import { StorageService } from './core/services/storage.service';
import { language } from './common/constants/storage.constants';
import { LanguageService, Language } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
    private router: Router,
    private storageService: StorageService,
    private languageService: LanguageService,
  ) {
    // this.translateService.setDefaultLang('en');
    // this.translateService.use('es');
    this.initializeApp();
  }

  initializeApp() {
    this.checkUser();
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.Language();
    });
  }

  private Language() {
    const lang = this.storageService.apiLanguage;
    if (lang) {
      this.languageService.DefaultLanguage(lang);
      // if (lang === 'es') {
      //   this.translateService.setDefaultLang('en');
      // } else {
      //   this.translateService.setDefaultLang('es');
      // }
      // this.translateService.use(lang);
    } else {
      this.languageService.DefaultLanguage(Language.EN);
      // this.translateService.setDefaultLang('en');
      // this.translateService.use('es');
      // StorageService.SetItem(language, 'es');
    }
  }

  private checkUser(): void {
    const token = this.storageService.apiAuthorization;

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
