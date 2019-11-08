import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { User } from '../models/user.model';
import { Item } from '../models/item.model';
import { NameCategories } from '../config/enums/nameCaterogies.enum';
import { LinkService } from './link.service';
import { IndexItemType } from '../config/enums/indexItemType.emun';


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
    private linkService: LinkService
  ) {
   }


  async Create(items: any[], user: User) {
    try {
      // this.contact = this.contacts.create();
      // this.contact.name = new ContactName(null, user.lastName, user.firstName);
      console.log('Aqui llego Create()');
      const contact: Contact =  this.contacts.create();
      if (contact) {
        contact.name = new ContactName(null, 'Smith', 'John');
        contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
        contact.save().then(
          () => console.log('Contact saved!', contact),
          (error: any) => console.error('Error saving contact.', error)
        );
      }

      
      // console.log('Create contact', response);

      /*items.forEach(
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
              this.AddURL(this.newValue);
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
      }*/
    } catch (err) {
      console.log('Error Create Save-Contact', err);
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
    // this.contact.nickname = nickname.value;
  }

  private AddPhoto(photo) {
    // this.contact.photo = photo;
  }


}
