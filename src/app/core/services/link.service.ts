import { Injectable } from '@angular/core';
import { SocialNetworkLinks } from '../../common/models/socialNetworkLinks.model';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../../common/enums/routes/routes.enum';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private socialNetworks: SocialNetworkLinks[] = [];
  private mail = 'mailto:';
  private tel = 'tel:';
  private whatsapp = 'whatsapp://send?phone=';

  constructor(
    private plataform: Platform,
    private http: HttpClient
  ) {
    this.Init();
  }

  private async Init() {
    if (this.socialNetworks.length === 0) {
      const response = await this.LoadSocialNetwork();
    }
  }

  SocialNetwork(nameSocialNetwork: string, userName: string, toReturn?: true) {
    try {
      if (this.socialNetworks.length === 0) {
        return;
      }
      const socialNetwork = this.SearchSocialNetwork(nameSocialNetwork);
      if (socialNetwork) {
        if ( this.plataform.is('mobile') ) {
          if (toReturn) {
            return socialNetwork.url + userName + socialNetwork.complement;
          } else {
            this.URL(socialNetwork.url + userName + socialNetwork.complement);
          }
        } else {
          if (toReturn) {
            return socialNetwork.url + userName;
          } else {
          this.URL(socialNetwork.url + userName );
          }
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log('Error OpenSocialNetwork', err.message);
    }
  }

  Mail(mail: string) {
    try {
      window.open(this.mail + mail, '_system');
    } catch (err) {
      console.log('Error OpenMail', err.message);
    }
  }

  WhatsApp(num: string) {
    try {
      window.open(this.whatsapp + num , '_system');
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  URL(url: string) {
    try {
      console.log('url', url);
      if (url.startsWith('http')) {
        window.open(url, '_system');
      } else {
        window.open('http://' + url, '_system');
      }
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  Tel(num: string) {
    try {
        window.open(this.tel + num , '_system', 'location=yes');
    } catch (err) {
      console.log('Error OpenURL', err.message);
    }
  }

  private SearchSocialNetwork(name: string) {
    if (this.socialNetworks.length !== 0 && name) {
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
