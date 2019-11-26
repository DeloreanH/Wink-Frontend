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
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { language, tours } from 'src/app/common/constants/storage.constants';
import { TourService } from 'ngx-tour-ngx-popper';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { Tours } from 'src/app/common/interfaces/tours.interface';

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
  personal = true;
  profesional  = true;
  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  private contadorUser = 10;
  load = false;
  arrayLoad = [] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private winkService: WinkService,
    private router: Router,
    private platform: Platform,
    private navController: NavController,
    private translateService: TranslateService,
    private tourService: TourService,
  ) {
    this.user = this.userService.User();
    for (let i = 0; i < 15; i++) {
      this.arrayLoad.push(i);
    }
  }

  ngOnInit() {
    this.platform.backButton.subscribe(
      (resp) => {
      alert('atras');
      resp.register(0, () => alert('atras'));
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

  lAN() {
    console.log('LAN');
    if (this.translateService.currentLang === 'es') {
      this.translateService.use('en');
      console.log('es');
      StorageService.SetItem(language, 'en');
    } else {
      console.log('en');
      this.translateService.use('es');
      StorageService.SetItem(language, 'es');
    }
  }

  ValidateTour() {
    const tour: Tours = StorageService.GetItem(tours, true);
    if (tour) {
      if (tour.home) {
        this.Tour(tour);
      }
    } else {
      StorageService.SetItem(tours, {
        home: true,
        profile: true,
        public: true,
        private: true,
        winks: true
      });
      this.Tour(tour);
    }
  }

  Tour(tour: Tours) {
    this.tourService.initialize(
      [{
        anchorId: 'status',
        content: 'Comparte lo que estes haciendo.',
        title: 'Status',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        }
      }, {
        anchorId: 'profiles',
        // tslint:disable-next-line: max-line-length
        content: 'Aqui puedes modificar los perfiles que deseas enviar.',
        title: 'Second',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        },
        // route: '/' + RoutesAPP.BASE + '/' + RoutesAPP.CONFIGURAR_PERFIL
      }]
    );
    this.tourService.start();
    this.tourService.end$.subscribe(
      () => {
        tour.home = false;
        StorageService.SetItem(tours, tour);
      }
    );
  }

  ngAfterViewInit() {
    this.VisibilityUser();
    this.ValidateTour();
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
    this.load = !this.load;
  }

  async GPS(event?) {
    this.load = true;
    try {
      await this.winkService.GetNearby();
    } catch (err) {
      console.log('GPS error', err.message);
    }
    if (event) {
      event.target.complete();
    }
    this.load = false;
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
        await this.userService.UpdateProfiles(this.user.visibility);
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
