import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/services/wink.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Item } from 'src/app/models/item.model';
import { Wink } from 'src/app/models/wink.model';
import { UserService } from 'src/app/services/user.service';
import { Config } from 'src/app/config/enums/config.enum';
import { IndexItemType } from 'src/app/config/enums/indexItemType.emun';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { ProfilesService } from 'src/app/services/profiles.service';

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
  urlWinks = '/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS;
  urlPrivate = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PRIVATE_PROFILES;
  publicItems: Item[] = [];
  wink: Wink;
  load = false;
  origin;

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    public modalController: ModalController,
    private userService: UserService,
    public alertController: AlertController,
    private profilesService: ProfilesService
  ) {
    this.user = this.userService.User();
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        if (params.origin) {
          this.origin = params.origin;
          if (this.origin === '0') {
            this.userWink = this.winkService.GetUser(params.id);
          } else if (this.origin === '1') {
            this.userWink = this.winkService.GetWinkID(params.id).user;
          } else {
            // Regresar
          }
          if (this.userWink) {
            this.GetWink();
          }
        }
      }
    );
  }

  async GetWink() {
    try {
      if (this.userWink) {
        const response = await this.profilesService.GetPublicItems(this.userWink._id);
        const userW = new User(response.user);
        this.FilterItems(response.userItems, userW);
        if (response.wink) {
          this.wink = response.wink;
          this.wink.user = this.userWink;
        }
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

  async AceptWink() {
    try {
      if (this.wink) {
        const response = await this.winkService.ApproveWink(this.wink);
        this.wink.approved = true;
        this.send = false;
      }
    } catch (err) {
      console.log('Error DeleteWink', err);
    }
  }

  async DeleteWink() {
    try {
      if (this.wink) {
        const response = await this.winkService.DeleteWink(this.wink);
        this.wink = null;
        this.send = false;
      }
    } catch (err) {
      console.log('Error DeleteWink', err);
    }
  }

  async SendWink() {
    try {
      const response = await this.winkService.SendWink(this.userWink._id);
      this.wink = response.wink;
      this.send = true;
    } catch (err) {
      console.log('Error SendWink', err);
    }
  }

  async CancelWink() {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Desea <strong>cancelar</strong> el wink?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.DeleteWink();
          }
        }
      ]
    });

    await alert.present();
  }

  GoProfiles() {

  }

  FilterItems(items: Item[], userW: User) {
    let contador = 0;
    items = items.filter(
      item => {
        return item.value && item.value !== '';
      }
    );
    if (items[0].position === -1) {
      contador++;
    }
    const age = new Item({
      _id: Config.ICON_AGE,
      value: (userW.age ? userW.age  : '0') + ' años',
      custom: Config.NAME_AGE,
      position: IndexItemType.BIOGARFIA,
      section: null
    });
    items.splice(contador, 0, age);
    contador ++;
    if (this.userService.gender[Config.GENDER_HIDEEN] !== userW.gender) {
      const gender = new Item({
        _id: Config.ICON_GENDER,
        value: userW.gender,
        custom: Config.NAME_GENDER,
        position: IndexItemType.BIOGARFIA,
        section: null
      });
      items.splice(contador, 0, gender);
      contador ++;
    }
    this.publicItems.push(...items);
  }
}
