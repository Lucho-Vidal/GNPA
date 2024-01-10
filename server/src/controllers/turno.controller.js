import Turno from "../models/Turno";

export const getTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find();

        if (turnos.length === 0) {
            // Si no se encuentran turnos en la base de datos
            return res.status(404).json({ message: 'No se encontraron turnos' });
        }

        res.json(turnos);
    } catch (error) {
        // Manejar errores durante la búsqueda de turnos
        console.error('Error al obtener los turnos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getTurno = async (req,res) =>{
    try {
        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            // Si no se encuentra el turno con el ID proporcionado
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        res.json(turno);
    } catch (error) {
        // Manejar errores durante la búsqueda del turno
        console.error('Error al obtener el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const createTurno = async (req,res) => {
    try {
        const {
            turno,
            itinerario,
            circular,
            personal,
            toma,
            deja,
            vueltas
        } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!turno || !itinerario || !circular || !personal || !toma || !deja || !vueltas) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const newTurno = new Turno({
            turno,
            itinerario,
            circular,
            personal,
            toma,
            deja,
            vueltas
        });

        const savedTurno = await newTurno.save();
        res.status(201).json(savedTurno);  // 201 significa "Creado" en HTTP
    } catch (error) {
        // Manejar errores durante la creación
        console.error('Error al crear el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const updateTurno = async (req,res) => {
    try {
        const updatedTurno = await Turno.findByIdAndUpdate(
            req.params.id,
            req.body, // Aquí se cambió de req.params.body a req.body
            {
                new: true,
            }
        );

        if (!updatedTurno) {
            // Si no se encuentra el turno con el ID proporcionado
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        // Éxito en la actualización
        res.json(updatedTurno);
    } catch (error) {
        // Manejar errores durante la actualización
        console.error('Error al actualizar el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const deleteTurno = async (req,res) =>{
    try {
        const deletedTurno = await Turno.findByIdAndDelete(req.params.id);

        if (!deletedTurno) {
            // Si no se encuentra el turno con el ID proporcionado
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        // Éxito en la eliminación
        res.json(deletedTurno);
    } catch (error) {
        // Manejar errores durante la eliminación
        console.error('Error al eliminar el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}