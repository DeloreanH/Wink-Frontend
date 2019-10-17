import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/servicios/user.service';
import { User } from 'src/app/modelos/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {

  avatar = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  user: User;
  userSusbcription = new Subscription();

  form: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.user = this.userService.User();
    this.form = this.formBuilder.group({
      avatarUrl: new FormControl( this.user.avatarUrl ? this.user.avatarUrl : null, [Validators.required]),
      firstName: new FormControl( this.user.firstName,  [Validators.required]),
      lastName: new FormControl( this.user.lastName,  [Validators.required]),
      email: new FormControl( this.user.email, [Validators.required, Validators.email]),
      phoneCode: new FormControl( this.user.phone ? this.user.phone.phoneCode : null,  [Validators.required]),
      phoneNumber: new FormControl( this.user.phone ? this.user.phone.phoneNumber : null,  [Validators.required]),
      birthday: new FormControl( this.user.birthday, [Validators.required]),
      gender: new FormControl( this.user.gender, [Validators.required]),
    });
   }

  ngOnInit() {
    this.userSusbcription = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    // console.log(this.user);
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
  }

  onSubmit() {

  }

  FechaActual() {
    return new Date();
  }

}
