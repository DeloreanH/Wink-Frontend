import { Component, OnInit, Input } from '@angular/core';
import { Wink } from 'src/app/models/wink.model';
import { User } from 'src/app/models/user.model';
import * as moment from 'moment';
import { Config } from 'src/app/config/enums/config.enum';

@Component({
  selector: 'item-wink',
  templateUrl: './item-wink.component.html',
  styleUrls: ['./item-wink.component.scss'],
})
export class ItemWinkComponent implements OnInit {

  @Input() wink: Wink;
  avatar = Config.AVATAR;

  constructor() {
   }

  ngOnInit() {}

  Accept() {
    this.wink.approved = true;
    this.wink.user.firstName

  }

  Ignore() {
  }

  Time(date: string) {
    if (!date) {
      return;
    }
    return moment(date).fromNow();
  }

}
