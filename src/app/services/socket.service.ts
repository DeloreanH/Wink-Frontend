import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Routes } from '../config/enums/routes/routes.enum';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Injectable()
export class SocketService extends Socket {

  constructor() {
    const data = JSON.parse(localStorage.getItem('userData'));
    super({ url: Routes.SOCKET, options: {
      transports: ['websocket'],
      query: {
        auth: data ? data.token : null
      }
    } });
  }
  

  private Connect() {
    try {
      if (!this.ioSocket.connected) {
        this.connect();
      }
    } catch (err) {
      console.log('Error SocketService Connetc ', err.message);
    }
  }

  UpdateUser(user: User) {
    try {
      this.Connect();
      console.log('Socket UpdateUser Error', user);
      this.emit('update-user', user);
    } catch (err) {
      console.log('Socket UpdateUser Error', err);
    }
  }

  UpdatedUser() {
    try {
      this.Connect();
      console.log('UpdatedUser');
      this.fromEvent('updated-user')
      .subscribe(
        (data) => {
          console.log('datadata', data);
        }
      );
    } catch (err) {
      console.log('Error SocketService Connetc ', err.message);
    }
  }


  private NewWink() {

  }

}

