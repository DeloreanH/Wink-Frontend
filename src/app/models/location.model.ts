export class Location {
  public longitude: number;
  public latitude: number;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
