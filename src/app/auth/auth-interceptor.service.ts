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
          // console.log('Interceptor', user);
          if (!user) {
            return next.handle(req);
          }
          // const userData: {token: string, exp: string, user: User} = JSON.parse(localStorage.getItem('userData'));
          const modifReq = req.clone({
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.Token)
          });
          // console.log('Interceptor', modifReq);
          return next.handle(modifReq);
        }
      )
      );
  }
}
