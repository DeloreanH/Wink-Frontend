import { Routes } from '../app/common/enums/routes/routes.enum';
import { RoutesPrincipal } from '../app/common/enums/routes/routesPrincipal.enum';

export const WebClientId = {
  android: '604204991836-n0pqda9hi5k320oscqnerblqqb17u0s9.apps.googleusercontent.com',
  ios: 'com.googleusercontent.apps.431905030876-44d13bo8u5e19bkqmomrqgghllg7bsmv',
};

export const authConfig = {
  accesssId: '5f70dab440bf746c476ea7dc',
  apiUrl:  Routes.IP + ':5050',
  apiVersion: 'v1',
  social: 'ALL',
  redirectUrl: Routes.BASE + Routes.AUTH,
  logoUrl: '/assets/icon/favicon.png',
  google: {
    androidWebClientId: WebClientId.android,
    iosWebClientId: WebClientId.ios,
  },
};

export function AuthResponse(data: any) {
   // console.log('esta es la respuesta', response);
   localStorage.setItem('userData', JSON.stringify(data));
   // console.log('token en', JSON.parse(localStorage.getItem('userData')));
   return RoutesPrincipal.APP;
}
