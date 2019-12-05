import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Injectable()
export class LoaderService  {
  private dismissTime = 10000;
  constructor(private loader: LoadingController) { }

  async showLoading() {
    const loading = await this.loader.create({
    message: 'Loading...',
    spinner: 'bubbles'
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();
      }, this.dismissTime);
  }
  public setDismissTime(time: number) {
    this.dismissTime = time;
  }

}

