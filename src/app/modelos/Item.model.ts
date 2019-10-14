import { Section } from './section.model';

export class Item {
  public value: string;
  public position: number;
  public custom: string;
  public section: Section;
  public basic: boolean;
  public itemType_id: string;
  public category_id: string;
  public user_id: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
