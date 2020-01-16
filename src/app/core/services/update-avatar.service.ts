import { Injectable } from '@angular/core';
import {
  Camera,
} from '@ionic-native/camera/ngx/';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../../common/enums/routes/routes.enum';
import { Platform, ActionSheetController } from '@ionic/angular';
import { ToastService } from './toast.service';
import { MessagesServices } from 'src/app/common/enums/messagesServices.enum';
import { NetworkService } from './network.service';
@Injectable({
  providedIn: 'root'
})
export class UpdateAvatarService {

  private imageBase64 = null;

  constructor(
    private camera: Camera,
    private http: HttpClient,
    private toastService: ToastService,
    private networkService: NetworkService,
  ) { }

  /**
   * @description Inicializa la camara(true) o la galeria(false) del movil segun el valor enviado.
   */

  async OpenUpdate(camera: boolean) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const open = await this.Open(camera);
          if (open) {
            const update = await this.UpdateAvatar();
            resolve(update);
          }
          reject({message: 'Error open Camera'});
      } catch (err) {
        reject(err);
      }
      }
    );
  }

  async Open(camera: boolean) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const image = await this.camera.getPicture(
            {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            allowEdit: true
          });
          // image = await this.crop.crop(image, { quality: 100 });
          this.imageBase64 = image;
          resolve(image);
      } catch (err) {
        reject(err);
      }
      }
    );
  }

  async UpdateAvatar() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!this.imageBase64) {
            reject({message: 'No imageBase64'});
          }
          const dataForm = new FormData();
          const imgBlob = this.ToBlob(this.imageBase64);
          dataForm.append('avatar', imgBlob, 'avatar.jpg');
          if (this.networkService.StatusNetwork) {
            const response: any = await this.http.post(Routes.BASE + Routes.UPLOAD_AVATAR, dataForm).toPromise();
            this.toastService.Toast(MessagesServices.SAVE_PHOTO);
            resolve(response);
          } else {
            reject({message: 'No network'});
          }
        } catch (err) {
          this.toastService.Toast(MessagesServices.ERROR_PHOTO);
          console.log('error', err);
          reject(err);
        }
      }
    );
  }

  private ToBlob(b64Data, contentType = 'image/jpg', sliceSize = 512) {
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

  Data() {
    return this.imageBase64;
  }
}
