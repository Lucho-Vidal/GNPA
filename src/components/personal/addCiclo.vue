<template>
    <main>
    <div class="container-fluid px-4" v-if="lstCiclo.length === 0">
        <div class="d-flex justify-content-center m-3">
            <h2>Cargar nuevos ciclos</h2>
        </div>
        <div class="d-flex justify-content-center">
            <label for="nuevosTurnos" class="custom-file-upload">Seleccionar archivo</label>
            <input
                type="file"
                name="nuevosTurnos"
                id="nuevosTurnos"
                @change="handleFileChange"
                accept=".xlsx,.xls,.xlsb"
            />
        </div>
        <div class="d-flex flex-wrap m-3" v-if="sheetNames.length > 0">
            <h6>Selecciona la hoja que contenga la lista de ciclos a cargar:</h6>
            <div>
                <select 
                    name="sheetnames" 
                    id="sheetnames" 
                    class="form-control"
                    v-model="sheetNameSeleccionado"
                    >
                    <option v-for="(sheetName, index) in sheetNames" :key="index" :value="sheetName">
                        {{sheetName}}
                    </option>
                </select>
            </div>
        </div>
        <div class="d-flex justify-content-center" v-if="sheetNameSeleccionado">
            <button class="btn btn-primary" @click="ConvertirJson()">Cargar Ciclos</button>
        </div>
    </div>

    <div class="container-fluid px-4" v-if="lstCiclo.length > 0">
        <h2 class="d-flex justify-content-center m-3">Cargar turnos</h2>
        <div class="d-flex justify-content-end">
            <!-- <button class="btn btn-primary d-flex end mx-3" @click="enviarTurnos()">Guardar turnos</button> -->
            <router-link class="btn btn-danger d-flex end" to="/itinerariosTrenes">Cancelar</router-link>
        </div>

        <table class="table table-striped table-hover">
            <thead>
                <tr>
                <th class="col-1">N°</th>
                <th class="col-1">Ciclo</th>
                <th class="col-1">Legajo</th>
                <th class="col-1">Franco Inicio</th>
                <th class="col-1">hora</th>
                <th class="col-1">Franco Inicio</th>
                <th class="col-1">hora</th>
                <th class="col-1">Borrar</th>
                </tr>
            </thead>
            <tbody
                v-for="(ciclo, index) in lstCiclo"
                :key=" index"
                class="Small shadow">
                <tr>
                    <td class="col-1">{{ index + 1 }}</td>
                    <td class="col-1"><input class="form-control" type="number" v-model="ciclo.Ciclo"/></td>
                    <td class="col-1"><input class="form-control" type="text" v-model="ciclo.legajo"/></td>
                    <td class="col-1">
                        <select class="form-control" v-model="ciclo.francoInicio">
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </td>
                    <td class="col-1"><input class="form-control" type="text" v-model="ciclo.HoraInicio"/></td>
                    <td class="col-1">
                        <select class="form-control" v-model="ciclo.francoHasta">
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </td>
                    <td class="col-1"><input class="form-control" type="text" v-model="ciclo.HoraHasta"/></td>
                    <td class="col-1">
                        <i class="material-icons cursor-hand rojo" @click="deleteTurno(index)">delete_forever</i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as XLSX from 'xlsx';
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
// import { Itinerario } from '../../interfaces/Itinerario';
// import { Registro } from "../../interfaces/IRegistro";
// import { createRegistro } from "../../services/registrosService";
// import { createMultipleItinerario } from "../../services/itinerarioService";
import { IPersonalSinDiagrama } from "../../interfaces/IPersonalSinDiagrama";

