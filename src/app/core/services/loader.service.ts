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
  private isLoading = false;
  private status = false;
  constructor(
    public loadingController: LoadingController,
    private translateService: TranslateService,
    ) { }

  async Show(opts?: LoadingOptions) {
    this.isLoading = true;
    const optsO: LoadingOptions = {
        message: 'WINK.LOADER.LOADING',
        spinner: 'bubbles'
      };
    opts = opts ? opts : optsO;
    opts.message = opts.message ? this.translateService.instant(opts.message) : null;
    return await this.loadingController.create(opts).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  public async Close() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  public get Status(): boolean {
    return this.status;
  }
}

