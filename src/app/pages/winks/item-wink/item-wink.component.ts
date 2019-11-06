import { Component, OnInit, Input } from '@angular/core';
import { Wink } from 'src/app/models/wink.model';
import * as moment from 'moment';
import { Config } from 'src/app/config/enums/config.enum';
import { WinkService } from 'src/app/services/wink.service';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';

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
  ) {
   }

  ngOnInit() {}

  async Accept() {
    try {
      const response = await this.winkService.ApproveWink(this.wink);
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
      const response = await this.winkService.DeleteWink(this.wink);
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

}
