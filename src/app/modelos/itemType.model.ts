import { Option } from './option.model';

export class ItemType {
  public _id: string;
  public description: string;
  public category_id: string;
  public icon: string;
  public index: number;
  public repeat: boolean;
  public options: Option[] = [];

  constructor(data: any) {
    Object.assign(this, data);
 }
}
