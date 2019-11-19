import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.AuthoLogin();
    return this.authService.user.pipe(
      take(1),
      exhaustMap(
        user => {
          // console.log('req', req);
          // console.log('next', next);
          if (!user) {
            return next.handle(req);
          }
          const modifReq = req.clone({
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.Token)
          });
          return next.handle(modifReq);
        }
      )
      );
  }
}
