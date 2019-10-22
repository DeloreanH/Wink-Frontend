import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PerfilPage } from './perfil.page';
import { ChooseImageModule } from 'vlibs/choose-image/choose-image.module';
import { ChooseImageService } from 'vlibs/choose-image/choose-image.service';
import { ChooseImageComponent } from 'vlibs/choose-image/choose-image.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebView } from '@ionic-native/ionic-webview/ngx';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ChooseImageModule,
    FontAwesomeModule
  ],
  declarations: [PerfilPage],
  providers: [ChooseImageService, WebView],
  entryComponents: [ChooseImageComponent]
})
export class PerfilPageModule {}
