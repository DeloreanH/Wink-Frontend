import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Routes } from '@virtwoo/sl-router';
import { AuthGuard } from './auth/auth.guard';
import { EmptyProfilePGuard } from './auth/empty-profile-p.guard';

export enum RoutesPrincipal {
  APP = 'app',
  DATOS_BASICOS = 'perfil'
}

export const routesApp: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsModule),
    name: RoutesPrincipal.APP,
    canActivate: [AuthGuard, EmptyProfilePGuard],
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    name: RoutesPrincipal.DATOS_BASICOS,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routesApp, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
