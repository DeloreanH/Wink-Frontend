export class TipoItem {
  public id: string;
  public descripcion: string;
  public id_categoria: string;
  public icono: string;
  public tipo: number;

  constructor(data: any) {
    Object.assign(this, data);
 }
}
