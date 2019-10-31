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
    try {
      if (this.userWink) {
        const response = await this.winkService.GetPublicItems(this.userWink._id);
        let contador = 1;
        const userW = new User(response.user);
        this.publicItems.push(...response.userItems);
        // console.log(response);
        const age = new Item({
          _id: Config.ICON_AGE,
          value: userW.age + ' años',
          custom: Config.NAME_AGE,
          position: -1,
          section: null
        });
        this.publicItems.splice(contador, 0, age);
        contador ++;
        if (this.userService.gender[Config.GENDER_HIDEEN] !== userW.gender) {
          const gender = new Item({
            _id: Config.ICON_GENDER,
            value: 'response.',
            custom: Config.NAME_GENDER,
            position: -1,
            section: null
          });
          this.publicItems.splice(contador, 0, gender);
          contador ++;
        }
        this.wink = response.wink;
        /*this.wink = new Wink(
          {
            sender_id : this.userWink._id,
            approved: false
          }
        );*/
        // this.wink = null;
        if (this.wink && this.wink.sender_id === this.userWink._id) {
          this.send = false;
        } else {
          this.send = true;
        }
        this.load = true;
      }
    } catch (err) {
      console.log('Error GetWink', err.message);
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
