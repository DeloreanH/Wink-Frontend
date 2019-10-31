import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/modelos/item.model';
import { ItemType } from 'src/app/modelos/itemType.model';
import { ConfiguracionPerfilService } from 'src/app/servicios/configuracion-perfil.service';
import { Config } from 'src/app/config/config.enum';
import { IndexItemType } from 'src/app/config/indexItemType.emun';
import { LinkService } from 'src/app/servicios/link.service';

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

  constructor(
    private cpService: ConfiguracionPerfilService,
    private linkService: LinkService
  ) {
   }

  async ngOnInit() {
    try {
      if (this.item) {
        if (this.item.position !== IndexItemType.BIOGARFIA) {
          this.itemType = await  this.cpService.BuscarTipoItem(this.item.itemtype);
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
    if (this.itemType.index === this.indexEmail) {
      this.linkService.OpenMail(this.item.value);
    } else if (this.itemType.index === this.indexURL) {
      this.linkService.OpenURL(this.item.value);
    }
  }

}
