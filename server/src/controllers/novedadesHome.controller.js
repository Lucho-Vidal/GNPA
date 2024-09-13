import Novedades from "../models/NovedadesHome";

export const getNovedadesHome = async (req, res) => {
    try {
        // Recupera todas las novedades de la base de datos
        const novedades = await Novedades.find();

        // Responde con los resultados en formato JSON
        res.status(200).json(novedades);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de novedades
        console.error("Error al obtener novedades:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const getNovedadHome = async (req, res) => {
    try {
        // Recupera la novedad según el ID proporcionado en los parámetros
        const novedad = await Novedades.findById(req.params.id);

        // Verifica si se encontró la novedad
        if (novedad) {
            // Responde con la novedad en formato JSON
            res.status(200).json(novedad);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Novedad no encontrada" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de la novedad
        console.error("Error al obtener la novedad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const createNovedadHome = async (req, res) => {
    try {
        const {
            fecha,
            titulo,
            description,
            activo,
            img
        } = req.body;

        // Crea una nueva instancia de la novedad con los datos proporcionados
        const newNovedad = new Novedades({
            fecha,
            titulo,
            description,
            activo,
            img
        });

        // Guarda la nueva novedad en la base de datos
        const savedNovedad = await newNovedad.save();

        // Responde con la novedad recién creada en formato JSON
        res.status(201).json(savedNovedad);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la creación de la novedad
        console.error("Error al crear la novedad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const updateNovedadHomeById = async (req, res) => {
    try {
        // Utiliza findByIdAndUpdate para buscar la novedad por ID y actualizarla con los datos del cuerpo de la solicitud
        const updateNovedad = await Novedades.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verifica si se encontró y actualizó la novedad
        if (updateNovedad) {
            // Responde con la novedad actualizada en formato JSON
            res.json(updateNovedad);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Novedad no encontrada" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la actualización de la novedad
        console.error("Error al actualizar la novedad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const deleteNovedadHomeById = async (req, res) => {
    try {
        // Utiliza findByIdAndDelete para buscar la novedad por ID y eliminarla
        const novedad = await Novedades.findByIdAndDelete(req.params.id);

        // Verifica si se encontró y eliminó la novedad
        if (novedad) {
            // Responde con la novedad eliminada en formato JSON
            res.json(novedad);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Novedad no encontrada" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la eliminación de la novedad
        console.error("Error al eliminar la novedad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};