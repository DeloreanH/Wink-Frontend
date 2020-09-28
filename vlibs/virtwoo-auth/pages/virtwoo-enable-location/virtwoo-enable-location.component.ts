import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SlRouterService } from '@virtwoo/sl-router';

declare var cordova: any;

@Component({
  selector: 'mp-virtwoo-enable-location',
  templateUrl: './virtwoo-enable-location.component.html',
  styleUrls: ['./virtwoo-enable-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooEnableLocationComponent implements OnInit {

  public loading = false;

  constructor(
    private slRouterService: SlRouterService,
  ) { }

  public ngOnInit(): void { }

  public enabledAccuracy(): void {
    this.loading = true;
    if (typeof cordova !== 'undefined') {
      cordova.plugins.locationAccuracy.canRequest((canRequest) => {
        if (canRequest) {
          cordova.plugins.locationAccuracy.request((success) => {
            this.slRouterService.pop();
          }, (error) => {
            if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
              cordova.plugins.diagnostic.switchToLocationSettings();
            }

            this.slRouterService.pop();
          }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        } else {
          this.slRouterService.pop();
        }
      });
    }
  }

  public enabled(): void {
    this.loading = true;
    // navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }


}
