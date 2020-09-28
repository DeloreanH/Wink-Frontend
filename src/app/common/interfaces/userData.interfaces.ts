import { User } from '../models/user.model';

export interface UserData {
  token: string;
  exp: number;
  user: User;
}
