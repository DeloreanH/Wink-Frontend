import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistancePipe } from './pipes/distance.pipe';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { NamesPipe } from './pipes/names.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';



@NgModule({
  declarations: [DistancePipe, NamesPipe, TruncatePipe],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    MatChipsModule,
    FormsModule
  ],
  exports: [SpinnerComponent, ItemListComponent, DistancePipe, NamesPipe, TruncatePipe]
})
export class ToolsModule { }
