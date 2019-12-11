import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SlRouterService } from '@virtwoo/sl-router';

import { VirtwooAuthServerService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mp-virtwoo-forgot-password',
  templateUrl: './virtwoo-forgot-password.component.html',
  styleUrls: ['./virtwoo-forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooForgotPasswordComponent {

  constructor(
    private matSnackBar: MatSnackBar,
    private slRouterService: SlRouterService,
    private translateService: TranslateService,
    private virtwooAuthServerService: VirtwooAuthServerService,
  ) { }

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
}
