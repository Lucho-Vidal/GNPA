import Personal from "../models/Personal";
import Datos_Personale from "../models/DatosPersonales";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import Vias from "../models/Vias";

export const obtenerPersonal = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Personal.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const obtenerDatos_Personales = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Datos_Personale.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const obtenerVias = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await Vias.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getPersonales = async (req, res) => {
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

export const getPersonal = async (req, res) => {
    try {
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

export const createPersonal = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const {
            legajo,
            apellido,
            nombres,
            turno,
            franco,
            puesto,
            especialidad,
            dotacion,
            observaciones,
            orden,
            conocimientos,
        } = req.body;

        // Crear un nuevo objeto Personal con los datos proporcionados
        const newPersonal = new Personal({
            legajo,
            apellido,
            nombres,
            turno,
            franco,
            puesto,
            especialidad,
            dotacion,
            observaciones,
            orden,
            conocimientos,
        });

        // Guardar el nuevo objeto Personal en la base de datos
        const savedPersonal = await newPersonal.save();

        // Responder con código de estado 201 y la ubicación del nuevo recurso
        res.status(201).location(`/api/personal/${savedPersonal._id}`).json(savedPersonal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación
        console.error("Error al crear un nuevo registro de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createMultiplePersonal = async (req, res) => {
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
                apellido,
                nombres,
            } = personal;

            if (!legajo || !apellido || !nombres) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios en cada registro de personal.' });
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


export const updatePersonalById = async (req, res) => {
    try {
        // Actualizar el registro específico por ID
        const updatePersonal = await Personal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verificar si se encontró el registro
        if (!updatePersonal) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro actualizado
        res.status(200).json(updatePersonal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la actualización
        console.error("Error al actualizar el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deletePersonalById = async (req, res) => {
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

export const deleteMultiplePersonal = async (req, res) => {
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


//--------------------------------------------------------------------------------------------

export const getDatosPersonales = async (req, res) => {
    try {
        // Obtener todos los registros de la colección Personal
        const datosPersonales = await Datos_Personale.find();

        // Responder con los registros obtenidos
        res.json(datosPersonales);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener los registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getDatoPersonal = async (req, res) => {
    try {
        // Obtener un registro específico por ID
        const datosPersonales = await Datos_Personale.findById(req.params.id);

        // Verificar si se encontró el registro
        if (!datosPersonales) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro encontrado
        res.json(datosPersonales);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createDatoPersonal = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const {
            Legajo,
            Dni,
            Nacionalidad,
            Calle,
            Nro,
            Piso,
            Depto,
            Postal,
            Localidad,
            Tel1,
            Tel2,
            Nacimiento,
            Sexo,
            Mail
        } = req.body;

        // Crear un nuevo objeto Personal con los datos proporcionados
        const newDatoPersonal = new Datos_Personale({
            Legajo,
            Dni,
            Nacionalidad,
            Calle,
            Nro,
            Piso,
            Depto,
            Postal,
            Localidad,
            Tel1,
            Tel2,
            Nacimiento,
            Sexo,
            Mail
        });

        // Guardar el nuevo objeto Personal en la base de datos
        const savedPersonal = await newDatoPersonal.save();

        // Responder con código de estado 201 y la ubicación del nuevo recurso
        res.status(201).location(`/api/personal/${savedPersonal._id}`).json(savedPersonal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación
        console.error("Error al crear un nuevo registro de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateDatoPersonalById = async (req, res) => {
    try {
        // Actualizar el registro específico por ID
        const updatePersonal = await Datos_Personale.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verificar si se encontró el registro
        if (!updatePersonal) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro actualizado
        res.status(200).json(updatePersonal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la actualización
        console.error("Error al actualizar el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteDatoPersonalById = async (req, res) => {
    try {
        // Eliminar el registro específico por ID
        const personal = await Datos_Personale.findByIdAndDelete(req.params.id);

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
//--------------------------------------------------------------------------------------------

export const getConocimientoVias = async (req, res) => {
    try {
        // Obtener todos los registros de la colección Personal
        const vias = await Vias.find();

        // Responder con los registros obtenidos
        res.json(vias);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener los registros de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



export const getConocimientoVia = async (req, res) => {
    try {
        // Obtener y convertir el ID a ObjectId
        const id = req.params.id;

        // Verificar si el ID es válido
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const objectId = new ObjectId(id);

        // Obtener un registro específico por ID
        const vias = await Vias.findById(req.params.id);

        // Verificar si se encontró el registro
        if (!vias) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro encontrado
        res.json(vias);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda
        console.error("Error al obtener el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const createConocimientoVias = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const {
            Legajo,
            Dni,
            Nacionalidad,
            Calle,
            Nro,
            Piso,
            Depto,
            Postal,
            Localidad,
            Tel1,
            Tel2,
            Nacimiento,
            Sexo,
            Mail
        } = req.body;

        // Crear un nuevo objeto Personal con los datos proporcionados
        const vias = new Vias({
            Legajo,
            Dni,
            Nacionalidad,
            Calle,
            Nro,
            Piso,
            Depto,
            Postal,
            Localidad,
            Tel1,
            Tel2,
            Nacimiento,
            Sexo,
            Mail
        });

        // Guardar el nuevo objeto Personal en la base de datos
        const savedVias = await vias.save();

        // Responder con código de estado 201 y la ubicación del nuevo recurso
        res.status(201).location(`/api/personal/${savedVias._id}`).json(savedPersonal);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la creación
        console.error("Error al crear un nuevo registro de Personal:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const updateConocimientoVias = async (req, res) => {
    try {
        // Actualizar el registro específico por ID
        const vias = await Vias.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        // Verificar si se encontró el registro
        if (!vias) {
            // No se encontró el registro, responder con código 404
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        // Responder con el registro actualizado
        res.status(200).json(vias);
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la actualización
        console.error("Error al actualizar el registro de Personal por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteConocimientoViasById = async (req, res) => {
    try {
        // Eliminar el registro específico por ID
        const vias = await Vias.findByIdAndDelete(req.params.id);

        // Verificar si se encontró el registro
        if (!vias) {
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

