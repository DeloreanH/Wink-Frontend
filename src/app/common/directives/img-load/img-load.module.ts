import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgLoadDirective } from './img-load.directive';

@NgModule({
  declarations: [
    ImgLoadDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImgLoadDirective
  ]
})
export class ImgLoadModule { }
