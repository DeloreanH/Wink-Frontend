import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WinksPage } from './winks.page';
import { ItemWinkComponent } from './item-wink/item-wink.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TourNgxPopperModule } from 'ngx-tour-ngx-popper';
import { ImgLoadModule } from 'src/app/common/directives';
import { AlertModule } from 'src/app/common/alert/alert.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuWinkComponent } from 'src/app/shared/components/menu-wink/menu-wink.component';
import { ItemRequestComponent } from './item-request/item-request.component';
import { LongPressModule } from 'ionic-long-press';


const routes: Routes = [
  {
    path: '',
    component: WinksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    TranslateModule.forChild(),
    TourNgxPopperModule.forRoot(),
    ImgLoadModule,
    AlertModule,
    SharedModule,
    LongPressModule,
  ],
  entryComponents: [MenuWinkComponent],
  declarations: [WinksPage, ItemWinkComponent, ItemRequestComponent]
})
export class WinksPageModule {}
