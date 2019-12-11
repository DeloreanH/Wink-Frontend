import {
  Injectable,
  InjectionToken,
  Inject,
  NgZone,
} from '@angular/core';
import {
  Router,
  NavigationExtras,
  ActivatedRoute,
} from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import {
  BehaviorSubject,
  Subject,
} from 'rxjs';

import {
  SLRouter,
  SLRouterChange,
  SLBackAction,
  SLRouterPathParams,
  SLRouterChangeType,
} from './sl-router.models';
import { NavController, Platform as Platform1 } from '@ionic/angular';


export const USE_SL_ROUTER = new InjectionToken<SLRouter[]>('USE_SL_ROUTER');
export const USE_SL_ROUTER_ROOT = new InjectionToken<SLRouter>('USE_SL_ROUTER_ROOT');

interface SLRouterExtras extends SLRouter {
  extras?: NavigationExtras;
  pathParams?: {
    [key: string]: string;
  };
}

export type DirectionNav = 'back' | 'root' | 'forward';

declare var Keyboard: any;

@Injectable()
export class SlRouterService {
  private routesSource = new BehaviorSubject<SLRouterExtras[]>([]);
  private eventsSource = new Subject<SLRouterChange>();
  private keyboardSource = new Subject<boolean>();
  private backActios: SLBackAction[] = [];
  private isKeyboard = false;
  private navagateDirection: DirectionNav = 'forward';


