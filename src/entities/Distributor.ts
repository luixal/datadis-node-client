export enum Codes {
  Viesgo = 1,
  'E-distribución',
  'E-redes',
  ASEME,
  UFD,
  EOSA,
  CIDE,
  'I-DE REDES ELÉCTRICAS INTELIGENTES, S.A.U.'
}

export class Distributor {
  code: string;
  name: string;

  static getByCode(code: string) {
    return Codes[parseInt(code)];
  }

  constructor(code: string) {
    this.code = code;
    this.name = Distributor.getByCode(code);
  }
}