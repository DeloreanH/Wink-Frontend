import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../common/models/user.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { ActionSheetController, MenuController, NavController, Platform } from '@ionic/angular';
import { UpdateAvatarService } from '../../core/services/update-avatar.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { MessageErrorForms } from 'src/app/common/enums/messageError.enum';
import { AlertService } from 'src/app/common/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Phone } from 'src/app/common/models/phone.model';
import { NoWhiteSpace } from 'src/app/common/validators/noWhitespace.validator';
import { Photo } from 'src/app/common/class/photo.class';
import { LanguageService } from 'src/app/core/services/language.service';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'basic-data',
  templateUrl: './basic-data.page.html',
  styleUrls: ['./basic-data.page.scss'],
})
export class BasicDataPage implements OnInit, OnDestroy, AfterViewInit {

  avatar: string = Config.AVATAR;
  user: User;
  userSusbcription = new Subscription();
  form: FormGroup;
  loading = false;
  loadingAvatar = false;
  uploadAvatar = false;
  edit = false;
  genders: { value: string, description: string}[] = [];
  languages: { value: string, description: string}[] = [];
  backButtonSubs = new Subscription();
  noWhiteSpace =  new NoWhiteSpace();
  photo =  new Photo();
  currentLanguage: string;
  changeLanguage = false;

  constructor(
    public actionSheetController: ActionSheetController,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private avatarService: UpdateAvatarService,
    private navController: NavController,
    private alertService: AlertService,
    private platform: Platform,
    private translateService: TranslateService,
    private languageService: LanguageService,
    public loaderService: LoaderService,
  ) {
    this.user = this.userService.User();
    this.LoadForm();
    this.genders = this.userService.genders;
    this.languages = this.languageService.languages;
    this.currentLanguage = this.languageService.language;
   }

  ngOnInit() {
    this.Subscriptions();
    this.RemoveWhiteSpace();
  }

  ngAfterViewInit(): void {
    this.DisabledEmail();
    this.DisabledPhone();
  }

