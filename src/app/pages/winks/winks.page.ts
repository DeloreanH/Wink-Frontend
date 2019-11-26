import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WinkService } from 'src/app/core/services/wink.service';
import { Wink } from 'src/app/common/models/wink.model';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { TourService } from 'ngx-tour-ngx-popper';
import { TranslateService } from '@ngx-translate/core';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { Tours } from 'src/app/common/interfaces/tours.interface';
import { StorageService } from 'src/app/core/services/storage.service';
import { tours } from 'src/app/common/constants/storage.constants';

@Component({
  selector: 'app-winks',
  templateUrl: './winks.page.html',
  styleUrls: ['./winks.page.scss'],
})
export class WinksPage implements OnInit, OnDestroy, AfterViewInit {

  tab = 'requests';
  requests: Wink[] = [];
  requestsSubscription = new Subscription();
  record: Wink[] = [];
  recordSubscription = new Subscription();
  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  noHistorical = Config.NO_RECORD;
  noRequests = Config.NO_REQUESTS;

  constructor(
    private winkService: WinkService,
    private tourService: TourService,
    private translateService: TranslateService
  ) {
    // this.Winks();
    this.record = this.winkService.Record;
    this.requests = this.winkService.Requests;
   }

  ngOnInit() {
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
    const tour: Tours = StorageService.GetItem(tours, true);
    if (tour) {
      if (tour.winks) {
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
      [
        {
          anchorId: 'intro',
          content: 'Aqui contraras todo lo relacionado a tus Winks.',
          title: 'Intro',
          placement : 'bottom',
          prevBtnTitle: this.translateService.instant(Buttons.PREV),
          nextBtnTitle: this.translateService.instant(Buttons.NEXT),
          endBtnTitle: this.translateService.instant(Buttons.END),
          popperSettings: {
            closeOnClickOutside: false,
          }
        },
        {
        anchorId: 'requests',
        content: 'Aqui encontraras tus solicitudes pendientes.',
        title: 'Requests',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        }
      }, {
        anchorId: 'record',
        content: 'Aqui encontraras todas las personas con las que tienes un wink concretado.',
        title: 'Record',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        },
        // route: '/' + RoutesAPP.BASE + '/' + RoutesAPP.CONFIGURAR_PERFIL
      },
    ]
    );
    this.tourService.start();
    this.tourService.end$.subscribe(
      () => {
        tour.winks = false;
        StorageService.SetItem(tours, tour);
      }
    );
  }

  ngOnDestroy() {
    this.recordSubscription.unsubscribe();
    this.requestsSubscription.unsubscribe();
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

}
