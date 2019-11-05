import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { DistancePipe } from './pipes/distance.pipe';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { ItemListComponent } from './components/item-list/item-list.component';



@NgModule({
  declarations: [SpinnerComponent, ItemListComponent, DistancePipe],
  imports: [
    CommonModule,
    IonicModule,
    FontAwesomeModule,
    MatChipsModule,
    FormsModule
  ],
  exports: [SpinnerComponent, ItemListComponent, DistancePipe]
})
export class ToolsModule { }
