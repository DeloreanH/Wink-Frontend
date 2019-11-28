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
  ],
  declarations: [WinksPage, ItemWinkComponent]
})
export class WinksPageModule {}
