import fs from 'fs';
import path  from'path';
import cron  from'node-cron';
import { obtenerNovedades }  from'./controllers/novedades.controller'; 
import { obtenerItinerario }  from'./controllers/itinerario.controller'; 
import { obtenerTarjetas }  from'./controllers/tarjetaPersonalSinDiagrama.controller'; 
import { obtenerCambioTurno } from './controllers/cambioTurno.controller';
import { obtenerPersonal,obtenerDatos_Personales,obtenerVias } from './controllers/personal.controller';
import { obtenerRegistro } from './controllers/registro.controller';
import { obtenerTurno } from './controllers/turno.controller';
import { obtenerOrdenamiento } from './controllers/ordenamiento.controller';
import { obtenerPersonalSinDiagrama } from './controllers/personalSinDiagrama.controller';
import { obtenerUser } from './controllers/user.controller';

const guardarBackup = (obtenerDatos, nameFile,pathFile)=>{
    /*
    * * * * *
    | | | | |
    | | | | └── Día de la semana (0 - 7) (Domingo = 0 o 7)
    | | | └──── Mes (1 - 12)
    | | └────── Día del mes (1 - 31)
    | └──────── Hora (0 - 23)
    └────────── Minuto (0 - 59)

    */
    // Configurar la tarea periódica
    cron.schedule('0 2 * * *', async () => {
        console.log('Ejecutando tarea programada...');
        
        try {
            // Verificar si la carpeta existe y crearla si no
            if (!fs.existsSync(pathFile)) {
                fs.mkdirSync(pathFile, { recursive: true });
            }
            // Realizar la consulta GET
            const datos = await obtenerDatos();
        
            // Definir la ruta y el nombre del archivo
            const filePath = path.join(pathFile, `backup-${nameFile}-${Date.now()}.json`);
        
            // Guardar los datos en el archivo JSON
            fs.writeFileSync(filePath, JSON.stringify(datos, null, 2));
            console.log(`Datos guardados en: ${filePath}`);
        } catch (error) {
            console.error(`Error al realizar la consulta o guardar los datos de ${nameFile}:`, error);
        }
    });
}
let backupsIniciados = false;
export const callBackup = async (pathFile)=>{
    if (backupsIniciados) return; // Evita duplicar tareas
    backupsIniciados = true;
    guardarBackup(obtenerNovedades,"Novedades",pathFile)
    guardarBackup(obtenerItinerario,"Itinerarios",pathFile)
    guardarBackup(obtenerTarjetas,"Tarjetas",pathFile)
    guardarBackup(obtenerCambioTurno,"CambiosDeTurnos",pathFile)
    guardarBackup(obtenerPersonal,"Personales",pathFile)
    guardarBackup(obtenerDatos_Personales,"Datos_Personales",pathFile)
    guardarBackup(obtenerVias,"Vias",pathFile)
    guardarBackup(obtenerRegistro,"Registros",pathFile)
    guardarBackup(obtenerTurno,"Turnos",pathFile)
    guardarBackup(obtenerOrdenamiento,"Ordenamientos",pathFile)
    guardarBackup(obtenerPersonalSinDiagrama,"Ciclo",pathFile)
    guardarBackup(obtenerUser,"Usuario",pathFile)
}

