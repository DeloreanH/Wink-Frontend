import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { SlRouterService } from '@virtwoo/sl-router';

import { VirtwooAuthServerService } from '../../services';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'mp-virtwoo-register',
  templateUrl: './virtwoo-register.component.html',
  styleUrls: ['./virtwoo-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooRegisterComponent implements OnDestroy {

  public loading = false;
  public visibility = false;
  private backButtonSub: Subscription;

  constructor(
    private slRouterService: SlRouterService,
    private virtwooAuthServerService: VirtwooAuthServerService,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) { }


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
