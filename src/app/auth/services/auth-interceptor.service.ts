import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.AutoLogin();
    return this.authService.user.pipe(
      take(1),
      exhaustMap(
        user => {
          if (!user) {
            return next.handle(req);
          }
          const modifReq = req.clone({
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.Token)
          });
          return next.handle(modifReq).pipe(
            catchError(errorBag => {
                console.log(errorBag.error);
                if (
                  (errorBag.error.error &&
                  errorBag.error.error === 'token not found' ||
                  errorBag.error.error === 'token is blacklisted') ||
                  (errorBag.error.error.message &&
                  errorBag.error.error.message === 'user not found' ||
                  errorBag.error.error.message === 'invalid token') ) {
                  this.authService.tokenException();
              }
                return throwError(errorBag);
            })
          );
        }
      )
      );
  }
}
