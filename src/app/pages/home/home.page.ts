import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { TourService } from 'ngx-tour-ngx-popper';
import { User } from '../../common/models/user.model';
import { UserService } from '../../core/services/user.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Config } from '../../common/enums/config.enum';
import { VisibilityOption } from '../../common/models/visibilityOptions.enum';
import { WinkService } from '../../core/services/wink.service';
import { RoutesAPP } from '../../common/enums/routes/routesApp.enum';
import { ToursService } from '../../core/services/tours.service';
import { PagesName } from '../../common/enums/pagesName.enum';
import { AlertService } from '../../common/alert/alert.service';
import { AlertButtonType } from '../../common/alert/base';
import { Buttons } from '../../common/enums/buttons.enum';
import { LoaderService } from '../../core/services/loader.service';
import { BackgroundService } from 'src/app/core/services/background.service';
import { LocalNotificationsService } from 'src/app/core/services/local-notifications.service';
import { ToastService } from '../../core/services/toast.service';

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
  private accountantUser = 10;

  user: User = null;
  userSubs = new Subscription();
  personal = true;
  professional  = true;

  maxStatus = Config.MAX_STATUS;

  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  urlSettigns = '/' + RoutesAPP.BASE + '/' + RoutesAPP.CONFIGURAR_PERFIL;
  urlWinks = '/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS;
  load = false;
  arrayLoad = [];

  tour = true;
  tourSubs = new Subscription();
  stepShowSubs = new Subscription();
  backButtonSubs = new Subscription();
  exit = 'app';
  countExit = 0;

  private goPage = new BehaviorSubject<boolean>(false);
  private goPage$ = this.goPage.asObservable();

  constructor(
    private userService: UserService,
    private winkService: WinkService,
    private router: Router,
    private platform: Platform,
    private navController: NavController,
    public tourService: TourService,
    private toursService: ToursService,
    public alertController: AlertController,
    private alertService: AlertService,
    public loaderService: LoaderService,
    private backgroundService: BackgroundService,
    private localNotificationsServices: LocalNotificationsService,
    private toastService: ToastService,
  ) {
    this.user = this.userService.User();
    for (let i = 0; i < 15; i++) {
      this.arrayLoad.push(i);
    }
    this.ValidateTour();
  }

  ngOnInit() {
    // this.router.events.subscribe(
    //   (value: any) => {
    //     if (Array.isArray(this.originNearbyUsers)) {
    //       if (value instanceof NavigationStart) {
    //         if (value.url.split('/')[2] === RoutesAPP.HOME ) {
    //           if (this.originNearbyUsers.length === 0) {
    //             this.GPS();
    //           }
    //         }
    //       } else if (value instanceof NavigationEnd) {
    //         if (value.url.split('/')[2] === RoutesAPP.HOME ) {
    //           if (this.originNearbyUsers.length === 0) {
    //             this.GPS();
    //           }
    //         }
    //       }
    //     }
    //   }
    // );
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
          this.OpenFabList = false;
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
  }

  VisibilityUser() {
    if (this.user) {
      switch (this.user.visibility) {
        case VisibilityOption.GENERAL:
          this.professional = false;
          this.personal = false;
          break;
        case VisibilityOption.PROFESIONAL:
          this.professional = true;
          this.personal = false;
          break;
        case VisibilityOption.PERSONAL:
          this.professional = false;
          this.personal = true;
          break;
        case VisibilityOption.ALL:
          this.professional = true;
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
    this.backButtonSubs.unsubscribe();
  }

  async GPS(event?) {
    if (!this.tour) {
      this.load = true;
      this.ChangeExit();
      try {
        await this.winkService.GetNearby();
      } catch (err) {
        console.log('GPS error', err);
      } finally {
        if (event) {
          event.target.complete();
        }
      }
      this.load = false;
    }
  }

  LoadUsers(event?) {
    this.ChangeExit();
    if (!this.tour) {
      if (this.accountantUser < this.originNearbyUsers.length) {
        this.accountantUser += 10;
      }
      this.nearbyUsers = this.originNearbyUsers.slice(0, this.accountantUser);
      if (event) {
        event.target.complete();
        if (this.accountantUser >= this.originNearbyUsers.length) {
          event.target.disabled = true;
        }
      }
    }
  }

  async ChangeStatus(value) {
    try {
      await this.userService.UpdateStatus(value);
    } catch (err) {
      this.user = this.userService.User();
      console.log('Error ChangeStatus', err.message);
    }
  }

  showToastProfessional() {
    if (this.professional) {
      this.toastService.show('WINK.CHANGE_PROFILE.PROFESSIONAL.ACTIVE');
    } else {
      this.toastService.show('WINK.CHANGE_PROFILE.PROFESSIONAL.INACTIVE');
    }
  }

  showToastPersonal() {
    if (this.personal) {
      this.toastService.show('WINK.CHANGE_PROFILE.PERSONAL.ACTIVE');
    } else {
      this.toastService.show('WINK.CHANGE_PROFILE.PERSONAL.INACTIVE');
    }
  }

  async ChangeProfiles(profile: string) {
    try {
      this.ChangeExit();
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
          this.showToastPersonal();
        } else {
          switch (this.user.visibility) {
            case VisibilityOption.GENERAL:
              this.user.visibility = VisibilityOption.PROFESIONAL;
              this.professional = true;
              break;
            case VisibilityOption.PROFESIONAL:
              this.user.visibility = VisibilityOption.GENERAL;
              this.professional = false;
              break;
            case VisibilityOption.PERSONAL:
              this.user.visibility = VisibilityOption.ALL;
              this.professional = true;
              break;
            case VisibilityOption.ALL:
              this.user.visibility = VisibilityOption.PERSONAL;
              this.professional = false;
              break;
          }
          this.showToastProfessional();
        }
        await this.userService.UpdateProfiles(this.user.visibility);
      }
    } catch (err) {
      this.user = this.userService.User();
      console.log('Error ChangeProfiles', err.message);
    }
  }

  async PromptStatus() {
    this.ChangeExit();
    this.alertService.showPromptStatus({
      title: 'WINK.STATUS.TITLE',
      description: this.user.status,
      buttons: [
        {
          label: Buttons.CANCEL,
          type: AlertButtonType.Medium,
          value: false
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
  }

  async AlertRange() {
    try {
      this.alertService.showRange({
        title: 'WINK.DIALOGUES.TITLES.RANGE',
        description: 'WINK.DIALOGUES.MESSAGES.RANGE',
        max: 8000,
        min: 1,
        value: (this.user.searchRange / 1000)
      }).subscribe(
        async (response) => {
          if (response && !this.tour) {
            await this.winkService.Range(response);
            this.user.searchRange = (response as number * 1000);
            this.userService.User(this.user, true);
            this.GPS();
          }
        }
      );
    } catch (err) {
      console.log();
    }
  }

  get isPersonal() {
    return this.personal;
  }

  get isProfessional() {
    return this.professional;
  }

  async GoPublicProfile(user: User) {
    try {
      this.ChangeExit();
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

  async GoProfilesSettings() {
    if (!this.tour) {
      try {
        await this.navController.navigateForward(
          this.urlSettigns
        );
      } catch (error) {
      }
    }
  }

  async GoWinks() {
    if (!this.tour) {
      try {
        await this.navController.navigateForward(
          this.urlWinks
        );
      } catch (error) {
      }
    }
  }

  ExitApp() {
    if (!this.tour) {
      this.countExit++;
      if (this.countExit === 2) {
        this.countExit = 0;
        navigator[this.exit].exitApp();
      }
    }
  }

  ChangeExit() {
    this.countExit = 0;
  }

  async ionViewWillEnter() {
    this.localNotificationsServices.CloseAll();
    this.loaderService.Close();
    this.backgroundService.Enable();
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          () => {
            this.ExitApp();
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
    this.OpenFabList = false;
  }

  Swipe(event) {
    // switch (event.offsetDirection) {
    //   case 2:
    //     this.GoWinks();
    //     break;
    //   case 4:
    //     this.GoProfilesSettings();
    //     break;
    //   default:
    //     break;
    // }
  }

}
