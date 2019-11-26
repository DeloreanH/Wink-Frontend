import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from '../pages-routing.module';
import { TabsComponent } from './tabs.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    TabsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PagesRoutingModule,
  ],
  exports: [
  ],
  providers:  [
  ]
})
export class TabsModule { }
