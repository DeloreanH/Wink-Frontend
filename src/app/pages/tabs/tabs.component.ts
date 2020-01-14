import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { SocketService, SocketEventsListen } from 'src/app/core/services/socket.service';
import { Subscription } from 'rxjs';
import { WinkService } from 'src/app/core/services/wink.service';
import { User } from 'src/app/common/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Wink } from 'src/app/common/models/wink.model';
import { ToursService } from 'src/app/core/services/tours.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { Platform, NavController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Photo } from 'src/app/common/class/photo.class';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {

  ocultar = false;
  home = RoutesAPP.HOME;
  profiles = RoutesAPP.CONFIGURAR_PERFIL;
  winks = RoutesAPP.WINKS;
  winksTab = false;
  newWinks = new Map();
  url: string;
  user: User;
  userSubs = new Subscription();
  idUserProfile: string;
  notificationSubs: Subscription;

  photo = new Photo();

  tour = true;

  updatedUserSubs = new Subscription();
  updatedAvatarSubs = new Subscription();
  sendedWinkSubs = new Subscription();
  handeledWinkSubs = new Subscription();
  deletedWinkSubs = new Subscription();
  tourSubs = new Subscription();
  keyUpSubs = new Subscription();
  keyDownSubs = new Subscription();

  constructor(
    private router: Router,
    private socketService: SocketService,
    private winkService: WinkService,
    private userService: UserService,
    private toursService: ToursService,
    private songsService: SongsService,
    private toastService: ToastService,
    private navController: NavController,
    private translateService: TranslateService,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private keyboard: Keyboard,
  ) {
   }

  async ngAfterViewInit(): Promise<void> {
    this.Listen();
    if (this.platform.is('ios')) {
      const permission = await this.localNotifications.hasPermission();
      if (!permission) {
        this.NotificationPermission();
      }
    }
  }
  public ngOnInit() {
    this.user = this.userService.User();
    this.RouterController();
    if (this.platform.is('mobile')) {
      this.backgroundMode.enable();
      this.backgroundMode.setDefaults({silent: true});
    }
    this.userSubs = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.platform.ready().then( () => {

      this.keyUpSubs = this.keyboard.onKeyboardShow().subscribe(() => {
        document.body.classList.add('keyboard-is-open');
      });

      this.keyDownSubs = this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
      });

    });
  }

  RouterController() {
    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
          this.url =  valor.url.split('/')[2];
          this.idUserProfile = valor.url.split('/')[3] ? valor.url.split('/')[3] : null;
          if (this.url === RoutesAPP.PERFIL_PUBLICO || this.url === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            this.ocultar = false;
            if (this.url === RoutesAPP.WINKS) {
              if (this.winksTab) {
                this.winksTab = false;
                this.newWinks.clear();
              }
            }
          }
        }
        if (valor instanceof NavigationEnd) {
          this.url =  valor.url.split('/')[2];
          this.idUserProfile = valor.url.split('/')[3] ? valor.url.split('/')[3] : null;
          if (this.url === RoutesAPP.PERFIL_PUBLICO || this.url === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            if (this.url === RoutesAPP.WINKS) {
              if (this.winksTab) {
                this.winksTab = false;
                this.newWinks.clear();
              }
            }
            this.ocultar = false;
          }
        }
      }
    );
  }

  async NotificationPermission() {
    try {
      await this.localNotifications.requestPermission();
    } catch (error) {
    }
  }

  async Background(wink: Wink) {
    if (this.backgroundMode.isActive() && this.platform.is('mobile')) {
      if (this.newWinks.size === 1) {
        const user = await this.winkService.GetUserWink(wink);
        this.localNotifications.schedule({
          id: 1,
          title: this.translateService.instant('WINK.NOTIFICATION.TITLE.NEW'),
          text: this.translateService.instant('WINK.NOTIFICATION.MESSAGE.NEW', {userName: user.firstName}),
          icon: '/assets/icon/wink.svg'
        });
      } else {
        this.localNotifications.schedule({
          id: 1,
          title: this.translateService.instant('WINK.NOTIFICATION.TITLE.MULTIPLE'),
          text: this.translateService.instant('WINK.NOTIFICATION.MESSAGE.MULTIPLE', {count: this.newWinks.size}),
          icon: '/assets/icon/wink.svg'
        });
      }
      this.notificationSubs = this.localNotifications.on('click').subscribe( event => {
        this.goToWinks();
        this.notificationSubs.unsubscribe();
      });
    }
  }

  async goToWinks() {
    await this.navController.navigateBack(
      ['/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS, true]
    );
  }

  private Listen() {
    this.tour = this.toursService.tour;
    this.tourSubs = this.toursService.tourChanged.subscribe(
      (tour) => {
        this.tour = tour;
      }
    );
    this.socketService.Connect();
    this.updatedUserSubs = this.socketService.Listen(SocketEventsListen.UPDATED_USER).subscribe(
      (user: User) => {
        if (user) {
          if (user._id === this.user._id) {
            this.userService.User(user, true);
          } else {
            this.winkService.UpdateUser(user as User);
          }
        }
      }
    );
    this.updatedAvatarSubs = this.socketService.Listen(SocketEventsListen.AVATAR_UPLOADED).subscribe(
      (user: User) => {
        if (user) {
          if (user._id === this.user._id) {
            this.userService.User(user, true);
          } else {
            this.winkService.UpdateUser(user as User, true);
          }
        }
      }
    );
    this.sendedWinkSubs = this.socketService.Listen(SocketEventsListen.SENDED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          wink.user = null;
          if (wink.receiver_id === this.user._id) {
            this.newWinks.set(wink._id, wink._id);
            this.Background(wink);
            if (this.url !== RoutesAPP.WINKS) {
              this.winksTab = true;
              if (this.idUserProfile && this.url === RoutesAPP.PERFIL_PUBLICO && wink.sender_id === this.idUserProfile) {
                this.winksTab = false;
              } else {
                if (!this.backgroundMode.isActive() && this.platform.is('mobile')) {
                  this.toastService.Toast('WINK.DIALOGUES.MESSAGES.NEW_WINK', null, [{
                    text: this.translateService.instant('WINK.BUTTONS.SEE'),
                    side: 'end',
                    handler: () => {
                      setTimeout(
                        async () => {
                          this.goToWinks();
                        }
                        , 250);
                    },
                  }], null, 2000);
                }
              }
            }
            this.songsService.Vibrate();
          }
          this.winkService.AddWink(wink);
        }
      }
    );
    this.handeledWinkSubs = this.socketService.Listen(SocketEventsListen.HANDLED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          wink.user = null;
          if (this.newWinks.get(wink._id)) {
            this.newWinks.delete(wink._id);
            this.winksTab = false;
          }
          this.winkService.AddWink(wink);
        }
      }
    );
    this.deletedWinkSubs = this.socketService.Listen(SocketEventsListen.DELETED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          wink.user = null;
          if (this.newWinks.get(wink._id)) {
            this.newWinks.delete(wink._id);
            this.winksTab = false;
          }
          this.winkService.DeleteWinkUser(wink);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sendedWinkSubs.unsubscribe();
    this.updatedUserSubs.unsubscribe();
    this.handeledWinkSubs.unsubscribe();
    this.deletedWinkSubs.unsubscribe();
    this.updatedAvatarSubs.unsubscribe();
    this.userSubs.unsubscribe();
    this.keyUpSubs.unsubscribe();
    this.keyDownSubs.unsubscribe();
  }

  Avatar() {
    return this.photo.URLAvatar(this.user);
  }

}
