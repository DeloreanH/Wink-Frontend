import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Wink } from 'src/app/common/models/wink.model';
import { WinkService } from 'src/app/core/services/wink.service';
import { AlertService } from 'src/app/common/alert/alert.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

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
    console.log(this.navParams);
  }

  async DelWink() {
    try {
      if (this.wink.approved) {
        this.alertService.showConfirm({
          title: 'WINK.DIALOGUES.TITLES.DELETE_WINK',
          description: 'WINK.DIALOGUES.MESSAGES.DELETE_WINK',
        }).subscribe(
          async (resp: any) => {
            if (resp && resp.value) {
              this.popoverController.dismiss();
              await this.winkService.DeleteWink(this.wink);
            }
          }
        );
      }
    } catch (err) {
      console.log('Error DelWInk', err.message);
    }
  }

}
