import { Injectable } from '@angular/core';
import { Tours } from 'src/app/common/interfaces/tours.interface';
import { StorageService } from './storage.service';
import { tours } from 'src/app/common/constants/storage.constants';
import { PagesName } from 'src/app/common/enums/pagesName.enum';
import { TranslateService } from '@ngx-translate/core';
import { Buttons } from 'src/app/common/enums/buttons.enum';
import { MessageTour } from 'src/app/common/enums/messageTour.enum';
import { User } from 'src/app/common/models/user.model';
import { Wink } from 'src/app/common/models/wink.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToursService {

  tour = false;
  tourChanged = new Subject<boolean>();
  tourStorage: Tours;
  tourHome = [];
  tourWinks = [];
  tourSettings = [];

  userTour = new User({
    autosave: true,
    avatarUrl: '/public/uploads/avatar/4d42cdf3-f40d-4917-ba5b-4643136bcdbd.jpg',
    birthday: '2008-11-06T16:33:06.088Z',
    email: 'john@doe.com',
    firstName: 'John',
    gender: 'male',
    lastName: 'Doe',
    location: {type: 'Point', coordinates: [-63.2033696, 9.8001396], latitude: 9.8000937, longitude: -63.2033488},
    phone: {phoneCode: 424, phoneNumber: 5529897},
    status: 'De paseo',
    username: 'johndoe123',
    visibility: 'all',
    __v: 0,
    _id: '5dbc6ce7c6245c02c02c29c2',
  });
  winkRecordTour = new Wink({
    approved: true,
    createdAt: '2019-11-14T19:40:17.696Z',
    receiverVisibility: 'all',
    receiver_id: '5dbc6ce7c6245c02c02c29c2',
    senderVisibility: 'all',
    sender_id: '5dcda960e1bf3c08a4cba88c',
    updatedAt: '2019-11-26T20:25:22.010Z',
    user: this.userTour,
    __v: 0,
    _id: '5dcdada1f0ce941a0073b823',
  });
  winkRequestsTour = new Wink({
    approved: false,
    createdAt: '2019-11-14T19:40:17.696Z',
    receiverVisibility: 'all',
    receiver_id: '5dbc6ce7c6245c02c02c29c2',
    senderVisibility: 'all',
    sender_id: '5dcda960e1bf3c08a4cba88c',
    updatedAt: '2019-11-26T20:25:22.010Z',
    user: this.userTour,
    __v: 0,
    _id: '5dcdada1f0ce941a0073b823',
  });

  constructor(
    private translateService: TranslateService
  ) {
    this.LoaSettings();
   }


  LoaSettings() {
    this.tourHome = [{
      anchorId: 'status',
      content: this.translateService.instant(MessageTour.HOME_STATUS),
      placement: 'bottom-end',
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      }
    }, {
      anchorId: 'see_status',
      content: this.translateService.instant(MessageTour.HOME_SEE_STATUS),
      placement: 'top',
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      }
    }, {
      anchorId: 'card',
      content: this.translateService.instant(MessageTour.HOME_CARD),
      placement: 'bottom-end',
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      },
    }, {
      anchorId: 'profiles',
      content: this.translateService.instant(MessageTour.HOME_PROFILES),
      placement: 'right-end',
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      },
    },
    ];
    this.tourWinks = [
      {
        anchorId: 'intro',
        content: this.translateService.instant(MessageTour.WINKS_INTRODUCTION),
        placement : 'bottom',
        prevBtnTitle: this.translateService.instant(Buttons.PREV),
        nextBtnTitle: this.translateService.instant(Buttons.NEXT),
        endBtnTitle: this.translateService.instant(Buttons.END),
        popperSettings: {
          closeOnClickOutside: false,
        }
      },
      {
      anchorId: 'requests',
      content: this.translateService.instant(MessageTour.WINKS_REQUESTS),
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      }
    }, {
      anchorId: 'wink',
      content: this.translateService.instant(MessageTour.WINKS_WINK),
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      }
    }, {
      anchorId: 'record',
      content: this.translateService.instant(MessageTour.WINKS_RECORD),
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      },
    }, {
      anchorId: 'delete',
      content: this.translateService.instant(MessageTour.WINKS_DELETE),
      prevBtnTitle: this.translateService.instant(Buttons.PREV),
      nextBtnTitle: this.translateService.instant(Buttons.NEXT),
      endBtnTitle: this.translateService.instant(Buttons.END),
      popperSettings: {
        closeOnClickOutside: false,
      },
    },
    ];
  }

  ValidateTour(pageName: PagesName) {
    const tourStorage = StorageService.GetItem(tours, true);
    console.log(tourStorage, pageName);
    let validate = false;
    if (tourStorage) {
      if (tourStorage[pageName]) {
        this.Tour(true);
        validate = true;
      } else {
        this.Tour(false);
      }
    } else {
      StorageService.SetItem(tours, {
        home: true,
        settings: true,
        winks: true
      });
      this.Tour(true);
      validate = true;
    }
    return validate;
  }

  EndTour(pageName: PagesName) {
    const tourStorage = StorageService.GetItem(tours, true);
    if (tourStorage[pageName]) {
      this.Tour(false);
      tourStorage[pageName] = false;
      StorageService.SetItem(tours, tourStorage);
    }
  }

  private Tour(tour: boolean) {
    this.tour = tour;
    this.tourChanged.next(tour);
  }
}
