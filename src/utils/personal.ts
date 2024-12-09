import { Novedad, Remplazo } from "@/interfaces/INovedades";
import { esFechaIgual, esFechaMayorIgual } from "./fechas";
import { IPersonal } from "@/interfaces/IPersonal";
import { ITurno } from "@/interfaces/ITurno";
import { CambioTurno } from "@/interfaces/ICambioTurno";

/**
 * Busca y asigna el personal a cargo para los turnos a imprimir en una fecha específica.
 *
 * @param {Date} fecha - Fecha actual para la consulta.
 * @param {string} inputDate - Fecha en formato string (YYYY-MM-DD) que se compara con las fechas de las novedades.
 * @param {ITurno[]} turnosAImprimir - Lista de turnos que se van a imprimir y se les asignará el personal.
 * @param {IPersonal[]} personales - Lista de personal disponible.
 * @param {Novedad[]} novedades - Lista de novedades que afectan al personal.
 * @param {CambioTurno[]} cambiosTurnos - Lista de cambios de turnos realizados por el personal.
 * 
 * @throws {Error} - Si ocurre un error durante el procesamiento, se captura y se muestra en la consola.
 */
export function buscarPersonalACargo(
    fecha: Date, 
    inputDate: string, 
    turnosAImprimir: ITurno[], 
    personales: IPersonal[], 
    novedades: Novedad[], 
    cambiosTurnos: CambioTurno[],
): Record<string, Novedad > {
    try {
        const resultado: Record<string, Novedad > = {};

        turnosAImprimir.forEach((turno: ITurno) => {
            // Inicializa el valor por defecto como null para el turno actual
            // resultado[turno.turno] = null;

            // Obtiene el personal relacionado con este turno
            const personal = filtroPersonal(turno.turno, fecha, personales);

            if (!personal) {
                console.warn(`No se encontró personal para el turno: ${turno.turno}`);
                return;
            }

            novedades.forEach((novedad: Novedad) => {
                const { legajo, fechaBaja, fechaAlta, HNA, novedadInactiva } = novedad;

                // Verifica si la novedad es activa y está relacionada con el personal
                const tieneNovedadActiva = !novedadInactiva &&
                    (
                        (HNA && esFechaMayorIgual(inputDate, fechaBaja)) ||
                        (esFechaMayorIgual(inputDate, fechaBaja) && esFechaMayorIgual(fechaAlta, inputDate))
                    );

                if (legajo === personal.legajo && tieneNovedadActiva) {
                    // Si el personal está sin cubrir, asocia la novedad al turno
                    personal.nombres = obtenerNombreConReemplazo(novedad, inputDate, cambiosTurnos);

                    if (personal.nombres === "Sin Cubrir") {
                        resultado[turno.turno] = novedad;
                    }
                }
            });

            // Maneja cambios de turno si es necesario
            const cambiado = buscarCambioTurno(cambiosTurnos, inputDate, personal.legajo);
            turno.personal = cambiado
                ? `${cambiado.apellido} ${cambiado.nombres}`
                : personal.nombres;
        });

        return resultado;
    } catch (error) {
        console.error("Error en buscarTurnosSinCubrir:", error);
        return {};
    }
}

/**
 * Filtra el personal según el turno y la fecha proporcionada.
 *
 * @param turno - El turno que se desea buscar. Puede tener formato 'diag.diaLab' o ser un turno directo.
 * @param fecha - La fecha que se utilizará para calcular el franco del personal.
 * @param personales - La lista de personal en la que se buscará.
 * @returns Un objeto con el turno, el legajo del personal encontrado, y una cadena con el nombre y apellido del personal (y su ayudante si existe).
 */
export function filtroPersonal(turno: string, fecha: Date, personales: IPersonal[]) {
    turno = turno.trim().toLowerCase();
    
    let titular: IPersonal[] = [];
    
    if (turno.includes("prog")) {
        // Filtra personal en turno "prog"
        titular = personales.filter(
            (personal) => personal.turno && personal.turno.toLowerCase().includes("prog")
        );
    } else if (turno.indexOf(".") !== -1) {
        const [diag, diaLabStr] = turno.split(".");
        const diaLab = Number(diaLabStr);
        
        if (isNaN(diaLab)) {
            console.error(`El valor después del punto no es un número válido: ${turno}`);
            return { turno, legajo: 0, nombres: "" };
        }

        const franco = dia_laboral(diaLab, fecha.getDay());

        titular = personales.filter(
            (personal) => personal.turno === diag && Number(personal.franco) === franco
        );
    } else {
        // Turnos directos sin punto ni 'prog'
        titular = personales.filter(
            (personal) => personal.turno && personal.turno.toLowerCase() === turno
        );
    }

    if (titular.length === 0) {
        return { turno, legajo: 0, nombres: "" };
    }

    const [titularPrincipal, titularAyudante] = titular;
    
    return {
        turno,
        legajo: titularPrincipal.legajo,
        nombres: titularAyudante
            ? `${titularPrincipal.apellido} ${titularPrincipal.nombres} - Ayudante: ${titularAyudante.apellido} ${titularAyudante.nombres}`
            : `${titularPrincipal.apellido} ${titularPrincipal.nombres}`
    };
}
/**
 * Calcula el día del franco del turno en función del día laboral y el día actual de la semana.
 * 
 * @param diaLaboral - Un número entero (0-6) que representa el día laboral del turno (donde 0 es Domingo y 6 es Sábado).
 * @param hoy - Un número entero (0-6) que representa el día de la semana actual (donde 0 es Domingo y 6 es Sábado).
 * 
 * @returns Un número entero que representa el día del franco del turno basado en el diagrama de rotación.
 */
