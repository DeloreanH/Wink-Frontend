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
import { AlertType, AlertButtons, maxStatus, AlertInputs, AlertRangeOption } from './base';
import { Subscription } from 'rxjs';
import { Platform, IonRadioGroup, IonInput, IonItem, IonCheckbox, IonRange } from '@ionic/angular';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild(IonRadioGroup, {static: false}) groupRadio: IonRadioGroup;
  @ViewChild(IonInput, {static: false}) custom: IonInput;
  @ViewChildren(IonItem) items: QueryList<HTMLImageElement>; // ElementRef<HTMLImageElement>;
  @ViewChildren(IonCheckbox) checkboxs: QueryList<HTMLImageElement>;
  @ViewChild(IonRange, {static: false}) range: IonRange;
  listInputs: any[] = [];
  maxStatus = maxStatus;
  valueRange = 1;

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
    if (this.isRange) {
      this.valueRange = this.value as number;
    }
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
    } else if (this.alertType === AlertType.Input) {
      this.closed.emit(this.ValueInputs(emit));
    } else if (this.alertType === AlertType.Range) {
      this.closed.emit(this.ValueRange(emit));
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

  get SelectRadioInput() {
    let select = false;
    if (
      this.groupRadio &&
      this.groupRadio.value === 'input' &&
      this.custom && !this.custom.value
      ) {
        select = true;
    } else {
      if (this.custom && this.custom.value) {
        if ((this.custom.value as string).trim() === '') {
          select = true;
        }
      }
    }
    return select;
  }

  disabledButton(button: any) {
    let disabled = false;
    if (button && button.value && this.isPromptStatus && this.SelectRadioInput) {
      disabled = true;
    }
    return disabled;
  }

  ValueRange(emit: any) {
    if (emit && emit.value) {
        return this.range.value;
    }
    return null;
  }

  changeRange() {
    this.valueRange = this.range.value as number;
  }

  ValueInputs(emit: any) {
    const value: string[] = [];
    let ready = false;
    if (emit && emit.value) {
      this.listInputs.push(...(this.checkboxs as any)._results);
      if (this.listInputs.length > 0) {
        this.listInputs.forEach(
          (input: any, index: number) => {
            if (input.checked) {
              value.push(input.value);
            }
            if (index === (this.listInputs.length - 1)) {
              ready = true;
            }
          }
        );
      } else {
        return null;
      }
      if (ready) {
        console.log(value);
        return value;
      }
    } else {
      return emit;
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

  public get inputs() {
    return this.option<AlertInputs>('inputs', []);
  }

  public get max() {
    return this.option('max');
  }

  public get min() {
    return this.option('min');
  }

  public get value() {
    return this.option('value');
  }

  public option<T>(key: string, DEFAULT = null): T {
    return this.options && this.options[key]
      ? this.options[key]
      : DEFAULT;
  }

  public get isConfirm(): boolean {
    return this.alertType === AlertType.Confirm;
  }

  public get isTutorial(): boolean {
    return this.alertType === AlertType.Tutorial;
  }

  public get isInputs(): boolean {
    return this.alertType === AlertType.Input;
  }

  public get isRange(): boolean {
    return this.alertType === AlertType.Range;
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

