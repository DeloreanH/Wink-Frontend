import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from './tabs-routing.module';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  ocultar = false;

  constructor(
    private router: Router
  ) { }

  public ngOnInit() {
    this.router.events.subscribe(
      (valor: any) => {
        this.ocultar = false;
        if (valor instanceof NavigationStart) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] === RoutesAPP.PERFIL_PUBLICO) {
            this.ocultar = true;
          }
        }
        if (valor instanceof NavigationEnd) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] === RoutesAPP.PERFIL_PUBLICO) {
            this.ocultar = true;
          }
        }
      }
    );
  }

}
