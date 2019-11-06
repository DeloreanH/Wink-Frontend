import { Component, OnInit, OnDestroy } from '@angular/core';
import { WinkService } from 'src/app/services/wink.service';
import { Wink } from 'src/app/models/wink.model';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';

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
      const response = await this.winkService.GetWinks();

      // this.FilterWinks(response);
    } catch (err) {

    }
  }

  FilterWinks(winks: Wink[]) {
    console.log('winks', winks);
    winks.forEach(
      (wink: Wink) => {
        wink.user = wink.user[0];
        if (wink.approved) {
          this.record.push(wink);
          console.log('this.record', this.record);
        } else if (wink.sender_id === wink.user._id) {
          this.requests.push(wink);
          console.log('this.requests', this.requests);
        }
      }
    );
  }

}
