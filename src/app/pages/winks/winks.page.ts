import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { WinkService } from 'src/app/core/services/wink.service';
import { Wink } from 'src/app/common/models/wink.model';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { TourService } from 'ngx-tour-ngx-popper';
import { TranslateService } from '@ngx-translate/core';
import { PagesName } from 'src/app/common/enums/pagesName.enum';
import { ToursService } from 'src/app/core/services/tours.service';
import { ItemWinkComponent } from './item-wink/item-wink.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-winks',
  templateUrl: './winks.page.html',
  styleUrls: ['./winks.page.scss'],
})
export class WinksPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(ItemWinkComponent, {static: false}) winkRecord: ItemWinkComponent;
  tab: 'record' | 'requests' = 'requests';

  requests: Wink[] = [];
  requestsSubscription = new Subscription();

  record: Wink[] = [];
  recordSubscription = new Subscription();

  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  noHistorical = Config.NO_RECORD;
  noRequests = Config.NO_REQUESTS;

  tour = true;
  tourSubscription = new Subscription();
  stepShowSubs = new Subscription();

  backButtonSubs = new Subscription();
  urlHome = '/' + RoutesAPP.BASE + '/' + RoutesAPP.HOME;

  constructor(
    private winkService: WinkService,
    public tourService: TourService,
    private toursService: ToursService,
    private route: ActivatedRoute,
    private platform: Platform,
    private navController: NavController,
  ) {
    this.record = this.winkService.Record;
    this.requests = this.winkService.Requests;
   }

  ngOnInit() {
    this.Subscriptions();
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
        this.record = record;
      }
    );
    this.requestsSubscription = this.winkService.requestsChanged.subscribe(
      (requests: Wink[]) => {
        this.requests = requests;
      }
    );
  }

  ngAfterViewInit(): void {
    this.ValidateTour();
  }


  ValidateTour() {
    if (this.toursService.ValidateTour(PagesName.WINKS)) {
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

  }

  async Winks() {
    try {
      await this.winkService.GetWinks();
    } catch (err) {
      console.log(err);
    }
  }

  ionViewWillEnter() {
    this.backButtonSubs = this.platform.backButton.subscribe(
      (resp) => {
        resp.register(100,
          async () => {
            await this.navController.navigateBack(
              [ this.urlHome]
            );
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
  }

}
