import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from './tabs/tabs.component';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';

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
            loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
          }
        ]
      },
      {
        path: 'config-profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-settings/profile-settings.module').then(m => m.ProfileSettingsPageModule),
          }
        ]
      },
      {
        path: 'public-profile/:id/:origin',
        children: [
          {
            path: '',
            loadChildren: () => import('./public-profile/public-profile.module').then(m => m.PublicProfilePageModule)
          }
        ]
      },
      {
        path: 'winks',
        children: [
          {
            path: '',
            loadChildren: () => import('./winks/winks.module').then(m => m.WinksPageModule),
          }
        ]
      },
      {
        path: 'private-profiles/:idUser/:idWink/:origin',
        children: [
          {
            path: '',
            loadChildren: () => import('./private-profiles/private-profiles.module').then(m => m.PrivateProfilesPageModule)
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
export class PagesRoutingModule { }
