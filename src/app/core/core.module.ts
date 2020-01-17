import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Globalization } from '@ionic-native/globalization/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Network } from '@ionic-native/network/ngx';

import { AuthModule } from '../auth/auth.module';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { TabsModule } from '../pages/tabs/tabs.module';
import { LinkService } from './services/link.service';
import { LocationService } from './services/location.service';
import { ProfilesService } from './services/profiles.service';
import { SaveContactService } from './services/save-contact.service';
import { SocketService } from './services/socket.service';
import { StorageService } from './services/storage.service';
import { ToastService } from './services/toast.service';
import { UpdateAvatarService } from './services/update-avatar.service';
import { UserService } from './services/user.service';
import { WinkService } from './services/wink.service';
import { ToolsModule } from '../common/tools/tools.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToursService } from './services/tours.service';
import { LoaderService } from './services/loader.service';
import { IonicGestureConfig } from '../common/tools/IonicGestureConfig';
import { NetworkService } from './services/network.service';
import { BackgroundService } from './services/background.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatChipsModule,
    TabsModule,
    ToolsModule,
    TranslateModule.forChild(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    Diagnostic,
    Contacts,
    Globalization,
    Keyboard,
    Network,
    ScreenOrientation,
    LocalNotifications,
    BackgroundMode,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    // my providers
    LinkService,
    LocationService,
    ProfilesService,
    SaveContactService,
    SocketService,
    StorageService,
    ToastService,
    UpdateAvatarService,
    UserService,
    WinkService,
    ToursService,
    LoaderService,
    NetworkService,
    IonicGestureConfig,
    BackgroundService,
  ]
})
export class CoreModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
 }
