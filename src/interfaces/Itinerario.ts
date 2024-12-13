
export interface Itinerario {
    _id: string;
    tren: string;
    circular: string;
    itinerario: string;
    estaciones: string[];
    horarios: string[];
    horarioXEst:Record<string,string>
    viewDetail:boolean;
    /* PC: string;
    ALL: string;
    RE: string;
    TY: string;
    BO: string;
    GW: string;
    AK: string;
    CY: string;
    FV: string;
    BQ: string;
    LLV: string;
    MG: string;
    ZZ: string;
    QL: string;
    BZ: string;
    HD: string;
    VE: string;
    OA: string;
    LP: string; */
}