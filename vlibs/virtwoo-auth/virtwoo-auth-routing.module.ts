import { NgModule } from '@angular/core';
import {
  RouterModule
} from '@angular/router';

import {
  VirtwooAuthLoginComponent,
  VirtwooRegisterComponent,
  VirtwooForgotPasswordComponent,
  VirtwooPhoneSmsComponent,
  VirtwooVerifyPhoneSmsComponent,
  VirtwooChangePasswordComponent,
  VirtwooEnableLocationComponent
} from './pages';
import { Routes } from '@virtwoo/sl-router';

import { VirtwooAuthPathName } from './virtwoo-auth-config.data';

export const VirtwooAuthRoutes: Routes = [
  {
    path: 'virtwoo-auth/login',
    component: VirtwooAuthLoginComponent,
    name: VirtwooAuthPathName.Login
  },
  {
    path: 'virtwoo-auth/register',
    component: VirtwooRegisterComponent,
    name: VirtwooAuthPathName.Register,
  },
  {
    path: 'virtwoo-auth/forgot-password',
    component: VirtwooForgotPasswordComponent,
    name: VirtwooAuthPathName.ForgotPassword
  },
  {
    path: 'virtwoo-auth/change-password/:id',
    component: VirtwooChangePasswordComponent,
    name: VirtwooAuthPathName.ChangePassword,
  },
  {
    path: 'virtwoo-auth/sms',
    component: VirtwooPhoneSmsComponent,
    name: VirtwooAuthPathName.Sms,
  },
  {
    path: 'virtwoo-auth/verify-sms',
    component: VirtwooVerifyPhoneSmsComponent,
    name: VirtwooAuthPathName.VerifySms,
  },
  {
    path: 'virtwoo-auth/location',
    component: VirtwooEnableLocationComponent,
    name: VirtwooAuthPathName.location,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(VirtwooAuthRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class VirtwooAuthRoutingModule { }
