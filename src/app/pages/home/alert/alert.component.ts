import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, NgZone } from '@angular/core';
import { AlertType, AlertButtons } from './base';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnDestroy, OnInit {

  @Output()
  public closed = new EventEmitter<any>();

  @Input()
  public options: { [key: string]: any } = null;

  @Input()
  public alertType: AlertType = null;

  private stepIndex = 0;

  private sub$ = new Subscription();

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
  ) {}

  public ngOnInit(): void {
    this.initBack();
  }

  public ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  public close(emit: any = null): void {
    if (this.alertType !== AlertType.Tutorial) {
      this.closed.emit(emit);
    } else if (this.stepIndex === this.steps.length - 1) {
      this.closed.emit(emit);
    }
  }

  public get title(): string {
    return this.option('title');
  }

  public get description(): string {
    return this.option('description');
  }

  public get buttons() {
    return this.option<AlertButtons>('buttons', []);
  }

  public option<T>(key: string, DEFAULT = null): T {
    return this.options && this.options[key]
      ? this.options[key]
      : DEFAULT;
  }

  public get isConfirm(): boolean {
    return this.alertType === AlertType.Comfirm;
  }

  public get isTutorial(): boolean {
    return this.alertType === AlertType.Tutorial;
  }

  public get steps(): string[] {
    return this.option('steps');
  }

  public get step(): string {
    return this.steps[this.stepIndex];
  }

  public nextStep(): void {
    if (this.stepIndex === this.steps.length - 1) {
      this.close();
    } else {
      this.stepIndex++;
    }
  }

  public backStep(): void {
    if (this.stepIndex > 0) {
      this.stepIndex--;
    }
  }

  private initBack(): void {
    this.sub$.add(
      this.platform.backButton
      .subscribe(
        (res) => {
          res.register(150, () => {
            this.ngZone.run(() => {
              // TODO: Implementar opciones para  back button
            });
          });
        }
      )
    );
  }

}

