import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ComponentRef,
} from '@angular/core';
import {
  Observable,
  Subscriber,
} from 'rxjs';

import {
  AlertType,
  AlertOption,
  AlertActionsOption,
  AlertTutorialOption,
  AlertButton,
  AlertButtons,
  AlertButtonType,
} from './base';
import { AlertComponent } from './alert.component';
import { Buttons } from '../enums/buttons.enum';

@Injectable()
export class AlertService {

  private element: HTMLElement = null;
  private componentRef: ComponentRef<AlertComponent> = null;
  private observer: Subscriber<any>;

  public removeClass = true;

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  public showTutorial(option: AlertTutorialOption): Observable<null> {
    return this.any(AlertType.Tutorial, option);
  }

  public showConfirm(option: AlertOption): Observable<null | boolean> {
    return this.any(AlertType.Comfirm, option);
  }

  public showActions(option: AlertActionsOption): Observable<null | AlertButton> {
    return this.any(AlertType.Actions, option);
  }

  public showPromptStatus(option: AlertActionsOption): Observable<null | AlertButton> {
    return this.any(AlertType.PromptStatus, option);
  }

  public showNotification(option: AlertActionsOption): Observable<null> {
    return this.any(AlertType.Actions, option);
  }

  public any(alertType: AlertType, option: AlertOption | AlertActionsOption | AlertTutorialOption): Observable<null | any> {
    if (alertType === AlertType.Comfirm) {
      const buttons = this.confirmBT;

      (option as any).buttons = buttons;
    }
    return new Observable<any>((observer) => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      let unsu = true;

      this.observer = observer;
      this.element = document.createElement('alert');
      this.componentRef = factory.create(this.injector, [], this.element);

      this.applicationRef.attachView(this.componentRef.hostView);

      this.componentRef.instance.alertType = alertType;
      this.componentRef.instance.options = option;

      this.componentRef.instance.closed
        .subscribe((response: any) => {
          unsu = false;
          this.close(response);
        });

      document.body.classList.add('alert-open', 'blur');
      document.body.appendChild(this.element);

      return {
        unsubscribe: () => {
          if (unsu) {
            this.close(null, true);
          }
        }
      };
    });
  }

  private close(response: any, unsubscribe = false): void {
    this.componentRef.destroy();
    this.applicationRef.detachView(this.componentRef.hostView);

    if (!unsubscribe) {
      this.observer.next(response);
      this.observer.complete();
    }

    this.observer = null;
    this.element = null;
    this.componentRef = null;

    if (this.removeClass) {
      document.body.classList.remove('alert-open', 'blur');
    }

    this.removeClass = true;
  }

  private get confirmBT(): AlertButtons {
    const A = Buttons.YES;
    const B = Buttons.NO;

    return [
      { type: AlertButtonType.Danger, label: B, value: false },
      { type: AlertButtonType.Secondary, label: A, value: true }
    ] as AlertButtons;
  }

}
