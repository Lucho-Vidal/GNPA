import { IPersonal } from "./IPersonal";
import { ITurno } from "./ITurno";

export interface Ordenamiento{
    _id: string;
    fecha:string;
    tipo: string;
    turnoEfectivo:string;
    toma:string;
    deja:string
    personal: IPersonal;
    // trenes: Array<Vueltas>,
    turno: ITurno;
    detalle: string;
    
}
// export interface trenes{
//     tren: number;
//     desde:string;
//     sale: string;
//     hasta:string;
//     llega: string;
// }