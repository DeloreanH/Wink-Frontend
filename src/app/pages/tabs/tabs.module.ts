import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';
import { IonicModule } from '@ionic/angular';
import { SocketService } from 'src/app/services/socket.service';


@NgModule({
  declarations: [
    TabsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule,
  ],
  exports: [
  ],
  providers:  [
    SocketService
  ]
})
export class TabsModule { }
