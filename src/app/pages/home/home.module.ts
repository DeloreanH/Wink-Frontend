import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { CardComponent } from './card/card.component';
import { SharedModule } from '../..//shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TourNgxPopperModule, TourStepTemplateComponent } from 'ngx-tour-ngx-popper';
import { ImgLoadModule } from '../..//common/directives';
import { AlertModule } from '../../common/alert/alert.module';
import { AlertComponent } from '../../common/alert/alert.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    TranslateModule.forChild(),
    TourNgxPopperModule.forRoot(),
    ImgLoadModule,
    AlertModule,
  ],
  entryComponents: [
    CardComponent,
    AlertComponent,
    TourStepTemplateComponent,
  ],
  declarations: [
    HomePage,
    CardComponent
  ]
})
export class HomePageModule {}
