import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { SocketService, SocketEventsListen } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { WinkService } from 'src/app/services/wink.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, AfterViewInit {

  ocultar = false;
  home = RoutesAPP.HOME;
  profiles = RoutesAPP.CONFIGURAR_PERFIL;
  winks = RoutesAPP.WINKS;
  winksTab = true;

  subs = new Subscription();

  constructor(
    private router: Router,
    private socketService: SocketService,
    private winkService: WinkService,
  ) { }

  ngAfterViewInit(): void {
    this.socketService.Connect();
    this.subs = this.socketService.Listen(SocketEventsListen.UPDATED_USER).subscribe(
      (user) => {
        if (user) {
          this.winkService.UpdateUser(user as User);
        }
        console.log(user);
      }
    );
  }

  public ngOnInit() {
    // this.socketService.connect();

    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] === RoutesAPP.PERFIL_PUBLICO || valor.url.split('/')[2] === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            this.ocultar = false;
          }
        }
        if (valor instanceof NavigationEnd) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] === RoutesAPP.PERFIL_PUBLICO || valor.url.split('/')[2] === RoutesAPP.PRIVATE_PROFILES) {
            this.ocultar = true;
          } else {
            if (this.winksTab && valor.url.split('/')[2] === RoutesAPP.WINKS) {
              this.winksTab = false;
            }
            this.ocultar = false;
          }
        }
      }
    );
  }

}
