import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoutesPrincipal } from './common/enums/routes/routesPrincipal.enum';
import { StorageService } from './core/services/storage.service';
import { LanguageService, Language } from './core/services/language.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

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
    private screenOrientation: ScreenOrientation,
    private router: Router,
    private storageService: StorageService,
    private languageService: LanguageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.checkUser();
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      setTimeout( () => {
        this.splashScreen.hide();
    }, 600);
      this.Language();
    });
  }

  private Language() {
    if (this.platform.is('mobile')) {
      this.languageService.Init();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    } else {
      const lang = this.storageService.apiLanguage;
      if (lang) {
        this.languageService.DefaultLanguage(lang);
      } else {
        this.languageService.DefaultLanguage(Language.EN);
      }
    }
  }

  private checkUser(): void {
    const token = this.storageService.apiAuthorization;
    if (token) {
      this.router.navigate(['/' + RoutesPrincipal.APP]);
    } else {
      this.router.navigate(['/' + RoutesPrincipal.LOGIN]);
    }
  }

}
