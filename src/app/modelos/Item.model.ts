export class Item {
  public valor: string;
  public posicion: number;
  public personalizado: string;
  public id_tipoitem: string;
  public id_seccion: string;
  public id_categoria: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
