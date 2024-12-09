<template>
    <main>
        <h2 class="d-flex justify-content-center m-3">
            Lista de trenes sin cubrir
        </h2>
        <div class="d-flex justify-content-center mb-3">
            <label for="dotacion" class="col-1 mx-3">
                    <select
                    name="dotacion"
                    id="dotacion"
                    class="form-control"
                    placeholder="Dotación"
                    v-model="dotacionesSeleccionadas"
                    @change="filtrar()"
                    >
                    <option v-for="(dotacion, index) in dotacionesPermitidas" :key="index" :value="dotacion">
                        {{ dotacion }}
                    </option>
                    </select>
                </label>

            <label for="it" class="col-1 mx-3">
                <select
                    name="it"
                    id="it"
                    class="form-control"
                    placeholder="Itinerario"
                    v-model="itinerarioSeleccionado"
                    @change="filtrar()"
                >
                    <option value="H">Hábil</option>
                    <option value="S">Sábado</option>
                    <option value="D">Domingo</option>
                </select>
            </label>
            <button class="btn btn-info mx-1" @click.prevent="toggleExpandirTurnos()">
            {{ turnosExpandidos ? 'Contraer todos los Turnos' : 'Expandir todos los Turnos' }}
            </button>
        </div>
        <div class="d-flex justify-content-center flex-wrap my-3">
            <h6>Aplicar circular:</h6>
            <div v-for="(circular, index) in circulares" :key="index">
                <label class="form-check-label mx-2">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :value="circular"
                        v-model="circularSeleccionada"
                        v-on:change="cambioCirculares()"
                    />
                    {{ circular }}
                    <!-- Mostrar el valor de la variable circular en el label -->
                </label>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <ul class="list-unstyled">
                        <li>
                            <h4>Ascendente</h4>
                        </li>
                        <table v-if="trenesSinCubrir.length > 0" class="table table-striped table-hover">
                            <thead>
                                    <tr  >
                                        <th >Turno</th>
                                        <th >Vuelta</th>
                                        <th >Referencia</th>
                                        <th >Tren</th>
                                        <th >Origen</th>
                                        <th >Sale</th>
                                        <th >Destino</th>
                                        <th >Llega</th>
                                        <th >Observaciones</th>
                                        <th >Vuelta</th>
                                        <th >Referencia</th>
                                        <th >Tren</th>
                                        <th >Origen</th>
                                        <th >Sale</th>
                                        <th >Destino</th>
                                        <th >Llega</th>
                                        <th >Observaciones</th>
                                    </tr>
                                </thead>
                            <tbody v-for="(vuelta, index) in trenesSinCubrir" :key="index" class="Small">
                                <tr @click="resaltarFila(vuelta)" @dblclick="expandirFila(vuelta)" :class="{ 'filaResaltada': vuelta.resaltar }">
                                    <td >{{ vuelta.turno }}</td>
                                    <td >{{ vuelta.vueltaA === 0 ? "-": vuelta.vueltaA }}</td>
                                    <td >{{ vuelta.referA }}</td>
                                    <td >{{ vuelta.trenA }}</td>
                                    <td >{{ vuelta.origenA }}</td>
                                    <td >{{ vuelta.saleA }}</td>
                                    <td >{{ vuelta.destinoA }}</td>
                                    <td >{{ vuelta.llegaA }}</td>
                                    <td >{{ vuelta.observacionesA }}</td>
                                    <td >{{ vuelta.vueltaD  === 0 ? "-": vuelta.vueltaD}}</td>
                                    <td >{{ vuelta.referD }}</td>
                                    <td >{{ vuelta.trenD }}</td>
                                    <td >{{ vuelta.origenD }}</td>
                                    <td >{{ vuelta.saleD }}</td>
                                    <td >{{ vuelta.destinoD }}</td>
                                    <td >{{ vuelta.llegaD }}</td>
                                    <td >{{ vuelta.observacionesD }}</td>
                                </tr>
                                <tr v-if="vuelta.viewDetail" class=" custom-orange">
                                    <td>Detalle:</td>
                                    <td colspan="16">{{ vuelta.detalle }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { newToken } from "../../services/signService";
import { IPersonal } from "../../interfaces/IPersonal";
import { getTurnos } from "../../services/turnosService";
import { ITurno, TrenesDescubiertos, Vueltas } from '../../interfaces/ITurno';
import { AxiosError } from "axios";
import { getNovedades } from "../../services/novedadesService";
import { getPersonales } from "../../services/personalService";
import { Novedad } from "../../interfaces/INovedades";
import {
    handleRequestError,
    quitarDuplicados,
    loadCambiosTurnos,
} from "../../utils/funciones";
import { CambioTurno } from "../../interfaces/ICambioTurno";
import { obtenerTiposCirculares } from "../../utils/turnos";
import { buscarPersonalACargo, obtenerDotaciones } from "../../utils/personal";
import { compararHoras } from "../../utils/fechas";
import { defaultTrenesDescubiertos } from "../../utils/interfacesDefault";
import { Ordenamiento } from "../../interfaces/IOrdenamientos";
import {  getOrdenamientos } from "../../services/ordenamientoService";

export default defineComponent({
    data() {
        return {
            personales: [] as IPersonal[],
            turnos: [] as ITurno[],
            novedades: [] as Novedad[],

            today: new Date(),

            dotacionesPermitidas: [] as string[],
            dotacionesSeleccionadas: "" as string,
            circulares: [] as string[],
            circularSeleccionada: [] as string[],

            trenesSinCubrir: [] as TrenesDescubiertos[],
            ordenamientos: [] as Ordenamiento[],

            itinerarioSeleccionado: "" as string,
            inputDate: "" as string,
            datosCargados: 0 as number,
            cambiosTurnos: [] as CambioTurno[],
            turnosExpandidos:false,

        };
    },
    methods: {
        async loadTurnos() {
            /* Trae todos los elementos de la base de datos  */
            try {
                const res = await getTurnos();
                this.turnos = res.data;
                const circularSeleccionadaString = localStorage.getItem(
                    "circularSeleccionada"
                );
                this.circularSeleccionada = circularSeleccionadaString
                    ? circularSeleccionadaString.split(",")
                    : [];
                this.circulares = obtenerTiposCirculares(this.turnos);
                if (this.datosCargados > 1) {
                    this.filtrar();
                } else {
                    this.datosCargados++;
                }
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        async loadPersonales() {
            try {
                /* Trae todos los elementos de la base de datos */
                const res = await getPersonales();
                this.personales = res.data;
                this.dotacionesPermitidas = obtenerDotaciones(this.personales);

                if (this.datosCargados > 1) {
                    this.filtrar();
                } else {
                    this.datosCargados++;
                }
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        async loadNovedades() {
            try {
                const res = await getNovedades();
                this.novedades = res.data;
                if (this.datosCargados > 1) {
                    this.filtrar();
                } else {
                    this.datosCargados++;
                }
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        async loadOrdenamientos() {
            try {
                const res = await getOrdenamientos();
                this.ordenamientos = res.data;
                if (this.datosCargados > 1) {
                    this.filtrar();
                } else {
                    this.datosCargados++;
                }
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        resaltarFila(vuelta:TrenesDescubiertos) {
            vuelta.resaltar = !vuelta.resaltar
        },
        expandirFila(vuelta:TrenesDescubiertos) {
            vuelta.viewDetail = !vuelta.viewDetail
        },
        filtrar() {
            localStorage.setItem("dotacionSeleccionada", this.dotacionesSeleccionadas.toString());
            localStorage.setItem("itSeleccionada", this.itinerarioSeleccionado);
            this.inputDate =  this.today.toISOString().split("T")[0]
            
            if (this.dotacionesSeleccionadas.length === 0 || (this.inputDate === '' && this.itinerarioSeleccionado === '')) return;
            this.trenesSinCubrir = []

            const filtroTurnos = (especialidad:string[], ordenes:boolean) => {
                return this.turnos.filter((turno) => {
                    return (
                        this.circularSeleccionada.includes(turno.circular) &&
                        this.dotacionesSeleccionadas.includes(turno.dotacion) &&
                        this.itinerarioSeleccionado === turno.itinerario &&
                        especialidad.includes(turno.especialidad.toLowerCase()) &&
                        turno.ordenes === ordenes
                    );
                });
            };
            const ordenarPorHora = (turnos: ITurno[]) =>
                turnos.sort((turno1: ITurno, turno2: ITurno) => {
                    const resultado = compararHoras(turno1.toma, turno2.toma);
                    return resultado !== null ? resultado : 0; // Asegura que siempre se devuelva un número
                });

            let turnosSinCubrir = filtroTurnos(["conductor electrico", "conductor diesel","guardatren electrico", "guardatren diesel"], false);
            const fechaSelect = new Date(this.inputDate+"T12:00").toLocaleDateString();
            const fecha = this.obtenerFecha(this.inputDate, this.today);

            const cancelacionesDiagrama = this.ordenamientos.filter((orden:Ordenamiento)=>{                
                return orden.tipo === "cancelacionDiagrama" && orden.fecha.split(",")[0] === fechaSelect;
            })            

            turnosSinCubrir = quitarDuplicados(turnosSinCubrir, this.circularSeleccionada);
            const novedadesSinCubrir = buscarPersonalACargo(fecha, this.inputDate, turnosSinCubrir, this.personales, this.novedades, this.cambiosTurnos);
            
            turnosSinCubrir = turnosSinCubrir.filter((turno:ITurno)=>{
                return turno.personal === "Sin Cubrir"
            })
            
            cancelacionesDiagrama.forEach((cd:Ordenamiento)=>{
                turnosSinCubrir.push(cd.turno)
            })
            turnosSinCubrir = ordenarPorHora(turnosSinCubrir);

            turnosSinCubrir.forEach(turno =>{
                let trenesSinCubrir: TrenesDescubiertos = defaultTrenesDescubiertos();
                trenesSinCubrir.turno = turno.turno;
                turno.vueltas.forEach((vuelta:Vueltas)=>{
                    if (typeof vuelta.tren === "string" && vuelta.tren.length > 0) {
                        const ultimoDigito = parseInt(vuelta.tren[vuelta.tren.length - 1]);
                        if (!isNaN(ultimoDigito)) {
                            if(ultimoDigito % 2 === 1){
                                trenesSinCubrir = defaultTrenesDescubiertos();
                                trenesSinCubrir.turno = turno.turno
                                trenesSinCubrir.vueltaA = vuelta.vuelta;
                                trenesSinCubrir.referA = vuelta.refer;
                                trenesSinCubrir.trenA = vuelta.tren;
                                trenesSinCubrir.origenA = vuelta.origen;
                                trenesSinCubrir.saleA = vuelta.sale;
                                trenesSinCubrir.destinoA = vuelta.destino;
                                trenesSinCubrir.llegaA = vuelta.llega;
                                trenesSinCubrir.observacionesA = vuelta.observaciones;
                            }else if(ultimoDigito % 2 === 0){
                                trenesSinCubrir.vueltaD = vuelta.vuelta;
                                trenesSinCubrir.referD = vuelta.refer;
                                trenesSinCubrir.trenD = vuelta.tren;
                                trenesSinCubrir.origenD = vuelta.origen;
                                trenesSinCubrir.saleD = vuelta.sale;
                                trenesSinCubrir.destinoD = vuelta.destino;
                                trenesSinCubrir.llegaD = vuelta.llega;
                                trenesSinCubrir.observacionesD = vuelta.observaciones;
                                if(novedadesSinCubrir[turno.turno]){ 
                                    trenesSinCubrir.detalle = `Personal de baja por la novedad N°${novedadesSinCubrir[turno.turno]?._id} 
                                    V/ ${novedadesSinCubrir[turno.turno]?.apellido}, ${novedadesSinCubrir[turno.turno]?.nombres} 
                                    por ${novedadesSinCubrir[turno.turno]?.tipoNovedad} desde: ${new Date(novedadesSinCubrir[turno.turno]?.fechaBaja).toLocaleDateString()} 
                                    hasta: ${novedadesSinCubrir[turno.turno]?.fechaAlta ? new Date(novedadesSinCubrir[turno.turno]?.fechaAlta).toLocaleDateString() : 'HNA'}`
                                }else{
                                    trenesSinCubrir.detalle = `Cancelacion de diagrama`
                                } 
                                this.trenesSinCubrir.push(trenesSinCubrir)
                            }
                        }
                    }
                })
            })
        },

        obtenerFecha(fecha: string, today: Date) {
            if (fecha == "") {
                // Formatear la fecha en formato ISO (YYYY-MM-DD)
                const formattedDate = today.toISOString().split("T")[0];
                // Asignar el valor al input
                this.inputDate = formattedDate;
                return today;
            } else {
                return new Date(fecha + " 12:00");
            }
        },
        toggleExpandirTurnos(){
            this.turnosExpandidos = !this.turnosExpandidos
            this.trenesSinCubrir.forEach((turno) => (turno.viewDetail = this.turnosExpandidos));
        },
        cambioCirculares() {
            window.localStorage.setItem(
                "circularSeleccionada",
                this.circularSeleccionada.join(",")
            );
            this.filtrar();
        },
    },
    async created() {
        try {
            this.dotacionesSeleccionadas = localStorage.getItem("dotacionSeleccionada") || "";
            this.itinerarioSeleccionado = localStorage.getItem("itSeleccionada")||"";

            this.loadTurnos();
            this.loadPersonales();
            this.loadNovedades();
            this.loadOrdenamientos();

            this.cambiosTurnos = (await loadCambiosTurnos()) || [];
            this.today.setHours(12, 0, 0, 0);
            this.inputDate = this.today.toISOString()
            newToken();
            
            

        } catch (error) {
            console.error(error);
        }
    },
    name: "App",
    components: {},
});
</script>
<style>

main{
    margin-top: 5rem;
}

.hidden-row {
    display: none;
}
tr.filaResaltada {
    background-color: #ddd ;
    color: #fff !important;
    font-weight: bold;
}
.custom-orange{
    background-color: #fd7d1485;
}
</style>
