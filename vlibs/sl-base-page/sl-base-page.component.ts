import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  SlRouterService,
  SLBackAction
} from '@virtwoo/sl-router';

import {
  SLBaseButton,
  SLBaseButtonPosition
} from './sl-base-page.models';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sl-base-page',
  templateUrl: './sl-base-page.component.html',
  styleUrls: ['./sl-base-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SLBasePageComponent
  implements OnDestroy, OnInit, AfterViewInit {

  @HostBinding('class')
  public get classElement(): string {
    const position = this.navPosition || '';
    const WH = this.WH || '';

    return `${this.classes} ${position} ${WH}`;
  }

  // tslint:disable-next-line: no-input-rename
  @Input('class')
  public classes = '';

  @Input()
  public backButtonEmit = false;

  @Input()
  public set nav($position: 'top' | 'bottom' | 'both') {
    this.navPosition = $position;
  }

  public get nav(): 'top' | 'bottom' | 'both' {
    return this.navPosition;
  }

  @Input()
  public set contentWH($WH: 'content-full' | 'window-full') {
    this.WH = $WH;
  }

  public get contentWH(): 'content-full' | 'window-full' {
    return this.WH;
  }

  @Input()
  public search = false;

  @Input()
  public searchAutoFocus = false;

  @Input()
  public set float($float: string) {
    this.floatButtom = $float;

    if ($float && this.includeAction) {
      this.slRouterService.push(this.floatClose);
    }

    this.changeDetectorRef.detectChanges();
  }

  public get float(): string {
    return this.floatButtom;
  }

  @Input()
  public backButton: 'top' | 'bottom' = null;

  @Input()
  public buttons: SLBaseButton[] = [];

  @Output()
  public button = new EventEmitter<SLBaseButton>();

  @Output()
  public searchValue = new EventEmitter<string>();

  @Output()
  public back = new EventEmitter<boolean>();

  @Output()
  public floatd = new EventEmitter<boolean>();

  public isKeyboard = false;
  public ButtonPosition = SLBaseButtonPosition;

  @ViewChildren('searchInput')
  private searchInput: QueryList<ElementRef<HTMLInputElement>>;

  private subs$ = new Subscription();
  private navPosition: 'top' | 'bottom' | 'both';
  private floatButtom: string = null;
  private WH: 'content-full' | 'window-full' = null;
  private includeAction = true;
  private floatClose: SLBackAction = () => {
    this.includeAction = false;
    this.float = null;
    this.includeAction = true;

    this.floatEmit(false);

    return false;
  }

  constructor(
    private slRouterService: SlRouterService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.subs$.add(
      this.slRouterService.keyboard$
        .subscribe(
          isKeyboard => {
            this.isKeyboard = isKeyboard;
            this.changeDetectorRef.detectChanges();
          }
        )
    );
  }

  public ngAfterViewInit(): void {
    if (this.searchAutoFocus) {
      setTimeout(() => { this.searchFocus(); }, 50);
    }
  }

  public ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  public searchFocus(): void {
    const element = this.searchInput.first.nativeElement;

    element.focus();
  }

  public searchClear(): void {
    const element = this.searchInput.first.nativeElement;

    element.value = '';
  }

  public searchChange(value = ''): void {
    this.searchValue.emit(value);
  }

  public getButtons(position: SLBaseButtonPosition): SLBaseButton[] {
    return this.buttons.filter(button => button.position === position);
  }

  public backEmit(): void {
    if (this.backButtonEmit) {
      this.back.emit(true);
    } else {
      this.slRouterService.launch();
    }
  }

  public buttonSelect(item: SLBaseButton): void {
    if (item.redirectTo) {
      this.slRouterService.push(item.redirectTo.name, item.redirectTo.pathParams, item.redirectTo.extras);
    } else {
      this.button.emit(item);
    }
  }

  public floatEmit($selected: boolean): void {
    this.floatd.emit($selected);
  }

}
