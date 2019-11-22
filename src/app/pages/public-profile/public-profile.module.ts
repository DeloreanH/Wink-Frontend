import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { PublicProfilePage } from './public-profile.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { ItemListComponent } from 'src/app/shared/components/item-list/item-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PublicProfilePage
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
    MatChipsModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [ItemListComponent],
  declarations: [PublicProfilePage],
  providers: [],
})
export class PublicProfilePageModule {}
