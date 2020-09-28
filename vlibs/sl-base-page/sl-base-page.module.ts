import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule  } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SlRouterModule } from '@virtwoo/sl-router';
import { SLBasePageComponent } from './sl-base-page.component';

@NgModule({
  declarations: [
    SLBasePageComponent
  ],
  imports: [
    CommonModule,
    SlRouterModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    SLBasePageComponent,
    SlRouterModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class SLBasePageModule { }
