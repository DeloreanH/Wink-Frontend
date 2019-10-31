import { Injectable } from '@angular/core';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { ConfiguracionPerfilService } from './configuracion-perfil.service';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  // private redesSociales: {redSocial: string, iosName: string, androidName: string, app: string, url: string}[] = [];
  private redesSociales: {redSocial: string,  url: string}[] = [
    {redSocial: 'instagram', url: 'https://www.instagram.com/'},
    {redSocial: 'twitter', url: 'https://twitter.com/'},
    {redSocial: 'facebook', url: 'https://www.facebook.com/'},
    {redSocial: 'linkedin', url: 'https://www.linkedin.com/in/'},
    {redSocial: 'youtube', url: 'https://www.youtube.com/channel/'},
  ];

  private mail = 'mailto:';
  private tel = 'tel:';
  constructor(
    private informacionPerfilService: ConfiguracionPerfilService
  ) { }

  OpenSocialNetwork(red: string, username: string) {
    console.log('OpenSocialNetwork');
    let tipoItem;
    let redSocial;
    // redSocial = this.BuscarRedSocial(tipoItem.descripcion);
    console.log('https://www.facebook.com/' + username);
    window.open('fb://facewebmodal/f?href=' + username, '_system', 'location=no');
/*
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
    }*/
  }

  OpenMail(mail: string) {
    console.log('OpenMail');
    try {
      window.open(this.mail + 'anibal-1409@hotmail.com', '_system');
    } catch (err) {
      console.log('Error OpenMail', err.message);
    }
  }

  OpenURL(url: string) {
    console.log('OpenURL');
    try {
      console.log('URL', url.startsWith('http'));
      if (url.startsWith('http')) {
        window.open(encodeURI(url), '_system', 'location=yes');
      } else {
        window.open(encodeURI('http://' + 'facebook.com'), '_system', 'location=yes');
      }
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  OpenTel(num: string) {
    console.log('OpenURL');
    try {
        window.open(encodeURI(this.tel + '+584120872584' ), '_system', 'location=yes');
    } catch (err) {
      console.log('Error OpenURL', err.message);
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
