import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Routes } from '@virtwoo/sl-router';

export enum RoutesName {
  Home = 'HOME',
}

export const routesApp: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    name: RoutesName.Home
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routesApp, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
