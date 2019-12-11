import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Observable,
  throwError,
} from 'rxjs';
import {
  retryWhen,
  catchError,
  tap
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class VirtwooAuthHttpInterceptorService implements HttpInterceptor {

  constructor(
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
  ) { }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(this.catchError)
    );
  }

  private catchError = (error: HttpErrorResponse): Observable<never> => {
    let errorCode = 'defaul';

    if (!error.status) {
      errorCode = 'SERVER_UNREACHABLE';
    } else if (error.status >= 500) {
      errorCode = 'SERVER_ERROR';
    } else if (error.error.error) {
      errorCode = error.error.error;
    }
    const message = this.getMessage(errorCode);
    if (!message.startsWith('VIRTWOO_AUTH')) {
      this.matSnackBar.open(this.getMessage(errorCode), null, {duration: 3000, verticalPosition: 'top'});
    }

    return throwError(error);
  }

  private getMessage(errorCode: string): string {
    const basePath = 'VIRTWOO_AUTH.MESSAGE.HTTP_RESPONSE.';

    return this.translateService.instant(`${basePath}${errorCode}`);
  }

}
