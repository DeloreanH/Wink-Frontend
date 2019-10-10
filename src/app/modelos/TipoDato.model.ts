export class TIpoDato {
  public id: string;
  public valor: string;
  constructor(data: any) {
      Object.assign(this, data);
  }
}
