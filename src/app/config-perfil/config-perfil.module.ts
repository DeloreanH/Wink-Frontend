import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfigPerfilPage } from './config-perfil.page';

import { MatExpansionModule } from '@angular/material/expansion';


import {DragDropModule} from '@angular/cdk/drag-drop';
import { ItemPerfilComponent } from './item-perfil/item-perfil.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
  ],
  declarations: [ConfigPerfilPage, ItemPerfilComponent]
})
export class ConfigPerfilPageModule {}
