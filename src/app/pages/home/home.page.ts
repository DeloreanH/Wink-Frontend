import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../app/auth/auth.service';
import { NearbyService } from 'src/app/service/nearby.service';
import { User } from 'src/app/modelos/user.model';
import { UserService } from 'src/app/servicios/user.service';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/config/config.enum';
import { VisibilityOption } from 'src/app/modelos/visibilityOptions.emun';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  users: User[] = [];
  originUsers: User[] = [];
  user: User = null;
  userSusbcription = new Subscription();
  maxStatus = Config.MAX_STATUS;
  placeholderStatus = Config.MESSAGE_PLACEHOLDER_STATUS;
  personal = true;
  profesional  = true;
  private contadorUser; number = 10;

  constructor(
    private authService: AuthService,
    private nearbyService: NearbyService,
    private userService: UserService
  ) {
    this.user = this.userService.User();
  }

  ngOnInit() {
    this.userSusbcription = this.userService.userChanged.subscribe(
      (data) => {
        this.user = data;
      }
    );
    if (this.user) {
      switch (this.user.visibility) {
        case VisibilityOption.GENERAL:
          this.profesional = false;
          this.personal = false;
          break;
        case VisibilityOption.PROFESIONAL:
          this.profesional = true;
          this.personal = false;
          break;
        case VisibilityOption.PERSONAL:
          this.profesional = true;
          this.personal = true;
          break;
        case VisibilityOption.TODOS:
          this.profesional = true;
          this.personal = true;
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.userSusbcription.unsubscribe();
  }

  async GPS(event) {
    try {
      // const response = await this.userService.UpdateLocation();
      const respuesta = await this.nearbyService.OpenP();
      if (respuesta) {
        this.originUsers = respuesta;
        this.LoadUsers();
        console.log('User:', this.users.slice(0, 10));
      }
    } catch (err) {
      console.log('GPS error', err.message);
    }
    event.target.complete();
  }

  Logout() {
    this.authService.Logout();
  }

  LoadUsers(event?) {
    if (this.contadorUser < this.originUsers.length) {
      this.contadorUser += 10;
    }
    this.users = this.originUsers.slice(0, this.contadorUser);
    if (event) {
      event.target.complete();
      if (this.contadorUser >= this.originUsers.length) {
        event.target.disabled = true;
      }
    }
  }

  async ChangeStatus(event) {
    console.log('Foco', event);
    if (event.target.value !== this.user.status) {
      try {
        // const response = await this.userService.UpdateStatus(event.target.value);
        // console.log('Respuesta ChangeStatus', response);
      } catch (err) {
        console.log('Error ChangeStatus', err.message);
      }
    }
  }

  async ChangeProfiles(profile: boolean) {
    // console.log(this.user.visibility);
    if (this.user) {
      if (profile) {
        switch (this.user.visibility) {
          case VisibilityOption.GENERAL:
            this.user.visibility = VisibilityOption.PERSONAL;
            this.personal = true;
            break;
          case VisibilityOption.PERSONAL:
            this.user.visibility = VisibilityOption.GENERAL;
            this.personal = false;
            break;
          case VisibilityOption.PROFESIONAL:
            this.user.visibility = VisibilityOption.TODOS;
            this.personal = true;
            break;
          case VisibilityOption.TODOS:
            this.user.visibility = VisibilityOption.PROFESIONAL;
            this.personal = false;
            break;
        }
      } else {
        switch (this.user.visibility) {
          case VisibilityOption.GENERAL:
            this.user.visibility = VisibilityOption.PROFESIONAL;
            this.profesional = true;
            break;
          case VisibilityOption.PROFESIONAL:
            this.user.visibility = VisibilityOption.GENERAL;
            this.profesional = false;
            break;
          case VisibilityOption.PERSONAL:
            this.user.visibility = VisibilityOption.TODOS;
            this.profesional = true;
            break;
          case VisibilityOption.TODOS:
            this.user.visibility = VisibilityOption.PERSONAL;
            this.profesional = false;
            break;
        }
      }
      try {
        // console.log(this.user.visibility);
        // const response = await this.userService.UpdateProfiles(this.user.visibility);
        // console.log('Respuesta ChangeProfiles', response);
      } catch (err) {
        console.log('Error ChangeProfiles', err.message);
      }
    }
  }

}
