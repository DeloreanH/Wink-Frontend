import { Injectable } from '@angular/core';
import { Category } from '../../common/models/category.model';
import { ItemType } from '../../common/models/itemType.model';
import { Section } from '../../common/models/section.model';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../../common/enums/routes/routes.enum';
import { AuthService } from '../../auth/services/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Item } from '../../common/models/item.model';
import { UserService } from './user.service';
import { ToastService } from './toast.service';
import { MessagesServices } from 'src/app/common/enums/messagesServices.enum';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  unique: string[] = [];
  categories: Category[] = [];
  biography: Item = null;

  itemTypes: ItemType[] = [];

  sections: Section[] = [
    new Section({name: 'WINK.SECTIONS.PUBLIC', key: 0}),
    new Section({name: 'WINK.SECTIONS.GENERAL', key: 1}),
    new Section({name: 'WINK.SECTIONS.PERSONAL', key: 2}),
    new Section({name: 'WINK.SECTIONS.PROFESSIONAL', key: 3}),
  ];
  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.LoadCategories();
    this.LoadTypesItems();
   }

  async SearchItemTypeCategoryName(nameCategory: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!nameCategory) {
            reject({message: 'No name Category'});
          }
          if (this.itemTypes.length === 0) {
            const response = await this.LoadTypesItems();
          }
          const resultado = this.itemTypes.filter(
            (item: ItemType) => {
              return item.category === nameCategory;
            }
          );
          resolve(resultado);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async SearchItemType(nameItemType: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!nameItemType) {
            reject({message: 'No name itemType'});
          }
          if (this.itemTypes.length === 0) {
            await this.LoadTypesItems();
          }
          const response = this.itemTypes.filter(
            (item: ItemType) => {
              return item.name === nameItemType;
            }
          );
          resolve(response[0]);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async LoadCategories() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get<Category[]>(Routes.BASE + Routes.CATEGORIES).toPromise();
          this.categories = [];
          this.categories.push(...response);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async LoadTypesItems() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get<ItemType[]>(Routes.BASE + Routes.ITEM_TYPES).toPromise();
          this.itemTypes = [];
          this.itemTypes.push(...response);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async LoadItemsUser() {
    this.biography = null;
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          let response = await this.http.get<Item[]>(Routes.BASE + Routes.ITEMS_USER).toPromise();
          response = response.filter(
            (item: Item) => {
              if (item.position === -1) {
                this.biography = item;
              } else {
                return item;
              }
            }
          );
          resolve(response);
        } catch (err) {
          this.toastService.Toast(MessagesServices.ERROR_GET_INFORMATION);
          reject(err);
        }
      }
    );
  }

  async SaveItems(data: Item[]) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!data) {
            reject({message: 'No data'});
          }
          const response = await this.http.post<Item[]>(Routes.BASE + Routes.CREATE_ITEM, data).toPromise();
          this.toastService.Toast(MessagesServices.SAVE_ITEMS);
          resolve(response);
        } catch (err) {
          this.toastService.Toast(MessagesServices.ERROR_SAVE);
          reject(err);
        }
      }
    );
  }

  async GetPublicItems(idUser: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser) {
            reject({message: 'No idUSer'});
          }
          const response = await this.http.post(Routes.BASE + Routes.SHOW_PUBLIC_PROFILE, { winkUserId: idUser}).toPromise();
          resolve(response);
        } catch (err) {
          console.log('Error GetPublicItems: ' + err.message);
          reject(err);
        }
      }
    );
  }

  async GetPrivateItems(idUser: string, idWink: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!idUser || !idWink) {
            reject({message: 'No idUser/idWink'});
          }
          const response = await this.http.post(
            Routes.BASE + Routes.SHOW_PRIVATE_PROFILE,
            {
              winkUserId: idUser,
              wink_id: idWink
            }
          ).toPromise();
          resolve(response);
        } catch (err) {
          console.log('Error GetPrivateItems: ' + err.message);
          reject(err);
        }
      }
    );
  }
}
