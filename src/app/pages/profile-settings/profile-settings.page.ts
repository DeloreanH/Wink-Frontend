import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActionSheetController, MenuController, NavController, Platform } from '@ionic/angular';
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
import {TranslateService} from '@ngx-translate/core';
import { TourService } from 'ngx-tour-ngx-popper';
import { PagesName } from 'src/app/common/enums/pagesName.enum';
import { ToursService } from 'src/app/core/services/tours.service';
import { Config } from 'src/app/common/enums/config.enum';
import { AlertService } from 'src/app/common/alert/alert.service';
import { UpdateAvatarService } from 'src/app/core/services/update-avatar.service';
import { NoWhiteSpace } from 'src/app/common/validators/noWhitespace.validator';
import { MessageErrorForms } from 'src/app/common/enums/messageError.enum';
import { Photo } from 'src/app/common/class/photo.class';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('pp') publicPanel: MatExpansionPanel;
  @ViewChild('pg') generalPanel: MatExpansionPanel;
  @ViewChild('pper') personalPanel: MatExpansionPanel;
  @ViewChild('ppro') professionalPanel: MatExpansionPanel;
  panels: MatExpansionPanel[] = [];
  avatar: string = Config.AVATAR;
  order = true;

  loading = true;
  data: Item[] = [];

  isDrag = false;

  publicArray = new FormArray([]);
  generalArray = new FormArray([]);
  personalArray = new FormArray([]);
  professionalArray = new FormArray([]);
  grupoForm: FormGroup;

  groupArray: FormArray[] = [];

  selecSection: number;
  selectCategory: string;

  categories: Category[] = [];
  sections: Section[] = [];

  changeData = false;

  loadingAvatar = false;

  item: Item;
  user: User;
  userSubs = new Subscription();
  eventRouter = new Subscription();

  stepShowSubs = new Subscription();
  tourSubs = new Subscription();
  tour = true;
  itemTour: boolean;
  backButtonSubs = new Subscription();
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  noWhiteSpace =  new NoWhiteSpace();

  photo = new Photo();

  constructor(
    public actionSheetController: ActionSheetController,
    private profilesServices: ProfilesService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private menuController: MenuController,
    private navController: NavController,
    private translateService: TranslateService,
    public tourService: TourService,
    private toursService: ToursService,
    private alertService: AlertService,
    private platform: Platform,
    private avatarService: UpdateAvatarService,
    public loaderService: LoaderService,
    private toastService: ToastService,
    ) {
    this.user = this.userService.User();
    this.sections = this.profilesServices.sections;
    this.groupArray.push(this.publicArray);
    this.groupArray.push(this.generalArray);
    this.groupArray.push(this.personalArray);
    this.groupArray.push(this.professionalArray);
    this.grupoForm = this.formBuilder.group({
      biografia: new FormControl( null, [Validators.minLength(2), Validators.maxLength(50), this.noWhiteSpace.Validator]),
      0: this.publicArray,
      1: this.generalArray,
      2: this.personalArray,
      3: this.professionalArray,
    });
    this.ValidateTour();
  }

  MoveItem(event: any) {
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
          section: new Section({name: 'biografia', key: -1}),
          basic: false,
          itemtype: 'biografia',
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
    this.groupArray[item.section.key].push(
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
        itemtype: null,
        user_id: this.user._id,
        basic: false,
      });
    }
  }

  ngOnInit() {
    this.userSubs = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.eventRouter = this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationStart) {
            this.CloseMenu();
        }
        if (valor instanceof NavigationEnd) {
            this.CloseMenu();
        }
      }
    );
  }

  private managePanel() {
    this.panels = [
      this.publicPanel,
      this.generalPanel,
      this.personalPanel,
      this.professionalPanel
    ];
  }

  ngAfterViewInit(): void {
  }

  ValidateTour() {
    if (this.toursService.ValidateTour(PagesName.SETTINGS)) {
      this.loading = false;
      this.tourService.initialize(this.toursService.tourSettings);
      // this.tourService.initialize([{
      //   placement: 'top-start'
      // }]);
      this.tourService.start();
      this.stepShowSubs = this.tourService.stepShow$.subscribe(
        (step) => {
          if (step.anchorId === 'item') {
            if (!this.itemTour) {
              this.itemTour = true;
              // this.groupArray.forEach(
              //   (group) => {
              //     group.clear();
              //   }
              // );
              if (!this.groupArray[0].length) {
                this.AddItem(this.toursService.itemTourOne, false);
              }
              this.publicPanel.open();
            }
          } else if (step.anchorId !== 'item_icon') {
            this.itemTour = false;
            this.publicPanel.close();
            // this.groupArray.forEach(
            //   (group) => {
            //     group.clear();
            //   }
            // );
          } else if (step.anchorId === 'item_icon') {
            this.publicPanel.open();
          }
        }
      );
      this.tourSubs = this.tourService.end$.subscribe(
        () => {
          this.tour = false;
          this.publicPanel.close();
          this.groupArray.forEach(
            (group) => {
              group.clear();
            }
          );
          this.toursService.EndTour(PagesName.SETTINGS);
          this.tourSubs.unsubscribe();
          this.stepShowSubs.unsubscribe();
          this.LoadData();
        }
      );
    } else {
      this.tour = false;
      this.LoadData();
    }
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.eventRouter .unsubscribe();
    this.tourSubs.unsubscribe();
    this.stepShowSubs.unsubscribe();
    this.backButtonSubs.unsubscribe();
  }

  async LoadData() {
    try {
      this.item = new Item({
        category: null,
        section: null,
        value: null,
        custom: null,
        position: null,
        itemtype_id: null,
        user_id: this.user._id,
        basic: false,
      });
      const response = await this.profilesServices.LoadItemsUser();
      if (response) {
        this.AddItemsData();
      }
      // for (const dato of response) {
      //   this.AddItem(dato, false);
      // }
      // const valor = this.profilesServices.biography;
      // if (valor) {
      //   this.grupoForm.controls.biografia.setValue(valor.value);
      // }
    } catch (err) {
      this.loading = false;
      console.log('Error LoadData', err.message);
    }
  }

  AddItemsData() {
    const data: Item[] = JSON.parse(JSON.stringify(this.profilesServices.ItemsUser));
    if (data) {
      data.forEach(
        (item: Item, index) => {
          this.AddItem(item, false);
          if (index === (data.length - 1) ) {
            this.loading = false;
          }
        }
      );
      const valor = this.profilesServices.biography;
      if (valor) {
        this.grupoForm.controls.biografia.setValue(valor.value);
      } else {
        this.grupoForm.controls.biografia.setValue('');
      }
    }
  }

  Order() {
    this.order = !this.order;
  }

  OpenPanel(panel: MatExpansionPanel) {
    panel.open();
  }

  ClosePanel(panel: MatExpansionPanel) {
    panel.close();
  }

  DeleteItem(arreglo: FormArray, index: number) {
    if (!this.tour) {
      this.changeData = true;
      arreglo.removeAt(index);
    }
  }

  async SelectSection() {
    this.managePanel();
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('WINK.PROFILE_SETTINGS.OPTIONS.SECTION'),
      buttons: [
        ...this.LoadSection(),
        {
        text: this.translateService.instant('WINK.BUTTONS.CANCEL'),
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  async SelectCategory() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('WINK.PROFILE_SETTINGS.OPTIONS.CATEGORY'),
      buttons: [
        ...this.LoadCategories()
        , {
        text: this.translateService.instant('WINK.BUTTONS.CANCEL'),
        role: 'cancel',
        cssClass: 'contrast-pego',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  private LoadCategories(): [] {
    const obj: any = [];
    if (this.categories.length === 0) {
      this.categories = this.profilesServices.categories;
    }
    for (const categoria of this.categories) {
      if (categoria.name !== 'biografia') {
        obj.push({
          text: this.translateService.instant(categoria.description),
          handler: () => {
            this.item.category = categoria.name;
            this.manageOpenPanel(Object.assign({}, this.item ));
            this.AddItem(this.item, true);
          }
        });
      }
    }
    return obj;
  }

  private LoadSection() {
    const obj: any = [];
    for (const seccion of this.sections) {
      obj.push({
        text: this.translateService.instant(seccion.name),
        handler: () => {
          this.item.section = seccion;
          this.SelectCategory();
        }
      });
    }
    return obj;
  }


  private manageOpenPanel(item: Item) {
    if (!item) {
      return;
    }
    this.sections.forEach(
      (section) => {
        this.panels[section.key].close();
      }
    );
    this.panels[item.section.key].open();
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
    if (!this.tour) {
      this.alertService.showConfirm({
        title: 'WINK.AUTH.LOGOUT.TITLE',
        description: 'WINK.AUTH.LOGOUT.MESSAGE',
      }).subscribe(
        async (resp: any) => {
          if (resp && resp.value) {
            this.loaderService.Show();
            this.authService.Logout().then(
              async () => {
                if (await this.menuController.isOpen('menuSettings')) {
                  this.menuController.close('menuSettings');
                }
              }
            )
            .catch(() => this.toastService.error('SOMETHING'))
            .finally(
              () => setTimeout(() => {
                this.loaderService.Close();
              }, 500)
            );
          }
        }
      );
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
      if (!this.tour) {
        await this.navController.navigateForward(
          ['/' + RoutesPrincipal.DATOS_BASICOS]
        );
        this.CloseMenu();
      }
    } catch (err) {
      console.log('Error Go', err);
    }
  }

  async CloseMenu() {
    if (await this.menuController.isOpen('menuSettings')) {
      this.menuController.close('menuSettings');
    }
  }

  ChangeData() {
    if (!this.tour) {
      this.changeData = true;
    }
  }

  ErrorImagen() {
    this.user.avatarUrl = this.avatar;
  }

  Avatar() {
    return this.photo.URLAvatar(this.user);
  }

  ionViewWillEnter() {
    this.CloseMenu();
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          async () => {
            if (await this.menuController.isOpen('menuSettings')) {
              this.menuController.close('menuSettings');
            } else {
              if (!this.tour /*&& !this.loaderService.Status*/) {
                await this.navController.navigateBack(
                  [ this.urlHome]
                );
              }
            }
          }
        );
      }
    );
    // alert('3 - Acabamos de entrar en la página.');
  }

  ionViewDidEnter() {
    this.CloseMenu();
    // alert('4 - Página completamente cargada y activa.');
  }

  ionViewWillLeave() {
    // alert('6 - ¿Estás seguro que quieres dejar la página?.');
  }

  ionViewDidLeave() {
    // alert('7 - La página Home2 ha dejado de estar activa.');
    this.backButtonSubs.unsubscribe();
    this.CloseMenu();
  }

  async SelectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('WINK.PROFILE_SETTINGS.SELECT_AVATAR'),
      buttons: [{
        text: this.translateService.instant('WINK.BUTTONS.CAMERA'),
        icon: 'camera',
        handler:  async () => {
          this.RequestImage(true);
        }
      }, {
        text: this.translateService.instant('WINK.BUTTONS.GALLERY'),
        icon: 'image',
        handler:   () => {
          this.RequestImage(false);
        }
      }, {
        text: this.translateService.instant('WINK.BUTTONS.CANCEL'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  private async RequestImage(camera: boolean) {
    try {
      this.loadingAvatar = true;
      const respuesta: any = await this.avatarService.OpenUpdate(camera);
      this.userService.UpdateAvatar(respuesta.link);
    } catch (err) {
      console.log('Error RequestImage', err);
    }
    this.loadingAvatar = false;
  }

  Cancel() {
    let ready = false;
    this.loading = true;
    this.groupArray.forEach(
      (arrayData: FormArray, index) => {
        arrayData.clear();
        if (index === (this.groupArray.length - 1)) {
          ready = true;
        }
      }
    );
    if (ready) {
      this.AddItemsData();
      this.changeData = false;
    }
  }

  MessageError(input: string) {
    if (this.grupoForm.controls[input].errors && this.grupoForm.controls[input].touched) {
      const obj = this.grupoForm.controls[input].errors;
      let prop;
      Object.keys(obj).forEach(
        (key) => {
          prop = key;
        }
      );
      if (prop) {
        switch (prop) {
          case 'required':
            return MessageErrorForms.REQUIRED;
          case 'email':
            return MessageErrorForms.EMAIL;
          case 'minlength':
            return MessageErrorForms.MINIMUM;
          case 'maxlength':
            return MessageErrorForms.MAXIMUM;
          case 'pattern':
            return MessageErrorForms.CHARACTER;
          case 'whitespace':
            return MessageErrorForms.WHITE_SPACE;
        }
      }
    }
  }

  async GoHome() {
    if (!this.tour) {
      await this.navController.navigateBack(
        [ this.urlHome]
      );
    }
  }

  Swipe(event) {
    // switch (event.offsetDirection) {
    //   case 2:
    //     this.GoHome();
    //     break;
    //   case 4:
    //     break;
    //   default:
    //     break;
    // }
  }

}
