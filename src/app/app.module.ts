import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
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

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {MatChipsModule} from '@angular/material/chips';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

// create a class that overrides hammer default config

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL } // override default settings
  } as any;
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
    FontAwesomeModule,
    MatChipsModule,
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
    Camera,
    Geolocation,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
