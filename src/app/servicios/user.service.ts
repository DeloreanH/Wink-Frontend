import { Injectable } from '@angular/core';
import { User } from '../modelos/user.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../modelos/routes.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User = null;
  userChanged = new Subject<User>();

  constructor(
    private http: HttpClient,
  ) { }

  User(data?: User) {
    if (data) {
      this.user = data;
      this.userChanged.next(this.user);
    } else {
      return this.user;
    }

  }

  async UpdateAvatar(data) {
    if (data) {
      try {
        const dataForm = new FormData();
        const imgBlob = this.ToBlob(data);
        dataForm.append('avatar', imgBlob, 'avatar.jpg');
        const respuesta = await this.http.post(Routes.BASE + Routes.UPLOAD_AVATAR, dataForm).toPromise();
        console.log('respuesta', respuesta);
      } catch (error) {
        console.log('error', error);
      }
    }
  }


  ToBlob(b64Data, contentType = 'image/jpg', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
