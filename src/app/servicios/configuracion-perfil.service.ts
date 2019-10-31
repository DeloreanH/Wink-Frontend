import { Injectable } from '@angular/core';
import { Category } from '../modelos/category.model';
import { ItemType } from '../modelos/itemType.model';
import { Section } from '../modelos/section.model';
import { HttpClient } from '@angular/common/http';
import { Routes } from '../modelos/routes.enum';
import { AuthService } from '../auth/auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Item } from '../modelos/item.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionPerfilService {

  unique: string[] = [];

  categories: Category[] = [];

  categories2: Category[] = [];
  biografia: Item = null;

  itemTypes: ItemType[] = [];

  sections: Section[] = [
    new Section({name: 'Publico', key: 0}),
    new Section({name: 'General', key: 1}),
    new Section({name: 'Personal', key: 2}),
    new Section({name: 'Profesional', key: 3}),
  ];
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.CargarCategorias();
    this.CargarTiposItem();
   }

  async BuscarTItemCategoria(nameCategory: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!nameCategory) {
            reject(false);
          }
          if (this.itemTypes.length === 0) {
            const response = await this.CargarTiposItem();
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

  async BuscarTipoItem(nameItemType: string) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!nameItemType) {
            reject(false);
          }
          if (this.itemTypes.length === 0) {
            const reponse = await this.CargarTiposItem();
          }
          const resultado = this.itemTypes.filter(
            (item: ItemType) => {
              return item.name === nameItemType;
            }
          );
          resolve(resultado[0]);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async CargarCategorias() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get<Category[]>(Routes.BASE + Routes.CATEGORIES).toPromise();
          // console.log('respuesta', respuesta);
          this.categories = [];
          this.categories.push(...response);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async CargarTiposItem() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          const response = await this.http.get<ItemType[]>(Routes.BASE + Routes.ITEM_TYPES).toPromise();
          // console.log('respuesta', response);
          this.itemTypes = [];
          this.itemTypes.push(...response);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async CargarItemsUsuario() {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          let response = await this.authService.user.pipe(
            take(1),
            exhaustMap(
              user => {
                if (!user) {
                  return null;
                }
                return this.http.get<Item[]>(Routes.BASE + Routes.ITEMS_USER + user.user._id);
              }
            )
            ).toPromise();
          response = response.filter(
            (item: Item) => {
              if (item.position === -1) {
                this.biografia = item;
              } else {
                return item;
              }
            }
          );
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  async GuardarItems(data: Item[]) {
    return new Promise<any>(
      async (resolve, reject) => {
        try {
          if (!data) {
            reject(false);
          }
          const response = await this.http.post<Item[]>(Routes.BASE + Routes.CREATE_ITEM, data).toPromise();
          resolve(response);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}
