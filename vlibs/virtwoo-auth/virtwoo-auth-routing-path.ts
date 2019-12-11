import { SLRouter } from '@virtwoo/sl-router';

export const VIRTWOO_AUTH_ROUTER: SLRouter[] = [
  {
    path: 'virtwoo-auth/login',
    name: 'LOGIN'
  },
  {
    path: 'virtwoo-auth/register',
    name: 'REGISTER'
  },
  {
    path: 'virtwoo-auth/forgot-password',
    name: 'FORGOT_PASSWORD'
  },
  {
    path: 'virtwoo-auth/sms',
    name: 'WIRTWOO_AUTH_SMS'
  },
  {
    path: 'virtwoo-auth/verify-sms',
    name: 'WIRTWOO_AUTH_VERIFY_SMS'
  }
];
