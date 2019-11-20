import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { AuthModule } from '../auth/auth.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
  ],
  providers: [
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
  ]
})
export class CoreModule { }
