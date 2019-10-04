import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule, routesApp } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VirtwooAuthModule, VirtwooAuthRoutes } from '@virtwoo/auth';
import { virtwooAuthEnvironment } from '../environments/environment';
import { SlRouterModule } from '@virtwoo/sl-router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule, FormsModule, } from '@angular/forms';



import {
  HttpClient,
  HttpClientModule,
  HttpClientJsonpModule
} from '@angular/common/http';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    VirtwooAuthModule.forRoot(virtwooAuthEnvironment),
    SlRouterModule.forRoot([
      ...VirtwooAuthRoutes,
      ...routesApp
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
