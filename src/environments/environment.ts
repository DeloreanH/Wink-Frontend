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
  resCallback: AuthResponse,
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


