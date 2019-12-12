import {
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SlRouterService } from '@virtwoo/sl-router';

import { VIRTWOO_AUTH_CONFIG } from '../../virtwoo-auth-config.data';
import { VirtwooAuthConfig } from '../../virtwoo-auth-config';
import { VirtwooAuthServerService } from '../../services';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';
import { LanguageService, Language } from 'src/app/core/services/language.service';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'mp-virtwoo-auth-login',
  templateUrl: './virtwoo-auth-login.component.html',
  styleUrls: ['./virtwoo-auth-login.component.scss'],
})
export class VirtwooAuthLoginComponent implements OnDestroy {
  private backButtonSub: Subscription;
  private countExit = 0;
  private exit = 'app';
  constructor(
    @Inject(VIRTWOO_AUTH_CONFIG)
    private virtwooAuthConfig: VirtwooAuthConfig,
    private slRouterService: SlRouterService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private languageService: LanguageService,
    private platform: Platform
  ) {}

  public goToRegister(): void {
    this.slRouterService.push(VirtwooAuthPathName.Register);
  }

  public goToForgot(): void {
    this.slRouterService.push(VirtwooAuthPathName.ForgotPassword);
  }

  public get config(): VirtwooAuthConfig {
    return this.virtwooAuthConfig;
  }

  public submitted(event: any): void {
    this.virtwooAuthServerService.serverAppLogin(event)
      .subscribe(response => {
        console.log(response);
      });
  }
  ionViewWillEnter() {
    this.countExit = 0;
    this.backButtonSub = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            this.ExitApp();
          }
        );
      }
    );
  }


  ExitApp() {
    this.countExit++;
    if (this.countExit === 2) {
      this.countExit = 0;
      navigator[this.exit].exitApp();
    }
  }


  ionViewDidLeave() {
    this.backButtonSub.unsubscribe();
  }

  ngOnDestroy(): void {
    this.backButtonSub.unsubscribe();
  }

  isEn() {
    return this.languageService.language === 'en';
  }

  isEs() {
    return this.languageService.language === 'es';
  }

  ChangeLanguage(lang: Language) {
    this.languageService.ChangeLanguage(lang);
  }
}
