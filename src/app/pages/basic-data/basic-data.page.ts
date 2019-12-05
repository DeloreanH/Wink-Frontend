import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../common/models/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { ActionSheetController, MenuController, NavController, Platform } from '@ionic/angular';
import { UpdateAvatarService } from '../../core/services/update-avatar.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { MessageErrorForms } from 'src/app/common/enums/messageError.enum';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { AlertService } from 'src/app/common/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'basic-data',
  templateUrl: './basic-data.page.html',
  styleUrls: ['./basic-data.page.scss'],
})
export class BasicDataPage implements OnInit, OnDestroy {

  avatar: string = Config.AVATAR;
  user: User;
  userSusbcription = new Subscription();
  form: FormGroup;
  loading = false;
  loadingAvatar = false;
  uploadAvatar = true;
  edit = false;
  genders: { value: string, description: string}[] = [];
  backButtonSubs = new Subscription();

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
  ) {
    this.user = this.userService.User();
    this.form = this.formBuilder.group({
      firstName: new FormControl( this.user.firstName,  [Validators.required]),
      lastName: new FormControl( this.user.lastName,  [Validators.required]),
      email: new FormControl({
          value: this.user.email,
          disabled: this.DisabledEmail()
        }, [
          Validators.required,
          Validators.email
        ]),
      phoneCode: new FormControl( {
        value: this.user.phone ? this.user.phone.phoneCode : null,
        disabled: this.DisabledPhone() },  [Validators.required]),
      phoneNumber: new FormControl({
        value: this.user.phone ? this.user.phone.phoneNumber : null,
        disabled: this.DisabledPhone()}, [Validators.required]),
      birthday: new FormControl( this.user.birthday, [Validators.required]),
      gender: new FormControl( this.user.gender, [Validators.required]),
      autosave: new FormControl( this.user.autosave  ? this.user.autosave : true),
      phone: new FormControl(''),
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
    this.genders = this.userService.genders;
   }

  ngOnInit() {
    this.Subscriptions();
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
        this.form.value.phone = {
          phoneCode: this.form.value.phoneCode,
          phoneNumber: this.form.value.phoneNumber
        };
        const response = await this.userService.UpdateDate(this.form.value);
        response.user.emptyProfile = false;
        console.log(response);
        if (response.status === 'user updated successfully' && !response.user.emptyProfile) {
          this.userService.User(response.user, true);
          this.edit = false;
          await this.navController.navigateRoot(
            '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME
          );
          // setTimeout(
          //   async () => {
          //   }
          //   , 500);
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
        if (resp.value) {
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
        return (this.form.valid && this.edit) ? false : true;
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


  private DisabledEmail(): boolean {
    return (this.user.emptyProfile && this.user.email !== '' || !this.user.emptyProfile) ? true : false;
  }

  private DisabledUsername(): boolean {
    return (this.user.emptyProfile && this.user.username !== '' || !this.user.emptyProfile) ? true : false;
  }

  private DisabledPhone(): boolean {
    return (
      this.user.emptyProfile && this.user.phone && this.user.phone.phoneCode && this.user.phone.phoneNumber || !this.user.emptyProfile)
      ? true : false;
  }

  Avatar() {
    if (this.user) {
      if (this.user.avatarUrl.startsWith('http')) {
        return this.user.avatarUrl;
      } else {
        return Routes.PHOTO + this.user.avatarUrl;
      }
    } else {
      return this.avatar;
    }
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
        }
      }
    }
  }

  ionViewWillEnter() {
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            if (this.user.emptyProfile) {
              this.Logout();
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

}
