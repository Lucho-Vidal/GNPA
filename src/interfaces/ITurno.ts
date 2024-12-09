export interface ITurno {
    _id: string;
    turno: string;
    itinerario: string;
    circular: string;
    personal: string;
    toma: string;
    deja: string;
    dotacion: string;
    especialidad: string;
    ordenes: boolean;
    viewDetail:boolean;
    vueltas: Vueltas[];
}

export interface Vueltas {
    vuelta: number;
    tren: string;
    refer: string;
    origen: string;
    sale: string;
    destino: string;
    llega: string;
    observaciones: string;
}
export interface TrenesDescubiertos {
    turno: string;
    vueltaA: number;
    trenA: string;
    referA: string;
    origenA: string;
    saleA: string;
    destinoA: string;
    llegaA: string;
    observacionesA: string;
    vueltaD: number;
    trenD: string;
    referD: string;
    origenD: string;
    saleD: string;
    destinoD: string;
    llegaD: string;
    observacionesD: string;
    viewDetail:boolean;
    resaltar:boolean;
    detalle:string;
}