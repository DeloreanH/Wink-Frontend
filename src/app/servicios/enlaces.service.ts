import { Injectable } from '@angular/core';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class EnlacesService {

  // private redesSociales: {redSocial: string, iosName: string, androidName: string, app: string, url: string}[] = [];
  private redesSociales: {redSocial: string,  url: string}[] = [
    {redSocial: 'instagram', url: 'https://www.instagram.com/'},
    {redSocial: 'twitter', url: 'https://twitter.com/'},
    {redSocial: 'facebook', url: 'https://www.facebook.com/'},
  ];
  constructor() { }

  AbrirRedSocial(redSocialNombre: string, username: string) {
    const redSocial = this.BuscarRedSocial(redSocialNombre);
    if (redSocial && username) {
      window.open(redSocial.url + username, '_system');
    } else {
      return ;
    }
  }

  private BuscarRedSocial(redSocial: string) {
    return this.redesSociales.filter(
      (item) => {
        return redSocial.toLowerCase === item.redSocial.toLowerCase;
      }
    )[0];
  }
}
