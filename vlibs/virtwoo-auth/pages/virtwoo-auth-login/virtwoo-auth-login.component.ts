import {
  Component,
  Inject,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SlRouterService } from '@virtwoo/sl-router';

import { VIRTWOO_AUTH_CONFIG } from '../../virtwoo-auth-config.data';
import { VirtwooAuthConfig } from '../../virtwoo-auth-config';
import { VirtwooAuthServerService } from '../../services';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';
import { LanguageService, Language } from 'src/app/core/services/language.service';

@Component({
  selector: 'mp-virtwoo-auth-login',
  templateUrl: './virtwoo-auth-login.component.html',
  styleUrls: ['./virtwoo-auth-login.component.scss'],
})
export class VirtwooAuthLoginComponent {

  constructor(
    @Inject(VIRTWOO_AUTH_CONFIG)
    private virtwooAuthConfig: VirtwooAuthConfig,
    private slRouterService: SlRouterService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private languageService: LanguageService
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
