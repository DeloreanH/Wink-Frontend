import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../common/models/item.model';
import { ItemType } from '../../../common/models/itemType.model';
import { Config } from '../../../common/enums/config.enum';
import { IndexItemType } from '../../../common/enums/indexItemType.emun';
import { LinkService } from '../../../core/services/link.service';
import { ProfilesService } from 'src/app/core/services/profiles.service';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {

  @Input() item: Item;
  itemType: ItemType;
  preIcono = 'far';
  icon = 'smile-wink';
  chips = [];
  indexChip = IndexItemType.CHIP;
  indexBiogarfia = IndexItemType.BIOGARFIA;
  indexEmail = IndexItemType.EMAIL;
  indexURL = IndexItemType.URL;
  indexTel = IndexItemType.TELEFONO;
  socialNetwork = Config.SOCIAL_NETWORK;
  birthday = Config.BIRTHDAY;
  indexCustom = IndexItemType.PERZONALIZADO;
  indexDouble = IndexItemType.DOBLE_CAMPO;

  constructor(
    private profilesService: ProfilesService ,
    private linkService: LinkService
  ) {
   }

  async ngOnInit() {
    try {
      if (this.item) {
        if (this.item.position !== IndexItemType.BIOGARFIA) {
          this.itemType = await  this.profilesService.SearchItemType(this.item.itemtype);
        } else {
          if (this.item.section) {
            this.itemType = new ItemType({
              icon: Config.ICON_BIOGRAFIA,
              description: Config.NAME_BIOGRAFIA,
              index: IndexItemType.BIOGARFIA,
            });
          } else {
            this.itemType = new ItemType({
              icon: this.item._id,
              description: this.item.custom,
              index: IndexItemType.CAMPO,
            });
          }
        }
        this.CargarIcono();
        this.LoadChips();
        this.IsSelect();
        this.IsCustom();
      }
    } catch (err) {

    }
  }

  CargarIcono() {
    if (this.itemType) {
      const valores = this.itemType.icon.split(' ');
      this.preIcono = valores[0];
      this.icon = valores[1];
    } else {
      this.preIcono = 'far';
      this.icon = 'smile-wink';
    }
  }

  LoadChips() {
    if (this.itemType.index === IndexItemType.CHIP) {
      this.chips = this.item.value.split(',');
    }
  }

  IsSelect() {
    if (this.itemType.index === IndexItemType.SELECTOR) {
      this.itemType.options.forEach( (option) => {
        if (option._id === this.item.value) {
          this.item.value = option.name;
        }
      });
    }
  }

  OpenLink() {
    setTimeout(
      () => {
        if (this.itemType.index === this.indexEmail) {
          this.linkService.Mail(this.item.value);
        } else if (this.itemType.index === this.indexURL) {
          this.linkService.URL(this.item.value);
        } else if (this.itemType.category === this.socialNetwork) {
          this.linkService.SocialNetwork(this.itemType.name, this.item.value);
        } else if (this.itemType.index === this.indexTel) {
          this.linkService.Tel(this.item.value);
        }
      }
      , 500);
  }

  IsCustom() {
    if (this.itemType.index === this.indexCustom || this.itemType.index === this.indexDouble) {
      this.itemType.description = this.item.value;
      this.item.value = this.item.custom;
    }
  }

}
