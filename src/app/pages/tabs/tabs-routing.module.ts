import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from './tabs.component';

export enum RoutesAPP {
  BASE = 'app/',
  HOME = 'home',
  CONFIGURAR_PERFIL = 'config-profile',
  PERFIL_PUBLICO = 'public-profile',
}

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'config-profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../config-perfil/config-perfil.module').then(m => m.ConfigPerfilPageModule)
          }
        ]
      },
      {
        path: 'public-profile/:user',
        children: [
          {
            path: '',
            loadChildren: () => import('../publico/publico.module').then(m => m.PublicoPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
