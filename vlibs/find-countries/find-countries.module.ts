import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';

import { SLBasePageModule } from '@virtwoo/sl-base-page';
import { SlRouterModule } from '@virtwoo/sl-router';

import { FindCountriesComponent } from './find-countries.component';
import { FindCountriesService } from './find-countries.service';

@NgModule({
  declarations: [
    FindCountriesComponent
  ],
  imports: [
    CommonModule,
    SLBasePageModule,
    SlRouterModule,
    ScrollingModule,
    MatListModule
  ],
  entryComponents: [
    FindCountriesComponent
  ],
  exports: [
    FindCountriesComponent,
    ScrollingModule,
    MatListModule
  ],
  providers: [
    FindCountriesService
  ]
})
export class FindCountriesModule { }
