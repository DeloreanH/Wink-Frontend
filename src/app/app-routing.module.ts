import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Routes } from '@virtwoo/sl-router';
import { AuthGuard } from './auth/auth.guard';
import { EmptyProfileGuard } from './auth/empty-profile.guard';
import { EmptyProfilePGuard } from './auth/empty-profile-p.guard';

export enum RoutesName {
  APP = 'app',
  PERFIL = 'perfil'
}

export const routesApp: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsModule),
    name: RoutesName.APP,
    canActivate: [AuthGuard, EmptyProfilePGuard],
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    name: RoutesName.PERFIL,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'ConfigurarPerfil',
  //   loadChildren: () => import('./config-perfil/config-perfil.module').then( m => m.ConfigPerfilPageModule),
  //   name: RoutesName.ConfigurarPerfil,
  //   canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routesApp, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
