export class ValorTI {
    public id: number;
    public valor: string;
    public id_tipoitem: number;
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
