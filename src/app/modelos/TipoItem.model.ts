export class TipoItem {
  public id: number;
  public descripcion: string;
  public id_categoria: number;
  public icono: string;
  public tipo: number;

  constructor(data: any) {
    Object.assign(this, data);
 }
}
