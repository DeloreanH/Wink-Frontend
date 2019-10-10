export class Categoria {
  public id: string;
  public categoria: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
