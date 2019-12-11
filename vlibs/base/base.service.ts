import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiConfig } from '../api-config';
import { LocalStorageService } from '../local-storage';

@Injectable()
export class BaseService {

  constructor(protected localStorageService: LocalStorageService, protected apiConfig: ApiConfig) {}

  public getAuthUserId(): any {
    const authInfo = this.localStorageService.getTokenInfo();
    return authInfo.userId || '';
  }

  public get httpHeaders(): HttpHeaders {
    const authInfo = this.localStorageService.getToken() || '';
    return new HttpHeaders({ authorization: authInfo });
  }

  public getURL(): string {
    let baseUrl = `${this.apiConfig.protocol}://${this.apiConfig.host}:${this.apiConfig.port}/${this.apiConfig.apiUrl}/`;
    if (this.apiConfig.version) {
      baseUrl += `${this.apiConfig.version}/`
    }
    return baseUrl;
  }

}
