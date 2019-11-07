import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { NameCategories } from '../config/enums/nameCaterogies.enum';
import { LinkService } from './link.service';


@Injectable({
  providedIn: 'root'
})
export class SaveContactService {

  contact: Contact;
  phoneNumbers: ContactField[] = [];
  emails: ContactField[] = [];
  urls: ContactField[] = [];
  ims: ContactField[] = [];
  categories: ContactField[] = [];
  ready = false;

  constructor(
    private contacts: Contacts,
    private linkService: LinkService
  ) {
    this.contact = this.contacts.create();
   }


  async Create(items: any[], user: User) {
    try {
      this.contact.name = new ContactName(null, user.lastName, user.firstName);
      items.forEach(
        (value: any, index) => {
          switch (value.itemType.category) {
            case NameCategories.MESSENGER:
              this.AddIM(value);
              break;
            case NameCategories.SOCIAL_NETWORKS:
              value.item.value = this.linkService.SocialNetwork(value.item.itemType, value.item.value, true);
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
                  value.item.value = value.item.value + ' ' + value.item.custom;
                  this.AddCategory(value);
                  break;
                case 3:
                  this.AddURL(value);
                  break;
                case 4:
                  value.itemType.options.forEach( (option) => {
                    if (option._id === value.item.value) {
                      value.item.value = option.name;
                      this.AddCategory(value);
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
                  value.item.value = value.item.value.replace(',', ' ');
                  this.AddCategory(value);
                  break;
              }
              break;
          }
          if (index === items.length - 1) {
            this.ready = true;
          }
        }
      );
      if (this.ready) {
        this.contact.phoneNumbers = this.phoneNumbers;
        this.contact.emails = this.emails;
        this.contact.urls = this.urls;
        this.contact.ims = this.ims;
        this.contact.categories = this.categories;
        const response = await this.contact.save();
      }
    } catch (err) {
      console.log('Error Create Save-Contact');
    }
  }

  private AddPhoneNumber(numberPhone: any) {
    this.phoneNumbers.push(new ContactField(numberPhone.itemtype, numberPhone.value, false));
  }

  private AddIM(im: any) {
    this.ims.push(new ContactField(im.item.itemtype, im.item.value, false));
  }

  private AddURL(url: any) {
    this.urls.push(new ContactField(url.item.itemtype, url.item.value, false));
  }

  private AddEmail(email: any) {
    this.emails.push(new ContactField(email.item.itemtype, email.item.value, false));
  }

  private AddCategory(categorie: any, custom?: boolean) {
    if (custom) {
      this.categories.push(new ContactField(categorie.item.value, categorie.item.cutom, false));
    } else {
      this.categories.push(new ContactField(categorie.item.itemtype, categorie.item.value, false));
    }
  }

  private AddNickname(nickname: any) {
    this.contact.nickname = nickname.value;
  }

  private AddPhoto(photo) {
    this.contact.photo = photo;
  }


}
