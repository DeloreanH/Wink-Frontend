export class Categoria {
public id: number;
  public categoria: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
