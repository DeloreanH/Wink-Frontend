import { Injectable } from '@angular/core';
import { Category } from '../modelos/category.model';
import { ItemType } from '../modelos/itemType.model';
import { Option } from '../modelos/option.model';
import { Section } from '../modelos/section.model';

@Injectable({
  providedIn: 'root'
})
export class InformacionPerfilService {

  unique: string[] = [];

  categories: Category[] = [
    new Category({_id: 1, name: 'Contacto'}),
    new Category({_id: 2, name: 'Educación'}),
    new Category({_id: 3, name: 'Laboral'}),
    new Category({_id: 4, name: 'Mensajería'}),
    new Category({_id: 5, name: 'Personal'}),
    new Category({_id: 6, name: 'Red Social'}),
    new Category({_id: 7, name: 'Otra'}),
  ];

  itemTypes: ItemType[] = [
    new ItemType({_id: 1, description: 'Celular', category_id: 1, icon: 'fas mobile-alt', index: 6, repeat: true}),
    new ItemType({_id: 2, description: 'Correo', category_id: 1, icon: 'fas envelope', index: 1, repeat: true}),
    new ItemType({_id: 3, description: 'Sitio web', category_id: 1, icon: 'fas at', index: 3, repeat: true}),
    new ItemType({_id: 4, description: 'Teléfono', category_id: 1, icon: 'fas phone', index: 6, repeat: true}),

    new ItemType({_id: 5, description: 'Nivel de instrucción', category_id: 2, icon: 'fas bookmark', index: 4, repeat: false, options: [
      new Option({_id: 1, valor: 'Primaria'}),
      new Option({_id: 2, valor: 'Secundaria' }),
      new Option({_id: 3, valor: 'Media-Superior' }),
      new Option({_id: 4, valor: 'Superior' }), ] }),
    new ItemType({_id: 6, description: 'Profesión', category_id: 2, icon: 'fas graduation-cap', index: 0, repeat: true}),
    new ItemType({_id: 7, description: 'Universidad', category_id: 2, icon: 'fas university', index: 0, repeat: true}),

    new ItemType({_id: 8, description: 'LinkedIn', category_id: 3, icon: 'fab linkedin', index: 0, repeat: true}),
    new ItemType({_id: '9', description: 'Ocupación', category_id: 3, icon: 'fas briefcase', index: 0, repeat: false}),
    new ItemType({_id: 10, description: 'Trabajo', category_id: 3, icon: 'fas city', index: 2, repeat: true}),

    new ItemType({_id: 11, description: 'Line', category_id: 4, icon: 'fab line', index: 0, repeat: true}),
    new ItemType({_id: 12, description: 'Skype', category_id: 4, icon: 'fab skype', index: 0, repeat: true}),
    new ItemType({_id: 13, description: 'Telegram', category_id: 4, icon: 'fab telegram', index: 0, repeat: true}),
    new ItemType({_id: 14, description: 'WeChat', category_id: 4, icon: 'fab weixin', index: 0, repeat: true}),
    new ItemType({_id: 15, description: 'WhatsApp', category_id: 4, icon: 'fab whatsapp', index: 6, repeat: true}),

    new ItemType({_id: 16, description: 'Apodo', category_id: 5, icon: 'fas user', index: 0, repeat: false}),
    new ItemType({_id: 17, description: 'Dirección', category_id: 5, icon: 'fas map-marker-alt', index: 0, repeat: false}),
    new ItemType({_id: 18, description: 'Estado civil', category_id: 5, icon: 'fas heart', index: 4, repeat: false, options: [
      new Option({_id: 5, valor: 'Soltero/a' }),
      new Option({_id: 6, valor: 'Compromet_ido/a' }),
      new Option({_id: 7, valor: 'En Relación' }),
      new Option({_id: 8, valor: 'Casado/a' }),
      new Option({_id: 5, valor: 'Separado/a' }),
      new Option({_id: 6, valor: 'Divorciado/a' }),
      new Option({_id: 7, valor: 'Viudo/a' }),
      new Option({_id: 8, valor: 'Noviazgo' }),
    ] }),
    new ItemType({_id: 19, description: 'Fecha de nacimiento', category_id: 5, icon: 'fas calendar-alt', index: 5, repeat: false}),
    new ItemType({_id: 20, description: 'Hobbies', category_id: 5, icon: 'fas star', index: 8, repeat: false}),
    new ItemType({_id: 21, description: 'Intereses', category_id: 5, icon: 'fas thumbs-up', index: 8, repeat: false}),

    new ItemType({_id: 22, description: 'Facebook', category_id: 6, icon: 'fab facebook', index: 0, repeat: true}),
    new ItemType({_id: 23, description: 'Instagram', category_id: 6, icon: 'fab instagram', index: 0, repeat: true}),
    new ItemType({_id: 24, description: 'Medium', category_id: 6, icon: 'fab medium', index: 0, repeat: true}),
    new ItemType({_id: 25, description: 'Pinterest', category_id: 6, icon: 'fab pinterest', index: 0, repeat: true}),
    new ItemType({_id: 26, description: 'Reddit', category_id: 6, icon: 'fab reddit', index: 0, repeat: true}),
    new ItemType({_id: 27, description: 'Snapchat', category_id: 6, icon: 'fab snapchat', index: 0, repeat: true}),
    new ItemType({_id: 28, description: 'Tumblr', category_id: 6, icon: 'fab tumblr', index: 0, repeat: true}),
    new ItemType({_id: 29, description: 'Twitter', category_id: 6, icon: 'fab twitter', index: 0, repeat: true}),
    new ItemType({_id: 30, description: 'YouTube', category_id: 6, icon: 'fab youtube', index: 0, repeat: true}),

    new ItemType({_id: 31, description: 'Personalizado', category_id: 7, icon: 'fas asterisk', index: 7, repeat: true}),
  ];

  sections: Section[] = [
    new Section({_id: '1',  name: 'Publico', key: 0}),
    new Section({_id: '2',  name: 'General', key: 1}),
    new Section({_id: '3',  name: 'Personal', key: 2}),
    new Section({_id: '4',  name: 'Profesional', key: 3}),
  ];
  constructor() { }

  BuscarTItemCategoria(idCategory: string): ItemType[] {
    const resultado = this.itemTypes.filter(
      (item: ItemType) => {
        return item.category_id === idCategory;
      }
    );
    return resultado;
  }

  BuscarTipoItem(idItemType: string): ItemType {
    console.log('idItemType', idItemType);
    const resultado = this.itemTypes.filter(
      (item: ItemType) => {
        return item._id === idItemType;
      }
    );
    return resultado[0];
  }

  /*BuscarValoresTipoItem(_idTipoItem: string): Option[] {
    const resultado = this.valoresIT.filter(
      (item: Option) => {
        return item._id_tipoitem === _idTipoItem;
      }
    );
    // console.log('Resultados Valores: ', resultado);
    return resultado;
  }*/
}
