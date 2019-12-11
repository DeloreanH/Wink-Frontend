export enum VirtwooAuthProvider {
  ChangePasswordToken = '/user/change-password-token`',
  Facebook = '/auth/facebook',
  ForgotPassword = '/user/forgot-password',
  Google = '/auth/google',
  Normal = '/auth',
  Register = '/user',
  Sms = '/auth/phone-number',
  Verify = '/auth/verify-code',
}

export interface VirtwooAuthConfig {
  accesssId: string;
  apiVersion: string;
  apiUrl: string;
  social: VirtwooAuthProvider[] | 'ALL';
  redirectUrl: string;
  google?: {
    androidWebClientId: string;
    iosWebClientId: string;
  };
  logoUrl?: string;
  resCallback: (response: any) => string;
}
