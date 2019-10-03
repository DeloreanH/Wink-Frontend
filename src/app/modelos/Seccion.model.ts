export class Seccion {
  public id: number;
  public seccion: string;
  public icono: string;

  constructor(data: any) {
    Object.assign(this, data);
 }
}
