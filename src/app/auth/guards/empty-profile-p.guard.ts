import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { RoutesPrincipal } from '../../../app/common/enums/routes/routesPrincipal.enum';

@Injectable({
  providedIn: 'root'
})
export class EmptyProfilePGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.authService.usuario) {
        this.authService.AuthoLogin();
      }
      return this.authService.user.pipe(
      take(1),
      map( user => {
        if (!user.user.emptyProfile) {
          return true;
        }
        // return true;
        // ruta a redirigir si no esta autenticado
        return this.router.createUrlTree([RoutesPrincipal.DATOS_BASICOS]);
      })
      );
  }

}
