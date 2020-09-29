import {
  Injectable,
  Inject
} from '@angular/core';
import {
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import {
  Observable,
} from 'rxjs';

import {
  SlRouterService,
} from '@virtwoo/sl-router';
import { VIRTWOO_AUTH_CONFIG } from '../../virtwoo-auth-config.data';
import {
  VirtwooAuthConfig,
  VirtwooAuthProvider
} from '../../virtwoo-auth-config';

import { concatMap } from 'rxjs/operators';

export interface VirtwooAuthResponse {
  username?: string;
  email?: string;
  avatarUrl?: '';
  created?: Date;
  appId?: string;
  auth_token: string;
  birthday?: Date;
  firstName?: string;
  gender?: any;
  lastName?: string;
  platformsId?: any[];
  provider: string;
}

export interface UserCredentials {
  username?: string;
  email?: string;
  password?: string;
}


@Injectable()
export class VirtwooAuthServerService {

  constructor(
    @Inject(VIRTWOO_AUTH_CONFIG)
    private virtwooAuthConfig: VirtwooAuthConfig,
    private http: HttpClient,
    private slRouterService: SlRouterService,
  ) { }

  public changePassword({ password, access_token }): Observable<any> {
    return this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.ChangePasswordToken),
      { password, access_token },
      { headers: this.httpHeaders }
    );
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.ForgotPassword),
      { email },
      { headers: this.httpHeaders }
    );
  }

  public loginFacebook(accessToken: string): Observable<VirtwooAuthResponse> {
    const pre = this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.Facebook),
      { access_token: accessToken },
      { headers: this.httpHeaders }
    );

    return this.login(pre);
  }

  public loginGoogle(access: { access_token: string, access_audience: string }): Observable<VirtwooAuthResponse> {
    // this.http.post<VirtwooAuthResponse>(
    //   this.url(VirtwooAuthProvider.Google),
    //   access,
    //   { headers: this.httpHeaders }
    // ).subscribe(
    //   (data) => {
    //     console.log(data);
    //   }
    // );
    const pre = this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.Google),
      access,
      { headers: this.httpHeaders }
    );

    return this.login(pre);
  }

  public loginSms({ phone, prefix }: { phone: string, prefix: number }): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      this.url(VirtwooAuthProvider.Sms),
      {
        access_phone_number: phone,
        country_code: prefix
      },
      { headers: this.httpHeaders }
    );
  }

  public verifyCode({ accessToken, code }: { accessToken: string, code: number }): Observable<VirtwooAuthResponse> {
    const pre = this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.Verify),
      {
        verify_code: code,
        access_token: accessToken
      },
      { headers: this.httpHeaders }
    );

    return this.login(pre);
  }

  private get config(): VirtwooAuthConfig {
    return this.virtwooAuthConfig;
  }

  private url(provider: VirtwooAuthProvider): string {
    const baseUrl = `${this.config.apiUrl}/${this.config.apiVersion}`;
    return `${baseUrl}${provider}`;
  }

  private get httpHeaders(): HttpHeaders {
    return new HttpHeaders({ access_id: this.config.accesssId });
  }

  public appServer(virtwooAuthResponse: VirtwooAuthResponse): Observable<any> {
    const url = this.config.redirectUrl;

    return this.http.post<any>(url, { access_token: virtwooAuthResponse.auth_token });
  }

  private login(pre: Observable<VirtwooAuthResponse>): Observable<any> {
    return pre
      .pipe(
        concatMap(
          response => this.appServer(response)
        )
      )
      .pipe(
        concatMap(
          resource => this.redirectToApp(resource)
        )
      );
  }

  private redirectToApp(resourceResponse: any): Observable<any> {
    return new Observable<any>(observer => {
      try {
        this.slRouterService.direction = 'root';

        this.slRouterService.push(this.virtwooAuthConfig.resCallback(resourceResponse));

        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  public serverAppLogin({ email, password }: UserCredentials) {
    const pre = this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.Normal),
      {
        user: email,
        password
      },
      { headers: this.httpHeaders }
    );

    return this.login(pre);
  }

  public registerUser(userCredentials: UserCredentials): Observable<VirtwooAuthResponse> {
    const pre = this.http.post<VirtwooAuthResponse>(
      this.url(VirtwooAuthProvider.Register),
      userCredentials,
      { headers: this.httpHeaders }
    );
    return this.login(pre);
  }

}
