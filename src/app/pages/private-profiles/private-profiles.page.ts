import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Wink } from 'src/app/models/wink.model';
import { WinkService } from 'src/app/services/wink.service';
import { Item } from 'src/app/models/item.model';
import { ProfilesService } from 'src/app/services/profiles.service';
import { Section } from 'src/app/models/section.model';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { AlertController } from '@ionic/angular';
import { ItemType } from 'src/app/models/itemType.model';
import { SaveContactService } from 'src/app/services/save-contact.service';

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
  items: any[] = [
    this.generalItems,
    this.personalItems,
    this.professionalItems
  ];
  sections: Section[] = [];
  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    private profilesService: ProfilesService,
    public alertController: AlertController,
    private contact: SaveContactService
  ) {
    this.sections = this.profilesService.sections;
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
    this.generalItems = [];
    this.personalItems = [];
    this.professionalItems = [];
    if (this.generalItems.length === 0  && this.personalItems.length === 0  && this.professionalItems.length === 0) {
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
    for (const items of this.items) {
      for (const item of items) {
        const itemType = await this.profilesService.BuscarTipoItem(item.item.itemtype);
        item.itemType = itemType;
        obj.push({
          name: item.item._id,
          type: 'checkbox',
          label: itemType.name,
          value: item.item._id,
          checked: true
        });
      }
    }
    return obj;
  }

  private SaveContact(ids: string[]) {
    const predata: {item: Item, itemType: ItemType}[] = [];
    let complet = false;
    for (const arrays of this.items) {
      predata.push(...arrays);
    }
    console.log('arrays', this.items);
    const data: {item: Item, itemType: ItemType}[] = [];
    let item;
    if (ids[0] === 'photo') {
    }
    console.log('predata', predata, predata.length);
    ids.forEach(
      (id, index) => {
        item = predata.find(value => value.item._id === id);
        console.log('item index', item, index, id);
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
      this.contact.Create(data, this.userWink);
    }
  }

}
