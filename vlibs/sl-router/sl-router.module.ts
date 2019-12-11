import {
  NgModule,
  ModuleWithProviders,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  SlRouterService,
  USE_SL_ROUTER,
  USE_SL_ROUTER_ROOT
} from './sl-router.service';
import { Routes } from './sl-router.models';

@NgModule({
  imports: [
    RouterModule
  ],
  exports: [
    RouterModule
  ]
})
export class SlRouterModule {

  static forRoot(config: Routes = []): ModuleWithProviders {
    return {
      ngModule: SlRouterModule,
      providers: [
        { provide: USE_SL_ROUTER, useValue: config.map(({ name, path }) => ({ name, path })) },
        { provide: USE_SL_ROUTER_ROOT, useValue: null },
        SlRouterService,
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SlRouterModule,
      providers: [
        SlRouterService,
      ]
    };
  }

}
