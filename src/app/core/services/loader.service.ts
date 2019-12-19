import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

interface LoadingOptions {
  spinner?: 'bubbles' | 'circles' | 'circular' | 'crescent'| 'dots' | 'lines' | 'lines-small' | null;
  message?: string;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;
  backdropDismiss?: boolean;
  keyboardClose?: boolean;
  id?: string;
}

@Injectable()
export class LoaderService  {

  constructor(
    public loadingController: LoadingController,
    private translateService: TranslateService,
    ) { }

  async Show(opts?: LoadingOptions) {
    try {
      const optsO: LoadingOptions = {
        message: 'WINK.LOADER.LOADING',
        spinner: 'bubbles'
      };
      opts = opts ? opts : optsO;
      opts.message = opts.message ? this.translateService.instant(opts.message) : null;
      const loading = await this.loadingController.create(opts);
      await loading.present();
    } catch (err) {
      console.log('Error Show ', err);
    }
  }
  public async Close() {
    try {
      if (await this.loadingController.getTop()) {
        this.loadingController.dismiss();
      }
    } catch (err) {
      this.loadingController.dismiss();
    }
  }

}

