import { RoutesPrincipal } from '../app/common/enums/routes/routesPrincipal.enum';

export const WebClientId = {
  android: '431905030876-c5jmqp2opd7so6kk1fmn0acbd51j268h.apps.googleusercontent.com',
  ios: 'com.googleusercontent.apps.431905030876-44d13bo8u5e19bkqmomrqgghllg7bsmv',
};

export function AuthResponse(data: any) {
   // console.log('esta es la respuesta', response);
   localStorage.setItem('userData', JSON.stringify(data));
   // console.log('token en', JSON.parse(localStorage.getItem('userData')));
   return RoutesPrincipal.APP;
}
