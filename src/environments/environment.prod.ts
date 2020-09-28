import { VirtwooAuthConfig } from '@virtwoo/auth';
import { authConfig, AuthResponse } from './auth.config';
// import { Paths } from '@common/route';

export const virtwooAuthEnvironment: VirtwooAuthConfig = {
  accesssId: authConfig.accesssId,
  apiUrl:  authConfig.apiUrl,
  apiVersion: authConfig.apiVersion,
  social: authConfig.social as any,
  redirectUrl: authConfig.redirectUrl,
  logoUrl: authConfig.logoUrl,
  google: authConfig.google,
  resCallback: AuthResponse
};

export const environment = {
  production: true
};
