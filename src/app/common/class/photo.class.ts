import { User } from '../models/user.model';
import { Routes } from '../enums/routes/routes.enum';
import { Config } from '../enums/config.enum';

export class Photo {

  URLAvatar(user: User): string {
    if (user && user.avatarUrl) {
      if (user.avatarUrl.startsWith('http')) {
        return user.avatarUrl;
      } else {
        return Routes.PHOTO + user.avatarUrl;
      }
    } else {
      return Config.AVATAR;
    }
  }
}
