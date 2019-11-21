import { Injectable, NgModule } from '@angular/core';
import * as io from 'socket.io-client';
import { Routes } from '../../common/enums/routes/routes.enum';
import { User } from '../../common/models/user.model';
import { Wink } from '../../common/models/wink.model';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';


enum SocketEvents {
  UPDATE_USER = 'update-user',
  SEND_WINK = 'send-wink',
  APPROVE_WINK = 'approve-wink',
  DELETE_WINK = 'delete-wink',
}
export enum SocketEventsListen {
  UPDATED_USER = 'updated-user',
  SENDED_WINK = 'sended-wink',
  APPROVED_WINK = 'approved-wink',
  DELETED_WINK = 'deleted-wink',
}

@Injectable()
export class SocketService  {

  socket: any;
  private connect = false;
  private readonly url: string = Routes.SOCKET;

  constructor( private storageService: StorageService) { }

  Create() {
    const authorization: {token: string, exp: number, user: User} = JSON.parse(localStorage.getItem('userData'));
    this.socket = io(this.url, {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        auth: authorization.token,
      }
    });
  }

  Connect() {
    try {
      if (!this.connect) {
        this.Create();
        this.socket.open();
        this.connect = true;
      }
    } catch (err) {
      console.log('Error SocketService Connetc ', err.message);
    }
  }

  Disconnect() {
    try {
      if (!this.connect) {
        this.socket.close();
        this.connect = false;
        this.socket = null;
      }
    } catch (err) {
      console.log('Error SocketService Connetc ', err.message);
    }
  }

  UpdateUser(user: User) {
    try {
      this.Emit(SocketEvents.UPDATE_USER, user);
    } catch (err) {
      console.log('Socket UpdateUser Error', err);
    }
  }

  Error() {
    try {
    } catch (err) {
      console.log('Error SocketService  ', err.message);
    }
  }

  SendWink(idUserSend: string, winkValue: Wink, distanceValue: number) {
    try {
      this.Emit(SocketEvents.SEND_WINK, {
        winkUser: idUserSend,
        wink: winkValue,
        distance: distanceValue
      });
    } catch (err) {
      console.log('Error SendWink  ', err.message);
    }
  }

  ApproveWink(idUserSend: string, winkValue: Wink) {
    try {
      this.Emit(SocketEvents.APPROVE_WINK,  {
        winkUser: idUserSend,
        wink: winkValue,
      });
    } catch (err) {
      console.log('Error ApproveWink  ', err.message);
    }
  }

  DeleteWink(idUserSend: string, winkValue: Wink) {
    try {
      this.Emit(SocketEvents.DELETE_WINK, {
        winkUser: idUserSend,
        wink: winkValue,
      });
    } catch (err) {
      console.log('Error DeleteWink  ', err.message);
    }
  }

  Listen(eventName: SocketEventsListen) {
    return new Observable(
      (subscriber) => {
        try {
          this.socket.on(eventName,
            (data) => {
              subscriber.next(data);
            });
        } catch (err) {
          console.log('SocketService Listen Error', err.message);
        }
      }
    );
  }

  private Emit(eventName: SocketEvents, data: any) {
    try {
      this.socket.emit(eventName, data);
    } catch (err) {
      console.log('SocketService Emit Error', err.message);
    }
  }

}

