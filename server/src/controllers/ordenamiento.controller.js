import CambioTurno from "../models/cambioTurno";
import Ordenamiento from "../models/Ordenamiento";

export const obtenerOrdenamiento = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Ordenamiento.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getOrdenamientos = async (req, res) => {
    try {
        // Recupera todas las novedades de la base de datos
        const ordenamiento = await Ordenamiento.find();

        // Responde con los resultados en formato JSON
        res.status(200).json(ordenamiento);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de novedades
        console.error("Error al obtener ordenamientos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const getOrdenamiento = async (req, res) => {
    try {
        // Recupera la novedad según el ID proporcionado en los parámetros
        const ordenamiento = await Ordenamiento.findById(req.params.id);

        // Verifica si se encontró la novedad
        if (ordenamiento) {
            // Responde con la novedad en formato JSON
            res.status(200).json(ordenamiento);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "ordenamiento no encontrado" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de la novedad
        console.error("Error al obtener la cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const createOrdenamiento = async (req, res) => {
    try {
        const {
            
            fecha,
            tipo,
            turnoEfectivo,
            toma,
            deja,
            personal,
            turno,
            detalle
        } = req.body;
        console.log(req.body);

        // Crea una nueva instancia de la novedad con los datos proporcionados
        const ordenamiento = new Ordenamiento({
            
            fecha,
            tipo,
            turnoEfectivo,
            toma,
            deja,
            personal,
            turno,
            detalle
        });

        // Guarda la nueva novedad en la base de datos
        const ordenamientoSaved = await ordenamiento.save();

        // Responde con la novedad recién creada en formato JSON
        res.status(201).json(ordenamientoSaved);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la creación de la novedad
        console.error("Error al crear la cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const updateOrdenamientoById = async (req, res) => {
    try {
        // Utiliza findByIdAndUpdate para buscar la novedad por ID y actualizarla con los datos del cuerpo de la solicitud
        const updateOrdenamiento = await Ordenamiento.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verifica si se encontró y actualizó la novedad
        if (updateOrdenamiento) {
            // Responde con la novedad actualizada en formato JSON
            res.json(updateCambio);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Ordenamiento no encontrado" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la actualización de la novedad
        console.error("Error al actualizar el cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const deleteOrdenamientoById = async (req, res) => {
    try {
        // Utiliza findByIdAndDelete para buscar la novedad por ID y eliminarla
        const ordenamiento = await Ordenamiento.findByIdAndDelete(req.params.id);

        // Verifica si se encontró y eliminó la novedad
        if (ordenamiento) {
            // Responde con la novedad eliminada en formato JSON
            res.json(ordenamiento);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Ordenamiento no encontrado" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la eliminación de la novedad
        console.error("Error al eliminar el Ordenamiento:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};