  public routes$ = this.routesSource.asObservable();
  public events$ = this.eventsSource.asObservable();
  public keyboard$ = this.keyboardSource.asObservable();
  public lock = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private platform: Platform,
    private ngZone: NgZone,
    private navController: NavController,
    private pltf: Platform1,
    @Inject(USE_SL_ROUTER) private slRouterSource: SLRouter[],
    @Inject(USE_SL_ROUTER_ROOT) private slRouterRoot: SLRouter,
  ) {
    if (
      this.platform.ANDROID ||
      this.platform.IOS
    ) {
      this.initCordovaMobileEvents();
    }
  }

  public get direction(): DirectionNav {
    return this.navagateDirection;
  }

  public set direction(direction: DirectionNav) {
    this.navagateDirection = direction;
  }

  private initCordovaMobileEvents(): void {
    this.pltf.backButton.subscribe(
      (resp) => {
        resp.register(50,
          () => {
            this.ngZone.run(() => {
              this.launch();
            });
          }
        );
      }
    );
    // document.addEventListener('backbutton', () => {
    //   this.ngZone.run(() => {
    //     this.launch();
    //   });
    // });

    window.addEventListener('keyboardWillShow', () => {
      this.isKeyboard = true;
      this.keyboardSource.next(this.isKeyboard);
    });

    window.addEventListener('keyboardWillHide', () => {
      this.isKeyboard = false;
      this.keyboardSource.next(this.isKeyboard);
    });
  }

  public push(
    event: string | SLBackAction,
    pathParams: SLRouterPathParams = {},
    extras: NavigationExtras = null,
  ): void {
    if (typeof event === 'string') {
      if (!this.lock) {
        this.launchPush(event, pathParams, extras);
      }
    } else {
      this.backActios.push(event);
    }
  }

  public pop(pathParams?: SLRouterPathParams, extras?: NavigationExtras): void {
    if (!this.lock) {
      this.launchPop(pathParams, extras);
    }
  }

  public launch(pathParams?: SLRouterPathParams, extras?: NavigationExtras): void {
    if (this.isKeyboard) {
      Keyboard.hide();
    } else {
      if (this.backActios.length > 0) {
        this.launchAction();
      } else if (!this.lock) {
        this.launchPop(pathParams, extras);
      }
    }
  }

  public setRoot(
    name: string,
    navegated = false,
    pathParams: SLRouterPathParams = {},
    extras: NavigationExtras = null
  ): void {
    const root = this.findSLRoute(name);

    if (root) {
      this.slRouterRoot = root;

      if (navegated) {
        this.push(name, pathParams, extras);
      }

    } else {
      console.error(`Alias "${name}" not found.`);
    }
  }

  public getRoot(): SLRouter {
    return this.slRouterRoot;
  }

  private launchPush(
    name: string,
    pathParams: SLRouterPathParams = {},
    extras?: NavigationExtras
  ): void {
    const routeApp = this.findSLRoute(name);
    let path;
    let extrasFinal: NavigationExtras = {};

    if (routeApp) {
      path = routeApp.path;

      if (pathParams) {
        path = this.parsePathParams(routeApp.path, pathParams);
      }

      if (this.direction === 'back') {
        this.direction = 'forward';
      }

      extrasFinal = extras ? extras : {};

      if (this.direction === 'root') {
        extrasFinal.replaceUrl = true;
      }

      this.navController.setDirection(this.direction);
      this.router.navigate([path], extrasFinal)
        .finally(
          () => {
            this.direction = 'forward';
          }
        )
        .then(
          isPush => {
            if (isPush) {
              this.pushChange(routeApp, pathParams, extras);
              this.backActios = [];
            } else {
              this.errorChange(routeApp);
            }
          }
        )
        .catch(
          (error) => {
            console.log(error);
            this.errorChange(routeApp);
          }
        );
    } else {
      console.error('La ruta no existe');
    }
  }

  private launchPop(pathParams?: SLRouterPathParams, extras?: NavigationExtras): void {
    const routesSource = this.routesSource.value;
    const routeRoot = this.slRouterRoot;
    let routeTo: SLRouterExtras = null;
    let path: string;
    let extrasFinal: NavigationExtras = {};

    routesSource.pop();

    if (routesSource.length > 0) {
      routeTo = routesSource[routesSource.length - 1];
    } else {
      routeTo = routeRoot;
    }

    path = routeTo.path;

    if (pathParams) {
      pathParams = pathParams || {};
    } else if (routeTo.pathParams) {
      pathParams = routeTo.pathParams;
    } else {
      pathParams = {};
    }

    path = this.parsePathParams(path, pathParams);

    if (this.direction === 'forward') {
      this.direction = 'back';
    }

    extrasFinal = extras
        ? extras
        : (routeTo.extras
          ? routeTo.extras
          : {});

    if (this.direction === 'root') {
      extrasFinal.replaceUrl = true;
    }

    this.navController.setDirection(this.direction);

    if (routeTo) {
      this.router.navigate(
        [path],
        extrasFinal
      )
        .finally(
          () => {
            this.direction = 'forward';
          }
        )
        .then(
          isPop => {
            if (isPop) {
              this.popChange(routeTo);
            } else {
              this.errorChange(routeTo);
            }
          }
        )
        .catch(
          () => {
            this.errorChange(routeTo);
          }
        );
    }
  }

  private launchAction(): void {
    const backAction = this.backActios.pop();

    if (backAction) {
      backAction();
    }
  }

  public cancelAction(): void {
    this.backActios.pop();
  }

  private pushChange(
    routeApp: SLRouter,
    pathParams: SLRouterPathParams,
    extras: NavigationExtras
  ): void {
    const routesSource = this.routesSource.value;
    const routeRoot = this.slRouterRoot;
    const event: SLRouterChange =  {
      type: SLRouterChangeType.Push,
      SLRouter: routeApp
    };

    if (routeApp.name === routeRoot.name) {
      const length =  routesSource.length;

      routesSource.splice(0, length);
    }

    routesSource.push({ ...routeApp, pathParams, extras });

    this.routesSource.next(routesSource);
    this.eventsSource.next(event);
  }

  private popChange(routeApp: SLRouterExtras): void {
    const routesSource = this.routesSource.value;
    const event: SLRouterChange =  {
      type: SLRouterChangeType.Pop,
      SLRouter: routeApp
    };

    if (
      routesSource.length > 0
      && routeApp.name === routesSource[routesSource.length - 1].name
    ) {
      routesSource.splice(routesSource.length - 1, 1, routeApp);
    } else {
      routesSource.push(routeApp);
    }

    this.routesSource.next(routesSource);
    this.eventsSource.next(event);
  }

  private errorChange(routeApp: SLRouter): void {
    const changeError: SLRouterChange =  {
      type: SLRouterChangeType.Error,
      SLRouter: routeApp
    };

    this.eventsSource.next(changeError);
  }

  private findSLRoute(name: string): SLRouter {
    return this.slRouterSource.find(routeApp => routeApp.name === name);
  }

  private parsePathParams(base: string, pathParams: SLRouterPathParams = {}): string {
    let path = base;

    if (!pathParams) {
      pathParams = {};
    }

    for (const key in pathParams) {
      if (pathParams.hasOwnProperty(key)) {
        path = path.replace(new RegExp(`:${key}`, 'g'), pathParams[key]);
      }
    }

    return path;
  }



}
