import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Routes } from '@virtwoo/sl-router';
import { AuthGuard } from './auth/auth.guard';

export enum RoutesName {
  Home = 'HOME',
  ConfigurarPerfil = 'ConfigurarPerfil',
}

export const routesApp: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    name: RoutesName.Home,
    canActivate: [AuthGuard]
  },
  {
    path: 'ConfigurarPerfil',
    loadChildren: () => import('./config-perfil/config-perfil.module').then( m => m.ConfigPerfilPageModule),
    name: RoutesName.ConfigurarPerfil,
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
