export class Wink {
  public _id: string;
  public sender_id: string;
  public senderVisibility: string;
  public receiver_id: string;
  public receiverVisibility: string;
  public approved: boolean;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
