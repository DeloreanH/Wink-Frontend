import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform, NavController } from '@ionic/angular';
import { WinkService } from './wink.service';
import { Wink } from 'src/app/common/models/wink.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  private notificationSubs: Subscription;

  constructor(
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private winkService: WinkService,
    private translateService: TranslateService,
    private navController: NavController,
  ) { }

  async Permission() {
    if (this.platform.is('cordova') && this.platform.is('ios')) {
      const permission = await this.localNotifications.hasPermission();
      if (!permission) {
        this.NotificationPermission();
      }
    }
  }

  private async NotificationPermission() {
    try {
      if (this.platform.is('cordova')) {
        const permission = await this.localNotifications.requestPermission();
        console.log('NotificationPermission', permission);
      }
    } catch (error) {
    }
  }

  async NewRequest(wink: Wink) {
    if (this.platform.is('cordova')) {
      const user = await this.winkService.GetUserWink(wink);
      this.localNotifications.schedule({
        id: 1,
        title: this.translateService.instant('WINK.NOTIFICATION.TITLE.NEW'),
        text: this.translateService.instant('WINK.NOTIFICATION.MESSAGE.NEW', {userName: user.firstName}),
        icon: '/assets/icon/wink.svg'
      });
      this.Listen();
    }
    
  }

  async NewRequests(size: number) {
    if (this.platform.is('cordova')) {
      this.localNotifications.schedule({
        id: 1,
        title: this.translateService.instant('WINK.NOTIFICATION.TITLE.MULTIPLE'),
        text: this.translateService.instant('WINK.NOTIFICATION.MESSAGE.MULTIPLE', {count: size}),
        icon: '/assets/icon/wink.svg'
      });
      this.Listen();
    }
  }

  Listen() {
    if (this.platform.is('cordova')) { 
      this.notificationSubs = this.localNotifications.on('click').subscribe( event => {
        this.goToWinks();
        this.notificationSubs.unsubscribe();
      });
    }
  }

  private async goToWinks() {
    await this.navController.navigateForward(
      ['/' + RoutesAPP.BASE + '/' + RoutesAPP.WINKS, true]
    );
  }

  async CloseAll() {
    try {
      if (this.platform.is('cordova')) {
        await this.localNotifications.clearAll();
      }
    } catch (error) {
      console.log('CloseAll', error);
    }
  }
}
