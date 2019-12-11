import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { SlRouterService } from '@virtwoo/sl-router';

import { VirtwooAuthServerService } from '../../services';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mp-virtwoo-register',
  templateUrl: './virtwoo-register.component.html',
  styleUrls: ['./virtwoo-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooRegisterComponent {

  public loading = false;
  public visibility = false;

  constructor(
    private slRouterService: SlRouterService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  public goToLogin(): void {
    this.slRouterService.push(VirtwooAuthPathName.Login);
  }

  public changeVisibility(): void {
    this.visibility = !this.visibility;
  }

  public submit(event: any): void {
    this.loading = true;
    this.virtwooAuthServerService.registerUser(event)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

}
