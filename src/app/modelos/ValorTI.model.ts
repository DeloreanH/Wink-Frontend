export class ValorTI {
    public id: string;
    public valor: string;
    public id_tipoitem: string;
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
