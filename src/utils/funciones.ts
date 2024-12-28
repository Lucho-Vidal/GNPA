import { Novedad } from "@/interfaces/INovedades";
import { Ordenamiento } from "@/interfaces/IOrdenamientos";
import { IPersonal } from "@/interfaces/IPersonal";
import { Registro } from "@/interfaces/IRegistro";
import { ITurno } from "@/interfaces/ITurno";
import { User } from "@/interfaces/IUser";
import { getCambioTurnos } from "@/services/cambioTurnoService";
import { getItinerarios } from "@/services/itinerarioService";
import { getNovedades } from "@/services/novedadesService";
import { getOrdenamientos } from "@/services/ordenamientoService";
import { getPersonal, getPersonales } from "@/services/personalService";
import { getPersonalesSinDiagrama, getPersonalSinDiagrama } from "@/services/personalSinDiagramaService";
import { createRegistro } from "@/services/registrosService";
import { getTarjetaPersonalSinDiagrama, getTarjetaPersonalSinDiagramaPorLegajoYMes } from "@/services/tarjetaPersonalSinDiagramaService";
import { getTurnos } from "@/services/turnosService";
import { AxiosError } from "axios";
import * as XLSX from 'xlsx';

export function handleRequestError(error: AxiosError) {
    console.error("Error en la solicitud:", error);

    if (error.response && error.response.status === 401) {
        // Manejar la lógica de redirección a la página de inicio de sesión
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        localStorage.removeItem("token");
        // this.$router.push("/login");
    } else {
        // Manejar otros errores de solicitud
        // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
    }
}
export async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        return XLSX.read(arrayBuffer, { type: 'array' });
        // Obtener nombres de las hojas
        // this.sheetNames = this.workbook.SheetNames;
    }
}
export async function  loadTurnos() {
    /* Trae todos los elementos de la base de datos  */
    try {
        const res = await getTurnos();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
export async function  loadItinerarios() {
    try {
        /* Trae todos los elementos de la base de datos */
        const res = await getItinerarios();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
export async function  loadCambiosTurnos() {
    try {
        /* Trae todos los elementos de la base de datos */
        const res = await getCambioTurnos();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
export async function  loadPersonales() {
    try {
        /* Trae todos los elementos de la base de datos */
        const res = await getPersonales();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
export async function loadPersonal(id: string) {
    try {
        const res = await getPersonal(id);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
//----------- Personal sin diagrama -----------------
export async function loadPersonalesSinDiagrama() {
    try {
        const res = await getPersonalesSinDiagrama();
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
export async function loadPersonalSinDiagrama(id: string) {
    try {
        const res = await getPersonalSinDiagrama(id);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}

//----------- Tarjetas de Personal sin diagrama -----------------
export async function loadTarjetaPersonalSinDiagrama(id: string) {
    try {
        const res = await getTarjetaPersonalSinDiagrama(id);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
export async function loadTarjetaPersonalSinDiagramaPorLegajoYMes(legajo:number,mes: string) {
    try {
        const res = await getTarjetaPersonalSinDiagramaPorLegajoYMes(legajo,mes);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
export async function  loadNovedades() {
    try {
        const res = await getNovedades();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
export async function  loadOrdenamientos() {
    try {
        const res = await getOrdenamientos();
        return res.data;
    } catch (error) {
        handleRequestError(error as AxiosError);
    }
}
/**
 * Esta función se utiliza para quitar los duplicados que pueda tener la lista 
 * al seleccionar varias circulares.
 * @param lista de turnos
 * @param circularSeleccionada lista de string con los nombres de las circulares
 * @returns array con cada elemento filtrados
 */
export function quitarDuplicados(lista: ITurno[],circularSeleccionada: String[]): ITurno[] {
    const mapa: Map<string, ITurno> = new Map();

    for (const elemento of lista) {
        // Utilizamos el ID como clave en el mapa
        if (!mapa.has(elemento.turno)) {
            mapa.set(elemento.turno, elemento);
        } else if (
            mapa.has(elemento.turno) &&
            circularSeleccionada.includes(elemento.circular)
        ) {
            mapa.set(elemento.turno, elemento);
        }
    }
    // Convertir los valores del mapa de nuevo a una lista
    return Array.from(mapa.values());
}
export async function guardarRegistro(today:Date,accion:string,turno?: ITurno,personal?: IPersonal,novedad?: Novedad, user?: User,ordenamiento?:Ordenamiento){
    // guardamos registro
    const registro: Registro = {
        usuario: window.localStorage.getItem("username") || "",
        fecha: today.toString(),
        accion: accion,
        turno:turno,
        personal: personal,
        novedad:novedad,
        user:user,
        ordenamiento:ordenamiento
    };
    await createRegistro(registro);
}
/**
 * Determina si el último carácter de un string representa un número par.
 * 
 * @param {string} input - El string que se evaluará.
 * @returns {boolean | null} - Retorna `true` si el último carácter es un número par, 
 *                             `false` si es impar, y `null` si el último carácter no es un número.
 * 
 * @example
 * // Caso donde el último carácter es un número par
 * esUltimoCaracterPar("1234"); // true
 * 
 * @example
 * // Caso donde el último carácter es un número impar
 * esUltimoCaracterPar("1235"); // false
 * 
 * @example
 * // Caso donde el último carácter no es un número
 * esUltimoCaracterPar("abc"); // null
 */
export function esUltimoCaracterPar(input: string): boolean | null {
    const ultimoCaracter = input.slice(-1); // Obtiene el último carácter del string
    const numero = parseInt(ultimoCaracter, 10); // Convierte el carácter a un número entero

    if (isNaN(numero)) {
        // Retorna null si no se puede convertir el carácter a número
        return null;
    }

    // Verifica si el número es par
    return numero % 2 === 0;
}