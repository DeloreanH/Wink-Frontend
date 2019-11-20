import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrivateProfilesPage } from './private-profiles.page';
import { ToolsModule } from 'src/app/tools/tools.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { ItemListComponent } from 'src/app/shared/components/item-list/item-list.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateProfilesPage
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
  declarations: [PrivateProfilesPage]
})
export class PrivateProfilesPageModule {}
