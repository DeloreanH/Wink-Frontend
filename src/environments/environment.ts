import { VirtwooAuthConfig } from '@virtwoo/auth';
import { Routes } from '../app/common/enums/routes/routes.enum';
import { RoutesPrincipal } from '../app/common/enums/routes/routesPrincipal.enum';
// import { Paths } from '@common/route';

export const virtwooAuthEnvironment: VirtwooAuthConfig = {
  accesssId: '5d8d208418dbb9401cb62d1e',
  apiUrl:  Routes.IP + ':5000',
  apiVersion: 'v1',
  social: 'ALL',
  redirectUrl: Routes.BASE + Routes.AUTH,
  logoUrl: '/assets/icon/favicon.png',
  resCallback: (response) => {
    console.log('esta es la respuesta', response);
    localStorage.setItem('userData', JSON.stringify(response));
    console.log('token en', JSON.parse(localStorage.getItem('userData')));
    return RoutesPrincipal.APP;
  }
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
