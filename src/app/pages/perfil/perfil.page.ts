import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { ActionSheetController, MenuController } from '@ionic/angular';
import { UpdateAvatarService } from '../../services/update-avatar.service';
import { Router, NavigationEnd } from '@angular/router';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {

  avatar: {fileSrc: string, filePath: string } =
  {
    fileSrc : 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
    filePath: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
  };
  user: User;
  userSusbcription = new Subscription();
  formSusbcription = new Subscription();
  form: FormGroup;
  loading = false;
  loadingAvatar = false;
  uploadAvatar = false;
  edit = false;
  genders = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private avatarService: UpdateAvatarService,
    private router: Router,
  ) {
    this.user = this.userService.User();
    this.form = this.formBuilder.group({
      firstName: new FormControl( this.user.firstName,  [Validators.required]),
      lastName: new FormControl( this.user.lastName,  [Validators.required]),
      email: new FormControl( {value: this.user.email, disabled: this.DisableEmail()}, [Validators.required, Validators.email]),
      phoneCode: new FormControl( {
        value: this.user.phone ? this.user.phone.phoneCode : null,
        disabled: this.DisableEmail() },  [Validators.required]),
      phoneNumber: new FormControl({
        value: this.user.phone ? this.user.phone.phoneNumber : null,
        disabled: this.DisablePhone()}, [Validators.required]),
      birthday: new FormControl( this.user.birthday, [Validators.required]),
      gender: new FormControl( this.user.gender, [Validators.required]),
      autosave: new FormControl( this.user.autosave  ? this.user.autosave : true),
      phone: new FormControl('')
    });
    this.genders = this.userService.gender;
   }

  ngOnInit() {
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
  }

  async onSubmit() {
    this.loading = true;
    try {
      this.form.value.phone = {
        phoneCode: this.form.value.phoneCode,
        phoneNumber: this.form.value.phoneNumber
      };
      console.log('Data', this.form.value);
      const respuesta = await this.userService.UpdateDate(this.form.value);
      if (respuesta.status === 'user updated successfully') {
        this.authService.AuthoLogin();
        console.log('cambio ruta');
        this.router.navigate(['/' + RoutesAPP.BASE + RoutesAPP.HOME]);
      }
    } catch (err) {
      console.log('Error submit', err);
    }
    this.loading = false;
  }

  FechaActual() {
    return new Date();
  }

  Logout() {
    this.authService.Logout();
  }

  async SeleccionarImagen() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione una opcion',
      buttons: [{
        text: 'Camara',
        icon: 'camera',
        handler:  async () => {
          this.SolicitudImage(true);
        }
      }, {
        text: 'Galeria',
        icon: 'image',
        handler:   () => {
          this.SolicitudImage(false);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  private async SolicitudImage(camera: boolean) {
    try {
      this.loadingAvatar = true;
      const respuesta: any = await this.avatarService.OpenUpdate(camera);
      this.userService.UpdateAvatar(respuesta.link);
      console.log('Respuesta imagen', respuesta);
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

  Cancel() {
    this.router.navigate(['/' + RoutesAPP.BASE + RoutesAPP.CONFIGURAR_PERFIL]);
  }


  DisableEmail(): boolean {
    return (this.user.emptyProfile && this.user.email !== '') ? true : false;
  }

  DisablePhone(): boolean {
    return (this.user.emptyProfile && this.user.phone && this.user.phone.phoneCode && this.user.phone.phoneNumber) ? true : false;
  }

  ErrorImagen() {
    console.log('Error');
    this.user.avatarUrl = this.avatar.fileSrc;
  }

}
