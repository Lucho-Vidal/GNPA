<template>
            <main>
                <div class="container-fluid px-4" v-if="Filtradas.length == 0">
                    <div class="d-flex justify-content-center m-3">
                        <h2>Cargar nuevos turnos o circulares</h2>
                    </div>
                    <div class="d-flex justify-content-center">
                        <label for="nuevosTurnos" class="custom-file-upload">
                            Seleccionar archivo
                        </label>
                        <input type="file" name="nuevosTurnos" id="nuevosTurnos" @change="handleFileChange"
                            accept=".xlsx,.xls">
                    </div>
                    <div class="d-flex flex-wrap my-3" v-if="sheetNames.length != 0">
                        <h6>Selecciona las hojas a cargar:</h6>
                        <div v-for="(sheetName, index) in sheetNames" :key="index">
                            <label class="form-check-label mx-2">
                                <input class="form-check-input" type="checkbox" :value="sheetName"
                                    v-model="sheetNamesSeleccionado" />
                                {{ sheetName }}
                            </label>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center" v-if="sheetNamesSeleccionado.length != 0">
                        <div class="col-3">
                            <label for="itinerario">
                            Itinerario
                            <select
                                name="itinerario"
                                id="itinerario"
                                class="form-control mb-3"
                                required
                                v-model="itinerario"
                            >
                                <option value="H">Hábil</option>
                                <option value="S">Sábado</option>
                                <option value="D">Domingo</option>
                            </select>
                        </label>
                        </div>
                        <div class="col-3" >
                            <label for="circular">
                            Circular
                            <input
                            class="form-control mb-3"
                            placeholder="Dic23, HD4105"
                            type="text"
                            name="circular"
                            v-model="circular"
                        />
                        </label>
                        </div>

                        <div class="col-3" >
                            <label for="especialidad">Especialidad </label>
                            <select
                                name="especialidad"
                                id="especialidad"
                                class="form-control mb-3"
                                v-model="especialidad"
                                required
                            >
                                <option value="Conductor electrico">
                                    Conductor Eléctrico
                                </option>
                                <option value="Conductor diesel">
                                    Conductor Diesel
                                </option>
                                <option value="Guardatren electrico">
                                    GuardaTren Eléctrico
                                </option>
                                <option value="Guardatren diesel">
                                    GuardaTren Diesel
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center" v-if="especialidad && circular && itinerario">
                        <button class="btn btn-primary" @click="ConvertirJson()">
                            Cargar turnos
                        </button>
                    </div>
                </div>
                <div class="container-fluid px-4" v-if="Filtradas.length > 0">
                    <h2 class="d-flex justify-content-center m-3">
                        Cargar turnos
                    </h2>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary d-flex end mx-3" @click="enviarTurnos()">Guardar turnos</button>
                        <router-link class="btn btn-danger d-flex end" to="/turnos">Cancelar</router-link>
                    </div>

                    <h3 v-if="Filtradas.length == 0">
                        No se encontró ningún turno con los requerimientos
                        especificados.
                    </h3>

                    <table v-if="Filtradas.length > 0" class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th class="col-1" colspan="1">N°</th>
                                <th class="col-1" colspan="1">Turno</th>
                                <th class="col-1" colspan="1">Itinerario</th>
                                <th class="col-1" colspan="1">Circular</th>
                                <th class="col-1" colspan="1">Dotacion</th>
                                <th class="col-1" colspan="1">Especialidad</th>
                                <th class="col-1" colspan="1">Toma</th>
                                <th class="col-1" colspan="1">Deja</th>
                                <th class="col-1" colspan="1">Orden</th>
                                <th class="col-1">Borrar</th>
                            </tr>
                        </thead>
                        <tbody v-for="(turno, index) in Filtradas" :key="index" 
                            @dblclick="viewDetail(turno)">
                            <tr class="Small shadow">
                                <td class="col-1">{{ index + 1 }}</td>
                                <td class="col-1"><input class="form-control" type="text" v-model="turno.turno"></td>
                                <td class="col-1">
                                    <select class="form-control" v-model="turno.itinerario" name="Itinerario" id="Itinerario">
                                        <option value="H">Hábil</option>
                                        <option value="S">Sábado</option>
                                        <option value="D">Domingo</option>
                                    </select>
                                </td>
                                <td class="col-1"><input class="form-control" type="text" v-model="turno.circular"></td>
                                <td class="col-1"><input class="form-control" type="text" v-model="turno.dotacion"></td>
                                <td class="col-1">
                                    <select
                                        name="especialidad"
                                        id="especialidad"
                                        class="form-control mb-3"
                                        v-model="turno.especialidad"
                                        required
                                    >
                                        <option value="Conductor electrico">
                                            Conductor Eléctrico
                                        </option>
                                        <option value="Conductor diesel">
                                            Conductor Diesel
                                        </option>
                                        <option value="Guardatren electrico">
                                            GuardaTren Eléctrico
                                        </option>
                                        <option value="Guardatren diesel">
                                            GuardaTren Diesel
                                        </option>
                                    </select>
                                </td>
                                <td class="col-1"><input class="form-control" type="text" v-model="turno.toma"></td>
                                <td class="col-1"><input class="form-control" type="text" v-model="turno.deja"></td>
                                <td class="col-1"><input type="checkbox" name="orden" id="orden" v-model="turno.ordenes"></td>
                                <td class="col-1">
                                    <i class="material-icons cursor-hand rojo"
                                        @click="deleteTurno(index)">delete_forever</i>
                                </td>
                            </tr>
                            <tr v-if="turno.viewDetail" class="custom-orange">
                                <th></th>
                                <th class="col-1" colspan="1">Vuelta</th>
                                <th class="col-1" colspan="1">Referencia</th>
                                <th class="col-1" colspan="1">Tren</th>
                                <th class="col-1" colspan="1">Origen</th>
                                <th class="col-1" colspan="1">Sale</th>
                                <th class="col-1" colspan="1">Destino</th>
                                <th class="col-1" colspan="1">Llega</th>
                                <th class="col-1" colspan="1">Observaciones</th>
                                <th></th>
                            </tr>
                            
                            <tr class="custom-orange" v-for="(vuelta, index) in turno.vueltas" :key="index">
                                <td colspan="1" v-if="turno.viewDetail"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.vuelta"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.refer"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.tren"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.origen"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.sale"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.destino"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.llega"></td>
                                <td colspan="1" v-if="turno.viewDetail"><input class="form-control" type="text" v-model="vuelta.observaciones"></td>
                                <td colspan="1" v-if="turno.viewDetail"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ITurno, Vueltas } from '../../interfaces/ITurno';
