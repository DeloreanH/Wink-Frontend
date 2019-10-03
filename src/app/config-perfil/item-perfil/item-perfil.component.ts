import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { InformacionPerfilService } from 'src/app/servicios/informacion-perfil.service';
import { Categoria } from 'src/app/modelos/Categoria.model';
import { TipoItem } from 'src/app/modelos/TipoItem.model';
import { ValorTI } from 'src/app/modelos/ValorTI.model';
import { Item } from 'src/app/modelos/Item.model';
import { IonSelect } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-perfil',
  templateUrl: './item-perfil.component.html',
  styleUrls: ['./item-perfil.component.scss'],
})
export class ItemPerfilComponent implements OnInit {

  @Input() ordenando;
  @Input() categoria;
  @Input() seccion;
  @Input() tipo;
  @Input() posicion;
  @Input() public item: Item;
  valor: string;
  valor2: string;
  selecionado = false;
  @Output() eliminar = new EventEmitter();
  eventoCambio = new Subscription();

  categorias: Categoria[] = [];
  tiposItems: TipoItem[] = [];
  valoresTI: ValorTI[] = [];
  tipoItem: TipoItem;
  @Input() personalizado: string;


  constructor(
    private informacionPerfilService: InformacionPerfilService
  ) {
    // this.categorias = this.informacionPerfilService.categorias;
    // this.tiposItems = this.informacionPerfilService.tiposItems;
    // this.BuscarTItem();

   }

  ngOnInit() {
    this.BuscarTItem();
    this.item.posicion = this.posicion;
  }

  BuscarTItem() {
    if (this.item) {
      this.tiposItems = this.informacionPerfilService.BuscarTItemCategoria(this.item.id_categoria);
      console.log('tiposItems', this.tiposItems);
    }
  }

  BuscarValoresTI() {
    this.AlmacenarValores();
    this.selecionado = true;
    console.log(this.tipoItem);
    if (this.tipoItem && this.tipoItem.tipo === 1) {
      this.valoresTI = this.informacionPerfilService.BuscarValoresTipoItem(this.tipoItem.id);
    }
  }

  Eliminar() {
    this.eliminar.emit(this.item);
  }

  FechaActual() {
    return new Date();
  }

  MarcaAgua(campo: number) {
    switch (campo) {
      case 0:
        return this.tipoItem.tipo !== 2 ? this.tipoItem.descripcion : 'Puesto';
      case 1:
        return this.tipoItem.tipo !== 2 ? this.tipoItem.descripcion : 'Empresa';
    }
  }

  MostrarSelector() {
    this.selecionado = false;
  }

  AlmacenarValores() {
    if (this.tipoItem) {
      this.item.id_tipoitem = this.tipoItem.id;
      if (this.tipoItem.tipo === 2) {
        this.item.valor = this.valor + '-' + this.valor2;
      } else {
        this.item.valor = this.valor;
      }
    }
  }

}
