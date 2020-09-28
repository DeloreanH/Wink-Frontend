import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RoutesPrincipal } from '../../../app/common/enums/routes/routesPrincipal.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.authService.usuario) {
        this.authService.AutoLogin();
      }
      return this.authService.user.pipe(
      take(1),
      map( user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        // ruta a redirigir si no esta autenticado
        return this.router.createUrlTree([RoutesPrincipal.LOGIN]);
      })
      );
  }
}
