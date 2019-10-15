import { User } from '../modelos/user.model';

export class AuthUser {

  constructor(
    private token: string,
    private exp: Date,
    public user: User
  ) {}

  get Token() {
    if (!this.exp  || new Date() > this.exp) {
      return null;
    }
    return this.token;
  }

}
