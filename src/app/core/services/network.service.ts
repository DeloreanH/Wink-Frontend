import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ToastService, PositionToast } from './toast.service';
import { StorageService } from './storage.service';
import { networkStorage } from 'src/app/common/constants/storage.constants';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from './socket.service';

@Injectable()
export class NetworkService {
  private online: Observable<boolean> =  new Observable();
  private statusNetwork = true;

  constructor(
    public network: Network,
    public platform: Platform,
    private toastService: ToastService,
    private translateService: TranslateService,
    private socketService: SocketService,
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
          console.log('status', status);
          this.statusNetwork = status;
          const networkLocal = StorageService.GetItem(networkStorage, true);
          console.log('networkLocal', networkLocal);
          if (!status && networkLocal) {
            this.socketService.Disconnect();
            if (this.platform.is('cordova')) {
              this.toastService.Toast('WINK.NOTIFICATION.MESSAGE.NETWORK_DOWN', null, null, PositionToast.BOTTOM, null, 'danger');
            } else {
              window.alert(this.translateService.instant('WINK.NOTIFICATION.MESSAGE.NETWORK_DOWN'));
            }
            StorageService.SetItem(networkStorage, status);
          } else if (status && !networkLocal) {
            if (networkLocal === false) {
              this.socketService.Connect();
              if (this.platform.is('cordova')) {
                this.toastService.Toast('WINK.NOTIFICATION.MESSAGE.NETWORK_UP', null, null, PositionToast.BOTTOM, null, 'success');
              } else {
                window.alert(this.translateService.instant('WINK.NOTIFICATION.MESSAGE.NETWORK_UP'));
              }
            }
            StorageService.SetItem(networkStorage, status);
          }
        }
      );
    }

    public get StatusNetwork(): boolean {
      return this.statusNetwork;
    }
}
