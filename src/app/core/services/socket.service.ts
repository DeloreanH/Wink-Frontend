import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Routes } from '../../common/enums/routes/routes.enum';
import { User } from '../../common/models/user.model';
import { Wink } from '../../common/models/wink.model';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { UserData } from 'src/app/common/interfaces/userData.interfaces';


enum SocketEvents {
  UPDATE_USER = 'update-user',
  SEND_WINK = 'send-wink',
  HANDLE_WINK = 'handle-wink',
  DELETE_WINK = 'delete-wink',
  AVATAR_UPLOAD = 'avatar-upload',
}
export enum SocketEventsListen {
  UPDATED_USER = 'updated-user',
  SENDED_WINK = 'sended-wink',
  HANDLED_WINK = 'handled-wink',
  DELETED_WINK = 'deleted-wink',
  AVATAR_UPLOADED = 'avatar-uploaded',
  ERROR = 'end',
}

@Injectable()
export class SocketService  {

  socket: any;
  private connect = false;
  private readonly url: string = Routes.SOCKET;

  constructor( private storageService: StorageService) { }

  Create() {
    const authorization: UserData = this.storageService.apiAuthorization;
    if (authorization && authorization.token) {
      this.socket = io(this.url, {
        transports: ['websocket'],
        autoConnect: false,
        query: {
          auth: authorization.token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
      });
    }
  }

  Connect() {
    try {
      if (!this.connect) {
        this.Create();
        this.socket.open();
        this.connect = true;
        console.log('Socket connect');
      }
    } catch (err) {
      console.log('Error SocketService Connetc ', err.message);
    }
  }

  Disconnect() {
    try {
      if (this.connect) {
        this.socket.close();
        this.connect = false;
        this.socket = null;
        console.log('Socket Disconnect');
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
      this.socket.on('connect_error',
        (data) => {
          console.log('Socket end', data);
        });
    } catch (err) {
      console.log('SocketService Listen Error', err.message);
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

  HandleWink(idUserSend: string, winkValue: Wink) {
    try {
      this.Emit(SocketEvents.HANDLE_WINK,  {
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

  AvatarUpload(userValue: User) {
    try {
      this.Emit(SocketEvents.AVATAR_UPLOAD, userValue);
    } catch (err) {
      console.log('Error DeleteWink  ', err.message);
    }
  }

  Listen(eventName: SocketEventsListen) {
    if (!this.connect) {
      this.Connect();
    }
    return new Observable(
      (subscriber) => {
        try {
          if (this.socket) {
            this.socket.on(eventName,
              (data) => {
                subscriber.next(data);
              });
          }
        } catch (err) {
          console.log('SocketService Listen Error', err.message);
        }
      }
    );
  }

  private Emit(eventName: SocketEvents, data: any) {
    try {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    } catch (err) {
      console.log('SocketService Emit Error', err.message);
    }
  }

}

