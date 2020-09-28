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
import { Photo } from 'src/app/common/class/photo.class';
import { BackgroundService } from 'src/app/core/services/background.service';
import { LocalNotificationsService } from 'src/app/core/services/local-notifications.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {

  hidden = false;
  homeRoute = RoutesAPP.HOME;
  profilesRoute = RoutesAPP.CONFIGURAR_PERFIL;
  winksRoute = RoutesAPP.WINKS;
  winksTab = false;
  newWinks = new Map();
  url: string;
  user: User;
  userSubs = new Subscription();
  idUserProfile: string;

  photo = new Photo();

  tour = true;

  updatedUserSubs = new Subscription();
  updatedAvatarSubs = new Subscription();
  sendedWinkSubs = new Subscription();
  handeledWinkSubs = new Subscription();
  deletedWinkSubs = new Subscription();
  tourSubs = new Subscription();


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
    private platform: Platform,
    private backgroundService: BackgroundService,
    private localNotificationsService: LocalNotificationsService,
  ) {
   }

  async ngAfterViewInit(): Promise<void> {
    this.Listen();
    this.localNotificationsService.Permission();
    this.backgroundService.Enable();
  }

  public ngOnInit() {
    this.user = this.userService.User();
    this.RouterController();
    // this.socketService.Connect();
    this.userSubs = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.Listen();
  }

  RouterController() {
    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
          this.url =  valor.url.split('/')[2];
          this.idUserProfile = valor.url.split('/')[3] ? valor.url.split('/')[3] : null;
          if (this.url === RoutesAPP.PERFIL_PUBLICO || this.url === RoutesAPP.PRIVATE_PROFILES) {
            this.hidden = true;
          } else {
            this.hidden = false;
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
            this.hidden = true;
          } else {
            if (this.url === RoutesAPP.WINKS) {
              if (this.winksTab) {
                this.winksTab = false;
                this.newWinks.clear();
              }
            }
            this.hidden = false;
          }
        }
      }
    );
  }

  async Background(wink: Wink) {
    console.log('Background');
    console.log('isEnabled backgroundMode', this.backgroundService.isEnabled );
    console.log('isActive backgroundMode', this.backgroundService.isActive );
    if (this.backgroundService.isActive && this.platform.is('cordova')) {
      console.log('Background cordova');
      if (this.newWinks.size === 1) {
        this.localNotificationsService.NewRequest(wink);
      } else {
        this.localNotificationsService.NewRequests(this.newWinks.size);
      }
    }
  }

  async goToWinks() {
    await this.navController.navigateForward(
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
                console.log('desactivar notificacion');
                this.winksTab = false;
              } else {
                if (!this.backgroundService.isActive && this.platform.is('cordova')) {
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
            this.winkService.AddWink(wink);
          }
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
  }

  Avatar() {
    return this.photo.URLAvatar(this.user);
  }
}
