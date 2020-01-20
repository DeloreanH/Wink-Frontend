import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/models/user.model';
import { Wink } from 'src/app/common/models/wink.model';
import { WinkService } from 'src/app/core/services/wink.service';
import { Item } from 'src/app/common/models/item.model';
import { ProfilesService } from 'src/app/core/services/profiles.service';
import { Section } from 'src/app/common/models/section.model';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ItemType } from 'src/app/common/models/itemType.model';
import { SaveContactService } from 'src/app/core/services/save-contact.service';
import { NameCategories } from 'src/app/common/enums/nameCaterogies.enum';
import { IndexItemType } from 'src/app/common/enums/indexItemType.emun';
import { Config } from 'src/app/common/enums/config.enum';
import { TranslateService } from '@ngx-translate/core';
import { Tours } from 'src/app/common/interfaces/tours.interface';
import { StorageService } from 'src/app/core/services/storage.service';
import { toursStorage } from 'src/app/common/constants/storage.constants';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { TourService } from 'ngx-tour-ngx-popper';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/common/alert/alert.service';
import { SocketService, SocketEventsListen } from 'src/app/core/services/socket.service';
import { Photo } from 'src/app/common/class/photo.class';

@Component({
  selector: 'app-private-profiles',
  templateUrl: './private-profiles.page.html',
  styleUrls: ['./private-profiles.page.scss'],
})
export class PrivateProfilesPage implements OnInit, OnDestroy {

  userWink: User;
  origin: string;
  wink: Wink;
  idWink: string;
  generalItems: {item: Item, itemType: ItemType}[] = [];
  professionalItems: {item: Item, itemType: ItemType}[] = [];
  personalItems: {item: Item, itemType: ItemType}[] = [];
  items: any[] = [];
  sections: Section[] = [];
  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  avatar: string = Config.AVATAR;
  load = true;
  noItems = Config.NO_ITEMS;
  backButtonSubs = new Subscription();
  updatedUserSubs = new Subscription();
  updatedAvatarSubs = new Subscription();

