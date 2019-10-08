import { Component, OnInit, ViewChild } from '@angular/core';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatExpansionPanel } from '@angular/material';
import {  ActionSheetController } from '@ionic/angular';
import { Categoria } from '../modelos/Categoria.model';
import { InformacionPerfilService } from '../servicios/informacion-perfil.service';
import { Seccion } from '../modelos/Seccion.model';
import { Item } from '../modelos/Item.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EnlacesService } from '../servicios/enlaces.service';

@Component({
  selector: 'app-config-perfil',
  templateUrl: './config-perfil.page.html',
  styleUrls: ['./config-perfil.page.scss'],
})
export class ConfigPerfilPage implements OnInit {

  nombre = 'John Doe';
  ordenar = true;
  valor;

  publicoArray = new FormArray([]);
  generalArray = new FormArray([]);
  personalArray = new FormArray([]);
  profesionalArray = new FormArray([]);
  grupoForm: FormGroup;
  profileForm: FormGroup;

  seleccionSeccion: number;
  seleccionCategoria: number;

  categorias: Categoria[] = [];
  secciones: Seccion[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder,
    private enlaceService: EnlacesService
    ) {
    this.categorias = this.informacionPerfilService.categorias;
    this.secciones = this.informacionPerfilService.secciones;
    this.grupoForm = this.formBuilder.group({
      publico: this.publicoArray,
      general: this.generalArray,
      personal: this.personalArray,
      profesional: this.profesionalArray,
    });
    this.profileForm = new FormGroup({
      campo: new FormControl('', Validators.required),
    });

    }

    Prueba() {
      console.log('form: ', this.profileForm);
    }

    AbrirI() {
      this.enlaceService.AbrirRedSocial(1, 'UCpdIqzXKwpNWwSup_-Ys2FA');
    }

  // drop(event: CdkDragDrop<any[]>) {
    drop(event: any) {
    // console.log('drop...', event.container.data, event.previousIndex, event.currentIndex );
    // console.log('publicoArray', this.publicoArray);
    if (event.previousContainer === event.container) {
      // console.log('Data:' , event.container.data.controls[event.previousIndex]);
      moveItemInArray(event.container.data.controls, event.previousIndex, event.currentIndex);
    } else {
      // console.log('Data cambio:' , event.previousContainer.data);
      transferArrayItem(event.previousContainer.data.controls,
                        event.container.data.controls,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  onSubmit() {
    console.log('Formulario: ', this.grupoForm);
  }

  AggItem() {
    switch (this.seleccionSeccion) {
      case 1:
        console.log(this.publicoArray);
        this.publicoArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({id: -1, id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion, valor: ''})
          )
        })
        );
        console.log(this.publicoArray);
        break;
      case 2:
        this.generalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({id: -1, id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion, valor: ''}),
            Validators.required
          )
        })
        );
        break;
      case 3:
        this.personalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({id: -1, id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion, valor: ''}),
            Validators.required
          )
        })
        );
        break;
      case 4:
        this.profesionalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({id: -1, id_categoria: this.seleccionCategoria, id_seccion: this.seleccionSeccion, valor: ''}),
            Validators.required
          )
        })
        );
    }
  }

  ngOnInit() {
  }

  Ordenar() {
    this.ordenar = !this.ordenar;
  }

  AbrirPanel(panel: MatExpansionPanel) {
    // console.log('AbrirPanel() ');
    panel.open();
  }

  EliminarElemento(elemento: any, arreglo: FormArray) {
    console.log('Eliminar item-perfil', elemento);
    arreglo.controls.splice(arreglo.controls.indexOf(elemento), 1);
   /* switch (elemento.value.item.id_seccion) {
      case 1:
        console.log('Indice', this.publicoArray.controls.indexOf(elemento));
        this.publicoArray.controls.splice(this.publicoArray.controls.indexOf(elemento), 1);
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
    }*/
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
          // console.log('Cancel clicked');
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
          // console.log('Cancel clicked');
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
          // console.log('Categoria: ', item.categoria, item.id);
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
          // console.log('Seccion: ', item.seccion, item.id);
          this.seleccionSeccion = item.id;
          this.SeleccionCategoria();
        }
      });
    }
    return obj;
  }

  get publicoForm() {
    return (this.grupoForm.get('publico') as FormArray);
  }

  get generalForm() {
    return (this.grupoForm.get('general') as FormArray);
  }

  get personalForm() {
    return (this.grupoForm.get('personal') as FormArray);
  }

  get profesionalForm() {
    return (this.grupoForm.get('profesional') as FormArray);
  }
}
