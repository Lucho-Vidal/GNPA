import Personal from "../models/personalSinDiagrama";
import mongoose from 'mongoose';

export const getPersonalesSinDiagrama = async (req, res) => {
    try {
        // Obtener todos los registros de la colección Personal
        const personales = await Personal.find();
        

        // Responder con los registros obtenidos
        res.json(personales);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener los registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getPersonalSinDiagrama = async (req, res) => {
    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        // Obtener un registro específico por ID
        const personal = await Personal.findById(req.params.id);

        // Verificar si se encontró el registro
        if (!personal) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro encontrado
        res.json(personal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const createPersonalSinDiagrama = async (req, res) => {
    try {
        const newPersonal = new Personal(req.body);

        await newPersonal.save();

        res.status(201).json(newPersonal);
    } catch (error) {
        console.error("Error al crear PersonalSinDiagrama:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar PersonalSinDiagrama por legajo y periodo
export const updatePersonalSinDiagrama = async (req, res) => {
    try {
        const { legajo } = req.params;

        const updatedPersonal = await Personal.findOneAndUpdate(
            { legajo  },
            req.body,
            { new: true }
        );

        if (!updatedPersonal) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        res.json(updatedPersonal);
    } catch (error) {
        console.error("Error al actualizar PersonalSinDiagrama:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deletePersonalSinDiagramaById = async (req, res) => {
    try {
        // Eliminar el registro específico por ID
        const personal = await Personal.findByIdAndDelete(req.params.id);

        // Verificar si se encontró el registro
        if (!personal) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con código de estado 204 (Sin contenido)
        res.status(204).end();
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la eliminación
        console.error("Error al eliminar el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const createMultiplePersonalSinDiagrama = async (req, res) => {
    try {
        // Extraer la lista de personales del cuerpo de la solicitud
        const personales = req.body;

        if (!Array.isArray(personales) || personales.length === 0) {
            return res.status(400).json({ message: 'La solicitud debe contener un array de registros de personal.' });
        }

        // Validar que todos los campos requeridos estén presentes en cada objeto de personal
        for (const personal of personales) {
            const {
                legajo,
            } = personal;

            if (!legajo ) {
                return res.status(400).json({ message: 'el legajo es obligatorio en el registro de personalCiclo.' });
            }
        }
        
        // Crear nuevos objetos Personal con los datos proporcionados
        // const newPersonalList = personales.map(personal => {
        //     new Personal(personal);
        // });
        const newPersonalList = personales.map(personal => {
            return {
                ...personal,
                _id: new mongoose.Types.ObjectId()
            };
        });

        // Guardar los nuevos objetos Personal en la base de datos
        const savedPersonalList = await Personal.insertMany(newPersonalList);

        // Responder con código de estado 201 y los nuevos recursos creados
        res.status(201).json(savedPersonalList);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación
        console.error("Error al crear nuevos registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteMultiplePersonalSinDiagrama = async (req, res) => {
    try {
        // Eliminar todos los registros actuales de la base de datos
        const result = await Personal.deleteMany({});
        
        // Verificar cuántos registros fueron eliminados
        console.log(`Registros eliminados: ${result.deletedCount}`);
        
        // Responder con código de estado 204 (Sin contenido)
        res.status(204).end();
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la eliminación
        console.error("Error al eliminar registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};