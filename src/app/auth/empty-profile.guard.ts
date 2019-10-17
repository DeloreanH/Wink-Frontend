import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmptyProfileGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  canActivateChild(
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
        // ruta a redirigir si no esta autenticado
        return this.router.createUrlTree(['perfil']);
      })
      );
  }
}
