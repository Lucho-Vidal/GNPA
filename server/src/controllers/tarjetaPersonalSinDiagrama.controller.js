import Tarjeta from "../models/tarjetaPersonalSinDiagrama";
import mongoose from 'mongoose';

export const obtenerTarjetas = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Tarjeta.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getTarjetaPersonalesSinDiagrama = async (req, res) => {
    try {
        // Obtener todos los registros de la colección Personal
        const tarjeta = await Tarjeta.find();
        

        // Responder con los registros obtenidos
        res.json(tarjeta);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener los registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getTarjetaPersonalSinDiagramaById = async (req, res) => {
    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        // Obtener un registro específico por ID
        const tarjeta = await Tarjeta.findById(req.params.id);
        
        // Verificar si se encontró el registro
        if (!tarjeta) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro encontrado
        res.json(tarjeta);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener el registro de tarjeta por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const getTarjetaPersonalSinDiagramaPorLegajo = async (req, res) => {
    try {
        // Obtener legajo y mes de los parámetros de la consulta
        const { legajo } = req.query;

        // Validar que legajo y mes existan en la consulta
        if (!legajo ) {
            return res.status(400).json({ error: 'Falta parámetro legajo' });
        }

        // Convertir legajo a número para asegurar el tipo correcto
        const legajoNumber = Number(legajo);

        // Verificar si la conversión a número fue exitosa
        if (isNaN(legajoNumber)) {
            return res.status(400).json({ error: 'Legajo debe ser un número' });
        }

        // Buscar en la base de datos por legajo 
        const tarjeta = await Tarjeta.findOne({ legajo: legajoNumber});

        // Verificar si se encontró algún registro
        if (!tarjeta) {
            return res.status(404).json({ error: 'No se encontraron registros con los parámetros proporcionados' });
        }

        // Responder con el registro encontrado
        res.json(tarjeta);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener el registro de Personal por Legajo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getTarjetaPersonalSinDiagramaPorLegajoYMes = async (req, res) => {
    try {
        // Obtener legajo y mes de los parámetros de la ruta
        const { legajo, mes } = req.query;

        // Validar que legajo y mes existan en la consulta
        if (!legajo || !mes) {
            return res.status(400).json({ error: 'Faltan parámetros legajo o mes' });
        }

        // Convertir legajo a número para asegurar el tipo correcto
        const legajoNumber = Number(legajo);

        // Verificar si la conversión a número fue exitosa
        if (isNaN(legajoNumber)) {
            return res.status(400).json({ error: 'Legajo debe ser un número' });
        }

        // Buscar en la base de datos por legajo y mes
        const tarjeta = await Tarjeta.findOne({ legajo: legajoNumber, mes });

        // Verificar si se encontró algún registro
        if (!tarjeta) {
            return res.status(404).json({ error: 'No se encontraron registros con los parámetros proporcionados' });
        }

        // Responder con el registro encontrado
        res.json(tarjeta);
    } catch (error) {
        console.error("Error al obtener el registro de Personal por Legajo y Mes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const createTarjetaPersonalSinDiagrama = async (req, res) => {
    try {
         // Si el _id está vacío, genera uno nuevo
        if (!req.body._id || req.body._id === '') {
            req.body._id = new mongoose.Types.ObjectId();
        }
        const newTarjeta = new Tarjeta(req.body);

        await newTarjeta.save();

        res.status(201).json(newTarjeta);
    } catch (error) {
        console.error("Error al crear TarjetaPersonalSinDiagrama:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar PersonalSinDiagrama por legajo y periodo
export const updateTarjetaPersonalSinDiagrama = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedTarjeta = await Tarjeta.findByIdAndUpdate(
            id  ,
            req.body,
            { new: true }
        );

        if (!updatedTarjeta) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        res.json(updatedTarjeta);
    } catch (error) {
        console.error("Error al actualizar TarjetaPersonalSinDiagrama:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteTarjetaPersonalSinDiagramaById = async (req, res) => {
    try {
        // Eliminar el registro específico por ID
        const tarjeta = await Tarjeta.findByIdAndDelete(req.params.id);

        // Verificar si se encontró el registro
        if (!tarjeta) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con código de estado 204 (Sin contenido)
        res.status(204).end();
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la eliminación
        console.error("Error al eliminar el registro de TarjetaPersonal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
