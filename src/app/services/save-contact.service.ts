import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { NameCategories } from '../config/enums/nameCaterogies.enum';
import { LinkService } from './link.service';
import { IndexItemType } from '../config/enums/indexItemType.emun';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class SaveContactService {

  // private contact: Contact;
  private phoneNumbers: ContactField[] = [];
  private emails: ContactField[] = [];
  private urls: ContactField[] = [];
  private ims: ContactField[] = [];
  private categories: ContactField[] = [];
  private ready = false;
  private newValue;

  constructor(
    private contacts: Contacts,
    private linkService: LinkService,
    private platform: Platform
  ) {
   }


  async Create(items: any[], user: User, photo?: boolean) {
    try {
      this.LoadItems(items);
      console.log('items', items);
      // this.contact = this.contacts.create();
      // this.contact.name = new ContactName(null, user.lastName, user.firstName);
      // console.log('Create contact', response);

      if (this.ready) {
        console.log('Aqui llego Create()');
        const contact: Contact =  this.contacts.create();
        if (contact) {
          contact.name = new ContactName(null, user.lastName, user.firstName);
          // contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
          if (this.phoneNumbers.length > 0) {
            contact.phoneNumbers = this.phoneNumbers;
          }
          if (this.emails.length > 0) {
            contact.emails = this.emails;
          }
          if (this.urls.length > 0) {
            contact.urls = this.urls;
          }
          if (this.ims.length > 0) {
            contact.ims = this.ims;
          }
          if (this.categories.length > 0) {
            contact.categories = this.categories;
          }
          contact.save().then(
            () => console.log('Contact saved!', contact),
            (error: any) => console.error('Error saving contact.', error)
          );
        }
      }
    } catch (err) {
      console.log('Error Create Save-Contact', err);
    }
  }

  LoadItems(items) {
    items.forEach(
      (value: any, index) => {
        switch (value.itemType.category) {
          case NameCategories.MESSENGER:
            if (value.itemType.index === IndexItemType.TELEFONO) {
              this.AddPhoneNumber(value);
            } else {
              this.AddIM(value);
            }
            break;
          case NameCategories.SOCIAL_NETWORKS:
            this.newValue = Object.assign({}, value);
            this.newValue.item.value = this.linkService.SocialNetwork(value.itemType.name, value.item.value, true);
            this.AddURL(value);
            break;
          default:
            switch (value.itemType.index) {
              case 0:
                this.AddCategory(value);
                break;
              case 1:
                this.AddEmail(value);
                break;
              case 2:
                this.newValue = Object.assign({}, value);
                this.newValue.item.value = value.item.value + ' ' + value.item.custom;
                this.AddCategory(this.newValue);
                break;
              case 3:
                this.AddURL(value);
                break;
              case 4:
                this.newValue = Object.assign({}, value);
                value.itemType.options.forEach( (option) => {
                  if (option._id === value.item.value) {
                    this.newValue.item.value = option.name;
                    this.AddCategory(this.newValue);
                  }
                });
                break;
              case 5:
                break;
              case 6:
                this.AddPhoneNumber(value);
                break;
              case 7:
                this.AddCategory(value, true);
                break;
              case 8:
                this.newValue = Object.assign({}, value);
                this.newValue.item.value = value.item.value.replace(',', ' ');
                this.AddCategory(value);
                break;
            }
            break;
        }
        if (index === items.length - 1) {
          console.log('llegooo');
          this.ready = true;
        }
      }
    );

  }

  private AddPhoneNumber(numberPhone: any) {
    this.phoneNumbers.push(new ContactField(numberPhone.item.itemtype, numberPhone.item.value));
  }

  private AddIM(im: any) {
    this.ims.push(new ContactField(im.item.itemtype, im.item.value));
  }

  private AddURL(url: any) {
    this.urls.push(new ContactField(url.item.itemtype, url.item.value));
  }

  private AddEmail(email: any) {
    this.emails.push(new ContactField(email.item.itemtype, email.item.value));
  }

  private AddCategory(categorie: any, custom?: boolean) {
    if (custom) {
      this.categories.push(new ContactField(categorie.item.value, categorie.item.cutom));
    } else {
      this.categories.push(new ContactField(categorie.item.itemtype, categorie.item.value));
    }
  }

  private AddNickname(nickname: any) {
    // this.contact.nickname = nickname.value;
  }

  private AddPhoto(photo) {
    // this.contact.photo = photo;
  }


}
