import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Observable,
} from 'rxjs';
import {
  finalize,
  map,
  concatMap
} from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { VirtwooAuthServerService } from '../virtwoo-auth-server';

declare var facebookConnectPlugin: any;
declare var FB: any;

interface FacebookResponse {
  status: string | 'connected';
  authResponse: {
    session_key: boolean;
    accessToken: string;
    expiresIn: number;
    sig: string;
    secret: string;
    userID: string;
  };
}

@Injectable()
export class VirtwooAuthFacebookService {

  constructor(
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private virtwooAuthServerService: VirtwooAuthServerService
  ) { }

  public launch(): Observable<any> {
    return new Observable<any>(observer => {
      try {
        // if (this.isFacebookPlugin) {
          this.facebookLogin()
            .pipe(
              // map(response => response.authResponse.accessToken),
              concatMap(response => this.virtwooAuthServerService.loginFacebook(response)),
              finalize(() => observer.complete() )
            )
            .subscribe(
              (response) => {
                observer.next(response);
              },
              (error) => {
                observer.error(error);
              }
            );
        // }
      } catch (error) {
        observer.error(error);
        observer.complete();
      }
    });
  }

  private get isFacebookPlugin(): boolean {
    if (typeof facebookConnectPlugin !== 'undefined') {
      return true;
    } else {
      const LENGUAGE =  this.translateService.instant('VIRTWOO_AUTH.ERROR.FACEBOOK.PLUGIN');
      this.matSnackBar.open(LENGUAGE, null, { duration: 3000 });

      throw false;
    }
  }

  private facebookLogin(): Observable</*FacebookResponse*/ any> {
    const ACCESS_PROFILE = [
      'public_profile',
      'user_friends',
      'email',
      'user_birthday',
      'user_gender',
      'user_location'
    ];

    return new Observable</*FacebookResponse*/ any>(observer => {
      const accessToken =  'EAAMqi2CyZAh4BADZB8c13DvYmMRElcs7UiaAjuVwl3IoX6PjCNITqwketmftluVI1oxlOThNIKU3cIrMc4HJA9SjwR0Xu5v6xgxmwXVfeVZCYNqD2ZBET1XXUI7nk9KaAS7qrkuLPUqU4BZB47c4kp90OWxDrxOkKbeLR7pCEouaE6qoiZAJ2kRSTlIOpt4Jk9TXneZC7AQyvCxwbYkzpT9t8ZApEBCpj7YZD';

      observer.next(accessToken);
      observer.complete();

      // facebookConnectPlugin.login(ACCESS_PROFILE,
      //   (response: any) => {
      //     observer.next(response);
      //     observer.complete();
      //   },
      //   (error: any) => {
      //     observer.error(error);
      //     observer.complete();
      //   }
      // );
    });
  }

}
