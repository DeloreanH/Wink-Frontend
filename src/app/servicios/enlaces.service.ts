import { Injectable } from '@angular/core';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { InformacionPerfilService } from './informacion-perfil.service';

@Injectable({
  providedIn: 'root'
})
export class EnlacesService {

  // private redesSociales: {redSocial: string, iosName: string, androidName: string, app: string, url: string}[] = [];
  private redesSociales: {redSocial: string,  url: string}[] = [
    {redSocial: 'instagram', url: 'https://www.instagram.com/'},
    {redSocial: 'twitter', url: 'https://twitter.com/'},
    {redSocial: 'facebook', url: 'https://www.facebook.com/'},
    {redSocial: 'linkedin', url: 'https://www.linkedin.com/in/'},
    {redSocial: 'youtube', url: 'https://www.youtube.com/channel/'},
  ];
  constructor(
    private informacionPerfilService: InformacionPerfilService
  ) { }

  AbrirRedSocial(idTipoItem: string, username: string) {
    let tipoItem;
    let redSocial;

    if (idTipoItem && username) {
      tipoItem = this.informacionPerfilService.BuscarTipoItem(idTipoItem);
    }

    if (tipoItem) {
      redSocial = this.BuscarRedSocial(tipoItem.descripcion);
    }

    if (redSocial) {
      console.log(idTipoItem);
      console.log(redSocial);
      console.log(redSocial.url);
      window.open(redSocial.url + username, '_system');
    }

    if (!idTipoItem || !username || !tipoItem || !redSocial) {
      return null;
    }
  }

  private BuscarRedSocial(redSocial: string) {
    return this.redesSociales.filter(
      (item) => {
        console.log(item.redSocial.toLowerCase(), redSocial.toLowerCase(), item.redSocial.toLowerCase() === redSocial.toLowerCase());
        return item.redSocial.toLowerCase() === redSocial.toLowerCase();
      }
    )[0];
  }
}
