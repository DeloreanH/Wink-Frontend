import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  ocultar = false;
  home = RoutesAPP.HOME;
  profiles = RoutesAPP.CONFIGURAR_PERFIL;
  winks = RoutesAPP.WINKS;
  winksTab = true;

  constructor(
    private router: Router,
    private socketService: SocketService
  ) { }

  public ngOnInit() {
    // this.socketService.connect();
    this.socketService.UpdatedUser();

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
