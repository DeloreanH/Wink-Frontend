import {
  Directive,
  Input,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import {
  Subscription,
  fromEvent,
} from 'rxjs';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'img[srcPath]'
})
export class ImgLoadDirective implements
  OnDestroy {

  @Input()
  public set srcPath($event: string) {
    this._srcPath = $event;

    if (this.load) {
      this.initImage();
    }
  }

  public get srcPath() {
    return this._srcPath;
  }

  @Input()
  public imgLoad = '/assets/img/cargando.gif';

  @Input()
  public imgError = '/assets/img/no-img.jpg';

  // tslint:disable-next-line: variable-name
  private _srcPath: string = null;
  private imageElement: HTMLImageElement = null;
  private load = false;
  private sub$ = new Subscription();

  constructor(
    private elementRef: ElementRef<HTMLImageElement>,
  ) {
    this.initImage();
  }

  public ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  private initImage(): void {
    this.unsubscribe();
    this.elementRef.nativeElement.src = this.imgLoad;
    this.imageElement =  document.createElement('img');
    this.initEvents();
    this.imageElement.src = this.srcPath;

    this.load = true;
  }

  private initEvents(): void {
    this.sub$.add(
      fromEvent(this.imageElement, 'load')
        .subscribe(
          () => {
            this.elementRef.nativeElement.src = this.srcPath
              ? this.srcPath
              : '/assets/img/no-img.jpg';

            this.imageElement.remove();
          }
        )
    );
    this.sub$.add(
      fromEvent(this.imageElement, 'error')
        .subscribe(
          () => {
            this.elementRef.nativeElement.src = this.imgError;
            this.imageElement.remove();
          }
        )
    );
  }

  private unsubscribe(): void {
    this.sub$.unsubscribe();
    this.sub$ = new Subscription();
  }

}
