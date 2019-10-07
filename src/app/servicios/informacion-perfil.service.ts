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
    new Categoria({id: 2, categoria: 'Educacion'}),
    new Categoria({id: 3, categoria: 'Laboral'}),
    new Categoria({id: 4, categoria: 'Personal'}),
    new Categoria({id: 5, categoria: 'Red Social'}),
    new Categoria({id: 5, categoria: 'Mensajeria'}),
    new Categoria({id: 6, categoria: 'Otra'}),
  ];

  tiposItems: TipoItem[] = [
    new TipoItem({id: 1, descripcion: 'Celular', id_categoria: 1, icono: 'phone-portrait', tipo: 0}),
    new TipoItem({id: 2, descripcion: 'Telefono', id_categoria: 1, icono: 'call', tipo: 0}),
    new TipoItem({id: 3, descripcion: 'WhatsApp', id_categoria: 1, icono: 'logo-whatsapp', tipo: 0}),
    new TipoItem({id: 4, descripcion: 'E-mail', id_categoria: 1, icono: 'mail', tipo: 0}),
    new TipoItem({id: 5, descripcion: 'Skype', id_categoria: 1, icono: 'logo-skype', tipo: 0}),

    new TipoItem({id: 6, descripcion: 'Nivel de instruccion', id_categoria: 2, icono: 'bookmark', tipo: 1}),
    new TipoItem({id: 7, descripcion: 'Profesion', id_categoria: 2, icono: 'medal', tipo: 0}),
    new TipoItem({id: 8, descripcion: 'Universidad', id_categoria: 2, icono: 'school', tipo: 0}),

    new TipoItem({id: 9, descripcion: 'Ocupacion', id_categoria: 3, icono: 'briefcase', tipo: 0}),
    new TipoItem({id: 10, descripcion: 'Trabajo', id_categoria: 3, icono: 'business', tipo: 2}),
    new TipoItem({id: 11, descripcion: 'LinkedIn', id_categoria: 3, icono: 'logo-linkedin', tipo: 0}),

    new TipoItem({id: 13, descripcion: 'Direccion', id_categoria: 4, icono: 'pin', tipo: 3}),
    // new TipoItem({id: 14, descripcion: 'Sexo', id_categoria: 4, icono: 'radio-button-off', tipo: 1}),
    new TipoItem({id: 15, descripcion: 'Fecha de nacimiento', id_categoria: 4, icono: 'calendar', tipo: 3}),

    new TipoItem({id: 16, descripcion: 'Facebook', id_categoria: 5, icono: 'logo-facebook', tipo: 0}),
    new TipoItem({id: 17, descripcion: 'Twitter', id_categoria: 5, icono: 'logo-twitter', tipo: 0}),
    new TipoItem({id: 18, descripcion: 'Instagram', id_categoria: 5, icono: 'logo-instagram', tipo: 0}),
    new TipoItem({id: 19, descripcion: 'Snapchat', id_categoria: 5, icono: 'logo-snapchat', tipo: 0}),

    new TipoItem({id: 20, descripcion: 'Sitio web', id_categoria: 6, icono: 'at', tipo: 0}),
    new TipoItem({id: 21, descripcion: 'YouTube', id_categoria: 6, icono: 'logo-youtube', tipo: 0}),
    new TipoItem({id: 22, descripcion: 'Personalizado', id_categoria: 6, icono: 'medical', tipo: 4}),
  ];

  secciones: Seccion[] = [
    new Seccion({id: 1, seccion: 'Publico'}),
    new Seccion({id: 2, seccion: 'General'}),
    new Seccion({id: 3, seccion: 'Personal'}),
    new Seccion({id: 4, seccion: 'Profesional'}),
  ];

  valoresIT: ValorTI[] = [
    new ValorTI({id: 1, valor: 'Mujer', id_tipoitem: 14}),
    new ValorTI({id: 2, valor: 'Hombre', id_tipoitem: 14}),
    new ValorTI({id: 3, valor: 'Prefiero no decirlo', id_tipoitem: 14}),
    new ValorTI({id: 4, valor: 'Otro', id_tipoitem: 14}),
    new ValorTI({id: 5, valor: 'Primaria', id_tipoitem: 6}),
    new ValorTI({id: 6, valor: 'Secundaria', id_tipoitem: 6}),
    new ValorTI({id: 7, valor: 'Media-Superior', id_tipoitem: 6}),
    new ValorTI({id: 8, valor: 'Superior', id_tipoitem: 6}),
  ];
  constructor() { }

  BuscarTItemCategoria(idCategoria: number): TipoItem[] {
    const resultado = this.tiposItems.filter(
      (item: TipoItem) => {
        return item.id_categoria === idCategoria;
      }
    );
    console.log('Resultados: ', resultado);
    return resultado;
  }

  BuscarTipoItem(idTipoItem: number): TipoItem {
    const resultado = this.tiposItems.filter(
      (item: TipoItem) => {
        return item.id === idTipoItem;
      }
    );
    console.log('Resultados BuscarIDCategoria: ', resultado[0]);
    return resultado[0];
  }

  BuscarValoresTipoItem(idTipoItem: number): ValorTI[] {
    const resultado = this.valoresIT.filter(
      (item: ValorTI) => {
        return item.id_tipoitem === idTipoItem;
      }
    );
    console.log('Resultados Valores: ', resultado);
    return resultado;
  }
}
