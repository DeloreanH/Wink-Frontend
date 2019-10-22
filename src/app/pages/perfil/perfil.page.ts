import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../app/servicios/user.service';
import { User } from '../../../app/modelos/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../app/auth/auth.service';
import {
  Camera,
  CameraOptions,
} from '@ionic-native/camera/ngx/';
import { ActionSheetController } from '@ionic/angular';
import { UpdateAvatarService } from '../../../app/servicios/updateAvatar/update-avatar.service';
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
  form: FormGroup;

  constructor(
    public actionSheetController: ActionSheetController,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private camera: Camera,
    private avatarService: UpdateAvatarService
  ) {
    this.user = this.userService.User();
    this.form = this.formBuilder.group({
      firstName: new FormControl( this.user.firstName,  [Validators.required]),
      lastName: new FormControl( this.user.lastName,  [Validators.required]),
      email: new FormControl( this.user.email, [Validators.required, Validators.email]),
      phoneCode: new FormControl( this.user.phone ? this.user.phone.phoneCode : null,  [Validators.required]),
      phoneNumber: new FormControl( this.user.phone ? this.user.phone.phoneNumber : null,  [Validators.required]),
      birthday: new FormControl( this.user.birthday, [Validators.required]),
      gender: new FormControl( this.user.gender, [Validators.required]),
      autosave: new FormControl( this.user.autosave , [Validators.required]),
    });
   }

  ngOnInit() {
    this.userSusbcription = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
  }

  onSubmit() {
    console.log('Data', this.form);
  }

  FechaActual() {
    return new Date();
  }

  SeleccionarImagen2(camara: boolean) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: camara ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
    }).then((imageData) => {
      this.userService.UpdateAvatar(imageData);
     }, (err) => {
      console.log('Error', err);
     });
  }

  Logout() {
    this.authService.Logout();
  }

  Camara() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,

    }).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.user.avatarUrl = base64Image;
      this.userService.UpdateAvatar(imageData);
     }, (err) => {
      console.log('Error', err);
     });
  }

  Galeria() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.user.avatarUrl = base64Image;
      this.userService.UpdateAvatar(imageData);
     }, (err) => {
      console.log('Error', err);
     });
  }

  async SeleccionarImagen() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione una opcion',
      buttons: [{
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          const respuesta = this.avatarService.OpenUpdate(true);
        }
      }, {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          const respuesta = this.avatarService.OpenUpdate(false);
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

}
