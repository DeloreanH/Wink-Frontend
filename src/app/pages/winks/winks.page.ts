import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { WinkService } from 'src/app/core/services/wink.service';
import { Wink } from 'src/app/common/models/wink.model';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { TourService } from 'ngx-tour-ngx-popper';
import { PagesName } from 'src/app/common/enums/pagesName.enum';
import { ToursService } from 'src/app/core/services/tours.service';
import { ItemWinkComponent } from './item-wink/item-wink.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { LoaderService } from 'src/app/core/services/loader.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AlertComponent } from 'src/app/common/alert/alert.component';
import { ItemRequestComponent } from './item-request/item-request.component';
import { AlertService } from 'src/app/common/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-winks',
  templateUrl: './winks.page.html',
  styleUrls: ['./winks.page.scss'],
})
export class WinksPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(ItemWinkComponent, {static: false}) winkRecord: ItemWinkComponent;
  @ViewChildren(ItemWinkComponent) itemsWink: QueryList<ItemWinkComponent>;
  @ViewChildren(ItemRequestComponent) itemsRequest: QueryList<ItemRequestComponent>;
  tab: 'record' | 'requests' = 'requests';

  requests: Wink[] = [];
  requestsSubscription = new Subscription();

  record: Wink[] = [];
  recordSubscription = new Subscription();

  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  noHistorical = Config.NO_RECORD;
  noRequests = Config.NO_REQUESTS;

  tour = false;
  tourSubscription = new Subscription();
  stepShowSubs = new Subscription();

  backButtonSubs = new Subscription();
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;
  removingRecord = false;
  removingRequest = false;
  removeRecord = false;
  removeRequest = false;
  countDelRequest = 0;
  countDelRecord = 0;

  constructor(
    private winkService: WinkService,
    public tourService: TourService,
    private toursService: ToursService,
    private route: ActivatedRoute,
    private platform: Platform,
    private navController: NavController,
    public loaderService: LoaderService,
    private alertService: AlertService,
    private translateService: TranslateService,
  ) {
    this.ValidateTour();
    this.record = this.winkService.Record;
    this.requests = this.winkService.Requests;
   }

  ngOnInit() {
    this.Subscriptions();
    // this.loaderService.Close();
  }

  private Subscriptions() {
    this.route.params
    .subscribe(
      async (params: Params) => {
        if (params.requests) {
          this.tab = 'requests';
        }
      }
    );
    this.recordSubscription = this.winkService.recordChanged.subscribe(
      (record: Wink[]) => {
        if (!this.tour) {
          this.record = record;
        }
      }
    );
    this.requestsSubscription = this.winkService.requestsChanged.subscribe(
      (requests: Wink[]) => {
        if (!this.tour) {
          this.requests = requests;
        }
      }
    );
  }

  ngAfterViewInit(): void {
    // this.ValidateTour();
    // this.loaderService.Close();
  }


  ValidateTour() {
    if (this.toursService.ValidateTour(PagesName.WINKS)) {
      this.tour = true;
      this.tourService.initialize(this.toursService.tourWinks);
      this.record = [];
      this.requests = [];
      this.tourService.start();
      this.stepShowSubs = this.tourService.stepShow$.subscribe(
        (step) => {
          if (step.anchorId === 'requests') {
            this.tab = 'requests';
          }
          if (step.anchorId === 'wink') {
            this.requests.push(this.toursService.winkRequestsTour);
            this.tab = 'requests';
          } else {
            this.requests = [];
          }
          if (step.anchorId === 'record' ) {
            this.tab = 'record';
            this.record = [];
            this.record.push(this.toursService.winkRecordTour);
            this.winkRecord.Close();
          } else if (step.anchorId === 'delete') {
            this.winkRecord.Open();
          } else {
            this.record = [];
          }
        }
      );
      this.tourSubscription = this.tourService.end$.subscribe(
        () => {
          this.record = [];
          this.requests = [];
          this.tab = 'requests';
          this.tour = false;
          this.toursService.EndTour(PagesName.WINKS);
          this.tourSubscription.unsubscribe();
          this.stepShowSubs.unsubscribe();
          this.Winks();
        }
      );
    } else {
      this.tour = false;
      this.Winks();
    }
  }

  ngOnDestroy() {
    this.recordSubscription.unsubscribe();
    this.requestsSubscription.unsubscribe();
    this.tourSubscription.unsubscribe();
    this.stepShowSubs.unsubscribe();
    this.backButtonSubs.unsubscribe();
  }

  TabChanged(event) {
    this.tab = event.target.value;
    this.removingRecord = false;
    this.removingRequest = false;
  }

  async Winks(event?) {
    try {
      await this.winkService.GetWinks();
    } catch (err) {
      console.log(err);
    } finally {
      if (event) {
        event.target.complete();
      }
    }
  }

  async GoHome() {
    if (!this.tour) {
      await this.navController.navigateBack(
        [ this.urlHome]
      );
    }
  }

  ionViewWillEnter() {
    // this.loaderService.Close();
    if (!this.record.length && !this.requests.length) {
      this.Winks();
    }
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          async () => {
            if (!this.tour ) {
              this.GoHome();
            }
          }
        );
      }
    );
    // alert('3 - Acabamos de entrar en la página.');
  }

  ionViewDidEnter() {
    // this.loaderService.Close();
    // alert('4 - Página completamente cargada y activa.');
  }

  ionViewWillLeave() {
    // alert('6 - ¿Estás seguro que quieres dejar la página?.');
  }

  ionViewDidLeave() {
    // alert('7 - La página Home2 ha dejado de estar activa.');
    this.backButtonSubs.unsubscribe();
  }

  Swipe(event) {
    // switch (event.offsetDirection) {
    //   case 2:
    //     // this.Rigth();
    //     break;
    //   case 4:
    //     this.GoHome();
    //     // this.Left();
    //     break;
    //   default:
    //     break;
    // }
  }

  private Rigth() {
    this.tab = 'record';
  }

  private Left() {
    this.tab = 'requests';
  }

  Remove() {
    if (this.tab === 'requests' && this.removingRequest)  {
      this.alertService.showConfirm({
        title: null /* 'WINK.DIALOGUES.TITLES.DELETE_REQUEST'*/,
        description: this.translateService.instant(
          this.countDelRequest > 1 ?
          'WINK.DIALOGUES.MESSAGES.DELETE_WINK_REQUESTS'
          : 'WINK.DIALOGUES.MESSAGES.DELETE_WINK_REQUEST'
          , {value: this.countDelRequest}
          ),
      }).subscribe(
        async (resp: any) => {
          if (resp && resp.value) {
            this.itemsRequest.forEach(
              (item) => {
                item.RemoveList();
              }
            );
            this.removeRequest = true;
            this.removingRequest = false;
          }
        }
      );
    } else if (this.tab === 'record' && this.removingRecord) {
      this.alertService.showConfirm({
        title: null /*'WINK.DIALOGUES.TITLES.DELETE_WINK'*/,
        description: this.translateService.instant(
          this.countDelRecord > 1 ?
          'WINK.DIALOGUES.MESSAGES.DELETE_WINK_ITEMS'
          : 'WINK.DIALOGUES.MESSAGES.DELETE_WINK_ITEM',
          {value: this.countDelRecord}
          ),
      }).subscribe(
        async (resp: any) => {
          if (resp && resp.value) {
            this.itemsWink.forEach(
              (item) => {
                item.RemoveList();
              }
            );
            this.removeRecord = true;
            this.removingRecord = false;
          }
        }
      );
    }
  }

  NoRemove() {
    this.removingRequest = false;
    this.removingRecord = false;
  }

  CountRecord(event) {
    this.countDelRecord += event;
    if (this.countDelRecord === 0) {
      this.removingRecord = false;
    }
  }
  CountRequest(event) {
    this.countDelRequest += event;
    if (this.countDelRequest === 0) {
      this.removingRequest = false;
    }
  }


}
