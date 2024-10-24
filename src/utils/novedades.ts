import { Novedad } from "@/interfaces/INovedades";

export function filtrarNovedadesPorLegajo(legajo: number, novedades: Novedad[]): Novedad[] {
    return novedades.filter(novedad => novedad.legajo === legajo && !novedad.novedadInactiva);
}

export function filtrarRelevosPorLegajo(legajo: number, novedades: Novedad[]): Novedad[] {
    return novedades.filter(novedad => 
        novedad.remplazo.some(remplazo => remplazo.legajo === legajo) && !novedad.novedadInactiva
    );
}
