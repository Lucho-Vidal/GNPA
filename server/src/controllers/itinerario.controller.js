import mongoose from "mongoose";
import Itinerario from "../models/Itinerario";

export const obtenerItinerario = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Itinerario.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getItinerarios = async (req, res) => {
    const itinerario = await Itinerario.find();
    res.json(itinerario);
};

export const getItinerario = async (req, res) => {
    try {
        const itinerario = await Itinerario.findById(req.params.id);

        if (!itinerario) {
            // Si no se encuentra el turno con el ID proporcionado
            return res.status(404).json({ message: 'Itinerario no encontrado' });
        }

        res.json(itinerario);
    } catch (error) {
        // Manejar errores durante la búsqueda del turno
        console.error('Error al obtener el Itinerario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const createItinerario = async (req, res) => {
    try {
        const {
            tren,
            itinerario,
            circular,
            rotacion,
            trenSiguiente,
            trenSiguienteHora,
            estaciones,
            horarios,
            horarioXEst
        } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!tren || !itinerario) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const newItinerario = new Turno({
            tren,
            itinerario,
            circular,
            rotacion,
            trenSiguiente,
            trenSiguienteHora,
            estaciones,
            horarios,
            horarioXEst
        });

        const savedItinerario = await newItinerario.save();
        res.status(201).json(savedItinerario);  // 201 significa "Creado" en HTTP
    } catch (error) {
        // Manejar errores durante la creación
        console.error('Error al crear el Itinerario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const createMultipleItinerario = async (req, res) => {
    try {
        const request = req.body;

        if (!Array.isArray(request) || request.length === 0) {
            return res.status(400).json({ message: 'Datos inválidos: Se esperaba un arreglo de turnos.' });
        }

        const itinerarios = request.map(it => {
            if (!it || typeof it !== 'object') {
                throw new Error('Turno inválido: Se esperaba un objeto.');
            }
            return {
                ...it,
                _id: new mongoose.Types.ObjectId()
            };
        });

        const result = await Itinerario.insertMany(itinerarios);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear los Itinerarios:', error);
        res.status(500).json({ message: 'Error al crear los Itinerarios', error });
    }
};


export const updateItinerario = async (req, res) => {
    try {
        const updatedItinerario = await Itinerario.findByIdAndUpdate(
            req.params.id,
            req.body, // Aquí se cambió de req.params.body a req.body
            {
                new: true,
            }
        );

        if (!updatedItinerario) {
            // Si no se encuentra el Itinerario con el ID proporcionado
            return res.status(404).json({ message: 'Itinerario no encontrado' });
        }

        // Éxito en la actualización
        res.json(updatedItinerario);
    } catch (error) {
        // Manejar errores durante la actualización
        console.error('Error al actualizar el Itinerario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const deleteItinerario = async (req, res) => {
    try {
        const deletedItinerario = await Itinerario.findByIdAndDelete(req.params.id);

        if (!deletedItinerario) {
            // Si no se encuentra el Itinerario con el ID proporcionado
            return res.status(404).json({ message: 'Itinerario no encontrado' });
        }

        // Éxito en la eliminación
        res.json(deletedItinerario);
    } catch (error) {
        // Manejar errores durante la eliminación
        console.error('Error al eliminar el Itinerario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
// export const getItinerarioPaginado = async (req, res) => {
//     const { page, pageSize } = req.query;

//     try {
//         const result = await Itinerario.find()
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         res.status(200).json(result);
//     } catch (error) {
//         console.error(error);
//         // Manejar el error y enviar una respuesta de error al cliente
//         res.status(500).json({ error: 'Error al obtener datos del itinerario.' });
//     }
// }
