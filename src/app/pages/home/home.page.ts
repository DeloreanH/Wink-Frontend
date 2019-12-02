import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { User } from '../../common/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { Config } from '../../common/enums/config.enum';
import { VisibilityOption } from '../../common/models/visibilityOptions.enum';
import { WinkService } from '../../core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { language, tours } from 'src/app/common/constants/storage.constants';
import { TourService } from 'ngx-tour-ngx-popper';
import { ToursService } from 'src/app/core/services/tours.service';
import { PagesName } from 'src/app/common/enums/pagesName.enum';
import { AlertService } from '../../common/alert/alert.service';
import { AlertButtonType } from '../../common/alert/base';
import { Buttons } from 'src/app/common/enums/buttons.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  OpenFabList = false;

  nearbyUsers: User[] = [];
  originNearbyUsers: User[] = [];
  nearbyUsersSubs = new Subscription();
  private contadorUser = 10;

  user: User = null;
  userSubs = new Subscription();
  personal = true;
  profesional  = true;

  maxStatus = Config.MAX_STATUS;

  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  load = false;
  arrayLoad = [];

  tour = true;
  tourSubs = new Subscription();
  stepShowSubs = new Subscription();

  constructor(
    private userService: UserService,
    private winkService: WinkService,
    private router: Router,
    private platform: Platform,
    private navController: NavController,
    private translateService: TranslateService,
    public tourService: TourService,
    private toursService: ToursService,
    public alertController: AlertController,
    private alertService: AlertService,
  ) {
    this.user = this.userService.User();
    for (let i = 0; i < 15; i++) {
      this.arrayLoad.push(i);
    }
    this.ValidateTour();
  }

  ngOnInit() {
    this.platform.backButton.subscribe(
      (backButton) => {
        backButton.register(9999, () => {
          alert('BACK CLICK');
        });
      },
      (error) => {
        alert('error back');
      }
    );
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
    // this.GPS();
    this.originNearbyUsers = this.winkService.NearbyUsers;
    this.nearbyUsersSubs = this.winkService.nearbyUsersChanged.subscribe(
      (nearbyUsers) => {
        this.originNearbyUsers = nearbyUsers;
        this.LoadUsers();
      }
    );
    this.userSubs = this.userService.userChanged.subscribe(
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
      this.stepShowSubs = this.tourService.stepShow$.subscribe(
        (step) => {
          if (step.anchorId === 'profiles_buttons') {
            this.OpenFabList = true;
          } else {
            this.OpenFabList = false;
          }
        }
      );
      this.tourSubs = this.tourService.end$.subscribe(
        () => {
          this.tour = false;
          this.toursService.EndTour(PagesName.HOME);
          this.tourSubs.unsubscribe();
          this.stepShowSubs.unsubscribe();
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
    // this.ValidateTour();
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
          this.profesional = false;
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
    this.userSubs.unsubscribe();
    this.nearbyUsersSubs.unsubscribe();
    this.tourSubs.unsubscribe();
    this.stepShowSubs.unsubscribe();
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

  async ChangeStatus(value) {
    // if (event.target.value !== this.user.status) {
      try {
        await this.userService.UpdateStatus(value);
      } catch (err) {
        // event.target.value = this.user.status;
        console.log('Error ChangeStatus', err.message);
      }
    // }
  }

  async ChangeProfiles(profile: string) {
      try {
        if (this.user && !this.tour) {
          if (profile === '1') {
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
          await this.userService.UpdateProfiles(this.user.visibility);
        }
      } catch (err) {
        this.user = this.userService.User();
        console.log('Error ChangeProfiles', err.message);
      }
  }

  async presentAlertRadio() {
    this.alertService.showPromptStatus({
      title: 'WINK.STATUS.TITLE',
      description: this.user.status,
      buttons: [
        {
          label: Buttons.CANCEL,
          type: AlertButtonType.Danger,
          value: null
        },
        {
          label: Buttons.SAVE,
          type: AlertButtonType.Primary,
          value: true
        },
      ]
    }).subscribe(
      (response) => {
        if (response && !this.tour) {
          this.ChangeStatus(response);
        }
      }
    );
    // const alert = await this.alertController.create({
    //   header: 'Status',
    //   inputs: [
    //     {
    //       name: 'status',
    //       type: 'text',
    //       placeholder: 'Status',
    //       value: this.user.status
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: () => {
    //         console.log('Confirm Cancel');
    //       }
    //     }, {
    //       text: 'Ok',
    //       handler: (value) => {
    //         console.log(value);
    //         this.ChangeStatus(value.status);
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

  get isPersonal() {
    return this.personal;
  }

  get isProfessional() {
    return this.profesional;
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