  private LoadForm() {
    this.form = this.formBuilder.group({
      firstName: new FormControl( this.user.firstName,  [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.noWhiteSpace.Validator
      ]),
      lastName: new FormControl( this.user.lastName,  [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        this.noWhiteSpace.Validator
      ]),
      email: new FormControl(
        this.user.email
        , [
          Validators.required,
          Validators.email,
          Validators.minLength(2),
          Validators.maxLength(30),
          this.noWhiteSpace.Validator
        ]),
      phoneCode: new FormControl(
          this.user.phone ? this.user.phone.phoneCode : null,  [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          this.noWhiteSpace.Validator
        ]),
      phoneNumber: new FormControl(
        this.user.phone ? this.user.phone.phoneNumber : null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
          this.noWhiteSpace.Validator
        ]),
      birthday: new FormControl( this.user.birthday, [Validators.required]),
      gender: new FormControl( this.user.gender, [Validators.required]),
      autosave: new FormControl( this.user.autosave  ? this.user.autosave : true),
      phone: new FormControl(new Phone({})),
      // username: new FormControl({
      //     value: this.user.username ?  this.user.username : null,
      //     disabled: this.DisabledUsername(),
      //   }, [
      //     Validators.required,
      //     Validators.minLength(8),
      //     Validators.maxLength(16),
      //     Validators.pattern(/^[a-zA-Z0-9_s]+$/)
      //   ]),
    });
  }

  private Subscriptions() {
    this.userSusbcription = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.form.valueChanges.subscribe(
      () => {
        this.edit = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
    this.backButtonSubs.unsubscribe();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      try {
        if (this.changeLanguage) {
          this.currentLanguage = this.languageService.language;
          this.changeLanguage = false;
          if (!this.edit) {
            await this.navController.navigateRoot(
              '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME
            );
          }
        }
        if (this.edit) {
          await this.RemoveWhiteSpace();
          if (this.form.get('phoneCode').disabled) {
            this.form.removeControl('phone');
          } else {
            this.form.value.phone.phoneCode = this.form.value.phoneCode;
            this.form.value.phone.phoneNumber = this.form.value.phoneNumber;
          }
          if (this.form.value.phone || this.form.get('phoneCode').disabled) {
            const response = await this.userService.UpdateDate(this.form.value);
            if (response.status === 'user updated successfully' /*&& !response.user.emptyProfile*/) {
              this.edit = false;
              await this.navController.navigateRoot(
                '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME
              );
            }
          }
        }
      } catch (err) {
        console.log('Error submit', err);
      }
      this.loading = false;
    }
  }

  FechaActual() {
    return new Date();
  }

  Logout() {
    this.alertService.showConfirm({
      title: 'WINK.AUTH.LOGOUT.TITLE',
      description: 'WINK.AUTH.LOGOUT.MESSAGE',
    }).subscribe(
      (resp: any) => {
        if (resp && resp.value) {
          this.authService.Logout();
        }
      }
    );
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
      this.uploadAvatar = true;
    } catch (err) {
      console.log('Error SolicitudImage', err);
    }
    this.loadingAvatar = false;
  }

  FormValid() {
    if (this.user) {
      if (this.user.emptyProfile) {
        return (this.form.valid && this.uploadAvatar) ? false : true;
      } else {
        return (this.form.valid && this.edit || this.form.valid && this.changeLanguage) ? false : true;
      }
    } else {
      return true;
    }
  }

  Back() {
    setTimeout(
      async () => {
        await this.navController.navigateBack(
          '/' + RoutesAPP.BASE + '/' + RoutesAPP.CONFIGURAR_PERFIL
        );
      }
      , 500);
  }


  private DisabledEmail() {
    if (this.user.emptyProfile && this.user.email !== '' || !this.user.emptyProfile) {
      this.form.get('email').disable({onlySelf: true});
    }
  }

  private DisabledUsername() {
    if (this.user.emptyProfile && this.user.username !== '' || !this.user.emptyProfile) {
      this.form.get('username').disable();
    }
  }

  private DisabledPhone() {
    if (this.user.emptyProfile && this.user.phone && this.user.phone.phoneCode && this.user.phone.phoneNumber || !this.user.emptyProfile) {
      this.form.get('phoneCode').disable({onlySelf: true});
      this.form.get('phoneNumber').disable({onlySelf: true});
    }
  }

  Avatar() {
    return this.photo.URLAvatar(this.user);
  }

  ErrorImagen() {
    this.user.avatarUrl = this.avatar;
  }

  MessageError(input: string) {
    if (this.form.controls[input].errors && this.form.controls[input].touched) {
      const obj = this.form.controls[input].errors;
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
  async RemoveWhiteSpace() {
    Object.keys(this.form.value).forEach(
      (key) => {
        if (key !== 'autosave' && key !== 'phoneCode' && key !== 'phoneNumber' && key !== 'phone') {
          this.form.value[key] = this.noWhiteSpace.RemoveWhiteSpace(this.form.value[key]);
        }
      }
    );
  }

  ionViewWillEnter() {
    this.loaderService.Close();
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            if (this.user.emptyProfile) {
              // this.Logout();
            } else {
              this.Back();
            }
          }
        );
      }
    );
    // alert('3 - Acabamos de entrar en la página.');
  }

  ionViewDidEnter() {
    // alert('4 - Página completamente cargada y activa.');
  }

  ionViewWillLeave() {
    // alert('6 - ¿Estás seguro que quieres dejar la página?.');
  }

  ionViewDidLeave() {
    // alert('7 - La página Home2 ha dejado de estar activa.');
    this.backButtonSubs.unsubscribe();
  }

  ChangeLanguage(value) {
    this.languageService.ChangeLanguage(value);
    this.changeLanguage = true;
  }

}
