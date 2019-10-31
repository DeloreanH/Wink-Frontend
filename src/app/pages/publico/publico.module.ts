import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicoPage } from './publico.page';
import { DatosComponent } from './datos/datos.component';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemListComponent } from './item-list/item-list.component';
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
    IonicSwipeAllModule,
    FontAwesomeModule,
    MatChipsModule
  ],
  entryComponents: [DatosComponent],
  declarations: [PublicoPage, DatosComponent, ItemListComponent],
  providers: [
  ],
})
export class PublicoPageModule {}
