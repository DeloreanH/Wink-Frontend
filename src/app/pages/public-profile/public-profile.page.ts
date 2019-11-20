import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/core/services/wink.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { Item } from 'src/app/common/models/item.model';
import { Wink } from 'src/app/common/models/wink.model';
import { UserService } from 'src/app/core/services/user.service';
import { Config } from 'src/app/common/enums/config.enum';
import { IndexItemType } from 'src/app/common/enums/indexItemType.emun';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { ProfilesService } from 'src/app/core/services/profiles.service';

@Component({
  selector: 'public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit {

  userWink: User;
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
    private profilesService: ProfilesService,
    private navController: NavController,
  ) {
    // this.user = this.userService.User();
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      async (params: Params) => {
        console.log('params', params);
        if (params.origin) {
          this.origin = params.origin;
          if (this.origin === '0') {
            this.userWink = await this.winkService.GetNearbyUser(params.id);
            console.log('userWink', this.userWink);
          } else if (this.origin === '1') {
            const wink = await this.winkService.GetWinkID(params.id);
            this.userWink = wink.user;
            console.log('userWink', this.userWink);
          } else {
            this.origin = 0;
            this.Back();
          }
          if (this.userWink) {
            if (this.userWink.newWink) {
              this.userWink.newWink = false;
              this.winkService.UpdateUser(this.userWink);
            }
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
          // this.winkService.GetWinkID(response.wink._id).user = this.userWink;
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
      console.log('Error GetWink', err);
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

  FilterItems(items: Item[], userW: User) {
    if (items && items.length > 0) {
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
      if (this.userService.genders[3].value !== userW.gender) {
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

  async Back() {
    try {
      setTimeout(
      async () => {
        await this.navController.navigateBack(
          [this.origin === '0' ? this.urlHome : this.urlWinks]
        );
      }
      , 500);
    } catch (err) {
      console.log('Error Behind', err);
    }
  }

  async GoPrivateProfile() {
    try {
      await this.navController.navigateForward(
        [this.urlPrivate, this.userWink._id , this.wink._id, this.origin]
      );
    } catch (err) {
      console.log('Error Go', err.message);
    }
  }

}
