import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../common/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { Config } from '../../common/enums/config.enum';
import { VisibilityOption } from '../../common/models/visibilityOptions.enum';
import { WinkService } from '../../core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Platform, NavController, IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
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
  private contadorUser = 10;
  cargo = false;
  noNearby = Config.NO_NEARBY;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private winkService: WinkService,
    private router: Router,
    private platform: Platform,
    private navController: NavController,
  ) {
    this.user = this.userService.User();
  }

  ngOnInit() {
    this.platform.backButton.subscribe(
      (resp) => {
      console.group('Atras');
    });
    this.router.events.subscribe(
      (valor: any) => {
        if (valor instanceof NavigationEnd) {
          if (valor.url.split('/')[2] === RoutesAPP.HOME ) {
            if (this.originNearbyUsers.length === 0) {
              this.GPS();
            }
            this.VisibilityUser();
          }
        }
      }
    );
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
        this.VisibilityUser();
      }
    );
  }

  ngAfterViewInit() {
    this.VisibilityUser();
  }

  VisibilityUser() {
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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.nearbyUsersSubscription.unsubscribe();
  }

  Change() {
    this.cargo = !this.cargo;
  }

  async GPS(event?) {
    try {
      await this.winkService.GetNearby();
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
    if (event.target.value !== this.user.status) {
      try {
        await this.userService.UpdateStatus(event.target.value);
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

  async GoPublicProfile(user: User) {
    try {
      setTimeout(
        async () => {
          await this.navController.navigateForward(
            user ? [this.urlPublic, user._id, 0] : []
          );
        }
        , 500);
    } catch (err) {
      console.log('Error Go', err.message);
    }
  }

}
