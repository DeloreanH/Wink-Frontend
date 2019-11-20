import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { PublicProfilePage } from './public-profile.page';

import { ToolsModule } from 'src/app/tools/tools.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { ItemListComponent } from 'src/app/shared/components/item-list/item-list.component';

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
    RouterModule.forChild(routes),
    ToolsModule,
    FontAwesomeModule,
    MatChipsModule
  ],
  entryComponents: [ItemListComponent],
  declarations: [PublicProfilePage],
  providers: [],
})
export class PublicProfilePageModule {}
