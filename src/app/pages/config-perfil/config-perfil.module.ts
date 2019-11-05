import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfigPerfilPage } from './config-perfil.page';

import { MatExpansionModule } from '@angular/material/expansion';


import {DragDropModule} from '@angular/cdk/drag-drop';
import { ItemPerfilComponent } from './item-perfil/item-perfil.component';


import {MatChipsModule} from '@angular/material/chips';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolsModule } from 'src/app/tools/tools.module';


const routes: Routes = [
  {
    path: '',
    component: ConfigPerfilPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    DragDropModule,
    FontAwesomeModule,
    MatChipsModule,
    ToolsModule
  ],
  declarations: [ConfigPerfilPage, ItemPerfilComponent]
})
export class ConfigPerfilPageModule {}
