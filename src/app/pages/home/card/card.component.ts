import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/common/models/user.model';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { Config } from 'src/app/common/enums/config.enum';
import { Photo } from 'src/app/common/class/photo.class';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() user: User;
  @Input() tour: boolean;
  avatar: string = Config.AVATAR;
  photo = new Photo();

  constructor() {
   }

  ngOnInit() {}

  ErrorImagen() {
    this.user.avatarUrl = this.avatar;
  }

  Avatar() {
    return this.photo.URLAvatar(this.user);
    // if (this.user && this.user.avatarUrl) {
    //   if (this.user.avatarUrl.startsWith('http')) {
    //     return this.user.avatarUrl;
    //   } else {
    //     return Routes.PHOTO + this.user.avatarUrl;
    //   }
    // } else {
    //   return this.avatar;
    // }
  }

}
