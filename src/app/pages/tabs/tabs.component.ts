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
  idUser: string;
  idUserProfile: string;

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
  ) {
   }

  ngAfterViewInit(): void {
    this.Listen();
  }
  public ngOnInit() {
    this.idUser = this.userService.User()._id;
    this.RouterController();
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
              }
            }
            this.ocultar = false;
          }
        }
      }
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
          if (user._id === this.idUser) {
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
          if (user._id === this.idUser) {
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
          if (wink.receiver_id === this.idUser) {
            if (this.url !== RoutesAPP.WINKS) {
              this.winksTab = true;
              if (this.idUserProfile && this.url === RoutesAPP.PERFIL_PUBLICO && wink.sender_id === this.idUserProfile) {
                this.winksTab = false;
              } else {
                this.toastService.Toast('WINK.DIALOGUES.MESSAGES.NEW_WINK', null, [{
                  text: this.translateService.instant('WINK.BUTTONS.SEE'),
                  side: 'end',
                  handler: () => {
                    setTimeout(
                      async () => {
                        await this.navController.navigateBack(
                          ['/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS, true]
                        );
                      }
                      , 250);
                  },
                }], null, 2000);
              }
            }
            this.newWinks.set(wink._id, wink._id);
            this.winkService.AddWink(wink);
            this.songsService.Vibrate();
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
  }

}
