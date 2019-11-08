import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Config } from '../../config/enums/config.enum';
import { VisibilityOption } from '../../models/visibilityOptions.enum';
import { WinkService } from '../../services/wink.service';
import { LinkService } from 'src/app/services/link.service';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  nearbyUsers: User[] = [];
  originNearbyUsers: User[] = [];
  nearbyUsersSubscription = new Subscription();
  user: User = null;
  userSubscription = new Subscription();
  maxStatus = Config.MAX_STATUS;
  placeholderStatus = Config.MESSAGE_PLACEHOLDER_STATUS;
  personal = true;
  profesional  = true;
  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  private contadorUser; number = 10;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private winkService: WinkService,
    private linkService: LinkService
  ) {
    this.user = this.userService.User();
  }

  ngOnInit() {
    this.GPS();
    this.originNearbyUsers = this.winkService.NearbyUsers;
    this.nearbyUsersSubscription = this.winkService.nearbyUsersChanged.subscribe(
      (nearbyUsers) => {
        this.originNearbyUsers = nearbyUsers;
        this.LoadUsers();
      }
    );
    this.userSubscription = this.userService.userChanged.subscribe(
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
        case VisibilityOption.ALL:
          this.profesional = true;
          this.personal = true;
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.nearbyUsersSubscription.unsubscribe();
  }

  async GPS(event?) {
    try {
      const respuesta = await this.winkService.GetNearby();
    } catch (err) {
      console.log('GPS error', err.message);
    }
    if (event) {
      event.target.complete();
    }
  }

  Logout() {
    this.authService.Logout();
  }

  LoadUsers(event?) {
    if (this.contadorUser < this.originNearbyUsers.length) {
      this.contadorUser += 10;
    }
    this.nearbyUsers = this.originNearbyUsers.slice(0, this.contadorUser);
    if (event) {
      event.target.complete();
      if (this.contadorUser >= this.originNearbyUsers.length) {
        event.target.disabled = true;
      }
    }
  }

  async ChangeStatus(event) {
    console.log('Foco', event);
    if (event.target.value !== this.user.status) {
      try {
        const response = await this.userService.UpdateStatus(event.target.value);
      } catch (err) {
        event.target.value = this.user.status;
        console.log('Error ChangeStatus', err.message);
      }
    }
  }

  async ChangeProfiles(profile: boolean) {
      try {
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
                this.user.visibility = VisibilityOption.ALL;
                this.personal = true;
                break;
              case VisibilityOption.ALL:
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
                this.user.visibility = VisibilityOption.ALL;
                this.profesional = true;
                break;
              case VisibilityOption.ALL:
                this.user.visibility = VisibilityOption.PERSONAL;
                this.profesional = false;
                break;
            }
          }
        }
        const response = await this.userService.UpdateProfiles(this.user.visibility);
      } catch (err) {
        this.user = this.userService.User();
        console.log('Error ChangeProfiles', err.message);
      }
  }

  OpenLink(numb: number) {
    switch (numb) {
      case 0:
        this.linkService.Tel('4120872584');
        break;
      case 1:
        this.linkService.Mail('anibal-1409@hotmail.com');
        break;
      case 2:
        this.linkService.SocialNetwork('facebook', 'anibalbarreras');
        break;
    }
  }
}
