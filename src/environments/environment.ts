import { VirtwooAuthConfig } from '@virtwoo/auth';
import { RoutesName } from 'src/app/app-routing.module';
import { Routes } from 'src/app/modelos/routes.enum';
// import { Paths } from '@common/route';

export const virtwooAuthEnvironment: VirtwooAuthConfig = {
  accesssId: '5da628a08f6a5f1dec374c65',
  apiUrl: 'http://192.168.1.119:5000',
  apiVersion: 'v1',
  social: 'ALL',
  redirectUrl: 'http://192.168.1.119:3000/api/auth/authenticate',
  logoUrl: '/assets/icon/favicon.png',
  resCallback: (response) => {
    // console.log('esta es la respuesta', response);
    localStorage.setItem('userData', JSON.stringify(response));
    return RoutesName.APP;
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
