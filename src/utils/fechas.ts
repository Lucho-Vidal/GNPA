/**
 * Compara dos fechas en formato string para verificar si la primera es mayor que la segunda.
 *
 * @param {string} dateMayor - Fecha en formato string que se evaluará si es mayor.
 * @param {string} dateMenor - Fecha en formato string que se evaluará si es menor.
 * @returns {boolean} - Retorna true si la fecha `dateMayor` es mayor que `dateMenor`, de lo contrario false.
 */
export function esFechaMayor(dateMayor: string, dateMenor: string): boolean {
    if (dateMayor && dateMenor) {
        const dateObjMayor = new Date(dateMayor);
        const dateObjMenor = new Date(dateMenor);
        return dateObjMayor > dateObjMenor;
    }
    return false;
}

/**
 * Compara dos fechas en formato string para verificar si la primera es mayor o igual que la segunda.
 *
 * @param {string} dateMayor - Fecha en formato string que se evaluará si es mayor.
 * @param {string} dateMenor - Fecha en formato string que se evaluará si es menor.
 * @returns {boolean} - Retorna true si la fecha `dateMayor` es mayor o igual que `dateMenor`, de lo contrario false.
 */
export function esFechaMayorIgual(dateMayor: string, dateMenor: string) {
    if (dateMayor && dateMenor) {
        const dateObjMayor = new Date(dateMayor);
        const dateObjMenor = new Date(dateMenor);
        return dateObjMayor >= dateObjMenor;
    }
    return false;
}

/**
 * Compara dos fechas en formato string y determina si son iguales.
 * Valida el formato de las fechas antes de realizar la comparación.
 *
 * @param {string} dateMayor - La primera fecha en formato ISO (YYYY-MM-DD).
 * @param {string} dateMenor - La segunda fecha en formato ISO (YYYY-MM-DD).
 * @returns {boolean} - Retorna `true` si las fechas son iguales, de lo contrario `false`.
 */
export function esFechaIgual(dateMayor: string, dateMenor: string): boolean {
    if (!dateMayor || !dateMenor) return false;

    const formatDate = (date: string): string | null => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString().split("T")[0];
    };

    const formattedDateMayor = formatDate(dateMayor);
    const formattedDateMenor = formatDate(dateMenor);

    return formattedDateMayor !== null && formattedDateMayor === formattedDateMenor;
}

/**
 * Compara dos horas en formato de cadena (HH:mm) y determina su diferencia.
 * Valida el formato de las horas antes de realizar la comparación.
 *
 * @param {string} hora1 - La primera hora en formato HH:mm.
 * @param {string} hora2 - La segunda hora en formato HH:mm.
 * @returns {number | null} - Un número negativo si `hora1` es menor que `hora2`,
 *                             cero si son iguales, y un número positivo si `hora1` es mayor que `hora2`.
 *                             Retorna null si el formato de entrada es inválido.
 *
 * @example
 * compararHoras('14:30', '13:15'); // devuelve 1
 * compararHoras('09:00', '09:00'); // devuelve 0
 * compararHoras('08:15', '09:45'); // devuelve -1
 */
export function compararHoras(hora1: string, hora2: string): number | null {
    const validarFormatoHora = (hora: string): boolean => {
        const regex = /^([01]?\d|2[0-3]):([0-5]?\d)$/; // Expresión regular para validar el formato HH:mm
        return regex.test(hora);
    };

    if (!validarFormatoHora(hora1) || !validarFormatoHora(hora2)) {
        console.error("Formato de hora inválido. Debe ser HH:mm.");
        return null; // O lanzar un error si prefieres
    }

    // Extraer las horas y minutos de cada cadena
    const [hora1Hours, hora1Minutes] = hora1.split(":").map(Number);
    const [hora2Hours, hora2Minutes] = hora2.split(":").map(Number);

    // Comparar horas
    if (hora1Hours !== hora2Hours) {
        return hora1Hours - hora2Hours;
    }

    // Si las horas son iguales, comparar minutos
    return hora1Minutes - hora2Minutes;
}
/**
 * Recibe una hora en formato string y devuelve una fecha con la hora recibida por parámetro.
 * Si el parámetro no es convertible a número, retorna null.
 * Valida el formato de la hora antes de realizar la conversión.
 *
 * @param {string} hora - Hora en formato 'HH:mm', obligatorio.
 * @param {boolean} [incrementarDia=false] - Si se pasa true, suma un día a la fecha que se retorna.
 * @returns {Date | null} - Devuelve un objeto Date con la hora establecida, o null si la hora es inválida.
 *
 * @example
 * newDate('14:30'); // Retorna un Date con la hora 14:30 del día actual
 * newDate('14:30', true); // Retorna un Date con la hora 14:30 del día siguiente
 * newDate('invalid-hour'); // Retorna null
 */
