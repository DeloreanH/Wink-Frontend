import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { User } from '../../common/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { Config } from '../../common/enums/config.enum';
import { VisibilityOption } from '../../common/models/visibilityOptions.enum';
import { WinkService } from '../../core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { language, tours } from 'src/app/common/constants/storage.constants';
import { TourService } from 'ngx-tour-ngx-popper';
import { ToursService } from 'src/app/core/services/tours.service';
import { PagesName } from 'src/app/common/enums/pagesName.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  OpenFabList = false;

  nearbyUsers: User[] = [];
  originNearbyUsers: User[] = [];
  nearbyUsersSubscription = new Subscription();
  private contadorUser = 10;

  user: User = null;
  userSubscription = new Subscription();
  personal = true;
  profesional  = true;

  maxStatus = Config.MAX_STATUS;

  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  load = false;
  arrayLoad = [];

  tour = true;
  tourSubscription = new Subscription();

  constructor(
    private userService: UserService,
    private winkService: WinkService,
    private router: Router,
    private platform: Platform,
    private navController: NavController,
    private translateService: TranslateService,
    private tourService: TourService,
    private toursService: ToursService,
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
    if (this.translateService.currentLang === 'es') {
      this.translateService.use('en');
      StorageService.SetItem(language, 'en');
    } else {
      this.translateService.use('es');
      StorageService.SetItem(language, 'es');
    }
  }

  ValidateTour() {
    if (this.toursService.ValidateTour(PagesName.HOME)) {
      this.tourService.initialize(this.toursService.tourHome);
      this.nearbyUsers = [];
      this.nearbyUsers.push(this.toursService.userTour);
      this.tourService.start();
      this.tourSubscription = this.tourService.end$.subscribe(
        () => {
          this.tour = false;
          this.toursService.EndTour(PagesName.HOME);
          this.tourSubscription.unsubscribe();
          this.nearbyUsers = [];
          this.GPS();
        }
      );
    } else {
      this.tour = false;
      this.GPS();
    }
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
    this.tourSubscription.unsubscribe();
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

  LoadUsers(event?) {
    if (!this.tour) {
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
      if (!this.tour) {
        setTimeout(
          async () => {
            await this.navController.navigateForward(
              user ? [this.urlPublic, user._id, 0] : []
            );
          }
          , 500);
      }
    } catch (err) {
      console.log('Error Go', err.message);
    }
  }

}
