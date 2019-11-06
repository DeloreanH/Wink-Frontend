import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { PublicoPage } from './publico.page';

import { ItemListComponent } from 'src/app/tools/components/item-list/item-list.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
  {
    path: '',
    component: PublicoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ToolsModule,
    FontAwesomeModule,
    MatChipsModule
  ],
  entryComponents: [ItemListComponent],
  declarations: [PublicoPage],
  providers: [],
})
export class PublicoPageModule {}
