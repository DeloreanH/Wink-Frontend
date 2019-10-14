import { Phone } from './phone.model';

export class User {
  public _id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: Phone;
  public birthday: string;
  public gender: string;
  public avatarUrl: string;
  public status: string;
  public description: string;
  public emptyProfile: boolean;
  public username: string;
  public created: string;
  public updated: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
