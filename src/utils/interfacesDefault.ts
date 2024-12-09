import { CambioTurno } from "@/interfaces/ICambioTurno";
import { Novedad } from "@/interfaces/INovedades";
import { Ordenamiento } from "@/interfaces/IOrdenamientos";
import { IPersonal } from "@/interfaces/IPersonal";
import { IPersonalSinDiagrama } from "@/interfaces/IPersonalSinDiagrama";
import { ITarjetaPersonalSinDiagrama, Jornada } from "@/interfaces/ITarjetaPersonalSinDiagrama";
import { ITurno, TrenesDescubiertos, Vueltas } from "@/interfaces/ITurno";

export function defaultPersonal(): IPersonal {
    return {
        _id: '',
        legajo: 0,
        apellido: '',
        nombres: '',
        turno: '',
        franco: -1,
        especialidad: '',
        dotacion: '',
        observaciones: '',
        orden: 0,
        conocimientos: {
            CML: false,
            CKD: false,
            RO: false,
            MPN: false,
            OL: false,
            LCI: false,
            ELEC: false,
            DUAL: false,
        },
        viewDetail: false,
    };
}
export function defaultTurnos(): ITurno {
    return {
        _id: '',
        turno: '',
        itinerario: '',
        circular: '',
        personal: '',
        toma: '',
        deja: '',
        dotacion: '',
        especialidad: '',
        ordenes: false,
        viewDetail: false,
        vueltas: [{} as Vueltas],
    }
}
export function defaultNovedad(): Novedad {
    return{
            _id: 0,
            fecha: '',
            legajo: 0 ,
            apellido: '',
            nombres: '',
            base: '',
            especialidad: '',
            turno: '',
            franco: '',
            tipoNovedad:'',
            fechaBaja:'',
            fechaAlta:'',
            HNA: false,
            detalle:'',
            viewDetail:false,
            novedadInactiva: false,

            remplazo: [],
            
    }
}
export function defaultCambioTurno(): CambioTurno {
    return {
        _id: 0,
        fechaCambio:"",
        fecha:"",
        personal: [
            {
                legajo: 0,
                apellido: "",
                nombres: "",
                base: "",
                especialidad: "",
                turno: "",
                franco: "",
                turnoEfectivo: "",
                tomada: "",
                dejada: "",
            },
            {
                legajo: 1,
                apellido: "",
                nombres: "",
                base: "",
                especialidad: "",
                turno: "",
                franco: "",
                turnoEfectivo: "",
                tomada: "",
                dejada: "",
            }
        ]

    }
}
export function defaultPersonalSinDiagrama(): IPersonalSinDiagrama {
    return {
        _id: '',
        legajo: 0,
        Ciclo: 0,
        francoInicio: 0,
        HoraInicio: '',
        francoHasta: 0,
        HoraHasta: '',
    };
}
export function defaultTarjetaPersonalSinDiagrama(): ITarjetaPersonalSinDiagrama {
    return {
        _id: '',
        legajo: 0,
        Ciclo: 0,
        francoInicio: 0,
        HoraInicio: '',
        francoHasta: 0,
        HoraHasta: '',
        mes: '',
        days:{}
    };
}
export function defaultJornada(): Jornada {
    return {
        tren: '', 
        franco: '',
        desde: '', 
        hasta: '', 
        disponibleHora: '', 
        tomo: '', 
        dejo: '', 
        totalHoras: '', 
        dia_laboral: null,
        observaciones: '',
        editable: false,
        deBaja: false, 
        relevando:false,
        nroNovedad: null
    };
}
export function defaultTrenesDescubiertos(): TrenesDescubiertos {
    return {
        vueltaA: 0,
        turno: '',
        trenA: '',
        referA: '',
        origenA: '',
        saleA: '',
        destinoA: '',
        llegaA: '',
        observacionesA: '',
        vueltaD: 0,
        trenD: '',
        referD: '',
        origenD: '',
        saleD: '',
        destinoD: '',
        llegaD: '',
        observacionesD: '',
        viewDetail: false,
        resaltar: false,
        detalle:''
    };
}
export function defaultOrdenamiento(): Ordenamiento {
    return {
        _id:'',
        fecha: '',
        tipo: 'ordenamiento',
        personal: defaultPersonal(),
        turno: defaultTurnos(),
        detalle: '',
        turnoEfectivo: '',
        toma: '',
        deja: '',

    }
}