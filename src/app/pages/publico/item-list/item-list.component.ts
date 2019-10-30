import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/modelos/item.model';
import { ItemType } from 'src/app/modelos/itemType.model';
import { ConfiguracionPerfilService } from 'src/app/servicios/configuracion-perfil.service';
import { Config } from 'src/app/config/config.enum';

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

  constructor(
    private cpService: ConfiguracionPerfilService
  ) {
   }

  async ngOnInit() {
    try {
      if (this.item) {
        if (this.item.position !== -1) {
          this.itemType = await  this.cpService.BuscarTipoItem(this.item.itemtype);
        } else {
          if (this.item.section) {
            this.itemType = new ItemType({
              icon: Config.ICON_BIOGRAFIA,
              description: Config.NAME_BIOGRAFIA,
            });
          }
        }
        this.CargarIcono();
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

}
