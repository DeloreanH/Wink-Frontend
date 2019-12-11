import {
  Injectable,
  Inject
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Observable,
  concat,
  BehaviorSubject
} from 'rxjs';
import {
  finalize,
  map
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { VIRTWOO_AUTH_CONFIG } from '../../virtwoo-auth-config.data';
import { VirtwooAuthConfig } from '../../virtwoo-auth-config';
import { VirtwooAuthServerService } from '../virtwoo-auth-server';

interface GoogleResponse {
  accessToken?: string;
  displayName?: string;
  email?: string;
  expires?: number;
  expires_in?: number;
  familyName?: string;
  givenName?: string;
  idToken?: string;
  imageUrl?: string;
  userId?: string;
}

@Injectable()
export class VirtwooAuthGoogleService {

  constructor(
    @Inject(VIRTWOO_AUTH_CONFIG)
    private virtwooAuthConfig: BehaviorSubject<VirtwooAuthConfig>,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private platform: Platform
  ) { }

  public launch(): Observable<any> {
    return new Observable<any>(observer => {
      try {
        if (this.isGooglePlugin) {
          concat(
            this.googleLogin().pipe(
              map(response => {
                return {
                  access_token: response.idToken,
                  access_audience: this.webClientId
                };
              })
            ),
            this.virtwooAuthServerService.loginGoogle
          )
          .pipe(finalize(() => observer.complete() ))
          .subscribe(
            (response) => {
              observer.next(response);
            },
            (error) => {
              observer.error(error);
            }
          );
        }
      } catch (error) {
        observer.error(error);
        observer.complete();
      }

    });
  }

  private get isGooglePlugin(): boolean {
    if (
      (window as any).plugins &&
      (window as any).plugins.googleplus
    ) {
      return true;
    } else {
      const LENGUAGE =  this.translateService.instant('VIRTWOO_AUTH.ERROR.GOOGLE.PLUGIN');
      this.matSnackBar.open(LENGUAGE, null, { duration: 3000 });

      throw false;
    }
  }

  private get config(): VirtwooAuthConfig {
    return this.virtwooAuthConfig.value;
  }

  private webClientId(): string {
    return this.platform.ANDROID
    ? this.config.google.androidWebClientId
    : this.config.google.iosWebClientId;
  }

  private googleLogin(): Observable<GoogleResponse> {
    return new Observable<GoogleResponse>(observer => {
      (window as any).plugins.googleplus.login(
        { webClientId: this.webClientId },
        async (response: GoogleResponse) => {
          observer.next(response);
          observer.complete();
        },
        (error: any) => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

}
