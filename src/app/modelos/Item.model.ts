export class Item {
  public id: number;
  public valor: string;
  public posicion: number;
  public personalizado: string;
  public id_tipoitem: number;
  public id_user: number;
  public id_seccion: number;
  public id_tipodato: number;
  public id_categoria: number;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
