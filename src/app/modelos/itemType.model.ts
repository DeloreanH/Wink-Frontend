import { Option } from './option.model';

export class ItemType {
  public _id: string;
  public name: string;
  public description: string;
  public category: string;
  public icon: string;
  public index: number;
  public repeat: boolean;
  public options: Option[] = [];

  constructor(data: any) {
    Object.assign(this, data);
 }
}
