export interface CambioTurno{
    _id: number;
    fechaCambio:string;
    fecha:string;
    personal: Array<Personal>
}

export interface Personal{
    legajo:number|null;
    apellido: string;
    nombres: string;
    base: string;
    especialidad: string;
    turno: string;
    franco: string;
    turnoEfectivo: string;
    tomada: string;
    dejada: string;    
}