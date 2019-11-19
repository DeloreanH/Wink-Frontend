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
  private allWinks: Wink[] = [];
  private indexUser;
  private indexWink;

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

  GetNearbyUser(idUser: string): User {
    if (!idUser) {
      return ;
    }
    return this.nearbyUsers.find(
      (user, index) => {
        if (user._id === idUser) {
          this.indexUser = index;
          return user;
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

  GetWinkID(idWink: string) {
    return this.allWinks.find(
      (wink, index) => {
        if (wink._id === idWink) {
          this.indexWink = index;
          return wink;
        }
      });
  }

  GetWinkIDUser(idUser: string) {
    return this.allWinks.find(
      (wink, index) => {
      if (wink.user._id === idUser ) {
        this.indexWink = index;
        return wink;
      }
    });
  }

  async GetWinks() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get(Routes.BASE + Routes.GET_WINKS).toPromise();
          this.allWinks = (response as Wink[]);
          this.FilterWinks((response as Wink[]));
          // console.log('Res', response);
          resolve(response);
        } catch (err) {
          console.log('Error DeleteWink: ' + err.message);
          reject(err);
        }
      }
    );
  }

  private FilterWinks(winks: Wink[], newUser?: boolean) {
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
  }

  SetRequests(data: Wink[]) {
    this.requests = [];
    this.requests.push(...data);
    this.requestsChanged.next(this.requests);
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
    this.requests.push(wink);
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
    let index = this.record.indexOf(wink);
    if (index === -1) {
      for (let i = 0 ; i < this.record.length; i++) {
        if (this.record[i]._id === wink._id) {
          index = i;
          break;
        }
      }
    }
    if (index !== -1) {
      this.record.splice(index, 1);
      this.recordChanged.next(this.record);
    }
  }

  DeleteRequests(wink: Wink) {
    let index = this.requests.indexOf(wink);
    if (index === -1) {
      for (let i = 0 ; i < this.requests.length; i++) {
        if (this.requests[i]._id === wink._id) {
          index = i;
          break;
        }
      }
    }
    if (index !== -1) {
      this.requests.splice(index, 1);
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

  UpdateUser(newUser: User) {
    if (!newUser) {
      return ;
    }
    const nearbyUser = this.GetNearbyUser(newUser._id);
    if (nearbyUser) {
      this.UpdatNearbyUser(newUser);
    }
    const wink = this.GetWinkIDUser(newUser._id);
    if (wink) {
      this.UpdateUserWink(newUser);
    }

  }

  private UpdatNearbyUser(newUser: User) {
    if (!newUser) {
      return ;
    }
    if (this.indexUser) {
      this.nearbyUsers[this.indexUser] = newUser;
      this.nearbyUsersChanged.next(this.nearbyUsers);
    }
  }

  private UpdateUserWink(newUser: User) {
    if (!newUser) {
      return ;
    }
    if (this.indexWink) {
      this.allWinks[this.indexWink].user = newUser;
      this.FilterWinks(this.allWinks, true);
    }

  }
}
