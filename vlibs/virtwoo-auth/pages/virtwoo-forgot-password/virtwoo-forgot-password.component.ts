import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SlRouterService } from '@virtwoo/sl-router';

import { VirtwooAuthServerService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { VirtwooAuthPathName } from 'vlibs/virtwoo-auth/virtwoo-auth-config.data';

@Component({
  selector: 'mp-virtwoo-forgot-password',
  templateUrl: './virtwoo-forgot-password.component.html',
  styleUrls: ['./virtwoo-forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooForgotPasswordComponent implements OnDestroy {
  private backButtonSub: Subscription;
  constructor(
    private matSnackBar: MatSnackBar,
    private slRouterService: SlRouterService,
    private translateService: TranslateService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private platform: Platform
  ) {}
  submitted({ email }) {
    this.virtwooAuthServerService.forgotPassword(email)
      .subscribe(() => {
        this.matSnackBar.open(
          this.translateService.instant('VIRTWOO_AUTH.MESSAGE.EMAIL_SENT'),
          null,
          {
            duration: 3000,
            verticalPosition: 'top'
          }
        );
        this.slRouterService.pop();
      });
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
}
