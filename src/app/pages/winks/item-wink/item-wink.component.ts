import { Component, OnInit, Input } from '@angular/core';
import { Wink } from 'src/app/common/models/wink.model';
import * as moment from 'moment';
import { Config } from 'src/app/common/enums/config.enum';
import { WinkService } from 'src/app/core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'item-wink',
  templateUrl: './item-wink.component.html',
  styleUrls: ['./item-wink.component.scss'],
})
export class ItemWinkComponent implements OnInit {

  @Input() wink: Wink;
  avatar = Config.AVATAR;
  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;

  constructor(
    private winkService: WinkService,
    private navController: NavController,
  ) {
   }

  ngOnInit() {}

  async Accept() {
    try {
      await this.winkService.ApproveWink(this.wink);
      /*this.winkService.DeleteRequests(this.wink);
      this.wink.approved = true;
      this.wink.updatedAt = new Date().toString();
      this.winkService.AddRecord(this.wink);*/
    } catch (err) {
      console.log('Error Accept', err.message);
    }
  }

  async Ignore() {
    try {
      await this.winkService.DeleteWink(this.wink);
      // this.winkService.DeleteRequests(this.wink);
    } catch (err) {
      console.log('Error Ignore', err.message);
    }
  }

  Time(date: string) {
    if (!date) {
      return;
    }
    return moment(date).fromNow();
  }

  async GoPrivateProfileA() {
    try {
      if (this.wink && this.wink.approved) {
        await this.navController.navigateForward([this.urlPublic, this.wink._id, 1]);
      }
    } catch (err) {
      console.log('Error Go', err);
    }
  }
  async GoPrivateProfile() {
    try {
      if (this.wink && !this.wink.approved) {
        await this.navController.navigateForward([this.urlPublic, this.wink._id, 1]);
      }
    } catch (err) {
      console.log('Error Go', err);
    }
  }

}
