import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { VirtwooAuthModule, VirtwooAuthRoutes } from '@virtwoo/auth';
import { virtwooAuthEnvironment } from 'src/environments/environment';
import { SlRouterModule } from '@virtwoo/sl-router';
import { routesApp, AppRoutingModule } from './app-routing.module';
import { IonicModule } from '@ionic/angular';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { IonicGestureConfig } from './common/tools/IonicGestureConfig';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    CoreModule,
    IonicModule.forRoot(
      {
        scrollAssist: false,
        scrollPadding: false,
      }
    ),
    AppRoutingModule,
    SharedModule.forRoot(),
    VirtwooAuthModule.forRoot(virtwooAuthEnvironment),
    SlRouterModule.forRoot([
      ...VirtwooAuthRoutes,
      ...routesApp,
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TourMatMenuModule.forRoot(),
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [
    // {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig},
    {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