export function newDate(hora: string, incrementarDia: boolean = false): Date | null {
    // Validar el formato de la hora
    const regex = /^([01]?\d|2[0-3]):([0-5]?\d)$/; // Formato HH:mm
    if (!regex.test(hora)) {
        // console.error(`Formato de hora inválido. Debe ser 'HH:mm'. ${hora}`);
        return null; // O lanzar un error si prefieres
    }

    const [horaN, minutosN] = hora.split(":").map(Number);
    let date = new Date();
    date.setHours(horaN);
    date.setMinutes(minutosN);

    // Verificar si horaN y minutosN son números válidos
    if (isNaN(horaN) || isNaN(minutosN)) return null;

    // Si incrementarDia es verdadero, sumamos 1 día a la fecha
    if (incrementarDia) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}

/**
 * Calcula la diferencia entre dos horas en formato 'HH:mm'.
 * 
 * @param {string} hora1 - La primera hora en formato 'HH:mm' o 'HH:mm:ss'. 
 * Debe estar en un formato que pueda ser interpretado por el objeto Date.
 * 
 * @param {string} hora2 - La segunda hora en formato 'HH:mm' o 'HH:mm:ss'.
 * Debe estar en un formato que pueda ser interpretado por el objeto Date.
 * 
 * @returns {string} La diferencia entre las dos horas en formato 'HH:mm'.
 * Si la diferencia es negativa (es decir, hora2 es anterior a hora1),
 * se asume que hora2 corresponde al día siguiente y se ajusta en consecuencia.
 * Si alguna de las horas no es válida, se devuelve una cadena vacía.
 * 
 * @example
 * // Devuelve '02:30' si hora1 es '12:00' y hora2 es '14:30'
 * diferenciaHoras('12:00', '14:30');
 * 
 * @example
 * // Devuelve '01:30' si hora1 es '23:00' y hora2 es '00:30' (del día siguiente)
 * diferenciaHoras('23:00', '00:30');
 * 
 * @example
 * // Devuelve '' si la hora es inválida
 * diferenciaHoras('invalid', '14:30'); // Devuelve ''
 * 
 * @example
 * // Devuelve '' si la hora es inválida
 * diferenciaHoras('12:00', 'invalid'); // Devuelve ''
 */
export function diferenciaHoras(hora1: string, hora2: string): string {

    // Crear las fechas
    let dateDesde = newDate(hora1);
    let dateHasta = newDate(hora2);
    
    // Si la fecha no es válida, devolver una cadena vacía
    if (!dateDesde || !dateHasta) return '';

    // Si la hora2 es anterior a la hora1, asumimos que es el día siguiente
    if (dateHasta < dateDesde) {
        dateHasta = newDate(hora2, true); // Incrementar el día en hora2
        
        // Volvemos a verificar si la fecha es válida
        if (!dateHasta) return '';
    }

    // Calcular la diferencia en minutos
    let minutos = (dateHasta.getTime() - dateDesde.getTime()) / 1000 / 60;
    
    let horas = Math.floor(minutos / 60);  // Obtener las horas completas
    minutos = Math.round(minutos % 60);    // Redondear los minutos restantes
    
    // Formatear el resultado para que siempre muestre dos dígitos en horas y minutos
    const horasStr = horas.toString().padStart(2, '0');
    const minutosStr = minutos.toString().padStart(2, '0');
    
    return `${horasStr}:${minutosStr}`;
}

/**
 * Calcula y actualiza el total de horas en cada día a partir de los valores 'tomo' y 'dejo'.
 * Reinicia el conteo total cuando 'tomo' es igual a 'DH'.
 *
 * @param {Record<string, any>} dias - Un objeto que representa los días.
 * @returns {Record<string, any>} El objeto original con las propiedades 'totalHoras' actualizadas.
 */
export function calcularTotalHoras(dias: Record<string, any>): Record<string, any> {
    let totalMinutosAcumulados = 0;
    let reiniciar = false;

    // console.table(dias)

    for (const dia in dias) {
        const jornada = dias[dia];
        reiniciar = false;
        
        if (jornada.tomo === 'DH') {
            reiniciar = true;
            totalMinutosAcumulados = 0;
            jornada.totalHoras = '';
            continue;
        }

        if (!reiniciar) {
            const horas = diferenciaHoras(jornada.tomo, jornada.dejo);
            
            if (horas) {
                const [horasHH, minutosMM] = horas.split(':').map(Number);
                const minutosTotales = horasHH * 60 + minutosMM;
                totalMinutosAcumulados += minutosTotales;
            } else {
                jornada.totalHoras = '';
                continue;
            }
        }

        // if (reiniciar && jornada.tomo !== 'DH') {
        //     reiniciar = false;
        // }

        const horasTotales = Math.floor(totalMinutosAcumulados / 60);
        const minutosRestantes = totalMinutosAcumulados % 60;

        const horasStr = horasTotales.toString().padStart(2, '0');
        const minutosStr = minutosRestantes.toString().padStart(2, '0');

        jornada.totalHoras = `${horasStr}:${minutosStr}`;
    }

    return dias;
}

