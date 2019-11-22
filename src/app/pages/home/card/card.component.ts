import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/common/models/user.model';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { Config } from 'src/app/common/enums/config.enum';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() user: User;
  avatar: string = Config.AVATAR;

  constructor() {
   }

  ngOnInit() {}

  ErrorImagen() {
    this.user.avatarUrl = this.avatar;
  }

  Avatar() {
    let avatar;
    if (this.user) {
      if (this.user.avatarUrl.startsWith('http')) {
        avatar = this.user.avatarUrl;
      } else {
        avatar = Routes.PHOTO + this.user.avatarUrl;
      }
    } else {
      avatar = this.avatar;
    }
    return avatar;
  }


}
