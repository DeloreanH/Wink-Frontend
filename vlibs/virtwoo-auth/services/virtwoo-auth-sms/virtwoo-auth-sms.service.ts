import {
  Injectable,
} from '@angular/core';
import {
  Observable
} from 'rxjs';

import { VirtwooAuthServerService } from '../virtwoo-auth-server';
import { finalize } from 'rxjs/operators';

@Injectable()
export class VirtwooAuthSmsService {

  constructor(
    private virtwooAuthServerService: VirtwooAuthServerService
  ) { }

  public launch({ phone, prefix }: { phone: string, prefix: number }): Observable<{access_token: string}> {
    return new Observable<{access_token: string}>(observer => {
      try {
        this.virtwooAuthServerService.loginSms({ phone, prefix })
        .pipe(finalize(() => observer.complete() ))
        .subscribe(
          (response) => {
            observer.next(response);
          },
          (error) => {
            observer.error(error);
          }
        );
      } catch (error) {
        observer.error(error);
        observer.complete();
      }
      return {
        unsubscribe: () => { }
      };
    });
  }

}
