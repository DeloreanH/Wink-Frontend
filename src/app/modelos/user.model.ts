import { Phone } from './phone.model';
import { VisibilityOption } from './visibilityOptions.emun';
import { Location } from './location.model';

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
  public visibility: VisibilityOption;
  public autosave: boolean;
  public location: Location;
  public distance: number;
  public age: number;

  constructor(data: any) {
    Object.assign(this, data);
    this.CalculateAge();
  }

  public CalculateAge() {
    if (this.birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(this.birthday).getTime());
      this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    }
  }
}
