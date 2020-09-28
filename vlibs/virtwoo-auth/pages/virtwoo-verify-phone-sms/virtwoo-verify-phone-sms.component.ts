import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  Subscription,
  BehaviorSubject,
} from 'rxjs';
import { finalize } from 'rxjs/operators';

import {
  SlRouterService,
} from '@virtwoo/sl-router';

import { VirtwooAuthServerService } from '../../services';
import { VIRTWOO_AUTH_CONFIG } from '../../virtwoo-auth-config.data';
import { VirtwooAuthConfig } from '../../virtwoo-auth-config';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';

@Component({
  selector: 'mp-virtwoo-verify-phone-sms',
  templateUrl: './virtwoo-verify-phone-sms.component.html',
  styleUrls: ['./virtwoo-verify-phone-sms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooVerifyPhoneSmsComponent
  implements OnInit, OnDestroy {

  public timer: any;
  public timerInterval: number;
  public outTimer = false;
  public phone = null;
  public prefix = null;
  public loading = false;

  private data: Params = null;
  private sub$ = new Subscription();

  constructor(
    @Inject(VIRTWOO_AUTH_CONFIG)
    private virtwooAuthConfig: VirtwooAuthConfig,
    private changeDetectorRef: ChangeDetectorRef,
    private slRouterService: SlRouterService,
    private route: ActivatedRoute,
    private virtwooAuthServerService: VirtwooAuthServerService
  ) { }

  public ngOnInit(): void {
    this.resetTimer();
    this.initTimer();

    this.sub$.add(
      this.route.queryParams
        .subscribe(
          (response) => { this.data = response; }
        )
    );
  }

  public ngOnDestroy(): void {
    this.sub$.unsubscribe();
    clearInterval(this.timerInterval);
  }

  public initTimer(): void {
    this.timerInterval = window.setInterval(() => {

      if (this.timer.minutes === 0 && this.timer.seconds === 1) {
        clearInterval(this.timerInterval);
        this.outTimer = true;
      }

      if (this.timer.seconds === 0) {
        this.timer.seconds = 59;
        this.timer.minutes--;
      } else {
        this.timer.seconds--;
      }

      this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  public resetTimer(): void {
    this.timer = {
      seconds: 0,
      minutes: 5
    };
  }

  public retrySendPhoneNumber(): void {
    this.outTimer = false;
    this.resetTimer();
  }

  public wrongNumber(): void {
    clearInterval(this.timerInterval);

    this.slRouterService.push(
      VirtwooAuthPathName.Sms,
      null,
      { queryParamsHandling: 'preserve' }
    );
  }

  public getTimer(): string {
    const minutes = ('00' + this.timer.minutes).slice(-2);
    const seconds = ('00' + this.timer.seconds).slice(-2);

    return `${minutes}:${seconds}`;
  }

  public sendCodeNumber($event: { code: number }): void {
    this.loading = true;

    this.virtwooAuthServerService.verifyCode(
      {
        code: $event.code,
        accessToken: this.data.access_token
      }
    )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        () => { },
        (error) => {
          console.log(error);
        }
      );
  }

}