export default defineComponent({
    data() {
        return {
            
            lstCiclo: [] as IPersonalSinDiagrama[],

            
            username: "" as string,
            today: new Date(),

            workbook: null as XLSX.WorkBook | null,
            sheetNames: [] as string[],
            sheetNameSeleccionado: "" as string,
        };
    },
    methods: {
        async handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const arrayBuffer = await file.arrayBuffer();
                this.workbook = XLSX.read(arrayBuffer, { type: 'array' });
                // Obtener nombres de las hojas
                this.sheetNames = this.workbook.SheetNames;
            }
        },
        // async enviarTurnos() {
        //     try {
        //         const batchSize = 50;
        //         const batches = [];

        //         for (let i = 0; i < this.lstItinerariosTrenes.length; i += batchSize) {
        //             const batch = this.lstItinerariosTrenes.slice(i, i + batchSize);
        //             batches.push(batch);
        //         }
        //         for (const batch of batches) {
        //             console.log("Enviando lote de tamaño: ", batch.length);                        
        //             await createMultipleItinerario(batch);
        //         }
                
        //         // guardamos registro
        //         const registro: Registro = {
        //             usuario: window.localStorage.getItem("username") || "",
        //             fecha: this.today.toString(),
        //             accion: "Agrego lista de itinerario"+ this.circular,
        //         };
        //         await createRegistro(registro);
        //         alert("Se cargaron los trenes satisfactoriamente.")

        //         this.$router.push("/itinerariosTrenes");
        //     } catch (error) {
        //         console.error('Error al crear trenes:', error);
        //     }
        // },
        async deleteTurno(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este turno?"
                );
                if (confirmacion) {
                    // await deleteTurno(id);

                    this.lstCiclo.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        ConvertirJson()  {
            const sheet = this.workbook!.Sheets[this.sheetNameSeleccionado];

            if (!sheet) {
                console.error(`La hoja ${this.sheetNameSeleccionado} no se pudo leer correctamente.`);
                alert("Ocurrió un error al tratar de leer una hoja, recargue la página e intente nuevamente.");
                return;
            }

            const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Leer hoja como un array de arrays

            if (!rows || rows.length === 0) {
                console.error("La hoja está vacía o no tiene datos válidos.");
                return;
            }

            // const data: Array<{ ciclo: number; francoInicio: number; horaInicio: string; francoHasta: number; horaHasta: string; legajo: number }> = [];
            const data: Array<IPersonalSinDiagrama> = [];

            rows.forEach((row, index) => {
                if (index === 0) return; // Saltar el encabezado

                const cicloRaw = row[0];
                const francoInicio = row[1]?.toString().toUpperCase();
                const horaInicioRaw = row[2]?.toString();
                const francoHasta = row[3]?.toString().toUpperCase();
                const horaHastaRaw = row[4]?.toString();
                const legajo = row[5]?.toString().trim();

                // Normalizar ciclo
                const ciclo = !isNaN(Number(cicloRaw)) ? parseInt(cicloRaw, 10) : null;
                if (ciclo === null) return; // Saltar filas donde ciclo no es un número válido

                // Validar legajo
                if (!legajo || !/^[0-9]+$/.test(legajo)) return;

                const convertirFranco = (dia: string | undefined): number | null => {
                    switch (dia?.normalize("NFD").replace(/\p{Diacritic}/gu, "")) {
                        case "DOMINGO": return 0;
                        case "LUNES": return 1;
                        case "MARTES": return 2;
                        case "MIERCOLES": return 3;
                        case "JUEVES": return 4;
                        case "VIERNES": return 5;
                        case "SABADO": return 6;
                        default: return null; // Retornar null si no coincide con ningún día válido
                    }
                };

                const normalizarHora = (hora: string | undefined): string | null => {
                    if (!hora) return null;

                    // Convertir formato de hora Excel (número decimal) a string "HH:mm"
                    if (!isNaN(Number(hora))) {
                        const totalMinutes = Math.round(Number(hora) * 24 * 60);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    }

                    return hora.replace(/\s*hs$/i, "").replace(/\s*h[sS]?$/i, "").trim();
                };

                const francoInicioNum = convertirFranco(francoInicio);
                const francoHastaNum = convertirFranco(francoHasta);
                const horaInicio = normalizarHora(horaInicioRaw);
                const horaHasta = normalizarHora(horaHastaRaw);

                if (francoInicioNum === null || francoHastaNum === null || !horaInicio || !horaHasta) return; // Saltar filas con datos inválidos

                data.push({
                    _id:'',
                    Ciclo: ciclo,
                    francoInicio: francoInicioNum,
                    HoraInicio: horaInicio,
                    francoHasta: francoHastaNum,
                    HoraHasta: horaHasta,
                    legajo: parseInt(legajo, 10)
                });
            });


            console.log(data);
            this.lstCiclo = data
        },

        handleRequestError(error: AxiosError) {
            console.error("Error en la solicitud:", error);

            if (error.response && error.response.status === 401) {
                // Manejar la lógica de redirección a la página de inicio de sesión
                this.$router.push("/login");
            } else {
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
    },
    created() {
        // this.loadTurnos();
        newToken();        
        this.username = localStorage.getItem("username") || "";
                
    },
    name: "App",
    components: {
    },
});

</script>
<style>
main {
    margin-top: 5rem;
}
.custom-orange{
    background-color: #fd7d1485;
}
.hidden-row {
    display: none;
}

.cursor-hand {
    cursor: pointer;
}

.verde {
    color: #0f0;
}

.rojo {
    color: #f00;
}

.gris {
    color: #aaa;
}

</style>
