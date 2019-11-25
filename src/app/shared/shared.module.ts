import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './components/item-list/item-list.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

import { DistancePipe } from './pipes/distance.pipe';
import { NamesPipe } from './pipes/names.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({

  declarations: [
  ItemListComponent,
  // pipes
  DistancePipe,
  NamesPipe,
  TruncatePipe
],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    MatChipsModule,
    FormsModule,
    TranslateModule.forChild(),
  ],
  exports: [
    ItemListComponent,

    // pipes
    DistancePipe,
    NamesPipe,
    TruncatePipe,
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
 }
