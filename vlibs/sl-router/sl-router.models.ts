import {
  Route
} from '@angular/router';

export interface SLRouter {
  path: string;
  name: string;
}

export interface SLRouterPathParams {
  [key: string]: string;
}

export enum SLRouterChangeType {
  Push = 'push',
  Pop = 'pop',
  Error = 'error'
}

export interface SLRouterChange {
  SLRouter: SLRouter;
  type: SLRouterChangeType;
}

interface SLRoute extends Route {
  name: string;
}

export type Routes = SLRoute[];

export type SLBackAction = () => boolean;
