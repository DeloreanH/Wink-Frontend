import { NavigationExtras } from '@angular/router';
import { SLRouterPathParams } from '@virtwoo/sl-router';

export enum SLBaseButtonPosition {
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  TopRight = 'top-right',
  TopLeft = 'top-left'
}

export interface SLBaseButton {
  icon: string;
  id: number;
  position: SLBaseButtonPosition;
  redirectTo?: {
    extras?: NavigationExtras,
    name: string,
    pathParams?: SLRouterPathParams
  };
}
