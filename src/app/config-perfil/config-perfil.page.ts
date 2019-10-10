import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { ActionSheetController } from '@ionic/angular';
import { Categoria } from '../modelos/Categoria.model';
import { InformacionPerfilService } from '../servicios/informacion-perfil.service';
import { Seccion } from '../modelos/Seccion.model';
import { Item } from '../modelos/Item.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-config-perfil',
  templateUrl: './config-perfil.page.html',
  styleUrls: ['./config-perfil.page.scss'],
})
export class ConfigPerfilPage implements OnInit {

  nombre = 'John Doe';
  ordenar = true;

  idUser = 'prueba';
  data: Item[] = [];

  publicoArray = new FormArray([]);
  generalArray = new FormArray([]);
  personalArray = new FormArray([]);
  profesionalArray = new FormArray([]);
  grupoForm: FormGroup;

  seleccionSeccion: string;
  seleccionCategoria: string;

  categorias: Categoria[] = [];
  secciones: Seccion[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder,
    ) {
    this.categorias = this.informacionPerfilService.categorias;
    this.secciones = this.informacionPerfilService.secciones;
    this.grupoForm = this.formBuilder.group({
      biografia: new FormControl( null, Validators.maxLength(250)),
      publico: this.publicoArray,
      general: this.generalArray,
      personal: this.personalArray,
      profesional: this.profesionalArray,
    });
  }

  MoverItem(event: any) {
    if (event.previousContainer === event.container) {
      const item = (event.container.data as FormArray).at(event.previousIndex);
      (event.container.data as FormArray).removeAt(event.previousIndex);
      (event.container.data as FormArray).insert(event.currentIndex, item);
    } else {
      (event.container.data as FormArray).insert(event.currentIndex,
        (event.previousContainer.data as FormArray).at(event.previousIndex));
      (event.previousContainer.data as FormArray).removeAt(event.previousIndex);
    }
  }

  onSubmit() {
    console.log('formulario:', this.grupoForm);
    let idSeccion;
    idSeccion = this.secciones.find(seccion => seccion.key === 0);
    this.grupoForm.value.publico.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = idSeccion.id;
      this.data.push(valor.item);
    });
    idSeccion = this.secciones.find(seccion => seccion.key === 1);
    this.grupoForm.value.general.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = idSeccion.id;
      this.data.push(valor.item);
    });
    idSeccion = this.secciones.find(seccion => seccion.key === 2);
    this.grupoForm.value.personal.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = idSeccion.id;
      this.data.push(valor.item);
    });
    idSeccion = this.secciones.find(seccion => seccion.key === 3);
    this.grupoForm.value.profesional.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = idSeccion.id;
      this.data.push(valor.item);
    });
    console.log('Data', this.data);
    if (this.grupoForm.valid) {

    }
  }

  AggItem() {
    switch (this.seleccionSeccion) {
      case '0':
        console.log(this.publicoArray);
        this.publicoArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              id_seccion: this.seleccionSeccion,
              valor: null,
              personalizado: null,
              posicion: null,
              id_tipoitem: null,
              id_usuario: this.idUser
            })
          )
        })
        );
        console.log(this.publicoArray);
        break;
      case '1':
        this.generalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              id_seccion: this.seleccionSeccion,
              valor: null,
              personalizado: null,
              posicion: null,
              id_tipoitem: null,
              id_usuario: this.idUser
            })
          )
        })
        );
        break;
      case '2':
        this.personalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              id_seccion: this.seleccionSeccion,
              valor: null,
              personalizado: null,
              posicion: null,
              id_tipoitem: null,
              id_usuario: this.idUser
            })
          )
        })
        );
        break;
      case '3':
        this.profesionalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              id_seccion: this.seleccionSeccion,
              valor: null,
              personalizado: null,
              posicion: null,
              id_tipoitem: null,
              id_usuario: this.idUser
            })
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
    panel.open();
  }

  CerrarPanel(panel: MatExpansionPanel) {
    panel.close();
  }

  EliminarElemento(elemento: any, arreglo: FormArray) {
    arreglo.controls.splice(arreglo.controls.indexOf(elemento), 1);
    this.grupoForm.removeControl(elemento);
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
        }
      }]
    });
    await actionSheet.present();
  }

  CargarCategorias(): [] {
    const obj: any = [];
    for (const categoria of this.categorias) {
      obj.push({
        text: categoria.categoria,
        icon: 'trash',
        handler: () => {
          this.seleccionCategoria = categoria.id;
          this.AggItem();
        }
      });
    }
    return obj;
  }

  CargarSecciones(): [] {
    const obj: any = [];
    for (const seccion of this.secciones) {
      obj.push({
        text: seccion.seccion,
        icon: 'trash',
        handler: () => {
          this.seleccionSeccion = seccion.key.toString();
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
