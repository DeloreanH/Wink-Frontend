import { Component, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { ActionSheetController } from '@ionic/angular';
import { Category } from '../modelos/category.model';
import { InformacionPerfilService } from '../servicios/informacion-perfil.service';
import { Item } from '../modelos/item.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Section } from '../modelos/section.model';

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

  categorias: Category[] = [];
  secciones: Section[] = [];

  item: Item = new Item({
    category_id: null,
    section: null,
    value: null,
    custom: null,
    position: null,
    itemType_id: null,
    user_id: null,
    basic: false,
  });

  constructor(
    public actionSheetController: ActionSheetController,
    private informacionPerfilService: InformacionPerfilService,
    private formBuilder: FormBuilder,
    ) {
    this.categorias = this.informacionPerfilService.categories;
    this.secciones = this.informacionPerfilService.sections;
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
        value: this.grupoForm.value.biografia,
        position: -1,
        section: new Section({_id: '-1', name: 'Biografia', key: -1}),
        })
    );
    let seccion;
    for (let index = 0; index < 4; index++) {
      seccion = this.secciones.find(seccionx => seccionx.key === index);
      (this.grupoForm.value as any[])[index].forEach((valor: any, i: number) => {
        valor.item.position = i;
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

  AggItem(item: Item) {
    // console.log('grupoArray', this.grupoArray);
    this.grupoArray[item.section.key].push(
      new FormGroup({
      item: new FormControl(
        item
      )
    })
    );
    this.item = new Item({
      category_id: null,
      section: null,
      value: null,
      custom: null,
      position: null,
      itemType_id: null,
      user_id: null,
      basic: false,
    });
    /*this.grupoArray[this.seleccionSeccion].push(
      new FormGroup({
      item: new FormControl(
        new Item({
          category_id: this.seleccionCategoria,
          section: null,
          value: null,
          custom: null,
          position: null,
          itemType_id: null,
          user_id: this.idUser,
          basic: false,
        })
      )
    })
    );*/
  }

  ngOnInit() {
    this.CargarData();
  }

  CargarData() {
    const itemPrueba = new Item(
      {
        section: new Section({_id: '1',  name: 'Publico', key: 0}),
        value: 'anibal prueba',
        custom: null,
        position: 0,
        itemType_id: '9',
        user_id: 'Anibal',
        basic: true,
      }
    );
    this.AggItem(itemPrueba);
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
    arreglo.removeAt(index);
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
        text: categoria.name,
        icon: 'add',
        handler: () => {
          this.item.category_id = categoria._id;
          this.AggItem(this.item);
        }
      });
    }
    return obj;
  }

  CargarSecciones(): [] {
    const obj: any = [];
    for (const seccion of this.secciones) {
      obj.push({
        text: seccion.name,
        icon: 'add',
        handler: () => {
          this.item.section = seccion;
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
