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

  BuscarTItemCategoria(nameCategory: string): ItemType[] {
    if (this.categories.length === 0) {
      this.CargarCategorias();
    }
    if (this.itemTypes.length === 0) {
      this.CargarTiposItem();
    }
    const resultado = this.itemTypes.filter(
      (item: ItemType) => {
        return item.category === nameCategory;
      }
    );
    // console.log('resultados:' , resultado);
    return resultado;
  }

  BuscarTipoItem(nameItemType: string): ItemType {
    // console.log('idItemType', idItemType);
    // console.log('nameItemType', nameItemType);
    if (nameItemType) {
      if (this.itemTypes.length === 0) {
        this.CargarTiposItem();
      }
      const resultado = this.itemTypes.filter(
        (item: ItemType) => {
          return item.name === nameItemType;
        }
      );
      // console.log('resultado ItemType', resultado);
      return resultado[0];
    }
  }

  async CargarCategorias() {
    try {
      const respuesta = await this.http.get<Category[]>(Routes.BASE + Routes.CATEGORIES).toPromise();
      // console.log('respuesta', respuesta);
      this.categories = [];
      this.categories.push(...respuesta);
      // console.log('categories', this.categories);
    } catch (error) {

    }
  }

  async CargarTiposItem() {
    try {
      const respuesta = await this.http.get<ItemType[]>(Routes.BASE + Routes.ITEM_TYPES).toPromise();
      // console.log('respuesta', respuesta);
      this.itemTypes = [];
      this.itemTypes.push(...respuesta);
      // console.log('itemTypes', this.itemTypes);
    } catch (error) {

    }
  }

  async CargarItemsUsuario() {
    try {
      let respuesta = await this.authService.user.pipe(
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
      // console.log('respuesta', respuesta);
      respuesta = respuesta.filter(
        (item: Item) => {
          if (item.position === -1) {
            this.biografia = item;
          } else {
            return item;
          }
        }
      );
      // console.log('respuesta con filtro', respuesta);
      return respuesta;
    } catch (error) {

    }
  }

  async GuardarItems(data: Item[]) {
    if (data) {
      try {
        const respuesta = await this.http.post<Item[]>(Routes.BASE + Routes.CREATE_ITEM, data).toPromise();
        // console.log('respuesta', respuesta);
      } catch (error) {

      }
    }
  }
}
