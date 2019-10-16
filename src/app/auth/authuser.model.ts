import { User } from '../modelos/user.model';

export class AuthUser {

  constructor(
    private token: string,
    private exp: number,
    public user: User
  ) {}

  get Token() {
    console.log('Token', (new Date().getTime() / 1000 ) > this.exp);
    if (!this.exp  || (new Date().getTime() / 1000 ) > this.exp) {
      return null;
    }
    return this.token;
  }

}
