import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { User } from 'src/app/common/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/core/services/wink.service';
import { ModalController, AlertController, NavController, Platform } from '@ionic/angular';
import { Item } from 'src/app/common/models/item.model';
import { Wink } from 'src/app/common/models/wink.model';
import { UserService } from 'src/app/core/services/user.service';
import { Config } from 'src/app/common/enums/config.enum';
import { IndexItemType } from 'src/app/common/enums/indexItemType.emun';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { ProfilesService } from 'src/app/core/services/profiles.service';
import { SocketEventsListen, SocketService } from 'src/app/core/services/socket.service';
import { Subscription } from 'rxjs';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { Tours } from 'src/app/common/interfaces/tours.interface';
import { tours } from 'src/app/common/constants/storage.constants';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { TourService } from 'ngx-tour-ngx-popper';

@Component({
  selector: 'public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit, OnDestroy, AfterViewInit {

  userWink: User;
  send = false;
  data = false;
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  urlWinks = '/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS;
  urlPrivate = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PRIVATE_PROFILES;
  publicItems: Item[] = [];
  wink: Wink;
  load = true;
  origin;
  avatar: string = Config.AVATAR;
  deletedWinkSubs = new Subscription();
  approvedWinkSubs = new Subscription();
  sendedWinkSubs = new Subscription();
  backButtonSubs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    public modalController: ModalController,
    private userService: UserService,
    public alertController: AlertController,
    private profilesService: ProfilesService,
    private navController: NavController,
    private socketService: SocketService,
    private platform: Platform,
    private translateService: TranslateService,
    private tourService: TourService,
  ) {
    // this.user = this.userService.User();
  }

  ngOnInit() {
    this.load = true;
    this.route.params
    .subscribe(
      async (params: Params) => {
        if (params.origin) {
          this.origin = params.origin;
          if (this.origin === '0') {
            this.userWink = await this.winkService.GetNearbyUser(params.id);
          } else if (this.origin === '1') {
            const wink = await this.winkService.GetWinkID(params.id);
            this.userWink = wink.user;
          } else {
            this.origin = 0;
            this.Back();
          }
          if (this.userWink) {
            this.GetWink();
          }
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.sendedWinkSubs = this.socketService.Listen(SocketEventsListen.SENDED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          if (wink.receiver_id === this.userWink._id || wink.sender_id === this.userWink._id ) {
            wink.user = this.userWink;
            if (wink.user === this.userWink) {
              this.wink = data.wink;
              this.send = false;
            }
            if (wink.sender_id === this.userService.User()._id) {
              this.send = true;
            }
          }
        }
      }
    );
    this.approvedWinkSubs = this.socketService.Listen(SocketEventsListen.APPROVED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          if (this.wink._id === data.wink._id) {
            data.wink.user = this.userWink;
            if (data.wink.user === this.userWink) {
              this.wink = data.wink;
              this.send = false;
            }
          }
        }
      }
    );
    this.deletedWinkSubs = this.socketService.Listen(SocketEventsListen.DELETED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          if (this.wink._id === data.wink._id) {
            this.wink = null;
            this.send = false;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sendedWinkSubs.unsubscribe();
    this.approvedWinkSubs.unsubscribe();
    this.deletedWinkSubs.unsubscribe();
    this.backButtonSubs.unsubscribe();
  }

  ValidateTour() {
    const tour: Tours = StorageService.GetItem(tours, true);
    if (tour) {
      if (tour.public) {
        this.Tour(tour);
      }
    } else {
      StorageService.SetItem(tours, {
        home: true,
        profile: true,
        public: true,
        private: true,
        winks: true
      });
      this.Tour(tour);
    }
  }

  Tour(tour: Tours) {
    this.tourService.initialize(
      [{
        anchorId: 'status',
        content: 'Comparte lo que estes haciendo.',
        title: 'Status',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        }
      }, {
        anchorId: 'profiles',
        // tslint:disable-next-line: max-line-length
        content: 'Aqui puedes modificar los perfiles que deseas enviar.',
        title: 'Second',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        },
        // route: '/' + RoutesAPP.BASE + '/' + RoutesAPP.CONFIGURAR_PERFIL
      }]
    );
    this.tourService.start();
    this.tourService.end$.subscribe(
      () => {
        tour.public = false;
        StorageService.SetItem(tours, tour);
      }
    );
  }

  WatchWink() {
    if (this.userWink.newWink) {
      this.userWink.newWink = false;
      this.winkService.WatchedWink(this.wink);
      this.winkService.UpdateUser(this.userWink);
    }
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
          this.WatchWink();
        }
        if (this.wink && this.wink.sender_id === this.userWink._id) {
          this.send = false;
        } else {
          this.send = true;
        }
      }
    } catch (err) {
      console.log('Error GetWink', err);
      this.load = false;
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
        await this.winkService.DeleteWink(this.wink);
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
      header: this.translateService.instant('WINK.DIALOGUES.TITLES.CONFIRM') ,
      message: this.translateService.instant('WINK.DIALOGUES.MESSAGES.CANCEL_WINK') ,
      buttons: [
        {
          text: this.translateService.instant('WINK.BUTTONS.DISCARD'),
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: this.translateService.instant('WINK.BUTTONS.YES'),
          handler: () => {
            this.DeleteWink();
          }
        }
      ]
    });

    await alert.present();
  }

  FilterItems(items: Item[], userW: User) {
    this.publicItems = [];
    let contador = 0;
    if (items) {
      if (items.length > 0) {
        items = items.filter(
          item => {
            return item.value && item.value !== '';
          }
        );
        if (items[0].position === -1) {
          contador++;
        }
      }
      const age = new Item({
        _id: Config.ICON_AGE,
        value: (userW.age ? userW.age  : '0') + ' ' +  this.translateService.instant(Config.YEARS) ,
        custom: Config.NAME_AGE,
        position: IndexItemType.BIOGARFIA,
        section: null
      });
      items.splice(contador, 0, age);
      contador ++;
      if (userW.gender && userW.gender !== '' && this.userService.genders[3].value !== userW.gender) {
        const genderValue = this.userService.GetGender(userW.gender);
        if (genderValue) {
          const gender = new Item({
            _id: Config.ICON_GENDER,
            value:  this.translateService.instant(genderValue.description),
            custom: Config.NAME_GENDER,
            position: IndexItemType.BIOGARFIA,
            section: null,
          });
          items.splice(contador, 0, gender);
          contador ++;
        }
      }
      this.publicItems.push(...items);
      this.load = false;
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
      console.log('Error Back', err);
    }
  }

  async GoPrivateProfile() {
    try {
      await this.navController.navigateForward(
        [this.urlPrivate, this.userWink._id , this.wink._id, this.origin],
        {
          animationDirection: 'forward',
          animated: true
        }
      );
    } catch (err) {
      console.log('Error Go', err.message);
    }
  }

ErrorImagen() {
    this.userWink.avatarUrl = this.avatar;
  }

Avatar() {
    let avatar;
    if (this.userWink) {
      if (this.userWink.avatarUrl.startsWith('http')) {
        avatar = this.userWink.avatarUrl;
      } else {
        avatar = Routes.PHOTO + this.userWink.avatarUrl;
      }
    } else {
      avatar = this.avatar;
    }
    return avatar;
  }

}
