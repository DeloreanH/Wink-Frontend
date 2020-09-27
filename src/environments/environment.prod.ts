import { VirtwooAuthConfig } from '@virtwoo/auth';
import { Routes } from '../app/common/enums/routes/routes.enum';
import { RoutesPrincipal } from '../app/common/enums/routes/routesPrincipal.enum';
import { AuthResponse } from './auth.config';
// import { Paths } from '@common/route';

export const virtwooAuthEnvironment: VirtwooAuthConfig = {
  accesssId: '5de7fac0da9f2274ba04bf08',
  apiUrl:  Routes.IP + ':5000',
  apiVersion: 'v1',
  social: 'ALL',
  redirectUrl: Routes.BASE + Routes.AUTH,
  logoUrl: '/assets/icon/favicon.png',
  resCallback: AuthResponse
};

export const environment = {
  production: true
};
