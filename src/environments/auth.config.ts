import { Routes } from '../app/common/enums/routes/routes.enum';
import { RoutesPrincipal } from '../app/common/enums/routes/routesPrincipal.enum';

export const WebClientId = {
  android: '604204991836-erv6no982pa879cvsd6cce8hg9n3c0c9.apps.googleusercontent.com',
  ios: '604204991836-hnipnqfv91srhfk6fg09dijt1idt0g75.apps.googleusercontent.com',
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
