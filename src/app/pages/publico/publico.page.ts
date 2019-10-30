import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modelos/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/service/wink.service';
import { ModalController } from '@ionic/angular';
import { DatosComponent } from './datos/datos.component';
import { RoutesAPP } from '../tabs/tabs-routing.module';
import { Item } from 'src/app/modelos/item.model';
import { Wink } from 'src/app/modelos/wink.model';
import { UserService } from 'src/app/servicios/user.service';
import { Config } from 'src/app/config/config.enum';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.page.html',
  styleUrls: ['./publico.page.scss'],
})
export class PublicoPage implements OnInit {

  userWink: User;
  user: User;
  send = false;
  data = false;
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  publicItems: Item[] = [];
  wink: Wink;
  load = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private winkService: WinkService,
    public modalController: ModalController,
    private userService: UserService
  ) {
    this.user = this.userService.User();
  }

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
        console.log(response);
        const gender = new Item({
          icon: Config.ICON_GENDER,
          value: 'response.',
          description: Config.NAME_GENDER,
          position: -1,
          section: null
        });
        const age = new Item({
          icon: Config.ICON_AGE,
          value: 'response.',
          description: Config.NAME_AGE,
          position: -1,
          section: null
        });
        this.publicItems.includes(age, 1);
        this.publicItems.includes(gender, 2);
        console.log(2, this.publicItems);
        // this.wink = response.wink;
        this.wink = new Wink(
          {
            sender_id : this.userWink._id,
            approved: false
          }
        );
        // this.wink = null;
        if (this.wink && this.wink.sender_id === this.userWink._id) {
          this.send = false;
        } else {
          this.send = true;
        }
        this.load = true;
      } catch (err) {
        console.log('Error GetItems', err.message);
      }
    }
  }

  Acept() {
    this.wink.approved = true;
  }

  Decline() {
    this.wink = null;
  }

  Send() {
    this.send = true;
    this.wink = new Wink(
      {
        sender_id : this.user._id,
        approved: false
      }
    );
  }
}
