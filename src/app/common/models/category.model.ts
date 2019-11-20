export class Category {
  public _id: string;
  public description: string;
  public name: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
