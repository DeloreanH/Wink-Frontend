import { Injectable } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ToastButton } from '@ionic/core/dist/types/components/toast/toast-interface';
import { TranslateService } from '@ngx-translate/core';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';

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
    private toastController: ToastController,
    private translateService: TranslateService,
  ) { }

  async Toast(
    messageText: string,
    headerText?: string,
    buttonsValue?: ToastButton[],
    positionValue?: PositionToast,
    durationValue?: number,
    colorValue?: string
    ) {
      if (await this.toastController.getTop()) {
        this.toastController.dismiss();
      }
      const toast = await this.toastController.create({
        header: headerText ? this.translateService.instant(headerText) : null,
        message: this.translateService.instant(messageText),
        position: positionValue ? positionValue : PositionToast.TOP,
        duration: durationValue ? durationValue : 3000,
        color: colorValue ? colorValue : null,
        buttons: buttonsValue ? buttonsValue : [],
      });
      toast.present();
  }

}
