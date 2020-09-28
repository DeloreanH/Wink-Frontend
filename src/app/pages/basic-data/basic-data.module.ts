import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BasicDataPage } from './basic-data.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ImgLoadModule } from 'src/app/common/directives';
import { AlertModule } from 'src/app/common/alert/alert.module';

const routes: Routes = [
  {
    path: '',
    component: BasicDataPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    ImgLoadModule,
    AlertModule,
  ],
  declarations: [BasicDataPage],
  providers: [],
  entryComponents: []
})
export class BasicDataPageModule {}
