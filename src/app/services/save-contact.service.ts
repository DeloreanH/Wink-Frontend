import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { NameCategories } from '../config/enums/nameCaterogies.enum';
import { LinkService } from './link.service';
import { IndexItemType } from '../config/enums/indexItemType.emun';
import { Platform, ToastController } from '@ionic/angular';
import { Config } from '../config/enums/config.enum';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class SaveContactService {

  // private contact: Contact;
  private phoneNumbers: ContactField[] = [];
  private emails: ContactField[] = [];
  private urls: ContactField[] = [];
  private ims: ContactField[] = [];
  private ready = false;
  private birthday;
  private nickname;
  private address;

  constructor(
    private contacts: Contacts,
    private linkService: LinkService,
    private platform: Platform,
    private toastService: ToastService
  ) {
   }


  async Create(items: any[], user: User, photo?: boolean) {
    try {
      const response: any = await this.LoadItems(items);
      if (response) {
        const contact: Contact =  this.contacts.create();
        if (contact) {
          contact.name = new ContactName(null, user.lastName, user.firstName);
          if (photo && user.avatarUrl) {
            contact.photos = [new ContactField(Config.IMAGE_JPEG, user.avatarUrl, true)];
          }
          contact.urls = this.urls;
          contact.phoneNumbers = this.phoneNumbers;
          contact.emails = this.emails;
          contact.ims = this.ims;
          if (this.address) {
            contact.addresses = [
              {
                pref: true,
                streetAddress: this.address,
              },
            ];
          }
          contact.nickname = this.nickname;
          if (this.birthday) {
            contact.birthday = new Date(this.birthday);
          }
          contact.save().then(
            () => {
              this.toastService.Toast('Contact saved!');
              this.Clear();
            },
            (err: any) => {
              this.toastService.Toast('Error saving contact.');
              console.error('Error saving contact.', err);
              this.Clear();
            }
          );
        }
      }
    } catch (err) {
      this.toastService.Toast('Error saving contact.');
      console.log('Error Create Save-Contact', err);
    }
  }

  private Clear() {
    this.phoneNumbers = [];
    this.ims = [];
    this.emails = [];
    this.urls = [];
  }

  async LoadItems(items) {
    let ready = false;
    items.forEach(
      async (value: any, index) => {
        switch (value.itemType.category) {
          case NameCategories.MESSENGER:
            if (value.itemType.index === IndexItemType.TELEFONO) {
              this.AddPhoneNumber(value);
            } else {
              this.AddIM(value);
            }
            break;
          case NameCategories.SOCIAL_NETWORKS:
            let newValue = Object.assign({}, value);
            const url: any = this.linkService.SocialNetwork(newValue.itemType.name, newValue.item.value, true);
            if (url) {
              newValue.item.value = url;
              this.AddURL(newValue);
            }
            break;
          case NameCategories.CONTACT:
            switch (value.itemType.index) {
              case 1:
                this.AddEmail(value);
                break;
              case 3:
                this.AddURL(value);
                break;
              case 6:
                this.AddPhoneNumber(value);
                break;
            }
            break;
          case NameCategories.PERSONAL:
            switch (value.itemType.name) {
              case Config.BIRTHDAY:
                this.birthday = value.item.value;
                break;
              case Config.NICKNAME:
                this.nickname = value.item.value;
                break;
              case Config.ADDRESS:
                this.address = value.item.value;
                break;
            }
            break;
        }
        if (index === items.length - 1) {
          ready = true;
        }
      }
    );
    if (ready) {
      return true;
    }

  }

  private AddPhoneNumber(numberPhone: any) {
    this.phoneNumbers.push(new ContactField(numberPhone.item.itemtype, numberPhone.item.value));
  }

  private AddIM(im: any) {
    this.ims.push(new ContactField(im.item.itemtype, im.item.value));
  }

  private AddURL(url: any, red?: boolean) {
    console.log('AddURL', url, url.item.value);
    if (red) {
      this.urls.push(new ContactField(url.item.itemtype, url.item.custom));
    } else {
      this.urls.push(new ContactField(url.item.itemtype, url.item.value));
    }
  }

  private AddEmail(email: any) {
    this.emails.push(new ContactField(email.item.itemtype, email.item.value));
  }

}