import * as XLSX from 'xlsx';
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createMultipleTurnos } from "../../services/turnosService";
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";

export default defineComponent({
    data() {
        return {
            search: "",
            turnos: [] as ITurno[],

            Filtradas: [] as ITurno[],
            username: "" as string,
            itSeleccionado: ["H", "S", "D"] as string[],
            today: new Date(),
            workbook: null as XLSX.WorkBook | null,
            sheetNames: [] as string[],
            sheetNamesSeleccionado: [] as string[],
            especialidad: "", 
            itinerario:"",
            circular:"",
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
        async enviarTurnos() {
            try {
                const batchSize = 50;
                const batches = [];

                for (let i = 0; i < this.Filtradas.length; i += batchSize) {
                    const batch = this.Filtradas.slice(i, i + batchSize);
                    batches.push(batch);
                }
                for (const batch of batches) {
                    console.log("Enviando lote de tamaño: ", batch.length);                        
                    await createMultipleTurnos(batch);
                }
                
                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "Agrego lista de turnos turnos"+ this.circular,
                };
                await createRegistro(registro);
                alert("Se cargaron los turnos satisfactoriamente.")

                this.$router.push("/turnos");
            } catch (error) {
                console.error('Error al crear turnos:', error);
            }
        },
        determinarDotacion(sheetName: string):string{
            let dotacion = ''
            if (sheetName.toUpperCase().includes('PC')||sheetName.toUpperCase().includes('PLAZA')){
                    dotacion = 'PC'
                }else if (sheetName.toUpperCase().includes('LLV')||sheetName.toUpperCase().includes('LLA')){
                    dotacion = 'LLV'
                }else if (sheetName.toUpperCase().includes('TY')||sheetName.toUpperCase().includes('TEMP')){
                    dotacion = 'TY'
                }else if (sheetName.toUpperCase().includes('LP')||sheetName.toUpperCase().includes('PLATA')){
                    dotacion = 'LP'
                }else if (sheetName.toUpperCase().includes('OA')||sheetName.toUpperCase().includes('TOLOSA')){
                    dotacion = 'OA'
                }else if (sheetName.toUpperCase().includes('KM5')||sheetName.toUpperCase().includes('K5')){
                    dotacion = 'K5'
                }else if (sheetName.toUpperCase().includes('RE')||sheetName.toUpperCase().includes('ESC')){
                    dotacion = 'RE'
                }else if (sheetName.toUpperCase().includes('CÑ')||sheetName.toUpperCase().includes('CAÑ')){
                    dotacion = 'CÑ'
                }else if (sheetName.toUpperCase().includes('AK')||sheetName.toUpperCase().includes('KORN')){
                    dotacion = 'AK'
                }else {
                    dotacion = '-'
                    // dotacion = prompt("No se pudo reconocer la dotación para "+ sheetName,"Por favor ingrese la correspondiente entre: PC, LLV, TY, LP, OA, K5, RE, CÑ, AK" )||''
                }
                return dotacion
        },
        ConvertirJson() {
            this.sheetNamesSeleccionado.forEach(sheetName => {
                let dotacion = this.determinarDotacion(sheetName);
                let validarDotacion = false
                if (dotacion == ''){
                    alert("Ocurrió un error con la dotación y se detuvo el proceso.")
                    return
                }else if (dotacion == '-') validarDotacion = true 
                
                const sheet = this.workbook!.Sheets[sheetName]
                if (!sheet) {
                    console.error(`La hoja ${sheetName} no se pudo leer correctamente.`);
                    alert("ocurrió un error al tratar de leer una hoja, recargue la pagina e intente nuevamente" )
                    return;
                }
                const rangeRef = sheet['!ref'];
                if (rangeRef) {
                    const range = XLSX.utils.decode_range(rangeRef);
                    const rows = range.e.r 

                    let row = 1
                    while ( row <= rows + 1 ) {
                        const cell = sheet[`C${row}`];
                        if (cell && cell.v !== undefined) {
                            if (cell.w == "T./Scio."){// nuevo turno
                                
                                // Leer los datos del turno
                                let turno = sheet[`B${row}`]?.w || '';
                                const toma = sheet[`C${row + 1 }`]?.w || '';
                                const deja = sheet[`E${row + 1 }`]?.w || '';
                                
                                let ordenes = false;
                                
                                if(turno.toUpperCase().includes("ORD")){
                                    turno = turno.replace(" ORD","")
                                    ordenes = true;
                                }
                                if(turno.toUpperCase().includes("OR")){
                                    turno = turno.replace(" OR","")
                                    ordenes = true;
                                }
                                if(turno.toUpperCase().includes("DH")){
                                    turno = turno.replace(" DH","")
                                }

                                if(validarDotacion){
                                    if(turno[0] === '1') dotacion = 'RE'
                                    else if(turno[0] === '2') dotacion = 'TY'
                                    else if(turno[0] === '3') dotacion = 'LP'
                                    else if(turno[0] === '4') dotacion = 'PC'
                                    else if(turno[0] === '5') dotacion = 'LLV'
                                    else if(turno[0] === '6' && turno[1] === '0' ) dotacion = 'PC'
                                    else if(turno[0] === '6' && turno[1] !== '0' ) dotacion = 'LP'
                                    else if(turno[0] === '7' && turno[1] === '9') dotacion = 'TY'
                                    else if(turno[0] === '7' && turno[1] !== '9') dotacion = 'LLV'
                                    else if(turno[0] === '8' || turno[0] === '9' || turno[0] === 'P' ){
                                        dotacion = prompt(
                                                `El sistema no puede reconocer la dotacion a la que pertenece el turno ${turno}.\n
                                                Por favor ingrese la correspondiente entre: PC, LLV, TY, LP, OA, K5, RE, CÑ, AK`,
                                            dotacion)||'-'
                                    }
                                }

                                if (turno.toUpperCase().includes("PROG")){
                                    const numero = parseInt(turno.match(/\d+/)?.[0] || '', 10);
                                    const especialidad = this.especialidad.includes("Conductor")?"C":this.especialidad.includes("GuardaTren")?"G":""
                                    turno = "PROG."+ numero + especialidad + dotacion
                                }
                                //quitar  s y d itinerario sábado y domingo
                                if ((this.itinerario == 'S' || this.itinerario == 'D')){
                                    if(turno.toUpperCase().includes(" S")){
                                        turno = turno.replace(" S","")
                                    }else if(turno.toUpperCase().includes("S")){
                                        turno = turno.replace("S","")
                                    }else if(turno.toUpperCase().includes(" D")){
                                        turno = turno.replace(" D","")
                                    }else if(turno.toUpperCase().includes("D")){
                                        turno = turno.replace("D","")
                                    }
                                }
                                
                                
                                // Crear el objeto ITurno
                                const newTurno: ITurno = {
                                    _id:'',
                                    turno,
                                    itinerario: this.itinerario,
                                    circular: this.circular,
                                    personal:'',
                                    toma,
                                    deja,
                                    dotacion,
                                    especialidad: this.especialidad,
                                    ordenes,
                                    viewDetail: false,
                                    vueltas: []
                                };
                                // Avanzar a la fila donde comienzan las vueltas (2 filas abajo)
                                row += 3;
                                let numVuelta = 1
                                let recorrerTurno = true
                                // Leer las vueltas hasta encontrar una fila vacía
                                while (row <= rows && sheet[`C${row + 1}`]?.w != "T./Scio." && recorrerTurno ) {
                                    if(sheet[`A${row}`]?.w.toUpperCase().includes("O  R  D")){
                                        newTurno.ordenes = true
                                    }
                                    let valorA:string = sheet[`A${row + 1}`]?.w || ''
                                    recorrerTurno = !valorA.toUpperCase().includes('ESTOS TRENES SERAN CUBIERTOS POR PERSONAL SIN DIAGRAMA') 
                                    
                                    valorA = sheet[`A${row}`]?.w || ''
                                    valorA = valorA.toUpperCase().includes('O  R  D') ? 'Ordenes' : valorA
                                    valorA = valorA.toUpperCase().includes('D  I  S') ? 'Disponible' : valorA
                                    

                                    const vuelta: Vueltas = {
                                        vuelta: numVuelta, 
                                        refer: valorA,
                                        tren: sheet[`B${row}`]?.w || '',
                                        origen: sheet[`C${row}`]?.w || '',
                                        sale: sheet[`D${row}`]?.w || '',
                                        destino: sheet[`E${row}`]?.w || '',
                                        llega: sheet[`F${row}`]?.w || '',
                                        observaciones: sheet[`G${row}`]?.w || '',
                                    };
                                    
                                    newTurno.vueltas.push(vuelta);
                                    row++;
                                    numVuelta++;
                                }
                                this.Filtradas.push(newTurno)
                            }
                        }
                        row++
                    }
                }
            })
        },
        async deleteTurno(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este turno?"
                );
                if (confirmacion) {
                    // await deleteTurno(id);

                    this.Filtradas.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
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
        viewDetail(turno: ITurno) {
                turno.viewDetail = !turno.viewDetail;
        },
        filtrar() {
            this.Filtradas = this.turnos.filter((t) => {
                return (
                    t.turno
                        .toLocaleLowerCase()
                        .includes(this.search.toLowerCase()) &&
                    this.itSeleccionado.includes(t.itinerario)
                );
            });
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
