import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { ActionSheetController } from '@ionic/angular';
import { Categoria } from '../modelos/Categoria.model';
import { InformacionPerfilService } from '../servicios/informacion-perfil.service';
import { Seccion } from '../modelos/Seccion.model';
import { Item } from '../modelos/Item.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

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

  grupoArray: FormArray[] = [];

  seleccionSeccion: number;
  seleccionCategoria: string;

  categorias: Categoria[] = [];
  secciones: Seccion[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: {name: string}[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  constructor(
    public actionSheetController: ActionSheetController,
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder,
    ) {
    this.categorias = this.informacionPerfilService.categorias;
    this.secciones = this.informacionPerfilService.secciones;
    this.grupoArray.push(this.publicoArray);
    this.grupoArray.push(this.generalArray);
    this.grupoArray.push(this.personalArray);
    this.grupoArray.push(this.profesionalArray);
    this.grupoForm = this.formBuilder.group({
      biografia: new FormControl( null, Validators.maxLength(250)),
      0: this.publicoArray,
      1: this.generalArray,
      2: this.personalArray,
      3: this.profesionalArray,
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
    console.log('form', this.grupoForm);
    this.data = [];
    this.data.push(
      new Item({
        valor: this.grupoForm.value.biografia,
        posicion: -1,
        seccion: new Seccion({id: '-1', seccion: 'Biografia', key: -1}),
        })
    );
    let seccion;
    for (let index = 0; index < 4; index++) {
      seccion = this.secciones.find(seccionx => seccionx.key === index);
      (this.grupoForm.value as any[])[index].forEach((valor: any, i: number) => {
        valor.item.posicion = i;
        valor.item.seccion = seccion;
        this.data.push(valor.item);
      });
    }
    /*
    seccion = this.secciones.find(seccionx => seccionx.key === 1);
    this.grupoForm.value.general.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = seccion;
      this.data.push(valor.item);
    });
    seccion = this.secciones.find(seccionx => seccionx.key === 2);
    this.grupoForm.value.personal.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = seccion;
      this.data.push(valor.item);
    });
    seccion = this.secciones.find(seccionx => seccionx.key === 3);
    this.grupoForm.value.profesional.forEach((valor: any, index: any) => {
      valor.item.posicion = index;
      valor.item.id_seccion = seccion;
      this.data.push(valor.item);
    });*/
    console.log('Data', this.data);
    if (this.grupoForm.valid) {

    }
  }

  AggItem() {
    console.log('grupoArray', this.grupoArray);
    this.grupoArray[this.seleccionSeccion].push(
      new FormGroup({
      item: new FormControl(
        new Item({
          id_categoria: this.seleccionCategoria,
          seccion: null,
          valor: null,
          personalizado: null,
          posicion: null,
          id_tipoitem: null,
          id_usuario: this.idUser,
          basico: false,
        })
      )
    })
    );
    /*
    switch (this.seleccionSeccion) {
      case 0:
        console.log(this.publicoArray);
        this.publicoArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              seccion: null,
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
      case 1:
        this.generalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              seccion: null,
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
      case 2:
        this.personalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              seccion: null,
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
      case 3:
        this.profesionalArray.push(
          new FormGroup({
          item: new FormControl(
            new Item({
              id_categoria: this.seleccionCategoria,
              seccion: null,
              valor: null,
              personalizado: null,
              posicion: null,
              id_tipoitem: null,
              id_usuario: this.idUser
            })
          )
        })
        );
    }*/
  }

  ngOnInit() {
    // console.log('grupoArray', this.grupoArray);
    // console.log('Busqueda', this.grupoArray.find((valor, index) => index === 0));
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

  EliminarElemento(arreglo: FormArray, index: number) {
    // arreglo.removeAt(arreglo.controls.indexOf(elemento));
    // console.log('arreglo', arreglo.controls);
    arreglo.removeAt(index);
    // this.grupoForm.removeControl(elemento);
    // arreglo.controls.splice(arreglo.controls.indexOf(elemento), 1);
    // console.log('arreglo2', arreglo.controls);
    // console.log('this.grupoForm1', this.grupoForm.controls);
    // this.grupoForm.removeControl(elemento);
    // console.log('this.grupoForm2', this.grupoForm.controls);
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
          this.seleccionSeccion = seccion.key;
          this.SeleccionCategoria();
        }
      });
    }
    return obj;
  }

  get publicoForm() {
    return (this.grupoForm.get('0') as FormArray);
  }

  get generalForm() {
    return (this.grupoForm.get('1') as FormArray);
  }

  get personalForm() {
    return (this.grupoForm.get('2') as FormArray);
  }

  get profesionalForm() {
    return (this.grupoForm.get('3') as FormArray);
  }
}
