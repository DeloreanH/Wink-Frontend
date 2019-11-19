import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Routes } from '../config/enums/routes/routes.enum';
import { LocationService } from './location.service';
import { UserService } from './user.service';
import { Wink } from '../models/wink.model';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { MessagesServices } from '../config/enums/messagesServices.enum';

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

  constructor(
    private locationService: LocationService,
    private http: HttpClient,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.Init();
   }

   private async Init() {
    try {
      await this.GetWinks();
    } catch (err) {
      console.log('Error Init', err.message);
    }
   }

  GetNearby() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const location = await this.locationService.GetPosition();
          if (location) {
            const myLocation =  new Location({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            const response = await this.http.post<User[]>(Routes.BASE + Routes.NEARBY_USER, myLocation).toPromise();
            this.SetNearbyUsers((response as User[]));
            this.userService.UpdateLocation(myLocation);
            resolve(response);
          } else {
            resolve(false);
          }
        } catch (err) {
          console.log('Error GetNearby: ' + err.message);
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
    return this.nearbyUsers.find(
      (user, index: number, obj) => {
        if (user._id === idUser) {
          this.indexUser =  index;
          return true;
        }
      });
  }

  async SendWink(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.SEND_WINK, { winkUserId: idUser}).toPromise();
          // console.log('Res', response);
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
            reject(false);
          }
          const delWink = Object.assign({}, wink);
          const response: any = await this.http.post(Routes.BASE + Routes.APPROVE_WINK, { wink_id: wink._id}).toPromise();
          // console.log('Res', response);
          this.DeleteRequests(delWink);
          wink.approved = true;
          wink.updatedAt = new Date().toString();
          this.AddRecord(wink);
          resolve(response);
        } catch (err) {
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
            reject(false);
          }
          const response = await this.http.post(Routes.BASE + Routes.DELETE_WINK, { wink_id: wink._id}).toPromise();
          // console.log('Res', response);
          this.DeleteRequests(wink);
          resolve(response);
        } catch (err) {
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
    let wink = this.record.find(
      (winkValue, index: number, obj) => {
        if (winkValue.user._id === idUser) {
          this.winkType = false;
          this.indexWink =  index;
          return true;
        }
      });
    if (!wink) {
      wink = this.requests.find(
        (winkValue, index: number, obj) => {
          if (winkValue.user._id === idUser) {
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
          console.log('Error DeleteWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  private FilterWinks(winks: Wink[], newUser?: boolean) {
    if (winks.length === 0) {
      return;
    }
    console.log('FilterWinks');
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
          requests.push(wink);
        }
      }
    );
    this.SetRecord(record);
    this.SetRequests(requests);
  }


  SetRecord(data: Wink[]) {
    this.record = [];
    this.record.push(...data);
    this.recordChanged.next(this.record);
    console.log('SetRecord');
  }

  SetRequests(data: Wink[]) {
    this.requests = [];
    this.requests.push(...data);
    this.requestsChanged.next(this.requests);
    console.log('SetRequests');
  }

  AddRecord(wink: Wink) {
    if (!wink || !wink.approved) {
      return;
    }
    this.record.push(wink);
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

  AddRequests(wink: Wink) {
    if (wink && !wink.user._id) {
      wink.user = wink.user[0];
    }
    if (!wink || wink.approved || wink.sender_id !== wink.user._id) {
      return;
    }
    const winkExist = this.GetWinkRequestsID(wink._id);
    wink.user.newWink = true;
    const user = this.GetNearbyUser(wink.user._id);
    if (user && this.indexUser) {
      user.newWink = true;
      this.nearbyUsers[this.indexUser] = user;
    }
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

  DeleteRecord(wink: Wink) {
    const winkX = this.GetWinkRecordID(wink._id);
    if (winkX && this.indexWink  >= 0) {
      this.record.splice(this.indexWink, 1);
      this.recordChanged.next(this.record);
    }
  }

  DeleteRequests(wink: Wink) {
    const winkX = this.GetWinkRequestsID(wink._id);
    if (winkX && this.indexWink >= 0) {
      const user = this.GetNearbyUser(wink.user._id);
      if (user && this.indexUser) {
        user.newWink = false;
        this.nearbyUsers[this.indexUser] = user;
      }
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

  async UpdateUser(newUser: User) {
    if (!newUser) {
      return ;
    }
    this.indexUser = null;
    this.indexWink = null;
    try {
      const nearbyUser = this.GetNearbyUser(newUser._id);
      if (nearbyUser) {
        this.UpdatNearbyUser(nearbyUser, newUser);
      }
      const wink = this.GetWinkIDUser(newUser._id);
      if (wink) {
        this.UpdateUserWink(newUser);
      }
    } catch (err) {
      console.log('Error UpdateUser ', err.message);
    }
  }

  private UpdatNearbyUser(user: User, newUser: User) {
    if (!newUser || !user) {
      return ;
    }
    if (this.indexUser >= 0) {
      if (user.location) {
        newUser.location = user.location;
      }
      this.nearbyUsers[this.indexUser] = newUser;
      this.nearbyUsersChanged.next(this.nearbyUsers);
    }
  }

  private UpdateUserWink(newUser: User) {
    if (!newUser) {
      return ;
    }
    if (!this.winkType) {
      console.log(this.indexWink);
      if (this.indexWink >= 0) {
        this.record[this.indexWink].user = newUser;
        this.SetRecord(this.record);
      }
    } else {
      console.log(this.indexWink);
      if (this.indexWink >= 0) {
        this.requests[this.indexWink].user = newUser;
        this.SetRequests(this.requests);
      }
    }
  }
}
