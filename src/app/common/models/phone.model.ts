export class Phone {
  public phoneCode: number;
  public phoneNumber: number;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
