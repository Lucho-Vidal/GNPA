import { ITurno } from "./ITurno"

export interface SabanaDescendente {
    rotacion:string,
    tren: string,
    desde: string,
    hasta: string,
    llega: string,
    turnos: Array<ITurno>

    // CtTurno: string,
    // CtNombre: string,
    // CtSale: string,
    // CtHora: string,
    // CtObs: string,
    // GdTurno: string,
    // GdNombre: string,
    // GdSale: string,
    // GdHora: string,
    // GdObs: string
}

export interface SabanaAscendente {
    rotacion: string,
    tren: string,
    sale: string,
    origen: string,
    destino: string,
    paraTren: string,
    paraTrenHora: string,
    turnos: Array<ITurno>
    // ctReferencia: string[],
    // ctTurno: string[],
    // ctNombre: string[],
    // ctLlegaCon: string[],
    // ctRelevo: string[],
    // gdReferencia: string[],
    // gdTurno: string[],
    // gdNombre: string[],
    // gdLlegaCon: string[],
    // gdRelevo: string[],
}