import User from "../models/User";
import Role from "../models/Role";

export const obtenerUser = async () => {
    try {
        // Recupera todas las novedades de la base de datos
        return  await User.find();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw new Error("No se pudieron obtener los datos");
    }
};

export const getUsers = async (req, res) => {
    try {
        // Utiliza proyección para excluir la contraseña
        const users = await User.find().select('-password').populate("roles");

        const clearUsers = users.map(user => ({
            _id: user._id,
            legajo: user.legajo,
            username: user.username,
            email: user.email,
            roles: user.roles.map(role => ({ _id: role._id, name: role.name })),
        }));

        res.json(clearUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error de servidor al obtener los usuarios" });
    }
};

export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Utiliza proyección para excluir la contraseña
        const user = await User.findById(id).select('-password').populate("roles");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error de servidor al obtener el usuario" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { legajo, username, email, password, updatePass } = req.body;
        let { roles } = req.body;
        const id = req.params.id;
        
        // Verificar si el usuario existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }        
        
        if(roles.includes('admin')|| roles.some(role => role.name === "admin")){
            roles = []
            roles.push({name:"admin"})
            roles.push({name:"moderator"})
            roles.push({name:"user"})
        }else if (roles.includes('moderator') || roles.some(role => role.name === "moderator")){
            roles = []
            roles.push({name:"moderator"})
            roles.push({name:"user"})
        }else if (roles.includes('user') || roles.some(role => role.name === "user")){
            roles = []
            roles.push({name:"user"})
        }
        // Actualizar los campos proporcionados
        existingUser.legajo = legajo || existingUser.legajo;
        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;
        existingUser.password = password ? await User.encryptPassword(password) : existingUser.password;
        existingUser.updatePass = updatePass || existingUser.updatePass;

        if (roles && roles.length > 0) {
            // Solo actualiza los roles si se proporciona alguno
            const foundRoles = await Role.find({ name: { $in: roles.map(role => role.name) } });
            existingUser.roles = foundRoles.map((role) => role._id);
        }

        // Guardar los cambios
        await existingUser.save();

        res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error de servidor al actualizar el usuario" });
    }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId; // Asumiendo que has almacenado el ID del usuario en el token durante la autenticación

        const user = await User.findById(userId);

        // Verifica que la contraseña actual sea válida
        const matchPassword = await User.comparePassword(currentPassword, user.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Contraseña actual incorrecta" });
        }

        // Cambia la contraseña
        user.password = await User.encryptPassword(newPassword);
        user.updatePass = false;
        await user.save();

        res.status(200).json({ message: "Contraseña cambiada exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error de servidor al cambiar la contraseña" });
    }
};

export const deleteUser = async (req,res) =>{
    try {
        const id = req.params.id; // Asegúrate de obtener el ID del parámetro de la solicitud
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            // Si el usuario no se encuentra, devuelve un error 404
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error de servidor al eliminar usuario" });
    }
}