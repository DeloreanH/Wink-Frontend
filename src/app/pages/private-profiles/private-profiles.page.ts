import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Wink } from 'src/app/models/wink.model';
import { WinkService } from 'src/app/services/wink.service';
import { Item } from 'src/app/models/item.model';
import { ProfilesService } from 'src/app/services/profiles.service';
import { Section } from 'src/app/models/section.model';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { AlertController, NavController } from '@ionic/angular';
import { ItemType } from 'src/app/models/itemType.model';
import { SaveContactService } from 'src/app/services/save-contact.service';
import { NameCategories } from 'src/app/config/enums/nameCaterogies.enum';
import { IndexItemType } from 'src/app/config/enums/indexItemType.emun';
import { Config } from 'src/app/config/enums/config.enum';

@Component({
  selector: 'app-private-profiles',
  templateUrl: './private-profiles.page.html',
  styleUrls: ['./private-profiles.page.scss'],
})
export class PrivateProfilesPage implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    private profilesService: ProfilesService,
    public alertController: AlertController,
    private contact: SaveContactService,
    private navController: NavController,
  ) {
    this.sections = this.profilesService.sections;
    this.items.push(this.generalItems);
    this.items.push(this.personalItems);
    this.items.push(this.professionalItems);
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      async (params: Params) => {
        console.log(params);
        try {
          const wink = this.winkService.GetWinkID(params.idWink);
          if (wink) {
            this.userWink = wink.user;
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
  }

   async Confirm() {
    const alert = await this.alertController.create({
      header: 'Indicate the items you want to save in the contact.',
      inputs: [
        ...await this.LoadItemsList()
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (inputs) => {
            if (inputs.length > 0) {
              this.SaveContact(inputs);
              console.log('Confirm Ok', inputs);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async LoadItemsList() {
    const obj: any = [];
    obj.push({
      name: 'photo',
      type: 'checkbox',
      label: 'Photo',
      value: 'photo',
      checked: true
    });
    let add;
    for (const items of this.items) {
      for (const item of items) {
        add = false;
        const itemType = await this.profilesService.BuscarTipoItem(item.item.itemtype);
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
      console.log('predata', predata);
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
        console.log('data', data);
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

}
