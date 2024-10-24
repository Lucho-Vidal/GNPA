import { Itinerario } from "@/interfaces/Itinerario";
import { ITurno } from "@/interfaces/ITurno";
import { esFechaIgual } from "./fechas";
import { CambioTurno } from "@/interfaces/ICambioTurno";

/**
 * Obtiene una lista de tipos circulares únicos a partir de un array de turnos.
 *
 * Esta función filtra los elementos del array de turnos para obtener aquellos
 * que tienen definida la propiedad "circular" y luego retorna un array con
 * los tipos circulares únicos.
 *
 * @param turnos - Un array de objetos que representan los turnos, donde
 *                 cada objeto puede tener una propiedad "circular".
 *
 * @returns Un array de tipos circulares únicos encontrados en el array de turnos.
 */
export function obtenerTiposCirculares(turnos: ITurno[]) {
    // Filtramos aquellos turnos que tengan definida la propiedad "circular"
    const circularesUnicas = [
        ...new Set(turnos
            .filter((turno) => turno.circular != null) // Usar != para incluir tanto undefined como null
            .map((turno) => turno.circular))
    ];

    return circularesUnicas;
}

/**
 * Filtra una lista de turnos según el itinerario, la selección de circulares
 * y el tipo de turno especificado.
 *
 * Esta función devuelve un nuevo array de turnos que cumplen con los criterios
 * de filtrado establecidos.
 *
 * @param itinerario - El itinerario que se utilizará para filtrar los turnos.
 * @param listaTurnos - Un array de objetos que representan los turnos a filtrar.
 * @param circularSeleccionada - Un array de strings que contiene las circulares
 *                               seleccionadas para el filtrado.
 * @param turno - Una cadena que representa el tipo de turno a buscar en
 *                los turnos de la lista.
 *
 * @returns Un array de turnos que coinciden con los criterios de filtrado.
 */
export function filtrarPorTurno(
    itinerario: string,
    listaTurnos: ITurno[],
    circularSeleccionada: string[],
    turno: string
): ITurno[] {
    return listaTurnos.filter((diag: ITurno) =>
        diag.turno.toLowerCase().includes(turno.toLowerCase()) &&
        diag.itinerario === itinerario &&
        circularSeleccionada.includes(diag.circular)
    );
}
/**
 * Filtra una lista de turnos según el itinerario, la selección de circulares
 * y el tren especificado.
 *
 * Este método busca en el array de turnos los trenes que coincidan con el
 * criterio de búsqueda y devuelve un nuevo array con los turnos filtrados.
 *
 * @param itinerario - El itinerario que se utilizará para filtrar los turnos.
 * @param listaTurnos - Un array de objetos que representan los turnos a filtrar.
 * @param circularSeleccionada - Un array de strings que contiene las circulares
 *                               seleccionadas para el filtrado.
 * @param tren - Una cadena que representa el tren a buscar en los turnos.
 *
 * @returns Un array de turnos que coinciden con los criterios de filtrado.
 */
// export function filtroTrenes(
//     itinerario: string,
//     listaTurnos: ITurno[],
//     circularSeleccionada: string[],
//     tren: string
// ): ITurno[] {
//     return listaTurnos.filter((diag: ITurno) =>
//         diag.itinerario === itinerario &&
//         circularSeleccionada.includes(diag.circular) &&
//         diag.vueltas.some(vuelta => vuelta.tren === tren)
//     );
// }
export function filtroTrenes(itinerario: string,listaTurnos: ITurno[],circularSeleccionada: string[],tren: string): ITurno[] {
        // const turnosEnTren: ITurno[] = [];
        // listaTurnos.forEach((diag: ITurno) => {
        //     for (let i = 0; i < diag.vueltas.length; i++) {

        //         if (
        //             diag.vueltas[i].tren === parseInt(tren) &&
        //             diag.itinerario === itinerario &&
        //             circularSeleccionada.includes(diag.circular)
        //         ) {
        //             turnosEnTren.push(diag);
        //         }
        //     }
        // });
        // return turnosEnTren;
            return listaTurnos.filter((diag: ITurno) =>
                    diag.itinerario === itinerario &&
                    circularSeleccionada.includes(diag.circular) &&
                    diag.vueltas.some(vuelta => vuelta.tren === tren)
                );
    }
/**
 * Filtra una lista de itinerarios según el tren y el itinerario especificados.
 *
 * Este método busca en el array de itinerarios los horarios de pasadas por cada estación
 * que coincidan con el tren y el itinerario proporcionados.
 *
 * @param itinerario - El itinerario que se utilizará para filtrar los horarios.
 * @param listaItinerario - Un array de objetos que representan los itinerarios a filtrar.
 * @param tren - El número del tren que se utilizará para el filtrado.
 *
 * @returns Un objeto que representa los horarios del tren en el itinerario especificado,
 *          o un objeto vacío si no se encuentra coincidencias.
 */
export function filtroItinerario(itinerario: string, listaItinerario: Itinerario[], tren: string) {
    const itFiltrados = listaItinerario.filter(
        (it: Itinerario) => it.tren === parseInt(tren) && it.itinerario === itinerario
    );

    const horarios: Itinerario = {
        id: null,
        tren: 0,
        itinerario: "",
        estaciones: [],
        horarios: [],
    };

    if (itFiltrados.length === 1) {
        const result = itFiltrados[0];
        if (result.tren % 2 === 0) {
            result.estaciones.reverse();
            result.horarios.reverse();
        }
        return result;
    }
    
    return horarios;
}

/**
 * Busca el cambio de turno de un personal específico en una lista de cambios de turnos.
 *
 * Este método itera a través de un array de cambios de turnos y busca el cambio que coincide
 * con la fecha y el legajo del personal proporcionado. Si encuentra un cambio, devuelve el
 * objeto de personal que ha sido asignado como reemplazo.
 *
 * @param cambiosTurnos - Un array de objetos que representan cambios de turnos.
 * @param inputDate - La fecha de cambio de turno que se utilizará para buscar coincidencias.
 * @param legajo - El legajo del personal cuyo cambio se desea encontrar.
 *
 * @returns El objeto de personal que ha sido asignado como reemplazo, o `undefined` si no se encuentra.
 */
export function buscarCambioTurno(cambiosTurnos: CambioTurno[], inputDate: string, legajo: number) {
    let cambiado;
    for (let i = 0; i < cambiosTurnos.length; i++) {
        if (esFechaIgual(cambiosTurnos[i].fechaCambio, inputDate)) {
            if (cambiosTurnos[i].personal[0].legajo === legajo) {
                cambiado = cambiosTurnos[i].personal[1];
                break; // Salir del bucle una vez encontrado
            } else if (cambiosTurnos[i].personal[1].legajo === legajo) {
                cambiado = cambiosTurnos[i].personal[0];
                break; // Salir del bucle una vez encontrado
            }
        }
    }
    return cambiado;
}