/**
 * Suma una cantidad de horas a una hora dada en formato 'HH:mm'.
 * 
 * @param {string} hora - La hora inicial en formato 'HH:mm'.
 * Debe estar en un formato válido que pueda ser interpretado.
 * 
 * @param {number} cantidadHoras - El número de horas que se van a sumar a la hora proporcionada.
 * Puede ser cualquier número positivo o negativo.
 * 
 * @returns {string} La hora resultante en formato 'HH:mm', ajustada para estar dentro de un formato de 24 horas.
 * Si la hora proporcionada es inválida, devuelve una cadena vacía.
 * 
 * @example
 * // Devuelve '04:00' si hora es '23:00' y cantidadHoras es 5
 * sumarHoras('23:00', 5);
 * 
 * @example
 * // Devuelve '23:00' si hora es '23:00' y cantidadHoras es 0
 * sumarHoras('23:00', 0);
 * 
 * @example
 * // Devuelve '' si la hora es inválida
 * sumarHoras('invalid', 5); // Devuelve ''
 * 
 * @example
 * // Devuelve '00:30' si hora es '23:30' y cantidadHoras es 1
 * sumarHoras('23:30', 1);
 */

export function sumarHoras(hora: string, cantidadHoras: number): string {
    // Función auxiliar para crear una fecha con la hora proporcionada
    function newDate(hora: string) {
        const partes = hora.split(":");

        // Validar que la hora tenga el formato adecuado (hh:mm)
        if (partes.length !== 2) return null;

        const [horaN, minutosN] = partes.map(Number);

        // Verificar si horaN y minutosN son números válidos
        if (isNaN(horaN) || isNaN(minutosN)) return null;

        let date = new Date();
        date.setHours(horaN);
        date.setMinutes(minutosN);
        return date;
    }

    // Crear la fecha inicial a partir de la hora proporcionada
    let date = newDate(hora);

    // Si la fecha no es válida, devolver una cadena vacía
    if (!date) return '';

    // Sumar la cantidad de horas a la fecha
    date.setHours(date.getHours() + cantidadHoras);

    // Ajustar el resultado para que siempre esté dentro del rango de 0-23 horas
    let horas = date.getHours();
    let minutos = date.getMinutes();

    // Si el valor de horas excede 24, ajustar para el formato de 24 horas
    horas = horas % 24;

    // Formatear para que siempre sean dos dígitos
    const horasStr = horas.toString().padStart(2, '0');
    const minutosStr = minutos.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr}`;
}

/**
 * Calcula el día anterior a una fecha dada en formato 'YYYY-MM-DD'.
 * 
 * @param {string} fecha - La fecha en formato 'YYYY-MM-DD'.
 * 
 * @returns {string} La fecha del día anterior en formato 'YYYY-MM-DD'.
 * Si la fecha no es válida, se devuelve una cadena vacía.
 * 
 * @example
 * // Devuelve '2024-10-15' si la fecha es '2024-10-16'
 * diaAnterior('2024-10-16');
 * 
 * @example
 * // Devuelve '' si la fecha es inválida
 * diaAnterior('invalid');
 */
export function diaAnterior(fecha: string): string {
    // Crear una instancia de Date a partir del string proporcionado
    let date = new Date(fecha);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        // throw new Error('Fecha inválida'); // Lanzar un error si la fecha no es válida
        return ''
    }

    // Restar un día
    date.setDate(date.getDate() - 1);

    // Formatear el resultado como "YYYY-MM-DD"
    return date.toISOString().split('T')[0]; // Utilizar toISOString para formatear la fecha
}

/**
 * Obtiene la fecha de dos días anteriores a partir de una fecha proporcionada en formato 'YYYY-MM-DD'.
 *
 * @param {string} fecha - La fecha en formato 'YYYY-MM-DD'. Debe ser una cadena válida que pueda ser interpretada por el objeto Date.
 * @returns {string} La fecha de dos días anteriores en formato 'YYYY-MM-DD'.
 * 
 * @example
 * // Devuelve '2024-10-15' si la fecha es '2024-10-17'.
 * dosDiasAnterior('2024-10-17');
 * 
 * @example
 * // Devuelve '2024-01-01' si la fecha es '2024-01-03'.
 * dosDiasAnterior('2024-01-03');
 */
export function dosDiasAnterior(fecha: string): string {
    const date = new Date(fecha);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        // throw new Error('Fecha inválida'); // Lanzar un error si la fecha no es válida
        return '';
    }

    // Restar dos días
    date.setDate(date.getDate() - 2);

    // Formatear el resultado como "YYYY-MM-DD"
    return date.toISOString().split('T')[0]; // Utilizar toISOString para formatear la fecha
}

/**
 * Obtiene la fecha del día siguiente a partir de una fecha proporcionada en formato 'YYYY-MM-DD'.
 *
 * @param {string} fecha - La fecha en formato 'YYYY-MM-DD'. Debe ser una cadena válida que pueda ser interpretada por el objeto Date.
 * @returns {string} La fecha del día siguiente en formato 'YYYY-MM-DD'.
 * 
 * @example
 * // Devuelve '2024-10-18' si la fecha es '2024-10-17'.
 * diaPosterior('2024-10-17');
 * 
 * @example
 * // Devuelve '2024-01-01' si la fecha es '2023-12-31'.
 * diaPosterior('2023-12-31');
 */
export function diaPosterior(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
  
    // Crear una nueva fecha manualmente
    const date = new Date(year, month - 1, day); // Los meses en JS van de 0 a 11
  
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        // throw new Error('Fecha inválida'); // Lanzar un error si la fecha no es válida
        return '';
    }
  
    // Sumar un día
    date.setDate(date.getDate() + 1);
  
    // Obtener los nuevos valores de año, mes y día
    const newYear = date.getFullYear();
    const newMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura formato de 2 dígitos
    const newDay = date.getDate().toString().padStart(2, '0');
  
    // Devolver la nueva fecha en formato YYYY-MM-DD
    return `${newYear}-${newMonth}-${newDay}`;
  }

  const diasDeLaSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

/**
 * Obtiene el índice del día de la semana correspondiente al nombre dado.
 *
 * @param dia - El nombre del día de la semana (por ejemplo, "Lunes").
 * @returns El índice del día en la semana (0 para "Domingo", 1 para "Lunes", etc.), 
 * o -1 si el día no se encuentra en la lista.
 */
export function obtenerNumeroDia(dia: string): number {
    return diasDeLaSemana.findIndex((nombre) => nombre === dia);
}

/**
 * Obtiene el nombre del día de la semana correspondiente a un número dado.
 *
 * @param num - El índice del día de la semana (0 para "Domingo", 1 para "Lunes", etc.).
 * @returns El nombre del día correspondiente al índice dado, o `undefined` si el número está fuera de rango.
 */
export function obtenerDiaSemana(num: number): string | undefined {
    return diasDeLaSemana[num];
}

/**
 * Determina el tipo de itinerario basado en el día de la semana.
 *
 * @param fecha - Un objeto de tipo Date que representa la fecha a evaluar.
 * @returns Una cadena que representa el tipo de itinerario:
 * - "D" para domingo.
 * - "S" para sábado.
 * - "H" para días hábiles (lunes a viernes).
 */
export function itinerarioType(fecha: Date): string {
    const day = fecha.getDay();
    if (day === 0) {
        return "D"; // Domingo
    } else if (day === 6) {
        return "S"; // Sábado
    } else {
        return "H"; // Días hábiles
    }
}
/**
 * Formatea una fecha en formato "dd/mm/yyyy hh:mm" basado en el formato de Argentina ("es-AR").
 * Si la fecha es inválida, devuelve el mensaje "Fecha inválida".
 *
 * @param {string} fechaString - La fecha en formato string que se desea formatear.
 *        Ejemplos válidos: "2024-10-23T14:00:00", "2023-01-01 12:30:00".
 *        Ejemplo inválido: "fecha no válida".
 * @returns {string} - La fecha formateada en "dd/mm/yyyy hh:mm" o "Fecha inválida" si el formato no es válido.
 *
 * @example
 * formatearFecha("2024-10-23T14:00:00"); // "23/10/2024 14:00"
 *
 * @example
 * formatearFecha("fecha no válida"); // "Fecha inválida"
 */
export function formatearFecha(fechaString: string): string {
    const fecha: Date = new Date(fechaString);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        return "Fecha inválida"; // Mensaje en caso de que la fecha sea inválida
    }

    const opcionesDeFormato: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    const formatoFecha = new Intl.DateTimeFormat("es-AR", opcionesDeFormato);

    return formatoFecha.format(fecha);
}
