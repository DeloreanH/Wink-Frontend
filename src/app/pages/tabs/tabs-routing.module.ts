import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from './tabs.component';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';

export const routesTab: Routes = [
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
        path: 'public-profile/:id/:origin',
        children: [
          {
            path: '',
            loadChildren: () => import('../publico/publico.module').then(m => m.PublicoPageModule)
          }
        ]
      },
      {
        path: 'winks',
        children: [
          {
            path: '',
            loadChildren: () => import('../winks/winks.module').then(m => m.WinksPageModule)
          }
        ]
      },
      {
        path: 'private-profiles/:idUser/:idWink/:origin',
        children: [
          {
            path: '',
            loadChildren: () => import('../private-profiles/private-profiles.module').then(m => m.PrivateProfilesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesTab)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