export function dia_laboral(diaLaboral: number, hoy: number): number {
    /*   # devuelve el día de la semana como un número entero donde el Domingo 
    está indexado como 0 y el Sábado como 6
    Al ingresarle por parámetros la cantidad de días del turno pos franco y 
    el dia de la semana actual devuelve el dia del franco del turno mismo. */
    const diagrama = [
        [0, 1, 2, 3, 4, 5, 6],
        [6, 0, 1, 2, 3, 4, 5],
        [5, 6, 0, 1, 2, 3, 4],
        [4, 5, 6, 0, 1, 2, 3],
        [3, 4, 5, 6, 0, 1, 2],
        [2, 3, 4, 5, 6, 0, 1],
        [1, 2, 3, 4, 5, 6, 0],
    ];
    if (diaLaboral < 0 || diaLaboral > 6 || hoy < 0 || hoy > 6) {
        throw new Error("Los valores de 'diaLaboral' y 'hoy' deben estar en el rango de 0 a 6.");
    }
    return diagrama[diaLaboral][hoy]; //:franco
}
/**
 * Obtiene el nombre del personal que reemplaza a otro en una novedad según la fecha dada.
 * Si se encuentra un cambio de turno, devuelve el nombre del personal cambiado.
 * Si no hay reemplazo para la fecha, devuelve "Sin Cubrir".
 *
 * @param novedad - Objeto que contiene los detalles de la novedad del personal, incluyendo posibles reemplazos.
 * @param inputDate - La fecha en formato string (YYYY-MM-DD) que se usa para determinar si un reemplazo está activo.
 * @param cambiosTurnos - Un array de cambios de turno que puede modificar quién cubre el relevo.
 *
 * @returns El nombre del personal de reemplazo o "Sin Cubrir" si no se encuentra un reemplazo válido.
 */
export function obtenerNombreConReemplazo(novedad: Novedad, inputDate: string, cambiosTurnos: CambioTurno[]): string {
    if (!novedad || !novedad.remplazo || novedad.remplazo.length === 0) {
        return "Sin Cubrir";
    }

    const remplazo = novedad.remplazo.find((remplazo: Remplazo) => {
        return (
            esFechaMayorIgual(inputDate, remplazo.inicioRelevo) &&
            ((remplazo.finRelevo && esFechaMayorIgual(remplazo.finRelevo, inputDate)) || !remplazo.finRelevo)
        );
    });

    if (!remplazo || remplazo.legajo == null) {
        return "Sin Cubrir";
    }

    const cambiado = buscarCambioTurno(cambiosTurnos, inputDate, remplazo.legajo);
    return cambiado
        ? `${cambiado.apellido} ${cambiado.nombres}`
        : `${remplazo.apellido} ${remplazo.nombres}`;
}
export function buscarCambioTurno(cambiosTurnos: CambioTurno[], inputDate: string, legajo: number) {
    const cambiado = cambiosTurnos.find(cambio => 
        esFechaIgual(cambio.fechaCambio, inputDate) &&
        (cambio.personal[0].legajo === legajo || cambio.personal[1].legajo === legajo)
    );

    return cambiado ? (cambiado.personal[0].legajo === legajo ? cambiado.personal[1] : cambiado.personal[0]) : undefined;
}

/**
 * Obtiene una lista de dotaciones únicas a partir de un array de personal.
 *
 * Esta función filtra los elementos del array de personal para obtener aquellos
 * que tienen definida la propiedad "dotacion" y luego retorna un array con
 * las dotaciones únicas.
 *
 * @param personal - Un array de objetos que representan al personal, donde
 *                   cada objeto puede tener una propiedad "dotacion".
 *
 * @returns Un array de dotaciones únicas encontradas en el array de personal.
 */
export function obtenerDotaciones(personal: IPersonal[]) {
    // Filtramos aquellos turnos que tengan definida la propiedad "dotacion"
    const dotacionesUnicas = [
        ...new Set(personal
            .filter((p) => p.dotacion != null) // Usar != para incluir tanto undefined como null
            .map((p) => p.dotacion))
    ];

    return dotacionesUnicas;
}


