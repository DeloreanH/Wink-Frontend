import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { ActionSheetController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Category } from 'src/app/modelos/category.model';
import { Item } from 'src/app/modelos/item.model';
import { Section } from 'src/app/modelos/section.model';
import { ConfiguracionPerfilService } from 'src/app/servicios/configuracion-perfil.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/modelos/user.model';
import { UserService } from 'src/app/servicios/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-config-perfil',
  templateUrl: './config-perfil.page.html',
  styleUrls: ['./config-perfil.page.scss'],
})
export class ConfigPerfilPage implements OnInit, OnDestroy {

  nombre = 'John Doe';
  avatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  ordenar = true;

  loading = true;
  data: Item[] = [];

  isDrag = false;

  publicoArray = new FormArray([]);
  generalArray = new FormArray([]);
  personalArray = new FormArray([]);
  profesionalArray = new FormArray([]);
  grupoForm: FormGroup;

  grupoArray: FormArray[] = [];

  seleccionSeccion: number;
  seleccionCategoria: string;

  categories: Category[] = [];
  sections: Section[] = [];

  changeData = false;

  item: Item;
  user: User;
  userSusbcription =  new Subscription();

  constructor(
    public actionSheetController: ActionSheetController,
    private configuracionPerfilService: ConfiguracionPerfilService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
    ) {
    this.user = this.userService.User();
    this.sections = this.configuracionPerfilService.sections;
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
    // console.log('changeData', this.changeData);
  }

  MoverItem(event: any) {
    // console.log('changeData', this.changeData);
    this.changeData = true;
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
    // console.log('form', this.grupoForm);
    // console.log('Validaciones', this.changeData, this.grupoForm.valid);
    if (this.grupoForm.valid && this.changeData) {
      this.loading = true;
      this.data = [];
      this.data.push(
        new Item({
          value: this.grupoForm.value.biografia,
          position: -1,
          section: new Section({name: 'Biografia', key: -1}),
          basic: false,
          user_id: this.user._id,
          })
      );
      let section;
      for (let index = 0; index < 4; index++) {
        section = this.sections.find(sectionx => sectionx.key === index);
        (this.grupoForm.value as any[])[index].forEach((valor: any, i: number) => {
          valor.item.position = i;
          valor.item.section = section;
          this.data.push(new Item(valor.item));
        });
      }
      this.configuracionPerfilService.GuardarItems(this.data);
      this.loading = false;
      this.changeData = false;
      console.log('Data', this.data);
    }
  }

  AggItem(item: Item, user: boolean) {
    this.grupoArray[item.section.key].push(
      new FormGroup({
      item: new FormControl(item)
    })
    );
    if (user) {
      this.changeData = true;
      this.item = new Item({
        category: null,
        section: null,
        value: null,
        custom: null,
        position: null,
        itemType: null,
        user_id: this.user._id,
        basic: false,
      });
    }
  }

  ngOnInit() {
    this.CargarData();
    this.nombre = this.user.firstName + ' ' + this.user.lastName;
    this.avatar = this.user.avatarUrl;
    this.item = new Item({
      category: null,
      section: null,
      value: null,
      custom: null,
      position: null,
      itemType_id: null,
      user_id: this.user._id,
      basic: false,
    });
    this.userSusbcription = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    // console.log('changeData', this.changeData);
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
  }

  CargarData() {
    this.configuracionPerfilService.CargarItemsUsuario().then(
      (respuesta: Item[])  => {
        // console.log('respuestaaa', respuesta);
        for (const dato of respuesta) {
          this.AggItem(dato, false);
        }
        this.grupoForm.controls.biografia.setValue(this.configuracionPerfilService.biografia.value);
        this.loading = false;
      }
    );
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
    this.changeData = true;
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
    if (this.categories.length === 0) {
      this.categories = this.configuracionPerfilService.categories;
    }
    // console.log('this.categories', this.categories);
    for (const categoria of this.categories) {
      obj.push({
        text: categoria.description,
        icon: 'add',
        handler: () => {
          this.item.category = categoria.name;
          this.AggItem(this.item, true);
        }
      });
    }
    return obj;
  }

  CargarSecciones(): [] {
    const obj: any = [];
    for (const seccion of this.sections) {
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

  FormValid() {
    // console.log('this.grupoForm.invalid', this.grupoForm.invalid);
    return this.changeData && this.grupoForm.valid;
  }

  ChangeForm() {
    this.changeData = true;
  }

  Logout() {
    this.authService.Logout();
  }

  Drag() {
    this.isDrag = true;
  }

  Drop() {
    this.isDrag = false;
  }
}
