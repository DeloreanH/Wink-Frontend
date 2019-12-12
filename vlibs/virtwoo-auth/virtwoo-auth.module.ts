import {
  NgModule,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from '@ngx-translate/core';
import { SLBasePageModule } from '@virtwoo/sl-base-page';
import { SlRouterModule } from '@virtwoo/sl-router';
import { FindCountriesModule } from '@virtwoo/find-countries';

import { VirtwooAuthRoutingModule } from './virtwoo-auth-routing.module';
import {
  VirtwooAuthLoginComponent,
  VirtwooRegisterComponent,
  VirtwooForgotPasswordComponent,
  VirtwooPhoneSmsComponent,
  VirtwooVerifyPhoneSmsComponent,
  VirtwooChangePasswordComponent,
  VirtwooEnableLocationComponent,
} from './pages';
import { VirtwooAuthConfig } from './virtwoo-auth-config';
import { VIRTWOO_AUTH_CONFIG } from './virtwoo-auth-config.data';
import {
  VirtwooAuthFacebookService,
  VirtwooAuthServerService,
  VirtwooAuthGoogleService,
  VirtwooAuthSmsService,
} from './services';
import { VirtwooAuthHttpInterceptorService } from './interceptor';
import {
  VirtwooAuthSocialComponent,
  VirtwooAuthFormComponent
} from './components';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const DECLARATIONS = [
  VirtwooAuthLoginComponent,
  VirtwooAuthSocialComponent,
  VirtwooAuthFormComponent,
  VirtwooRegisterComponent,
  VirtwooForgotPasswordComponent,
  VirtwooPhoneSmsComponent,
  VirtwooVerifyPhoneSmsComponent,
  VirtwooChangePasswordComponent,
  VirtwooEnableLocationComponent,
];

const IMPORT_MATERIAL = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatButtonModule,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ...IMPORT_MATERIAL,
    SLBasePageModule,
    SlRouterModule,
    TranslateModule.forChild(),
    VirtwooAuthRoutingModule,
    FindCountriesModule,
    IonicModule,
    FontAwesomeModule,
  ],
  exports: [
    ...IMPORT_MATERIAL,
    ...DECLARATIONS
  ]
})
export class VirtwooAuthModule {
  static forRoot(config: VirtwooAuthConfig): ModuleWithProviders {
    return {
      ngModule: VirtwooAuthModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: VirtwooAuthHttpInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: VirtwooAuthHttpInterceptorService,
          multi: true
        },
        {
          provide: VIRTWOO_AUTH_CONFIG,
          useValue: config,
        },
        VirtwooAuthFacebookService,
        VirtwooAuthGoogleService,
        VirtwooAuthServerService,
        VirtwooAuthSmsService,
      ]
    };
  }
}
