import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AlertService } from './alert.service';
import { AlertComponent } from './alert.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AlertComponent
  ],
  entryComponents: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  providers: [
    AlertService,
  ],
  exports: [
    AlertComponent,
  ]
})
export class AlertModule { }
