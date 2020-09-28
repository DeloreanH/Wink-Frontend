import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { User } from 'src/app/common/models/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WinkService } from 'src/app/core/services/wink.service';
import { ModalController, AlertController, NavController, Platform, PopoverController } from '@ionic/angular';
import { Item } from 'src/app/common/models/item.model';
import { Wink } from 'src/app/common/models/wink.model';
import { UserService } from 'src/app/core/services/user.service';
import { Config } from 'src/app/common/enums/config.enum';
import { IndexItemType } from 'src/app/common/enums/indexItemType.emun';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { ProfilesService } from 'src/app/core/services/profiles.service';
import { SocketEventsListen, SocketService } from 'src/app/core/services/socket.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/common/alert/alert.service';
import { AlertButtonType } from 'src/app/common/alert/base';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { Photo } from 'src/app/common/class/photo.class';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit, OnDestroy, AfterViewInit {

  userWink: User;
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
  deleteWinkSubs = new Subscription();
  approvedWinkSubs = new Subscription();
  sendedWinkSubs = new Subscription();
  updatedUserSubs = new Subscription();
  updatedAvatarSubs = new Subscription();
  backButtonSubs = new Subscription();
  private loadB = new BehaviorSubject(false);
  load$ = this.loadB.asObservable();
  activateView: boolean;
  photo = new Photo();
  testSend = false;
  textBtnWink: string = Buttons.WINK;
  textBtnIgnore: string = Buttons.IGNORE;
  textBtnSee: string = Buttons.SEE;

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
    private alertService: AlertService,
    public popoverController: PopoverController,
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
    this.EventSocket();
  }

  EventSocket() {
    this.sendedWinkSubs = this.socketService.Listen(SocketEventsListen.SENDED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          if (wink.receiver_id === this.userWink._id || wink.sender_id === this.userWink._id ) {
            wink.user = this.userWink;
            this.userWink.newWink = !wink.watched;
            if (wink.user === this.userWink) {
              this.wink = data.wink;
              this.WatchWink();
            }
          }
        }
      }
    );
    this.approvedWinkSubs = this.socketService.Listen(SocketEventsListen.HANDLED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          const wink: Wink = data.wink;
          if (this.wink && this.wink._id === wink._id) {
            wink.user = this.userWink;
            if (wink.user === this.userWink) {
              this.wink = wink;
            }
          }
        }
      }
    );
    this.deletedWinkSubs = this.socketService.Listen(SocketEventsListen.DELETED_WINK).subscribe(
      (data: any) => {
        if (data && data.wink) {
          if (this.wink && this.wink._id === data.wink._id) {
            this.wink = null;
          }
        }
      }
    );
    this.deleteWinkSubs = this.winkService.deleteWink.subscribe(
      (wink: Wink) => {
        if (this.wink && this.wink._id === wink._id) {
          this.wink = null;
        }
      }
    );
    this.updatedUserSubs = this.socketService.Listen(SocketEventsListen.UPDATED_USER).subscribe(
      (user: User) => {
        if (user) {
          if (user._id === this.userWink._id) {
            this.userWink = user;
          }
        }
      }
    );
    this.updatedAvatarSubs = this.socketService.Listen(SocketEventsListen.AVATAR_UPLOADED).subscribe(
      (user: User) => {
        if (user) {
          if (user._id === this.userWink._id) {
            this.userWink = user;
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.DestroySubs();
  }

  DestroySubs() {
    this.sendedWinkSubs.unsubscribe();
    this.approvedWinkSubs.unsubscribe();
    this.deletedWinkSubs.unsubscribe();
    this.updatedUserSubs.unsubscribe();
    this.updatedAvatarSubs.unsubscribe();
    this.backButtonSubs.unsubscribe();
  }

  WatchWink() {
    if (this.userWink.newWink && this.activateView) {
      this.userWink.newWink = false;
      this.winkService.WatchedWink(this.wink);
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
      }
    } catch (err) {
      console.log('Error GetWink', err);
      this.load = false;
    }
  }

  async AceptWink() {
    try {
      if (this.wink) {
        this.loadB.next(true);
        await this.winkService.ApproveWink(this.wink);
        this.wink.approved = true;
      }
    } catch (err) {
      console.log('Error DeleteWink', err);
    } finally {
      this.loadB.next(false);
    }
  }

  async DeleteWink() {
    try {
      if (this.wink) {
        this.loadB.next(true);
        await this.winkService.DeleteWink(this.wink);
        this.wink = null;
      }
    } catch (err) {
      console.log('Error DeleteWink', err);
    } finally {
      this.loadB.next(false);
    }
  }

  Wink() {
    if (!this.wink) {
      this.SendWink();
    } else if (!this.wink.approved && !this.Sended()) {
      this.AceptWink();
    } else if (!this.wink.approved && this.Sended()) {
      this.CancelWink();
    }
  }

  async SendWink() {
    try {
      this.loadB.next(false);
      const response = await this.winkService.SendWink(this.userWink._id);
      this.wink = response.wink;
    } catch (err) {
      console.log('Error SendWink', err);
    } finally {
      this.loadB.next(false);
    }
  }

  async CancelWink() {
    this.alertService.showActions({
      title: 'WINK.DIALOGUES.TITLES.CONFIRM',
      description: 'WINK.DIALOGUES.MESSAGES.CANCEL_WINK',
      buttons: [
        {
          label: Buttons.DISCARD,
          value: null,
          type: AlertButtonType.Danger
        }, {
          label: Buttons.YES,
          value: true,
          type: AlertButtonType.Secondary
        }
      ]
    }).subscribe(
      (resp: any) => {
        if (resp && resp.value) {
          this.DeleteWink();
        }
      }
    );
  }

  FilterItems(items: Item[], userW: User) {
    this.publicItems = [];
    try {
      let contador = 0;
      if (items) {
        items = items.filter(
          item => {
            return item.value && item.value !== '';
          }
        );
        if (items.length > 0) {
          if (items[0].position === -1) {
            contador++;
          }
        }
        if (userW.age ) {
          const age = new Item({
            _id: Config.ICON_AGE,
            value: (userW.age ? userW.age  : '0') + ' ' +  this.translateService.instant(Config.YEARS) ,
            custom: Config.NAME_AGE,
            position: IndexItemType.BIOGARFIA,
            section: null
          });
          items.splice(contador, 0, age);
          contador ++;
        }
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
      }
    } catch (err) {
      console.log('Error Filtre', err);
    }
    this.load = false;
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
    return this.photo.URLAvatar(this.userWink);
    // if (this.userWink && this.userWink.avatarUrl) {
    //   if (this.userWink.avatarUrl.startsWith('http')) {
    //     return this.userWink.avatarUrl;
    //   } else {
    //     return Routes.PHOTO + this.userWink.avatarUrl;
    //   }
    // } else {
    //   return this.avatar;
    // }
  }

  Sended(): boolean {
    if (this.wink) {
      return this.wink.sender_id === this.userWink._id ? false : true;
    } else {
      return false;
    }
  }

  ionViewWillEnter() {
    this.activateView = true;
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            this.Back();
          }
        );
      }
    );
    // alert('3 - Acabamos de entrar en la página.');
  }

  ionViewDidEnter() {
    // alert('4 - Página completamente cargada y activa.');
  }

  ionViewWillLeave() {
    // alert('6 - ¿Estás seguro que quieres dejar la página?.');
  }

  ionViewDidLeave() {
    // alert('7 - La página Home2 ha dejado de estar activa.');
    this.activateView = false;
    this.backButtonSubs.unsubscribe();
    // this.DestroySubs();
  }

  async ShowMenu(ev) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      componentProps: {
        wink: this.wink
      },
      event: ev,
      translucent: false
    });
    return await popover.present();
  }

  onScroll(event) {
    // used a couple of "guards" to prevent unnecessary assignments if scrolling in a direction and the var is set already:
    // console.log('scroll', event);
  }



}
