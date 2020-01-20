import { Component, OnInit } from '@angular/core';
import { Wink } from 'src/app/common/models/wink.model';
import { NavParams, PopoverController } from '@ionic/angular';
import { WinkService } from 'src/app/core/services/wink.service';
import { AlertService } from 'src/app/common/alert/alert.service';

@Component({
  selector: 'app-menu-wink',
  templateUrl: './menu-wink.component.html',
  styleUrls: ['./menu-wink.component.scss'],
})
export class MenuWinkComponent implements OnInit {

  wink: Wink;
  constructor(
    public navParams: NavParams,
    private winkService: WinkService,
    private alertService: AlertService,
    public popoverController: PopoverController,
  ) {
    this.wink = this.navParams.data.wink;
  }

  ngOnInit() {
  }

  async DelWink() {
    try {
      this.popoverController.dismiss(
        {
          del: true
        }
      );
    } catch (err) {
      console.log('Error DelWInk', err.message);
    }
  }

}