  photo = new Photo();

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    private profilesService: ProfilesService,
    public alertController: AlertController,
    private contact: SaveContactService,
    private navController: NavController,
    private translateService: TranslateService,
    private tourService: TourService,
    private platform: Platform,
    private alerService: AlertService,
    private socketService: SocketService,
  ) {
    this.sections = this.profilesService.sections;
    this.items.push(this.generalItems);
    this.items.push(this.personalItems);
    this.items.push(this.professionalItems);
  }

  ngOnInit() {
    this.load = true;
    this.Subscriptions();
  }

  ngOnDestroy(): void {
    this.backButtonSubs.unsubscribe();
    this.updatedUserSubs.unsubscribe();
    this.updatedAvatarSubs.unsubscribe();
  }
  private Subscriptions() {
    this.route.params
    .subscribe(
      async (params: Params) => {
        try {
          const wink = await this.winkService.GetWinkID(params.idWink);
          const idUser = params.idUser;
          if (wink && idUser) {
            this.userWink = await this.winkService.GetUserID(idUser);
            this.idWink = params.idWink;
            this.origin = params.origin;
            const response: Item[] = await this.profilesService.GetPrivateItems(this.userWink._id, this.idWink);
            this.FiltreItems(response);
          }
        } catch (err) {
          console.log('Error ngOnInit private profiles', err.message);
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

  ValidateTour() {
    const tour: Tours = StorageService.GetItem(toursStorage, true);
    if (tour) {
      if (tour.private) {
        this.Tour(tour);
      }
    } else {
      StorageService.SetItem(toursStorage, {
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
        tour.private = false;
        StorageService.SetItem(toursStorage, tour);
      }
    );
  }

  private FiltreItems(items: Item[]) {
    if (this.items[0].length === 0  && this.items[1].length === 0  && this.items[2].length === 0) {
      items.forEach(
        (itemx: Item) => {
          if (itemx.value && itemx.value !== '') {
            (this.items[itemx.section.key - 1] as {item: Item, itemType: ItemType}[]).push({ item: itemx, itemType: null});
          }
        }
      );
      this.SortItems();
    }
  }

  private SortItems() {
    this.items.forEach(
      (items: any[]) => {
        items = items.sort(
          (a: any, b: any) => {
            if (a.item.position < b.item.position) {
              return -1;
            } else if (a.item.position > b.item.position) {
              return 1;
            } else {
              return 0;
            }
          }
        );
      }
    );
    this.load = false;
  }

   async Confirm() {
    setTimeout(
      async () => {
        this.alerService.showInput({
          title: 'WINK.DIALOGUES.TITLES.SAVE_CONTACTS',
          description: 'WINK.DIALOGUES.MESSAGES.SAVE_CONTACTS',
          inputs: [
            ...await this.LoadItemsList()
          ]
        }).subscribe(
          (data: any) => {
            if (data && data.length > 0) {
              this.SaveContact(data);
            }
          }
        );
        // const alert = await this.alertController.create({
        //   header: this.translateService.instant('WINK.PRIVATE_PROFILES.SAVE_CONTACTS'),
        //   inputs: [
        //     ...await this.LoadItemsList()
        //   ],
        //   buttons: [
        //     {
        //       text: this.translateService.instant('WINK.BUTTONS.CANCEL'),
        //       role: 'cancel',
        //       cssClass: 'secondary',
        //       handler: () => {
        //       }
        //     }, {
        //       text: this.translateService.instant('WINK.BUTTONS.OK'),
        //       handler: (inputs) => {
        //         if (inputs.length > 0) {
        //           this.SaveContact(inputs);
        //         }
        //       }
        //     }
        //   ]
        // });
        // await alert.present();
      }
      , 500);
  }

  async LoadItemsList() {
    const obj: any = [];
    obj.push({
      name: 'photo',
      type: 'checkbox',
      label: this.translateService.instant('WINK.ITEM_TYPES.AVATAR'),
      value: 'photo',
      checked: true
    });
    let add;
    for (const items of this.items) {
      for (const item of items) {
        add = false;
        const itemType = await this.profilesService.SearchItemType(item.item.itemtype);
        item.itemType = itemType;
        switch (itemType.category) {
          case NameCategories.MESSENGER:
            add = true;
            break;
          case NameCategories.SOCIAL_NETWORKS:
            add = true;
            break;
          case NameCategories.CONTACT:
            add = true;
            break;
          case NameCategories.PERSONAL:
            if (itemType.name === Config.BIRTHDAY) {
              add = true;
            } else if (itemType.index === IndexItemType.CAMPO) {
              add = true;
            }
            break;
        }
        if (add) {
          obj.push({
            name: item.item._id,
            type: 'checkbox',
            label: item.item.value,
            value: item.item._id,
            checked: true
          });
        }
      }
    }
    return obj;
  }

  private SaveContact(ids: string[]) {
    try {
      const predata: {item: Item, itemType: ItemType}[] = [];
      let complet = false;
      const copyItems = JSON.parse(JSON.stringify(this.items));
      for (const arrays of copyItems) {
        predata.push(...arrays);
      }
      const data: {item: Item, itemType: ItemType}[] = [];
      let item;
      ids.forEach(
        (id, index) => {
          item = predata.find(value => value.item._id === id);
          if (item) {
            data.push(item);
          }
          if (ids.length === index + 1) {
            complet = true;
          }
        }
      );
      if (complet) {
        this.contact.Create(data.slice(), this.userWink, ids[0] === 'photo');
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async Back() {
    try {
      setTimeout(
        async () => {
          await this.navController.navigateBack(
            this.userWink ? [this.urlPublic, this.origin === '0' ? this.userWink._id : this.idWink, this.origin] : [this.urlHome]
          );
        }
        , 500);
    } catch (err) {
      console.log('Error Behind', err);
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

  ionViewWillEnter() {
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
    this.backButtonSubs.unsubscribe();
  }

  public get Empty() {
    return this.generalItems.length === 0 && this.personalItems.length  === 0 && this.professionalItems.length === 0;
  }

}
