export class Location {
  public longitud: number;
  public latitud: number;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
