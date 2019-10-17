import { Injectable } from '@angular/core';
import { User } from '../modelos/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();

  constructor() { }

  User(data?: User) {
    if (data) {
      this.user = data;
      this.userChanged.next(this.user);
    } else {
      return this.user;
    }

  }
}
