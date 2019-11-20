import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BasicDataPage } from './basic-data.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolsModule } from 'src/app/tools/tools.module';

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
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FontAwesomeModule,
    ToolsModule
  ],
  declarations: [BasicDataPage],
  providers: [],
  entryComponents: []
})
export class BasicDataPageModule {}
