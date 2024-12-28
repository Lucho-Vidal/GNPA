<template>
    <main>
    <div class="container-fluid px-4" v-if="lstItinerariosTrenes.length === 0">
        <div class="d-flex justify-content-center m-3">
        <h2>Cargar nuevos itinerarios</h2>
        </div>
        <div class="d-flex justify-content-center">
        <label for="nuevosTurnos" class="custom-file-upload">Seleccionar archivo</label>
        <input
            type="file"
            name="nuevosTurnos"
            id="nuevosTurnos"
            @change="handleFileChange"
            accept=".xlsx,.xls"
        />
        </div>
        <div class="d-flex flex-wrap my-3" v-if="sheetNames.length > 0">
        <h6>Selecciona las hojas a cargar:</h6>
        <div v-for="(sheetName, index) in sheetNames" :key="index">
            <label class="form-check-label mx-2">
            <input
                class="form-check-input"
                type="checkbox"
                :value="sheetName"
                v-model="sheetNamesSeleccionado"
            />
            {{ sheetName }}
            </label>
        </div>
        </div>
        <div class="row d-flex justify-content-center" v-if="sheetNamesSeleccionado.length > 0">
        <div class="col-3">
            <label for="circular">
            Circular
            <input class="form-control mb-3" type="text" name="circular" v-model="circular" />
            </label>
        </div>
        </div>
        <div class="d-flex justify-content-center" v-if="circular">
        <button class="btn btn-primary" @click="ConvertirJson()">Cargar Itinerario</button>
        </div>
    </div>

    <div class="container-fluid px-4" v-if="lstItinerariosTrenes.length > 0">
        <h2 class="d-flex justify-content-center m-3">Cargar turnos</h2>
        <div class="d-flex justify-content-end">
        <button class="btn btn-primary d-flex end mx-3" @click="enviarTurnos()">Guardar turnos</button>
        <router-link class="btn btn-danger d-flex end" to="/itinerariosTrenes">Cancelar</router-link>
    </div>

        <table class="table table-hover">
            <thead>
                <tr>
                <th class="col-1">N°</th>
                <th class="col-1">Turno</th>
                <th class="col-1">Itinerario</th>
                <th class="col-1">Circular</th>
                <th class="col-1">Rotacion</th>
                <th class="col-1">Tren Siguiente</th>
                <th class="col-1">Hora Tren Siguiente</th>
                <th class="col-1">Borrar</th>
                </tr>
            </thead>
            <tbody
                v-for="(tren, index) in lstItinerariosTrenes"
                :key=" index"
                class="Small shadow"
                @dblclick="viewDetail(tren)">
                <tr>
                    <td class="col">{{ index + 1 }}</td>
                    <td class="col-1"><input class="form-control" type="text" v-model="tren.tren" /></td>
                    <td class="col-1">
                        <select class="form-control" v-model="tren.itinerario">
                            <option value="H">Hábil</option>
                            <option value="S">Sábado</option>
                            <option value="D">Domingo</option>
                        </select>
                    </td>
                    <td class="col-1"><input class="form-control" type="text" v-model="tren.circular" /></td>
                    <td class="col-1"><input class="form-control" type="text" v-model="tren.rotacion" /></td>
                    <td class="col-1"><input class="form-control" type="text" v-model="tren.trenSiguiente" /></td>
                    <td class="col-1"><input class="form-control" type="text" v-model="tren.trenSiguienteHora" /></td>
                    <td class="col-1"><i class="material-icons cursor-hand rojo" @click="deleteTurno(index)">delete_forever</i></td>
                </tr>
                <tr v-if="tren.viewDetail" class="details-row">
                    <td colspan="12" >
                        <div class="d-flex flex-nowrap justify-content-center">
                        <input
                            v-for="(estacion, idx) in tren.estaciones"
                            :key="'estacion-' + idx"
                            class="form-control mx-2 mb-2 col-1"
                            type="text"
                            :placeholder="estacion"
                            v-model="tren.estaciones[idx]"
                            style="width: 80px;"
                        />
                        </div>
                    </td>
                </tr>
                <tr v-if="tren.viewDetail" class="details-row">
                    <td colspan="12" class="text-center">
                        <div class="d-flex flex-nowrap justify-content-center">
                        <input
                            v-for="(horario, idx) in tren.horarios"
                            :key="'estacion-' + idx"
                            class="form-control mx-2 mb-2 col-1"
                            type="text"
                            :placeholder="horario"
                            v-model="tren.horarios[idx]"
                            style="width: 80px;"
                        />
                        </div>
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
import { Itinerario } from '../../interfaces/Itinerario';
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";
import { createMultipleItinerario } from "../../services/itinerarioService";

