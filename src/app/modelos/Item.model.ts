import { Seccion } from './Seccion.model';

export class Item {
  public valor: string;
  public posicion: number;
  public personalizado: string;
  public id_tipoitem: string;
  public seccion: Seccion;
  public basico: boolean;
  public id_categoria: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
