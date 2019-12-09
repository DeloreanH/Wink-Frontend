import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Wink } from 'src/app/common/models/wink.model';
import * as moment from 'moment';
import { Config } from 'src/app/common/enums/config.enum';
import { WinkService } from 'src/app/core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { NavController, IonItemSliding } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from 'src/app/common/enums/routes/routes.enum';
import { AlertService } from 'src/app/common/alert/alert.service';
import { User } from 'src/app/common/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'item-wink',
  templateUrl: './item-wink.component.html',
  styleUrls: ['./item-wink.component.scss'],
})
export class ItemWinkComponent implements OnInit {
  @ViewChild(IonItemSliding, {static: false}) itemSliding: IonItemSliding;
  @Input() wink: Wink;
  @Input() tour: boolean;

  avatar: string = Config.AVATAR;
  userWink: User;
  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  requestHttp = true;
  private load$ = new BehaviorSubject(false);
  load = this.load$.asObservable();

  constructor(
    private winkService: WinkService,
    private navController: NavController,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
   }

  ngOnInit() {
  }

  async Accept() {
    try {
      if (!this.tour) {
        this.load$.next(true);
        await this.winkService.ApproveWink(this.wink);
      }
    } catch (err) {
      console.log('Error Accept', err.message);
    } finally {
      this.load$.next(false);
    }
  }

  async Ignore() {
    try {
      if (!this.tour) {
        this.load$.next(true);
        if (this.wink.approved) {
          this.alertService.showConfirm({
            title: 'WINK.DIALOGUES.TITLES.DELETE_WINK',
            description: 'WINK.DIALOGUES.MESSAGES.DELETE_WINK',
          }).subscribe(
            async (resp: any) => {
              if (resp.value) {
                await this.winkService.DeleteWink(this.wink);
                this.Close();
              }
            }
          );
        } else {
          await this.winkService.DeleteWink(this.wink);
        }
      }
    } catch (err) {
      console.log('Error Ignore', err.message);
    } finally {
      this.load$.next(false);
    }
  }

  Time(date: string) {
    if (!date) {
      return;
    }
    moment.locale(this.translateService.currentLang);
    return moment(date).fromNow();
  }

  async GoPrivateProfileA() {
    try {
      if (this.wink && this.wink.approved && !this.tour) {
        setTimeout(
          async () => {
            await this.navController.navigateForward([this.urlPublic, this.wink._id, 1]);
            this.Close();
          }
          , 500);
      }
    } catch (err) {
      console.log('Error Go', err);
    }
  }

  async GoPrivateProfile() {
    try {
      if (this.wink && !this.wink.approved && !this.tour) {
        setTimeout(
          async () => {
            await this.navController.navigateForward([this.urlPublic, this.wink._id, 1]);
          }
          , 500);
      }
    } catch (err) {
      console.log('Error Go', err);
    }
  }

  ErrorImagen() {
    this.wink.user.avatarUrl = this.avatar;
  }

  Avatar() {
    if (this.wink.user) {
      if (this.wink.user.avatarUrl.startsWith('http')) {
        return this.wink.user.avatarUrl;
      } else {
        return Routes.PHOTO + this.wink.user.avatarUrl;
      }
    } else {
      return this.avatar;
    }
  }

  Open() {
    if (this.wink.approved) {
      this.itemSliding.open('start');
    }
  }

  Close() {
    if (this.wink.approved) {
      this.itemSliding.close();
    }
  }

}
