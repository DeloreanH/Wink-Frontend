import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { ActionSheetController, MenuController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Category } from '../../common/models/category.model';
import { Item } from '../../common/models/item.model';
import { Section } from '../../common/models/section.model';
import { ProfilesService } from '../../core/services/profiles.service';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../common/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { RoutesPrincipal } from 'src/app/common/enums/routes/routesPrincipal.enum';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit, OnDestroy {

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
  eventRouter = new Subscription();

  constructor(
    public actionSheetController: ActionSheetController,
    private profilesServices: ProfilesService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private menu: MenuController,
    private navController: NavController,
    ) {
    this.user = this.userService.User();
    this.sections = this.profilesServices.sections;
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
      this.profilesServices.SaveItems(this.data);
      this.loading = false;
      this.changeData = false;
    }
  }

  AddItem(item: Item, user: boolean) {
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
    this.LoadData();
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
    this.eventRouter = this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
          if (valor.url.split('/')[2] === RoutesAPP.CONFIGURAR_PERFIL) {
            this.CloseMenu();
          }
        }
        if (valor instanceof NavigationEnd) {
          if (valor.url.split('/')[2] === RoutesAPP.CONFIGURAR_PERFIL) {
            this.CloseMenu();
          }
        }
      }
    );
    /*this.grupoForm.valueChanges.subscribe(
      () => {
        this.changeData = true;
      }
    );*/
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
    this.eventRouter .unsubscribe();
  }

  async LoadData() {
    try {
      const response = await this.profilesServices.LoadItemsUser();
      for (const dato of response) {
        this.AddItem(dato, false);
      }
      const valor = this.profilesServices.biography;
      if (valor) {
        this.grupoForm.controls.biografia.setValue(valor.value);
      }
    } catch (err) {
      console.log('Error LoadData', err.message);
    }
    this.loading = false;
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
      this.categories = this.profilesServices.categories;
    }
    for (const categoria of this.categories) {
      obj.push({
        text: categoria.description,
        icon: 'add',
        handler: () => {
          this.item.category = categoria.name;
          this.AddItem(this.item, true);
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
    return this.changeData && this.grupoForm.valid;
  }

  Logout() {
    this.authService.Logout();
    if (this.menu.isOpen) {
      this.menu.close();
    }
  }

  Drag() {
    this.isDrag = true;
  }

  Drop() {
    this.isDrag = false;
  }

  async GoBasicData() {
    try {
      const response = await this.navController.navigateForward(
                        ['/' + RoutesPrincipal.DATOS_BASICOS]
                      );
      this.CloseMenu();
    } catch (err) {
      console.log('Error Go', err);
    }
  }

  CloseMenu() {
    if (this.menu.isOpen) {
      this.menu.close();
    }
  }

  ChangeData() {
    this.changeData = true;
  }
}
