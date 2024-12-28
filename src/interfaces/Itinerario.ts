
export interface Itinerario {
    _id: string;
    tren: string;
    circular: string;
    itinerario: string;
    rotacion: string;
    trenSiguiente: string;
    trenSiguienteHora:string;
    estaciones: string[];
    horarios: string[];
    horarioXEst:Record<string,string>
    viewDetail:boolean;

}