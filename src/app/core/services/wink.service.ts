import { Injectable } from '@angular/core';
import { Location } from '../../common/models/location.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../../common/models/user.model';
import { Routes } from '../../common/enums/routes/routes.enum';
import { LocationService } from './location.service';
import { UserService } from './user.service';
import { Wink } from '../../common/models/wink.model';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { MessagesServices } from '../../common/enums/messagesServices.enum';
import { SocketService } from './socket.service';
import { UserData } from 'src/app/common/interfaces/userData.interfaces';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class WinkService {

  private nearbyUsers: User[] = [];
  nearbyUsersChanged = new Subject<User[]>();
  private requests: Wink[] = [];
  requestsChanged = new Subject<Wink[]>();
  private record: Wink[] = [];
  recordChanged = new Subject<Wink[]>();
  private winkType: boolean;
  private indexWink: number = null;
  private indexUser: number = null;
  idUser: string;
  deleteWink = new Subject<Wink>();

  constructor(
    private locationService: LocationService,
    private http: HttpClient,
    private userService: UserService,
    private toastService: ToastService,
    private socketService: SocketService,
    private storageService: StorageService,
  ) {
    // this.Init();
   }

   async Init() {
    try {
        const userData: UserData = this.storageService.apiAuthorization;
        if (userData && userData.user) {
          this.idUser = userData.user._id ? userData.user._id : null;
          await this.GetWinks();
        }
    } catch (err) {
      console.log('Error Init', err.message);
    }
   }

  async GetNearby() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const location = await this.locationService.GetPosition();
          if (location) {
            if (isNaN(location.coords.latitude) || isNaN(location.coords.longitude)) {
              reject({message: 'isNaN'});
            }
            const myLocation =  new Location({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            const response = await this.http.post<User[]>(Routes.BASE + Routes.NEARBY_USER, myLocation).toPromise();
            this.SetNearbyUsers((response as User[]));
            this.userService.UpdateLocation(myLocation);
            this.Init();
            resolve(response);
          } else {
            reject({message: 'No Location'});
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  SetNearbyUsers(nearbyUsers: User[]) {
    this.nearbyUsers = [];
    this.nearbyUsers.push(...nearbyUsers);
    this.nearbyUsersChanged.next(this.nearbyUsers);
  }

  GetNearbyUser(idUser: string) {
    if (!idUser) {
      return ;
    }
    this.indexUser = null;
    return this.nearbyUsers.find(
      (user, index: number, obj) => {
        if (user._id === idUser) {
          this.indexUser =  index;
          return true;
        }
      });
  }

  async Range(rangeValue: number) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!rangeValue  || isNaN(rangeValue)) {
            reject({message: 'No range'});
          }
          const response: any = await this.http.post(Routes.BASE + Routes.SET_SEARCH_RANGE, { range: (rangeValue * 1000)}).toPromise();
          resolve(response);
        } catch (err) {
          this.toastService.Toast(MessagesServices.UNEXPECTED_ERROR);
          console.log('Error Range: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async SendWink(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject({message: 'No idUser'});
          }
          const response: any = await this.http.post(Routes.BASE + Routes.SEND_WINK, { winkUserId: idUser}).toPromise();
          // response.wink.user = this.userService.User();
          response.wink.user = null;
          if (!response.wink.user) {
            this.socketService.SendWink(idUser, response.wink, response.distance);
          }
          this.toastService.Toast(MessagesServices.WINK_SENT);
          resolve(response);
        } catch (err) {
          this.toastService.Toast(MessagesServices.WINK_ERROR);
          console.log('Error SendWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async ApproveWink(wink: Wink) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!wink) {
            reject({message: 'No wink'});
          }
          // const delWink = Object.assign({}, wink);
          const response: any = await this.http.post(Routes.BASE + Routes.HANDLE_WINK, {
            wink_id: wink._id,
            watch: false
          }).toPromise();
          // this.DeleteRequests(wink);
          wink.approved = true;
          wink.updatedAt = new Date().toString();
          wink.user = null;
          wink.watched = true;
          if (wink.watched  && !wink.user && wink.approved) {
            this.AddRecord(wink);
            this.socketService.HandleWink(
              wink.sender_id,
              wink
            );
          }
          resolve(response);
        } catch (err) {
          if (err.error.statusCode && err.error.statusCode === 404) {
            this.DeleteWinkUser(wink);
          } else {
            this.toastService.Toast(MessagesServices.UNEXPECTED_ERROR);
          }
          console.log('Error ApproveWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async DeleteWink(wink: Wink) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!wink) {
            reject({message: 'No wink'});
          }
          const response = await this.http.post(Routes.BASE + Routes.DELETE_WINK, { wink_id: wink._id}).toPromise();
          this.DeleteWinkUser(wink);
          wink.watched = true;
          if (wink.watched) {
            this.socketService.DeleteWink(
              wink.receiver_id === this.idUser ? wink.sender_id : wink.receiver_id,
              wink
            );
          }
          this.deleteWink.next(wink);
          resolve(response);
        } catch (err) {
          console.log('Del wink', err);
          if (err.error.statusCode && err.error.statusCode === 404) {
            this.DeleteWinkUser(wink);
          } else {
            this.toastService.Toast(MessagesServices.UNEXPECTED_ERROR);
          }
          console.log('Error DeleteWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  GetWinkRecordID(idWink: string) {
    if (!idWink) {
      return;
    }
    this.indexWink = null;
    return this.record.find(
      (winkValue, index: number, obj) => {
        if (winkValue._id === idWink) {
          this.winkType = false;
          this.indexWink =  index;
          return true;
        }
      });
  }

  GetWinkRequestsID(idWink: string) {
    if (!idWink) {
      return;
    }
    this.indexWink = null;
    return this.requests.find(
      (winkValue, index: number, obj) => {
        if (winkValue._id === idWink) {
          this.winkType = true;
          this.indexWink =  index;
          return true;
        }
      });
  }

  GetWinkID(idWink: string) {
    if (!idWink) {
      return;
    }
    let wink = this.GetWinkRecordID(idWink);
    if (!wink) {
      wink = this.GetWinkRequestsID(idWink);
    }
    return wink;
  }

  GetWinkIDUser(idUser: string) {
    if (!idUser) {
      return;
    }
    this.winkType = null;
    this.indexWink = null;
    let wink = this.record.find(
      (winkValue, index: number, obj) => {
        if (winkValue.user && winkValue.user._id === idUser) {
          this.winkType = false;
          this.indexWink =  index;
          return true;
        }
      });
    if (!wink) {
      wink = this.requests.find(
        (winkValue, index: number, obj) => {
          if (winkValue.user && winkValue.user._id === idUser) {
            this.winkType = true;
            this.indexWink =  index;
            return true;
          }
        });
    }
    return wink;
  }

  async GetWinks() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get(Routes.BASE + Routes.GET_WINKS).toPromise();
          this.FilterWinks((response as Wink[]));
          resolve(response);
        } catch (err) {
          console.log('Error GetWinks: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async WatchedWink(wink: Wink) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!wink || wink.sender_id === this.idUser) {
            reject({message: 'wink null'});
          }
          const response = await this.http.post(Routes.BASE + Routes.HANDLE_WINK, {
            wink_id: wink._id,
            watch: true
          }).toPromise();
          wink.watched = true;
          wink.user = null;
          if (wink.watched && !wink.user) {
            this.socketService.HandleWink(
              wink.sender_id,
              wink
            );
            this.AddRequests(wink);
          }
          resolve(response);
        } catch (err) {
          if (err.error.statusCode && err.error.statusCode === 404) {
            this.DeleteWinkUser(wink);
          }
          console.log('Error WatchedWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  private FilterWinks(winks: Wink[], newUser?: boolean) {
    if (winks.length === 0) {
      return;
    }
    const record: Wink[] = [];
    const requests: Wink[] = [];
    winks.forEach(
      (wink: Wink) => {
        if (!newUser) {
          wink.user = wink.user[0];
        }
        if (wink.approved) {
          record.push(wink);
        } else if (wink.sender_id === wink.user._id) {
          this.AddRequests(wink);
        }
      }
    );
    this.SetRecord(record);
    // this.SetRequests(requests);
  }

  SetRecord(data: Wink[]) {
    if (!data) {
      return;
    }
    this.record = [];
    this.record.push(...data);
    this.recordChanged.next(this.record);
  }

  SetRequests(data: Wink[]) {
    if (!data) {
      return;
    }
    this.requests = [];
    this.requests.push(...data);
    this.requestsChanged.next(this.requests);
  }

  AddWink(wink: Wink) {
    if (!wink) {
      return;
    }
    wink.user = null;
    if (wink.approved && !wink.user) {
      this.AddRecord(wink);
    } else if (wink.receiver_id === this.idUser && !wink.user) {
      this.AddRequests(wink);
    }
  }

  async GetUserWink(wink: Wink) {
    if (!wink) {
      return;
    }
    return this.GetUserID(wink.sender_id ===  this.idUser ? wink.receiver_id : wink.sender_id);
  }

  async GetUserID(idUserWink: string) {
    if (!idUserWink) {
      return;
    }
    try {
      let user: User = this.GetNearbyUser(idUserWink);
      if (user) {
        return user;
      } else {
        const response = await this.GetUser(idUserWink);
        user = response.winkUser;
        user.distance = response.distance;
        return user;
      }
    } catch (err) {
      return null;
    }
  }

  private async AddRecord(wink: Wink) {
    if (!wink || !wink.approved) {
      return;
    }
    try {
      this.DeleteRequests(wink);
      const user = await this.GetUserWink(wink);
      wink.user = user;
      if (wink.user) {
        wink.user.newWink = !wink.watched;
        this.WatchWink(wink);
        const winkExist = this.GetWinkRecordID(wink._id);
        if (winkExist  && this.indexWink >= 0) {
          this.record[this.indexWink] = wink;
        } else {
          this.record.push(wink);
        }
        this.record = this.record.sort(
          (a: Wink, b: Wink) => {
            if (new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()) {
              return -1;
            } else if (new Date(a.updatedAt).getTime() < new Date(b.updatedAt).getTime()) {
              return 1;
            } else {
              return 0;
            }
          }
        );
        this.recordChanged.next(this.record);
      }
    } catch (err) {
      console.log('Error AddRecord', err.message);
    }
  }

  private async AddRequests(wink: Wink) {
    if (!wink || wink.approved || wink.sender_id === this.idUser ) {
      return;
    }
    try {
      // this.DeleteRecord(wink);
      // const idUserWink = wink.sender_id === this.idUser ? wink.receiver_id : wink.sender_id;
      const winkExist = this.GetWinkRequestsID(wink._id);
      wink.user = await this.GetUserWink(wink);
      if (wink.user) {
        wink.user.newWink = !wink.watched;
        this.WatchWink(wink);
        if (winkExist && this.indexWink >= 0) {
          this.requests[this.indexWink] = wink;
        } else {
          this.requests.push(wink);
        }
        this.requests = this.requests.sort(
          (a: Wink, b: Wink) => {
            if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) {
              return -1;
            } else if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()) {
              return 1;
            } else {
              return 0;
            }
          }
        );
        this.requestsChanged.next(this.requests);
      }
    } catch (err) {
      console.log('Error AddRequests', err.message);
    }
  }

  WatchWink(wink: Wink) {
    if (!wink) {
      return;
    }
    const user = this.GetNearbyUser(wink.sender_id === this.idUser ? wink.receiver_id : wink.sender_id);
    if (user && this.indexUser >= 0) {
      user.newWink = !wink.watched;
      this.nearbyUsers[this.indexUser] = user;
    }
  }

  DeleteWinkUser(wink: Wink) {
    if (!wink) {
      return;
    }
    wink.user = null;
    this.DeleteRecord(wink);
    this.DeleteRequests(wink);
  }

  async DeleteRecord(wink: Wink) {
    if (!wink) {
      return;
    }
    wink.user = await this.GetUserWink(wink);
    if (wink.user && !wink.watched) {
      wink.user.newWink = !wink.watched;
      this.WatchWink(wink);
    }
    const winkX = this.GetWinkRecordID(wink._id);
    if (winkX && this.indexWink  >= 0) {
      this.record.splice(this.indexWink, 1);
      this.recordChanged.next(this.record);
    }
  }

  async DeleteRequests(wink: Wink) {
    if (!wink) {
      return;
    }
    wink.user = await this.GetUserWink(wink);
    if (wink.user && !wink.watched) {
      wink.user.newWink = !wink.watched;
      this.WatchWink(wink);
    }
    const winkX = this.GetWinkRequestsID(wink._id);
    if (winkX && this.indexWink >= 0) {
      this.requests.splice(this.indexWink, 1);
      this.requestsChanged.next(this.requests);
    }
  }

  get Record() {
    return this.record;
  }

  get Requests() {
    return this.requests;
  }

  get NearbyUsers() {
    return this.nearbyUsers;
  }

  async UpdateUser(newUser: User, updateAvatar?: boolean) {
    if (!newUser) {
      return ;
    }
    this.indexUser = null;
    this.indexWink = null;
    try {
      const nearbyUser = this.GetNearbyUser(newUser._id);
      if (nearbyUser) {
        this.UpdatNearbyUser(nearbyUser, newUser, updateAvatar);
      }
      const wink = this.GetWinkIDUser(newUser._id);
      if (wink) {
        this.UpdateUserWink(newUser, updateAvatar);
      }
    } catch (err) {
      console.log('Error UpdateUser ', err.message);
    }
  }

  private UpdatNearbyUser(user: User, newUser: User, updateAvatar?: boolean) {
    if (!newUser || !user) {
      return ;
    }
    if (this.indexUser >= 0) {
      if (user.location) {
        newUser.location = user.location;
      }
      if (updateAvatar) {
        this.nearbyUsers[this.indexUser] = newUser;
      } else {
        Object.keys(this.nearbyUsers[this.indexUser]).forEach(
          (key) => {
            if (key !== 'avatarUrl ') {
              this.nearbyUsers[this.indexUser][key] = newUser[key];
            }
          }
        );
      }
      this.nearbyUsersChanged.next(this.nearbyUsers);
    }
  }

  private UpdateUserWink(newUser: User, updateAvatar?: boolean) {
    if (!newUser) {
      return ;
    }
    if (!this.winkType) {
      if (this.indexWink >= 0) {
        if (updateAvatar) {
          this.record[this.indexWink].user = newUser;
        } else {
          Object.keys(this.record[this.indexWink].user).forEach(
            (key) => {
              if (key !== 'avatarUrl ') {
                this.record[this.indexWink].user[key] = newUser[key];
              }
            }
          );
        }
        this.SetRecord(this.record);
      }
    } else {
      if (this.indexWink >= 0) {
        if (updateAvatar) {
          this.requests[this.indexWink].user = newUser;
        } else {
          Object.keys(this.requests[this.indexWink].user).forEach(
            (key) => {
              if (key !== 'avatarUrl ') {
                this.requests[this.indexWink].user[key] = newUser[key];
              }
            }
          );
        }
        this.SetRequests(this.requests);
      }
    }
  }

  Destroy() {
    this.SetNearbyUsers([]);
    this.SetRecord([]);
    this.SetRequests([]);
    this.winkType = null;
    this.indexWink = null;
    this.indexUser = null;
    this.idUser = null;
  }

  async GetUser(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject({message: 'No idUser'});
          }
          const response: any = await this.http.post(Routes.BASE + Routes.GET_USER, {winkUserId: idUser}).toPromise();
          resolve(response);
        } catch (error) {
          console.log('error', error);
          reject(error);
        }
      }
    );
  }

}
