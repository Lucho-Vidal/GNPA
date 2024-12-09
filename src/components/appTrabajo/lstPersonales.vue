<template>
    <main>
        <h2 class="d-flex justify-content-center m-3">
            Lista de personales por base
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
            <label for="" class="col-1">
                <input
                    type="date"
                    name="today"
                    id="today"
                    class="form-control"
                    placeholder="Fecha"
                    v-model="inputDate"
                    @change="filtrar()"
                />
            </label>
            <div>
                <button
                    class="btn mx-5"
                    :class="[isOnlySinCubrir ? 'btn-secondary' : 'btn-danger' ]"
                    @click="toggleSinCubrir"
                >
                    {{ isOnlySinCubrir ? 'Todos' : 'Sin Cubrir' }}
                </button>
                <button class="btn btn-info mx-1" @click.prevent="toggleExpandirTurnos()">
                    {{ turnosExpandidos ? 'Contraer todos los Turnos' : 'Expandir todos los Turnos' }}
                </button>
            </div>
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
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li>
                            <h4>Conductores</h4>
                        </li>
                        <table
                            v-if="turnosConductor.length > 0"
                            class="table table-striped table-hover"
                        >
                            <thead>
                                <tr>
                                    <th class="col-1" colspan="1">Turno</th>
                                    <th class="col-1" colspan="1">Toma</th>
                                    <th class="col-1" colspan="1">Deja</th>
                                    <th class="col-1" colspan="1">ref</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Circular</th>
                                    <th class="col-6" colspan="1">Personal</th>
                                </tr>
                            </thead>
                            <tbody
                                v-for="(turno, index) in turnosConductor"
                                :key="index"
                                class="Small"
                                @dblclick="viewDetail(turno)"
                            >
                                <tr
                                    :class="{
                                        'fila-oscura':
                                            turno.personal == 'Sin Cubrir',
                                    }"
                                >
                                    <td class="col-1">{{ turno.turno }}</td>
                                    <td class="col-1">{{ turno.toma }}</td>
                                    <td class="col-1">{{ turno.deja }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].refer }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].tren }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].sale }}</td>
                                    <td class="col-1">{{ turno.circular }}</td>
                                    <td class="col-6">{{ turno.personal }}</td>
                                </tr>
                                <tr 
                                    class="custom-orange"
                                    v-if="turno.viewDetail"
                                >
                                    <th class="col-1" colspan="1">Vuelta</th>
                                    <th class="col-1" colspan="1">Referencia</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Origen</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Destino</th>
                                    <th class="col-1" colspan="1">Llega</th>
                                    <th class="col-1" colspan="1">Observaciones</th>
                                </tr>
                                <tr
                                    class="custom-orange mb-5 "
                                    v-for="(vuelta, index) in turno.vueltas"
                                    :key="index"
                                >
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.vuelta }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.refer }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.tren }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.origen }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.sale }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.destino }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.llega }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.observaciones }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <li>Ordenes</li>
                        <table
                            v-if="turnosConductorOrd.length > 0"
                            class="table table-striped table-hover"
                        >
                            <thead>
                                <tr>
                                    <th class="col-1" colspan="1">Turno</th>
                                    <th class="col-1" colspan="1">Toma</th>
                                    <th class="col-1" colspan="1">Deja</th>
                                    <th class="col-1" colspan="1">ref</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Circular</th>
                                    <th class="col-6" colspan="1">Personal</th>
                                </tr>
                            </thead>

                            <tbody
                                v-for="(turno, index) in turnosConductorOrd"
                                :key="index"
                                class="Small"
                                @dblclick="viewDetail(turno)"
                            >
                                <tr
                                    :class="{
                                        'fila-oscura':
                                            turno.personal == 'Sin Cubrir',
                                    }"
                                >
                                    <td class="col-1">{{ turno.turno }}</td>
                                    <td class="col-1">{{ turno.toma }}</td>
                                    <td class="col-1">{{ turno.deja }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].refer }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].tren }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].sale }}</td>
                                    <td class="col-1">{{ turno.circular }}</td>
                                    <td class="col-6">{{ turno.personal }}</td>
                                </tr>
                                <tr 
                                    class="custom-orange"
                                    v-if="turno.viewDetail"
                                >
                                    <th class="col-1" colspan="1">Vuelta</th>
                                    <th class="col-1" colspan="1">Referencia</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Origen</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Destino</th>
                                    <th class="col-1" colspan="1">Llega</th>
                                    <th class="col-1" colspan="1">Observaciones</th>
                                </tr>
                                <tr
                                    class="custom-orange mb-5 "
                                    style="margin-bottom: 10px;"
                                    v-for="(vuelta, index) in turno.vueltas"
                                    :key="index"
                                >
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.vuelta }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.refer }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.tren }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.origen }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.sale }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.destino }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.llega }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.observaciones }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li>
                            <h4>Guarda trenes</h4>
                        </li>
                        <table
                            v-if="turnosGuardas.length > 0"
                            class="table table-striped table-hover"
                        >
                            <thead>
                                <tr>
                                    <th class="col-1" colspan="1">Turno</th>
                                    <th class="col-1" colspan="1">Toma</th>
                                    <th class="col-1" colspan="1">Deja</th>
                                    <th class="col-1" colspan="1">ref</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Circular</th>
                                    <th class="col-6" colspan="1">Personal</th>
                                </tr>
                            </thead>

                            <tbody
                                v-for="(turno, index) in turnosGuardas"
                                :key="index"
                                class="Small"
                                @dblclick="viewDetail(turno)"
                            >
                                <tr
                                    :class="{
                                        'fila-oscura':
                                            turno.personal == 'Sin Cubrir',
                                    }"
                                >
                                    <td class="col-1">{{ turno.turno }}</td>
                                    <td class="col-1">{{ turno.toma }}</td>
                                    <td class="col-1">{{ turno.deja }}</td>
                                    <td class="col-1" v-if="turno.vueltas[0]">{{ turno.vueltas[0].refer }}</td>
                                    <td class="col-1" v-else>--</td>
                                    <td class="col-1" v-if="turno.vueltas[0]">{{ turno.vueltas[0].tren }}</td>
                                    <td class="col-1" v-else>--</td>
                                    <td class="col-1" v-if="turno.vueltas[0]">{{ turno.vueltas[0].sale }}</td>
                                    <td class="col-1" v-else>--</td>
                                    <td class="col-1">{{ turno.circular }}</td>
                                    <td class="col-6">{{ turno.personal }}</td>
                                </tr>
                                <tr 
                                    class="custom-orange"
                                    v-if="turno.viewDetail"
                                >
                                    <th class="col-1" colspan="1">Vuelta</th>
                                    <th class="col-1" colspan="1">Referencia</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Origen</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Destino</th>
                                    <th class="col-1" colspan="1">Llega</th>
                                    <th class="col-1" colspan="1">Observaciones</th>
                                </tr>
                                <tr
                                    class="custom-orange mb-5 "
                                    v-for="(vuelta, index) in turno.vueltas"
                                    :key="index"
                                >
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.vuelta }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.refer }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.tren }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.origen }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.sale }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.destino }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.llega }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.observaciones }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <li>Ordenes</li>
                        <table
                            v-if="turnosGuardasOrd.length > 0"
                            class="table table-striped table-hover"
                        >
                            <thead>
                                <tr>
                                    <th class="col-1" colspan="1">Turno</th>
                                    <th class="col-1" colspan="1">Toma</th>
                                    <th class="col-1" colspan="1">Deja</th>
                                    <th class="col-1" colspan="1">ref</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Circular</th>
                                    <th class="col-6" colspan="1">Personal</th>
                                </tr>
                            </thead>

                            <tbody
                                v-for="(turno, index) in turnosGuardasOrd"
                                :key="index"
                                class="Small"
                                @dblclick="viewDetail(turno)"
                            >
                                <tr
                                    :class="{
                                        'fila-oscura':
                                            turno.personal === 'Sin Cubrir',
                                    }"
                                >
                                    <td class="col-1">{{ turno.turno }}</td>
                                    <td class="col-1">{{ turno.toma }}</td>
                                    <td class="col-1">{{ turno.deja }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].refer }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].tren }}</td>
                                    <td class="col-1">{{ turno.vueltas[0].sale }}</td>
                                    <td class="col-1">{{ turno.circular }}</td>
                                    <td class="col-6">{{ turno.personal }}</td>
                                </tr>
                                <tr 
                                    class="custom-orange"
                                    v-if="turno.viewDetail"
                                >
                                    <th class="col-1" colspan="1">Vuelta</th>
                                    <th class="col-1" colspan="1">Referencia</th>
                                    <th class="col-1" colspan="1">Tren</th>
                                    <th class="col-1" colspan="1">Origen</th>
                                    <th class="col-1" colspan="1">Sale</th>
                                    <th class="col-1" colspan="1">Destino</th>
                                    <th class="col-1" colspan="1">Llega</th>
                                    <th class="col-1" colspan="1">Observaciones</th>
                                </tr>
                                <tr
                                    class="custom-orange mb-5 "
                                    v-for="(vuelta, index) in turno.vueltas"
                                    :key="index"
                                >
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.vuelta }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.refer }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.tren }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.origen }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.sale }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.destino }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.llega }}</td>
                                    <td colspan="1" v-if="turno.viewDetail">{{ vuelta.observaciones }}</td>
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
import { ITurno } from "../../interfaces/ITurno";
import { AxiosError } from "axios";
import { getNovedades } from "../../services/novedadesService";
import { getPersonales } from "../../services/personalService";
import { Novedad } from "../../interfaces/INovedades";
import {
    handleRequestError,
    quitarDuplicados,
    loadCambiosTurnos,
    loadOrdenamientos,
} from "../../utils/funciones";
import { CambioTurno } from "../../interfaces/ICambioTurno";
import { obtenerTiposCirculares } from "../../utils/turnos";
import { buscarPersonalACargo, obtenerDotaciones } from "../../utils/personal";
import { compararHoras } from "../../utils/fechas";
import { Ordenamiento } from "../../interfaces/IOrdenamientos";

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

            turnosConductor: [] as ITurno[],
            turnosGuardas: [] as ITurno[],
            turnosConductorOrd: [] as ITurno[],
            turnosGuardasOrd: [] as ITurno[],
            ordenamientos: [] as Ordenamiento[],

            itinerarioSeleccionado: "" as string,
            inputDate: "" as string,
            datosCargados: 0 as number,
            cambiosTurnos: [] as CambioTurno[],
            isOnlySinCubrir:false,
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
        toggleExpandirTurnos(){
            this.turnosExpandidos = !this.turnosExpandidos
            this.turnosConductor.forEach((turno) => (turno.viewDetail = this.turnosExpandidos));
            this.turnosGuardas.forEach((turno) => (turno.viewDetail = this.turnosExpandidos));
        },
        viewDetail(turno: ITurno) {
            turno.viewDetail = !turno.viewDetail 
        },
        toggleSinCubrir(){
            this.isOnlySinCubrir = ! this.isOnlySinCubrir
            this.filtrar()
        },
        filtrar() {
            localStorage.setItem("dotacionSeleccionada", this.dotacionesSeleccionadas.toString());
            localStorage.setItem("itSeleccionada", this.itinerarioSeleccionado);

            if (this.dotacionesSeleccionadas.length === 0 || (this.inputDate === '' && this.itinerarioSeleccionado === '')) return;

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

            let turnosGuardas = filtroTurnos(["guardatren electrico", "guardatren diesel"], false);
            let turnosConductor = filtroTurnos(["conductor electrico", "conductor diesel"], false);
            let turnosGuardasOrd = filtroTurnos(["guardatren electrico", "guardatren diesel"], true);
            let turnosConductorOrd = filtroTurnos(["conductor electrico", "conductor diesel"], true);

            turnosGuardas = quitarDuplicados(turnosGuardas, this.circularSeleccionada);
            turnosConductor = quitarDuplicados(turnosConductor, this.circularSeleccionada);
            turnosGuardasOrd = quitarDuplicados(turnosGuardasOrd, this.circularSeleccionada);
            turnosConductorOrd = quitarDuplicados(turnosConductorOrd, this.circularSeleccionada);

            const fecha = this.obtenerFecha(this.inputDate, this.today);

            [turnosGuardas, turnosConductor, turnosGuardasOrd, turnosConductorOrd].forEach((turnos) => {
                buscarPersonalACargo(fecha, this.inputDate, turnos, this.personales, this.novedades, this.cambiosTurnos);
            });

            //Aca si hay una cancelacion de diagrama vamos a quitarle el nombre por "Sin Cubrir"
            const cancelacionesDiagrama = this.ordenamientos.filter((orden:Ordenamiento)=>{                
                return orden.tipo === "cancelacionDiagrama" && orden.fecha.split(",")[0] === new Date(this.inputDate+"T12:00").toLocaleDateString();
            });

            cancelacionesDiagrama.forEach(cd=>{
                [turnosGuardas, turnosConductor ].forEach((turnos) => {
                    turnos.forEach(turno=>{
                        if(turno.turno === cd.turnoEfectivo) {
                            turno.personal = "Sin Cubrir"
                        }
                    })
                });
            })

            if (this.isOnlySinCubrir) {
                turnosConductor = turnosConductor.filter((turno) => turno.personal === "Sin Cubrir");
                turnosGuardas = turnosGuardas.filter((turno) => turno.personal === "Sin Cubrir");

                turnosConductor.forEach((turno) => (turno.viewDetail = true));
                turnosGuardas.forEach((turno) => (turno.viewDetail = true));
            }

            const ordenarPorHora = (turnos: ITurno[]) =>
                    turnos.sort((turno1: ITurno, turno2: ITurno) => {
                        const resultado = compararHoras(turno1.toma, turno2.toma);
                        return resultado !== null ? resultado : 0; // Asegura que siempre se devuelva un número
                    });


            this.turnosGuardas = ordenarPorHora(turnosGuardas);
            this.turnosConductor = ordenarPorHora(turnosConductor);
            this.turnosGuardasOrd = ordenarPorHora(turnosGuardasOrd);
            this.turnosConductorOrd = ordenarPorHora(turnosConductorOrd);
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
            this.ordenamientos = await loadOrdenamientos() || [];
            this.cambiosTurnos = (await loadCambiosTurnos()) || [];
            this.today.setHours(12, 0, 0, 0);
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
.fila-oscura {
    background-color: #e14646 !important;
    color: #fff;
}
.custom-orange{
    background-color: #fd7d1485;
}
</style>
