import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { Routes } from '@virtwoo/sl-router';
import { AuthGuard } from './auth/guards/auth.guard';
import { EmptyProfilePGuard } from './auth/guards/empty-profile-p.guard';
import { RoutesPrincipal } from './common/enums/routes/routesPrincipal.enum';



export const routesApp: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsModule),
    name: RoutesPrincipal.APP,
    canActivate: [AuthGuard, EmptyProfilePGuard],
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/basic-data/basic-data.module').then( m => m.BasicDataPageModule),
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
