import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modelos/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/service/wink.service';
import { ModalController } from '@ionic/angular';
import { DatosComponent } from './datos/datos.component';
import { RoutesAPP } from '../tabs/tabs-routing.module';
import { Item } from 'src/app/modelos/item.model';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.page.html',
  styleUrls: ['./publico.page.scss'],
})
export class PublicoPage implements OnInit {

  userWink: User;
  data = false;
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  publicItems: Item[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private winkService: WinkService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.userWink = this.winkService.GetUser(params.user);
      }
    );
    this.GetWink();
  }

  async Datos(event) {
    if (event.direction === 8) {
      const modal = await this.modalController.create({
        component: DatosComponent,
        showBackdrop: true,
        componentProps: {
          publicItems: this.publicItems
        }
      });
      return await modal.present();
    }
  }

  async GetWink() {
    if (this.userWink) {
      try {
        const response = await this.winkService.GetPublicItems(this.userWink._id);
        this.publicItems = response.userItems;
      } catch (err) {
        console.log('Error GetItems', err.message);
      }
    }
  }
}
