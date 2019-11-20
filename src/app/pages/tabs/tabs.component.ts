import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { SocketService, SocketEventsListen } from 'src/app/core/services/socket.service';
import { Subscription } from 'rxjs';
import { WinkService } from 'src/app/core/services/wink.service';
import { User } from 'src/app/common/models/user.model';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {

  ocultar = false;
  home = RoutesAPP.HOME;
  profiles = RoutesAPP.CONFIGURAR_PERFIL;
  winks = RoutesAPP.WINKS;
  winksTab = false;
  newWinks = new Map();
  url: string;

  updatedUserSubs = new Subscription();
  updatedAvatarSubs = new Subscription();
  sendedWinkSubs = new Subscription();
  approvedWinkSubs = new Subscription();
  deletedWinkSubs = new Subscription();

  constructor(
    private router: Router,
    private socketService: SocketService,
    private winkService: WinkService,
  ) { }

  ngAfterViewInit(): void {
    this.Listen();
  }

  public ngOnInit() {
    // this.socketService.connect();

    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
          this.url =  valor.url.split('/')[2];
          if (this.url === RoutesAPP.PERFIL_PUBLICO || this.url === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            this.ocultar = false;
          }
        }
        if (valor instanceof NavigationEnd) {
          this.url =  valor.url.split('/')[2];
          if (this.url === RoutesAPP.PERFIL_PUBLICO || this.url === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            if (this.winksTab && this.url === RoutesAPP.WINKS) {
              this.winksTab = false;
            }
            this.ocultar = false;
          }
        }
      }
    );
  }

  private Listen() {
    this.socketService.Connect();
    this.updatedUserSubs = this.socketService.Listen(SocketEventsListen.UPDATED_USER).subscribe(
      (user) => {
        if (user) {
          this.winkService.UpdateUser(user as User);
        }
        console.log(user);
      }
    );
    this.sendedWinkSubs = this.socketService.Listen(SocketEventsListen.SENDED_WINK).subscribe(
      (data: any) => {
        console.log(data);
        if (data && data.wink) {
          console.log('url', this.url);
          if (this.url !== RoutesAPP.WINKS) {
            this.winksTab = true;
          }
          this.newWinks.set(data.wink._id, data.wink._id);
          this.winkService.AddRequests(data.wink);
        }
      }
    );
    this.approvedWinkSubs = this.socketService.Listen(SocketEventsListen.APPROVED_WINK).subscribe(
      (data: any) => {
        console.log(data);
        if (data && data.wink) {
          if (this.newWinks.get(data.wink._id)) {
            this.newWinks.delete(data.wink._id);
            this.winksTab = false;
          }
          this.winkService.AddRecord(data.wink);
        }
      }
    );
    this.deletedWinkSubs = this.socketService.Listen(SocketEventsListen.DELETED_WINK).subscribe(
      (data: any) => {
        console.log(data);
        if (data && data.wink) {
          if (this.newWinks.get(data.wink._id)) {
            this.newWinks.delete(data.wink._id);
            this.winksTab = false;
          }
          this.winkService.DeleteWinkUser(data.wink);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sendedWinkSubs.unsubscribe();
    this.updatedUserSubs.unsubscribe();
    this.approvedWinkSubs.unsubscribe();
    this.deletedWinkSubs.unsubscribe();
    this.updatedAvatarSubs.unsubscribe();
  }


}
