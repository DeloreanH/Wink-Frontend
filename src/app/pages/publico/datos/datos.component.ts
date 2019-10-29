import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/modelos/user.model';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RoutesAPP } from '../../tabs/tabs-routing.module';
import { WinkService } from 'src/app/service/wink.service';
import { Item } from 'src/app/modelos/item.model';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent implements OnInit {

  @Input() user: User;
  publicItems: Item[] = [];

  close = false;
  constructor(
    public modalController: ModalController,
    private router: Router,
    private navParams: NavParams,
  ) {
    this.publicItems = this.navParams.get('publicItems');
  }

  ngOnInit() {
    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart && !this.close) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] !== RoutesAPP.PERFIL_PUBLICO) {
            this.close = true;
            this.Cerrar();
          }
        }
        if (valor instanceof NavigationEnd && !this.close) {
          // console.log('aquii', valor.url.split('/'));
          if (valor.url.split('/')[2] !== RoutesAPP.PERFIL_PUBLICO) {
            this.close = true;
            this.Cerrar();
          }
        }
      }
    );
  }

  async Cerrar() {
    this.close = true;
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }
}