export default defineComponent({
    data() {
        return {
            
            itinerariosTrenes: {} as Record<string,Itinerario>,
            lstItinerariosTrenes: [] as Itinerario[],

            
            username: "" as string,
            itSeleccionado: "" as string,
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

                for (let i = 0; i < this.lstItinerariosTrenes.length; i += batchSize) {
                    const batch = this.lstItinerariosTrenes.slice(i, i + batchSize);
                    batches.push(batch);
                }
                for (const batch of batches) {
                    console.log("Enviando lote de tamaño: ", batch.length);                        
                    await createMultipleItinerario(batch);
                }
                
                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "Agrego lista de itinerario"+ this.circular,
                };
                await createRegistro(registro);
                alert("Se cargaron los trenes satisfactoriamente.")

                this.$router.push("/itinerariosTrenes");
            } catch (error) {
                console.error('Error al crear trenes:', error);
            }
        },
        async deleteTurno(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este turno?"
                );
                if (confirmacion) {
                    // await deleteTurno(id);

                    this.lstItinerariosTrenes.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        viewDetail(itinerario: Itinerario) {
            itinerario.viewDetail = !itinerario.viewDetail;
        },
        ConvertirJson() {
            this.sheetNamesSeleccionado.forEach(sheetName => {
                const {rows,estaciones,rowRotacion,rowTrenSiguiente,rowTrenSiguienteHora} = 
                    this.obtenerItEstRows(sheetName) as { rows: number[]; estaciones: string[] ;rowRotacion:number;rowTrenSiguiente:number,rowTrenSiguienteHora:number };
                if(!rows && !estaciones) return
                
                const sheet = this.workbook!.Sheets[sheetName]
                if (!sheet) {
                    console.error(`La hoja ${sheetName} no se pudo leer correctamente.`);
                    alert("ocurrió un error al tratar de leer una hoja, recargue la pagina e intente nuevamente" )
                    return;
                }
                const formatoHora = (cell:number)=>{
                    // Convertir el número a horas y minutos
                    const totalMinutes = Math.round(cell * 24 * 60); // Convertir días a minutos
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }
                const rangeRef = sheet['!ref'];
                if (rangeRef) {
                    const range = XLSX.utils.decode_range(rangeRef);
                    // const rows = range.e.r 
                    const cols = range.e.c
                    
                    for (let colIndex = 0; colIndex < cols; colIndex++) {
                        const col = XLSX.utils.encode_col(colIndex); // Convierte el índice en una columna: 0 -> "A", 1 -> "B"
                        
                        // const rowTrenes = sheetName.toLowerCase().includes('univ') ? 4 : 1
                        const rowTrenes = 1
                        const trenNro = `${col}${rowTrenes}`; // Busco el numero de tren
                        const cellTren = sheet[trenNro];
                        
                        if (cellTren && typeof cellTren.v === 'number') {
                            // Crear un nuevo objeto para el tren actual
                            const nuevoItinerario:Itinerario = {
                                _id: '',
                                tren: cellTren.w,
                                itinerario: this.itinerario,
                                circular: this.circular,
                                rotacion: sheet[col+rowRotacion]?.w||'',
                                trenSiguiente: sheet[col+rowTrenSiguiente]?.w||'',
                                trenSiguienteHora: formatoHora(sheet[col+rowTrenSiguienteHora]?.v)||'',
                                horarioXEst: {},
                                horarios: [],
                                estaciones: [],
                                viewDetail: false
                            };
                            for(let i = 0; i<=rows.length-1; i++){
                                const cellAddress = `${col}${rows[i]}`; 
                                const cell = sheet[cellAddress];
                                
                                if(cell && typeof cell.v === 'number' && cell.v <= 1){
                                    
                                    // Convertir el número a horas y minutos
                                    const formattedTime = formatoHora(cell.v);
                                    
                                    nuevoItinerario.horarios.push(formattedTime);
                                    nuevoItinerario.estaciones.push(estaciones[i]);
                                    nuevoItinerario.horarioXEst[estaciones[i]] = formattedTime;
                                }
                            }
                            this.itinerariosTrenes[nuevoItinerario.tren] = nuevoItinerario
                        } 
                    }
                }
            })
            this.lstItinerariosTrenes = Object.values(this.itinerariosTrenes)
            // console.log(this.itinerariosTrenes)
        },
        obtenerItEstRows(sheetName:string): 
            { rows: number[]; estaciones: string[];rowRotacion:number;rowTrenSiguiente:number,rowTrenSiguienteHora:number; }|undefined{
            let rows:Array<number> = []
            let estaciones:Array<string> = []
            let rowRotacion:number = 0;
            let rowTrenSiguiente: number = 0;
            let rowTrenSiguienteHora: number = 0;

            if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('ty')){
                estaciones = ['PC','ALL','K5','RE','TY','BO','GW','AK','CY','FV','BQ','GT','LLV','MG','ZZ']
                rows = [4,6,8,11,14,16,18,20,23,25,27,29,31,33,35]
                rowRotacion = 36;
                rowTrenSiguiente = 37;
                rowTrenSiguienteHora = 38
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('ty')){
                estaciones = ['PC','ALL','RE','K5','TY','BO','GW','AK','CY','FV','BQ','GT','LLV','MG','ZZ'].reverse()
                rows = [4,6,8,10,12,14,16,19,21,23,25,28,31,33,35]
                rowRotacion = 36;
                rowTrenSiguiente = 37;
                rowTrenSiguienteHora = 38
            }else if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('ql')){
                estaciones = ['PC','ALL','QL','BZ','BQ','HD','VE','OA','LP']
                rows = [3,5,11,13,18,20,22,26,27]
                rowRotacion = 28;
                rowTrenSiguiente = 29;
                rowTrenSiguienteHora = 30
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('ql')){
                estaciones = ['PC','ALL','QL','BZ','BQ','HD','VE','OA','LP'].reverse()
                rows = [3,4,8,10,12,17,19,25,27]
                rowRotacion = 28;
                rowTrenSiguiente = 29;
                rowTrenSiguienteHora = 30
            }else if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('hdo')){
                estaciones = ['RE','TY','K34','SJ','HDO']
                rows = [3,6,11,16,18]
                rowRotacion = 20;
                rowTrenSiguiente = 21;
                rowTrenSiguienteHora = 22
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('hdo')){
                estaciones = ['RE','TY','K34','SJ','HDO'].reverse()
                rows = [3,5,10,15,18] 
                rowRotacion = 20;
                rowTrenSiguiente = 21;               
                rowTrenSiguienteHora = 22
            }else if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('cñ')){
                estaciones = ['PC','RE','TY','LLV','MG','ZZ','TZ','VC','CÑ','MN','LB']
                rows = [3,10,13,15,17,19,21,24,29,33,36] 
                rowRotacion = 38;
                rowTrenSiguiente = 39;               
                rowTrenSiguienteHora = 40
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('cñ')){
                estaciones = ['PC','RE','TY','LLV','MG','ZZ','TZ','VC','CÑ','MN','LB'].reverse()
                rows = [3,6,10,15,18,20,22,24,26,29,36]      
                rowRotacion = 38;
                rowTrenSiguiente = 39;          
                rowTrenSiguienteHora = 40
            }else if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('chc')){
                estaciones = ['PC','RE','TY','BO','GW','AK','D','BA','AO','CHC']
                rows = [4,10,13,15,17,19,20,21,23,25]   
                rowRotacion = 27;
                rowTrenSiguiente = 28;             
                rowTrenSiguienteHora = 29
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('chc')){
                estaciones = ['PC','RE','TY','BO','GW','AK','D','BA','AO','CHC'].reverse()
                rows = [4,6,8,9,10,12,14,16,19,25] 
                rowRotacion = 27;
                rowTrenSiguiente = 28;               
                rowTrenSiguienteHora = 29
            }
            else if(sheetName.toLowerCase().includes('asc')&&sheetName.toLowerCase().includes('univ')){
                estaciones = ['LP','ARQ','INF','MED','PER','D73','POL','AV7','CIR','MER','HDIOS']
                rows = [3,4,5,6,7,8,9,10,11,12,13]    
                rowRotacion = 14;
                rowTrenSiguiente = 15;
                rowTrenSiguienteHora = 16
            }else if(sheetName.toLowerCase().includes('des')&&sheetName.toLowerCase().includes('univ')){
                estaciones = ['LP','ARQ','INF','MED','PER','D73','POL','AV7','CIR','MER','HDIOS'].reverse()
                rows = [3,4,5,6,7,8,9,10,11,12,13]  
                rowRotacion = 14;
                rowTrenSiguiente = 15;  
                rowTrenSiguienteHora = 16
            }else{
                alert(`El sistema no logra discernir el ramal. Para la hoja ${sheetName} y no puede continuar con la carga.`)
                return 
            }
            if(sheetName.toLowerCase().includes('hab')){
                this.itinerario =  'H'
            }else if(sheetName.toLowerCase().includes('sab')||sheetName.toLowerCase().includes('sáb')){
                this.itinerario =  'S'
            }else if(sheetName.toLowerCase().includes('dom')||sheetName.toLowerCase().includes('dyf')){
                this.itinerario =  'D'
            }else{
                let respuesta:string|null = '' ;
                while ((respuesta !== 'H'&& respuesta !== 'S' && respuesta !== 'D')){
                    respuesta = prompt(`El sistema no logra discernir si el itinerario es Hábil, sábado o Domingo. Para la hoja ${sheetName} 
Por favor introducir H para Hábil, S para Sábado o D para Domingo. en Mayúscula`);
                }
                this.itinerario =  respuesta

            }
                return {rows, estaciones ,rowRotacion ,rowTrenSiguiente,rowTrenSiguienteHora}
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
