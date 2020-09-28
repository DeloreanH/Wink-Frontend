export class Section {
  public _id: string;
  public name: string;
  public key: number;

  constructor(data: any) {
    Object.assign(this, data);
 }
}
