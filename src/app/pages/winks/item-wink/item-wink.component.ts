import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Wink } from 'src/app/common/models/wink.model';
import * as moment from 'moment';
import { Config } from 'src/app/common/enums/config.enum';
import { WinkService } from 'src/app/core/services/wink.service';
import { RoutesAPP } from 'src/app/common/enums/routes/routesApp.enum';
import { NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/common/alert/alert.service';
import { User } from 'src/app/common/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from 'src/app/common/class/photo.class';
import { MenuWinkComponent } from 'src/app/shared/components/menu-wink/menu-wink.component';

@Component({
  selector: 'item-wink',
  templateUrl: './item-wink.component.html',
  styleUrls: ['./item-wink.component.scss'],
})
export class ItemWinkComponent implements OnInit {
  @Input() wink: Wink;
  @Input() tour: boolean;
  @Output() removing: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() currentRemoving: boolean;
  @Input() remove: boolean;
  @Output() count: EventEmitter<number> = new EventEmitter<number>();

  initRemoving = false;

  avatar: string = Config.AVATAR;
  userWink: User;
  urlPublic: string = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;
  requestHttp = true;
  private load$ = new BehaviorSubject(false);
  load = this.load$.asObservable();
  photo = new Photo();


  constructor(
    private winkService: WinkService,
    private navController: NavController,
    private translateService: TranslateService,
    private alertService: AlertService,
    public popoverController: PopoverController,
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

  private async Remove() {
    await this.winkService.DeleteWink(this.wink);
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
              if (resp && resp.value) {
                this.Remove();
              }
            }
          );
        } else {
          this.Remove();
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
      if (this.wink && this.wink.approved && !this.tour && !this.currentRemoving) {
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
      if (this.wink && !this.wink.approved && !this.tour  && !this.currentRemoving) {
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
    return this.photo.URLAvatar(this.wink.user);
  }

  Open() {
  }

  Close() {
  }

  async ShowMenu(ev) {
    if (!await this.popoverController.getTop()) {
      const popover = await this.popoverController.create({
        component: MenuWinkComponent,
        componentProps: {
          wink: this.wink
        },
        event: ev,
        translucent: false
      });
      popover.onDidDismiss()
      .then((result) => {
        if (result.data  && result.data.del) {
          this.Removing();
        }
      });
      return await popover.present();
      }
    }

    SelectRemove(event) {
      if (this.currentRemoving) {
        this.initRemoving = !this.initRemoving;
        this.count.emit( this.initRemoving ? 1 : -1);
      }
    }

  RemoveList() {
    if (this.initRemoving) {
      this.Remove();
    }
  }

  Removing() {
    if (!this.currentRemoving)  {
      this.removing.emit(true);
      this.currentRemoving = true;
      this.initRemoving = true;
      this.count.emit(1);
    }
  }

}
