import { Injectable } from '@angular/core';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { ConfiguracionPerfilService } from './configuracion-perfil.service';
import { SocialNetworkLinks } from '../modelos/socialNetworkLinks.mode';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../modelos/routes.enum';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  // private redesSociales: {redSocial: string, iosName: string, androidName: string, app: string, url: string}[] = [];
  private socialNetworks: SocialNetworkLinks[] = [];

  /*
    {redSocial: 'instagram', url: 'https://www.instagram.com/'},
    {redSocial: 'twitter', url: 'https://twitter.com/'},
    {redSocial: 'facebook', url: 'https://www.facebook.com/'},
    {redSocial: 'linkedin', url: 'https://www.linkedin.com/in/'},
    {redSocial: 'youtube', url: 'https://www.youtube.com/channel/'},
  */

  private mail = 'mailto:';
  private tel = 'tel:';

  constructor(
    private plataform: Platform,
    private http: HttpClient
  ) { }

  async SocialNetwork(nameSocialNetwork: string, userName: string) {
    try {
      console.log('OpenSocialNetwork');
      if (this.socialNetworks.length === 0) {
        const response = await this.LoadSocialNetwork();
      }
      const socialNetwork = this.SearchSocialNetwork(nameSocialNetwork);
      if (socialNetwork) {
        if ( this.plataform.is('mobile') ) {
          this.URL(socialNetwork.url + userName + socialNetwork.complement);
        } else {
          this.URL(socialNetwork.url + userName );
        }
      }
    } catch (err) {
      console.log('Error OpenSocialNetwork', err.message);
    }
    // redSocial = this.BuscarRedSocial(tipoItem.descripcion);
    // this.URL('https://twitter.com/');
    // console.log('https://www.facebook.com/' + userName);
    // window.open('https://twitter.com/', '_system', 'location=yes');
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

  Mail(mail: string) {
    console.log('OpenMail');
    try {
      window.open(this.mail + mail, '_system');
    } catch (err) {
      console.log('Error OpenMail', err.message);
    }
  }

  URL(url: string) {
    console.log('OpenURL');
    try {
      if (url.startsWith('http')) {
        window.open(encodeURI(url), '_system');
      } else {
        window.open(encodeURI('http://' + url), '_system');
      }
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  Tel(num: string) {
    console.log('OpenURL');
    try {
        window.open(encodeURI(this.tel + num ), '_system', 'location=yes');
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  private SearchSocialNetwork(name: string) {
    if (this.socialNetworks.length !== 0) {
      return this.socialNetworks.filter(
        (socialNetwork) => {
          return socialNetwork.name.toLowerCase() === name.toLowerCase();
        }
      )[0];
    } else {
      return null;
    }
  }

  private async LoadSocialNetwork() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get<SocialNetworkLinks[]>(Routes.BASE + Routes.SOCIAL_NETWORK).toPromise();
          this.socialNetworks = [];
          this.socialNetworks.push(...response);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
