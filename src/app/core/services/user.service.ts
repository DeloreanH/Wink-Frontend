import { Injectable } from '@angular/core';
import { User } from '../../common/models/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../../common/enums/routes/routes.enum';
import { AuthUser } from '../../auth/models/authuser.model';
import { VisibilityOption } from '../../common/models/visibilityOptions.enum';
import { Location } from '../../common/models/location.model';
import { SocketService } from './socket.service';
import { MessagesServices } from 'src/app/common/enums/messagesServices.enum';
import { ToastService } from './toast.service';
import { StorageService } from './storage.service';
import { UserData } from 'src/app/common/interfaces/userData.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();
  genders: { value: string, description: string}[] = [
    { value: 'femile', description: 'WINK.OPTIONS_ITEMS.FEMILE' },
    { value: 'male', description: 'WINK.OPTIONS_ITEMS.MALE'},
    { value: 'other', description: 'WINK.OPTIONS_ITEMS.OTHER'},
    { value: 'i prefer not to say', description: 'WINK.OPTIONS_ITEMS.I_PREFER_NOT_TO_SAY'}
  ];

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private toastService: ToastService,
    private storageService: StorageService,
  ) { }

  GetGender(valueGender: string) {
    return this.genders.find(gender => gender.value === valueGender);
  }

  User(user?: User, updateStorage?: boolean) {
    if (user) {
      this.user = user;
      this.userChanged.next(user);
      if (updateStorage) {
        this.UpdateStorage();
      }
    } else {
      if (this.user) {
        return this.user;
      } else {
        const userLocal = this.storageService.apiAuthorization.user;
        this.User(userLocal);
        return userLocal;
      }
    }

  }

  UpdateAvatar(link: string) {
    if (link) {
      this.user.avatarUrl = link;
      this.socketService.AvatarUpload(this.user);
      this.User(this.user, true);
    }
  }

  async UpdateDate(data) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!data) {
            reject({message: 'No data'});
          }
          const response: any = await this.http.put(Routes.BASE + Routes.UPDATE_BASIC_DATE, data).toPromise();
          console.log(response);
          this.User(response.user, true);
          this.toastService.Toast(MessagesServices.SAVE_INFORMATION);
          this.socketService.UpdateUser(response.user);
          resolve(response);
        } catch (error) {
          this.toastService.Toast(MessagesServices.ERROR_SAVE);
          console.log('error', error);
          reject(error);
        }
      }
    );
  }

  private UpdateStorage() {
    const userData: UserData = this.storageService.apiAuthorization;
    if (userData) {
      const loadedUser = new AuthUser(userData.token, userData.exp, this.user);
      StorageService.SetItem('userData', loadedUser);
      // localStorage.setItem('userData', JSON.stringify(loadedUser));
    }
  }

  async UpdateStatus(statusValue: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_STATUS, { status: statusValue }).toPromise();
          this.user.status = statusValue;
          if (this.user.status === statusValue) {
            this.socketService.UpdateUser(this.user);
            this.User(this.user, true);
          }
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async UpdateProfiles(value: VisibilityOption) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!value) {
            reject({message: 'No value'});
          }
          const response = await this.http.post(Routes.BASE + Routes.UPDATE_PROFILES, {visibility: value}).toPromise();
          this.user.visibility = value;
          this.User(this.user, true);
          this.socketService.UpdateUser(this.user);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async UpdateLocation(location: Location) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          this.user.location = {
            latitude: location.latitude,
            longitude: location.longitude
          };
          // this.user.location.latitude = location.latitude;
          // this.user.location.longitude = location.longitude;
          this.User(this.user, true);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
