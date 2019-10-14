export class Option {
    public _id: string;
    public name: string;
    public id_tipoitem: string;
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
