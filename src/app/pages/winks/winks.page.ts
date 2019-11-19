import { Component, OnInit, OnDestroy } from '@angular/core';
import { WinkService } from 'src/app/services/wink.service';
import { Wink } from 'src/app/models/wink.model';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';
import { Config } from 'src/app/config/enums/config.enum';

@Component({
  selector: 'app-winks',
  templateUrl: './winks.page.html',
  styleUrls: ['./winks.page.scss'],
})
export class WinksPage implements OnInit, OnDestroy {

  tab = 'requests';
  requests: Wink[] = [];
  requestsSubscription = new Subscription();
  record: Wink[] = [];
  recordSubscription = new Subscription();
  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  noHistorical = Config.NO_HISTORICAL;
  noRequests = Config.NO_REQUESTS;

  constructor(
    private winkService: WinkService,
  ) {
    this.Winks();
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

  ngOnDestroy() {
    this.recordSubscription.unsubscribe();
    this.requestsSubscription.unsubscribe();
  }

  TabChanged(event) {
    // this.winkService.GetWinks();
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
