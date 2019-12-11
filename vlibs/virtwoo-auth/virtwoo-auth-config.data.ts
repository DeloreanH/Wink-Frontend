import { InjectionToken } from '@angular/core';

import { VirtwooAuthConfig } from './virtwoo-auth-config';

export enum VirtwooAuthPathName {
  Login = 'WIRTWOO_AUTH_LOGIN',
  Register = 'WIRTWOO_AUTH_REGISTER',
  ForgotPassword = 'VIRTWOO_AUTH_FORGOT_PASSWORD',
  ChangePassword = 'VIRTWOO_AUTH_CHANGE_PASSWORD',
  Sms = 'VIRTWOO_AUTH_SMS',
  VerifySms = 'VIRTWOO_AUTH_VERIFY_SMS',
  location = 'VIRTWOO_LOCATION',
}

export const VIRTWOO_AUTH_CONFIG = new InjectionToken<VirtwooAuthConfig>('VIRTWOO_AUTH_CONFIG');
