import { Injectable } from '@angular/core';
import { Categoria } from '../modelos/Categoria.model';
import { TipoItem } from '../modelos/TipoItem.model';
import { Seccion } from '../modelos/Seccion.model';
import { ValorTI } from '../modelos/ValorTI.model';

@Injectable({
  providedIn: 'root'
})
export class InformacionPerfilService {

  categorias: Categoria[] = [
    new Categoria({id: 1, categoria: 'Contacto'}),
    new Categoria({id: 2, categoria: 'Educación'}),
    new Categoria({id: 3, categoria: 'Laboral'}),
    new Categoria({id: 4, categoria: 'Mensajería'}),
    new Categoria({id: 5, categoria: 'Personal'}),
    new Categoria({id: 6, categoria: 'Red Social'}),
    new Categoria({id: 7, categoria: 'Otra'}),
  ];

  tiposItems: TipoItem[] = [
    new TipoItem({id: 1, descripcion: 'Celular', id_categoria: 1, icono: 'fas mobile-alt', tipo: 6}),
    new TipoItem({id: 2, descripcion: 'Correo', id_categoria: 1, icono: 'fas envelope', tipo: 1}),
    new TipoItem({id: 3, descripcion: 'Sitio web', id_categoria: 1, icono: 'fas at', tipo: 0}),
    new TipoItem({id: 4, descripcion: 'Teléfono', id_categoria: 1, icono: 'fas phone', tipo: 6}),

    new TipoItem({id: 5, descripcion: 'Nivel de instrucción', id_categoria: 2, icono: 'fas bookmark', tipo: 4}),
    new TipoItem({id: 6, descripcion: 'Profesión', id_categoria: 2, icono: 'fas graduation-cap', tipo: 0}),
    new TipoItem({id: 7, descripcion: 'Universidad', id_categoria: 2, icono: 'fas university', tipo: 0}),

    new TipoItem({id: 8, descripcion: 'LinkedIn', id_categoria: 3, icono: 'fab linkedin', tipo: 0}),
    new TipoItem({id: 9, descripcion: 'Ocupación', id_categoria: 3, icono: 'fas briefcase', tipo: 0}),
    new TipoItem({id: 10, descripcion: 'Trabajo', id_categoria: 3, icono: 'fas city', tipo: 2}),

    new TipoItem({id: 11, descripcion: 'Line', id_categoria: 4, icono: 'fab line', tipo: 0}),
    new TipoItem({id: 13, descripcion: 'Skype', id_categoria: 4, icono: 'fab skype', tipo: 0}),
    new TipoItem({id: 14, descripcion: 'Telegram', id_categoria: 4, icono: 'fab telegram', tipo: 0}),
    new TipoItem({id: 15, descripcion: 'WeChat', id_categoria: 4, icono: 'fab weixin', tipo: 0}),
    new TipoItem({id: 16, descripcion: 'WhatsApp', id_categoria: 4, icono: 'fab whatsapp', tipo: 6}),

    new TipoItem({id: 17, descripcion: 'Apodo', id_categoria: 5, icono: 'fas user', tipo: 0}),
    new TipoItem({id: 18, descripcion: 'Dirección', id_categoria: 5, icono: 'fas map-marker-alt', tipo: 0}),
    new TipoItem({id: 19, descripcion: 'Estado civil', id_categoria: 5, icono: 'fas heart', tipo: 4}),
    new TipoItem({id: 20, descripcion: 'Fecha de nacimiento', id_categoria: 5, icono: 'fas calendar-alt', tipo: 5}),
    new TipoItem({id: 21, descripcion: 'Hobbies', id_categoria: 5, icono: 'fas star', tipo: 0}),
    new TipoItem({id: 22, descripcion: 'Intereses', id_categoria: 5, icono: 'fas thumbs-up', tipo: 4}),

    new TipoItem({id: 23, descripcion: 'Facebook', id_categoria: 6, icono: 'fab facebook', tipo: 0}),
    new TipoItem({id: 24, descripcion: 'Instagram', id_categoria: 6, icono: 'fab instagram', tipo: 0}),
    new TipoItem({id: 25, descripcion: 'Medium', id_categoria: 6, icono: 'fab medium', tipo: 0}),
    new TipoItem({id: 26, descripcion: 'Pinterest', id_categoria: 6, icono: 'fab pinterest', tipo: 0}),
    new TipoItem({id: 27, descripcion: 'Reddit', id_categoria: 6, icono: 'fab reddit', tipo: 0}),
    new TipoItem({id: 28, descripcion: 'Snapchat', id_categoria: 6, icono: 'fab snapchat', tipo: 0}),
    new TipoItem({id: 29, descripcion: 'Tumblr', id_categoria: 6, icono: 'fab tumblr', tipo: 0}),
    new TipoItem({id: 30, descripcion: 'Twitter', id_categoria: 6, icono: 'fab twitter', tipo: 0}),
    new TipoItem({id: 31, descripcion: 'YouTube', id_categoria: 6, icono: 'fab youtube', tipo: 0}),

    new TipoItem({id: 32, descripcion: 'Personalizado', id_categoria: 7, icono: 'fas asterisk', tipo: 7}),
  ];

  secciones: Seccion[] = [
    new Seccion({id: 1, seccion: 'Publico'}),
    new Seccion({id: 2, seccion: 'General'}),
    new Seccion({id: 3, seccion: 'Personal'}),
    new Seccion({id: 4, seccion: 'Profesional'}),
  ];

  valoresIT: ValorTI[] = [
    new ValorTI({id: 1, valor: 'Primaria', id_tipoitem: 5}),
    new ValorTI({id: 2, valor: 'Secundaria', id_tipoitem: 5}),
    new ValorTI({id: 3, valor: 'Media-Superior', id_tipoitem: 5}),
    new ValorTI({id: 4, valor: 'Superior', id_tipoitem: 5}),
    new ValorTI({id: 5, valor: 'Soltero/a', id_tipoitem: 19}),
    new ValorTI({id: 6, valor: 'Comprometido/a', id_tipoitem: 19}),
    new ValorTI({id: 7, valor: 'En Relación', id_tipoitem: 19}),
    new ValorTI({id: 8, valor: 'Casado/a', id_tipoitem: 19}),
    new ValorTI({id: 5, valor: 'Separado/a', id_tipoitem: 19}),
    new ValorTI({id: 6, valor: 'Divorciado/a', id_tipoitem: 19}),
    new ValorTI({id: 7, valor: 'Viudo/a', id_tipoitem: 19}),
    new ValorTI({id: 8, valor: 'Noviazgo', id_tipoitem: 19}),
  ];
  constructor() { }

  BuscarTItemCategoria(idCategoria: number): TipoItem[] {
    const resultado = this.tiposItems.filter(
      (item: TipoItem) => {
        return item.id_categoria === idCategoria;
      }
    );
    // console.log('Resultados: ', resultado);
    return resultado;
  }

  BuscarTipoItem(idTipoItem: number): TipoItem {
    const resultado = this.tiposItems.filter(
      (item: TipoItem) => {
        return item.id === idTipoItem;
      }
    );
    // console.log('Resultados BuscarTipoItem: ', resultado[0]);
    return resultado[0];
  }

  BuscarValoresTipoItem(idTipoItem: number): ValorTI[] {
    const resultado = this.valoresIT.filter(
      (item: ValorTI) => {
        return item.id_tipoitem === idTipoItem;
      }
    );
    // console.log('Resultados Valores: ', resultado);
    return resultado;
  }
}
