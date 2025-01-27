import CambioTurno from "../models/cambioTurno";

export const obtenerCambioTurno = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await CambioTurno.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getCambioTurnos = async (req, res) => {
    try {
        // Recupera todas las novedades de la base de datos
        const cambioTurno = await CambioTurno.find();

        // Responde con los resultados en formato JSON
        res.status(200).json(cambioTurno);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de novedades
        console.error("Error al obtener cambio de turno:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const getUltimaCambioTurno = async (req, res) => {
    
    try {
        // Recupera la última novedad de la base de datos ordenada por _id en orden descendente
        //const ultimaNovedad = await Novedades.findOne().sort({ _id: -1 });
        const ultimoCambio = await CambioTurno.find().sort({ $natural: -1 }).limit(1);
        // Verifica si se encontró alguna novedad
        if (ultimoCambio) {
            // Responde con la última novedad en formato JSON
            res.status(200).json(ultimoCambio);
        } else {
            // Si no se encuentra ninguna novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "No se encontraron cambios" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de la última novedad
        console.error("Error al obtener la último cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const getCambioTurno = async (req, res) => {
    try {
        // Recupera la novedad según el ID proporcionado en los parámetros
        const cambioTurno = await CambioTurno.findById(req.params.id);

        // Verifica si se encontró la novedad
        if (cambioTurno) {
            // Responde con la novedad en formato JSON
            res.status(200).json(cambioTurno);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "cambio no encontrada" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la recuperación de la novedad
        console.error("Error al obtener la cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const createCambioTurno = async (req, res) => {
    try {
        const {
            _id,
            fechaCambio,
            personal
        } = req.body;
        console.log(req.body);

        // Crea una nueva instancia de la novedad con los datos proporcionados
        const newCambio = new CambioTurno({
            _id,
            fechaCambio,
            personal
        });

        // Guarda la nueva novedad en la base de datos
        const savedCambio = await newCambio.save();

        // Responde con la novedad recién creada en formato JSON
        res.status(201).json(savedCambio);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la creación de la novedad
        console.error("Error al crear la cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const updateCambioTurnoById = async (req, res) => {
    try {
        // Utiliza findByIdAndUpdate para buscar la novedad por ID y actualizarla con los datos del cuerpo de la solicitud
        const updateCambio = await CambioTurno.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verifica si se encontró y actualizó la novedad
        if (updateCambio) {
            // Responde con la novedad actualizada en formato JSON
            res.json(updateCambio);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "Cambio no encontrado" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la actualización de la novedad
        console.error("Error al actualizar el cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const deleteCambioTurnoById = async (req, res) => {
    try {
        // Utiliza findByIdAndDelete para buscar la novedad por ID y eliminarla
        const cambio = await CambioTurno.findByIdAndDelete(req.params.id);

        // Verifica si se encontró y eliminó la novedad
        if (cambio) {
            // Responde con la novedad eliminada en formato JSON
            res.json(cambio);
        } else {
            // Si no se encuentra la novedad, responde con un código 404 (Not Found)
            res.status(404).json({ mensaje: "cambio no encontrado" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la eliminación de la novedad
        console.error("Error al eliminar el cambio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};