import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';

export enum PositionToast {
  TOP = 'top',
  BOTTOM = 'bottom',
  MIDDLE = 'middle'
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  async Toast(
    messageText: string,
    headerText?: string,
    positionValue?: PositionToast,
    durationValue?: number,
    colorValue?: string
    ) {
    const toast = await this.toastController.create({
      header: headerText ? headerText : null,
      message: messageText,
      position: positionValue ? positionValue : PositionToast.TOP,
      duration: durationValue ? durationValue : 3000,
      color: colorValue ? colorValue : null,
    });
    toast.present();
  }
}
