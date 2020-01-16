import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ToastService, PositionToast } from './toast.service';

@Injectable()
export class NetworkService {
  private online: Observable<boolean> =  new Observable();

  constructor(
    public network: Network,
    public platform: Platform,
    private toastService: ToastService,
    ) {
    if (this.platform.is('cordova')) {
      // on Device
      this.online = merge(
        this.network.onConnect().pipe(mapTo(true)),
        this.network.onDisconnect().pipe(mapTo(false))
      );
    } else {
      // on Browser
      this.online = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );
    }
    this.NetworkDownMessage();
  }

    public getNetworkType(): string {
      return this.network.type;
    }

    public getNetworkStatus(): Observable<boolean> {
      return this.online;
    }

    private NetworkDownMessage() {
      this.getNetworkStatus().subscribe(
        (status) => {
          if (!status) {
            if (this.platform.is('cordova')) {
              this.toastService.Toast('Sin internet.', null, null, PositionToast.BOTTOM, null, 'danger');
            } else {
              window.alert('Sin internet');
            }
          } else {
            if (this.platform.is('cordova')) {
              this.toastService.Toast('Reconectando', null, null, PositionToast.BOTTOM, null, 'primary');
            } else {
              window.alert('Reconectando');
            }
          }
        }
      );
    }
}
