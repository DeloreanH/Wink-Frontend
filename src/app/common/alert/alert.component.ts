import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  NgZone,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { AlertType, AlertButtons, maxStatus } from './base';
import { Subscription } from 'rxjs';
import { Platform, IonRadioGroup, IonInput, IonItem } from '@ionic/angular';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild(IonRadioGroup, {static: false}) groupRadio: IonRadioGroup;
  @ViewChild(IonInput, {static: false}) custom: IonInput;
  @ViewChildren(IonItem) items: QueryList<HTMLImageElement>; // ElementRef<HTMLImageElement>;
  maxStatus = maxStatus;

  @Output()
  public closed = new EventEmitter<any>();

  @Input()
  public options: { [key: string]: any } = null;

  @Input()
  public alertType: AlertType = null;

  private stepIndex = 0;

  private sub$ = new Subscription();

  public focusInput: boolean;

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
  ) {}

  public ngOnInit(): void {
    this.initBack();
    this.focusInput = this.isInput;
  }

  ngAfterViewInit(): void {
    // this.elementIonItemRef();

  }

  public ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  elementIonItemRef() {
    const items = this.items.first;

    // console.log(items.classList.remove('item-interactive'));
  }

  public close(emit: any = null): void {
    if (this.alertType === AlertType.PromptStatus) {
      this.closed.emit(this.ValuePrompt(emit));
    } else if (this.alertType !== AlertType.Tutorial) {
      this.closed.emit(emit);
    } else if (this.stepIndex === this.steps.length - 1) {
      this.closed.emit(emit);
    }
  }

  ValuePrompt(emit: any) {
    let value = null;
    if (emit && emit.value) {
      if (this.groupRadio.value === 'input') {
        value = this.custom.value;
      } else {
        value = this.groupRadio.value;
      }
    }
    return value;
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

  public get isPromptStatus(): boolean {
    return this.alertType === AlertType.PromptStatus;
  }

  public get isInput(): boolean {
    return this.description && this.description !== 'WINK.STATUS.BUSY' && this.description !== 'WINK.STATUS.AVAILABLE';
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
          res.register(200, () => {
            this.ngZone.run(() => {
              this.close(null);
              // TODO: Implementar opciones para  back button
            });
          });
        }
      )
    );
  }

  Focus(event) {
    this.focusInput = true;
  }

  Blur(event) {
    this.focusInput = false;
  }

}

