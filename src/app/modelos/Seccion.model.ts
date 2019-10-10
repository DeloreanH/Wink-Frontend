export class Seccion {
  public id: string;
  public seccion: string;
  public key: number;

  constructor(data: any) {
    Object.assign(this, data);
 }
}
