import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import { MatExpansionPanel } from '@angular/material';
import {  ActionSheetController } from '@ionic/angular';
import { Categoria } from '../modelos/Categoria.model';
import { TipoItem } from '../modelos/TipoItem.model';
import { InformacionPerfilService } from '../servicios/informacion-perfil.service';
import { Seccion } from '../modelos/Seccion.model';
import { Item } from '../modelos/Item.model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-config-perfil',
  templateUrl: './config-perfil.page.html',
  styleUrls: ['./config-perfil.page.scss'],
})
export class ConfigPerfilPage implements OnInit {
  arrastre = false;
  nombre = 'John Doe';
  panelOpenState = null;
  step;
  ordenar = true;

  grupoForm: FormGroup;
  items: FormArray;

  publico: Item[] = [];
  general: Item[] = [];
  personal: Item[] = [];
  profesional: Item[] = [];
  seleccionSeccion: number;
  seleccionCategoria: number;

  categorias: Categoria[] = [];
  tiposItems: TipoItem[] = [];
  secciones: Seccion[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder
    ) {
      this.categorias = this.informacionPerfilService.categorias;
      this.tiposItems = this.informacionPerfilService.tiposItems;
      this.secciones = this.informacionPerfilService.secciones;
      this.grupoForm = this.formBuilder.group({
        items: this.formBuilder.array([ ])
      });
     }

  drop(event: CdkDragDrop<string[]>) {
    console.log('drop...', event);
    console.log(this.publico);
    if (event.previousContainer === event.container) {
      console.log('Data:' , event.container.data[event.previousIndex]);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  CambiarPosicion() {

  }

  AggItem() {
    switch (this.seleccionSeccion) {
      case 1:
        this.publico.push(new Item({id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion}));
        break;
      case 2:
        this.general.push(new Item({id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion}));
        break;
      case 3:
        this.personal.push(new Item({id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion}));
        break;
      case 4:
        this.profesional.push(new Item({id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion}));
        break;
    }
  }

  allowDrop(e) {
    console.log('allwDrop...', e);
  }

  drag(e) {
    console.log('drap..', e);
  }

  ngOnInit() {
  }

  Ordenar() {
    this.ordenar = !this.ordenar;
  }

  toggleReorder(reorderGroup) {
    // const reorderGroup = document.getElementById('reorder');
    reorderGroup.disabled = !reorderGroup.disabled;
    reorderGroup.addEventListener('ionItemReorder', ({detail}) => {
      detail.complete(true);
    });
  }

  doReorder(ev: any) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  Arrastrar() {
    console.log('arrastrar');
    this.arrastre = true;
  }

  Parar() {
    console.log('parar');
    this.arrastre = false;
  }

  AbrirPanel(panel: MatExpansionPanel) {
    console.log('AbrirPanel() ');
    panel.open();
    if (this.arrastre) {
      panel.open();
    }
  }

  Previo(panelOrigen: MatExpansionPanel, panelDestino: MatExpansionPanel) {
    panelDestino.open();
    panelOrigen.close();
  }

  Siguiente(panelOrigen: MatExpansionPanel, panelDestino: MatExpansionPanel) {
    panelDestino.open();
    panelOrigen.close();
  }

  EliminarElemento(elemento: Item) {
    console.log('Eliminar item-perfil', elemento);
    switch (elemento.id_seccion) {
      case 1:
        this.publico.splice(this.publico.indexOf(elemento), 1);
        break;
      case 2:
        // this.general.splice(elemento, 1);
        break;
      case 3:
        // this.personal.splice(elemento, 1);
        break;
      case 4:
        // this.profesional.splice(elemento, 1);
        break;
    }
  }

  async SeleccionSeccion() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione una sección',
      buttons: [
        ...this.CargarSecciones(),
        {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async SeleccionCategoria() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione una categoria',
      buttons: [
        ...this.CargarCategorias()
        , {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  CargarCategorias(): [] {
    const obj: any = [];
    for (const item of this.categorias) {
      obj.push({
        text: item.categoria,
        icon: 'trash',
        handler: () => {
          console.log('Categoria: ', item.categoria, item.id);
          this.seleccionCategoria = item.id;
          this.AggItem();
        }
      });
    }
    return obj;
  }

  CargarSecciones(): [] {
    const obj: any = [];
    for (const item of this.secciones) {
      obj.push({
        text: item.seccion,
        icon: 'trash',
        handler: () => {
          console.log('Seccion: ', item.seccion, item.id);
          this.seleccionSeccion = item.id;
          this.SeleccionCategoria();
        }
      });
    }
    return obj;
  }
}
