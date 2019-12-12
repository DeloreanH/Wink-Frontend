import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import {
  SlRouterService,
} from '@virtwoo/sl-router';

import { VirtwooAuthSmsService } from '../../services';
import { finalize } from 'rxjs/operators';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'virtwoo-phone-sms',
  templateUrl: './virtwoo-phone-sms.component.html',
  styleUrls: ['./virtwoo-phone-sms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooPhoneSmsComponent implements OnDestroy {

  public step = 1;
  public loading = false;
  private backButtonSub: Subscription;

  constructor(
    private slRouterService: SlRouterService,
    private virtwooAuthSmsService: VirtwooAuthSmsService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }

  public goToLoginNormal(): void {
    this.slRouterService.push(VirtwooAuthPathName.Login);
  }
  ionViewWillEnter() {
    this.backButtonSub = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            this.Back();
          }
        );
      }
    );
  }

  Back() {
    setTimeout(() => {
      this.slRouterService.push(VirtwooAuthPathName.Login);
    }, 500);
  }


  ionViewDidLeave() {
    this.backButtonSub.unsubscribe();
  }

  ngOnDestroy(): void {
    this.backButtonSub.unsubscribe();
  }

  public sendPhoneNumber($event: { phone: string, prefix: number }): void {
    this.step = 2;
    this.loading = true;

    this.virtwooAuthSmsService.launch($event)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        ({ access_token }) => {
          const queryParams = Object.assign({}, $event, { access_token });

          this.slRouterService.push(
            VirtwooAuthPathName.VerifySms,
            null,
            { queryParams }
          );
        },
        (error) => {
          this.step = 1;
          console.log(error);
        }
      );
  }

}
