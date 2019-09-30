import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakePhotoComponent } from './take-photo.component';
import { TakePhotoService } from './services';

@NgModule({
  declarations: [
    TakePhotoComponent
  ],
  entryComponents: [
    TakePhotoComponent
  ],
  providers: [
    TakePhotoService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TakePhotoComponent
  ]
})
export class TakePhotoModule { }
