import { Component, OnInit } from '@angular/core';
import { WinkService } from 'src/app/services/wink.service';
import { Wink } from 'src/app/models/wink.model';

@Component({
  selector: 'app-winks',
  templateUrl: './winks.page.html',
  styleUrls: ['./winks.page.scss'],
})
export class WinksPage implements OnInit {

  tab = 'requests';
  requests: Wink[] = [];
  record: Wink[] = [];

  constructor(
    private winkService: WinkService,
  ) {
    this.Winks();
   }

  ngOnInit() {
  }

  TabChanged(event) {
    this.winkService.GetWinks();
    this.tab = event.target.value;

  }

  async Winks() {
    try {
      const response = await this.winkService.GetWinks();
      this.FilterWinks(response);
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
