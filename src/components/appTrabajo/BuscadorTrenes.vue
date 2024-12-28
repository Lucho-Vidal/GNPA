<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Buscador de trenes
            </h2>
            <div class="d-flex flex-column">
            <!-- Inputs alineados a la derecha -->
            <div class="d-flex justify-content-end mb-3">
                <div class="d-flex align-items-center w-50">
                    <div class="input-group w-50">
                        <input
                            class="form-control"
                            type="text"
                            placeholder="Buscar por tren o por turno"
                            v-model="tren"
                            @change="buscar"
                        />
                        <button
                            class="btn btn-outline-secondary"
                            @click="toggleSearchType"
                        >
                            {{ isSearchByTurno ? 'Turno' : 'Tren' }}
                        </button>
                    </div>
                </div>
                <select
                    name="itinerario"
                    id="itinerario"
                    class="form-control ms-3 w-auto"
                    required
                    v-model="inputIt"
                    @change="buscar"
                >
                    <option value=""></option>
                    <option value="H">Hábil</option>
                    <option value="S">Sábado</option>
                    <option value="D">Domingo</option>
                </select>
                <input
                    class="form-control ms-3 w-auto"
                    type="date"
                    v-model="inputDate"
                    @change="buscar"
                />
            </div>

            <!-- Sección "Aplicar circular" centrada -->
            <div class="d-flex flex-wrap justify-content-center my-3">
                <h6>Aplicar:</h6>
                <div v-for="(circular, index) in circulares" :key="index">
                    <label class="form-check-label mx-2">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :value="circular"
                            v-model="circularSeleccionada"
                            @change="cambioCirculares"
                        />
                        {{ circular }}
                    </label>
                </div>
            </div>
        </div>
            <div class=""></div>
            <table class="table table-striped table-hover">
                <thead v-if="horarios !== null">
                    <tr v-if="horarios.estaciones !== undefined">
                        <th
                            v-for="i in horarios.estaciones.length"
                            :key="i"
                            colspan="1"
                        >
                            {{ horarios.estaciones[i - 1] }}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="horarios !== null">
                    <tr v-if="horarios.horarios !== undefined">
                        <th
                            v-for="i in horarios.horarios.length"
                            :key="i"
                            colspan="1"
                        >
                            {{ horarios.horarios[i - 1] }}
                        </th>
                    </tr>
                </tbody>
            </table>
            <table
                v-if="turnosAImprimir !== null"
                class="table table-striped table-hover"
            >
                <thead>
                    <tr v-if="turnosAImprimir.length != 0">
                        <th colspan="1">Ref</th>
                        <th colspan="1">Turno</th>
                        <th colspan="1">Circular</th>
                        <th colspan="1">Observación</th>
                        <th colspan="2">Titular</th>
                        <th colspan="1">Toma</th>
                        <th colspan="1">Deja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(ind, index) in turnosAImprimir"
                        :key="index"
                    >
                        <td class="w-10">{{ ind.vueltas[0].refer }}</td>
                        <td class="w-10">{{ ind.turno }}</td>
                        <td class="w-10">{{ ind.circular }}</td>
                        <td class="w-10">{{ ind.vueltas[0].observaciones }}</td>
                        <td colspan="2" class="w-10">
                            <span
                                :class="{
                                    resaltado: ind.personal === 'Sin Cubrir' || ind.personal === 'Diagrama Cancelado',
                                    'resaltado-verde': ind.personal.includes('Ordenado')
                                }"
                            >
                                {{ ind.especialidad+ ': ' +  ind.personal }}
                            </span>
                        </td>
                        <td class="w-10">{{ ind.toma }}</td>
                        <td class="w-10">{{ ind.deja }}</td>
                    </tr>
                </tbody>
            </table>
            <div
                v-for="(t, tIndex) in turnosAImprimir"
                :key="tIndex"
                class="row"
            >
                <h4 class="Personal col-1">{{ t.turno }}</h4>
                <h4 class="col-4" :class="{
                                    resaltado: t.personal === 'Sin Cubrir' || t.personal === 'Diagrama Cancelado',
                                    'resaltado-verde': t.personal.includes('Ordenado')
                                }">{{ t.personal }}</h4>
                <h5 class="col-2">{{ "<<" + t.circular + ">>" }}</h5>
                <h5 class="col-2">Toma: {{ t.toma }}</h5>
                <h5 class="col-2">Deja: {{ t.deja }}</h5>
                <table class="table table-striped table-hover">
                    <thead class="">
                        <tr>
                            <th colspan="1">Vuelta</th>
                            <th colspan="1">Ref</th>
                            <th colspan="1">Tren</th>
                            <th colspan="1">Origen</th>
                            <th colspan="1">Sale</th>
                            <th colspan="1">Destino</th>
                            <th colspan="1">Llega</th>
                            <th colspan="1">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(vuelta, index) in t.vueltas"
                            :key="index"
                        >
                            <td class="col-3">{{ vuelta.vuelta }}</td>
                            <td class="col-1">{{ vuelta.refer }}</td>
                            <td class="col-1">{{ vuelta.tren }}</td>
                            <td class="col-1">{{ vuelta.origen }}</td>
                            <td class="col-1">{{ vuelta.sale }}</td>
                            <td class="col-1">{{ vuelta.destino }}</td>
                            <td class="col-1">{{ vuelta.llega }}</td>
                            <td class="col-3">{{ vuelta.observaciones }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ITurno } from '../../interfaces/ITurno';
import { Itinerario } from "../../interfaces/Itinerario";
import { IPersonal } from "../../interfaces/IPersonal";
import { Novedad } from "../../interfaces/INovedades";
import { newToken } from "../../services/signService";
import { CambioTurno } from '../../interfaces/ICambioTurno';
import { loadItinerarios, loadCambiosTurnos, loadPersonales, loadNovedades, loadOrdenamientos, loadTurnos } from '../../utils/funciones';
import { filtrarPorTurno, filtroItinerario, filtroTrenes, obtenerTiposCirculares } from "../../utils/turnos";
import { buscarCancelacionDiagrama, buscarPersonalACargo } from "../../utils/personal";
import { Ordenamiento } from "../../interfaces/IOrdenamientos";

export default defineComponent({
    data() {
        return {
            tren: "" as string,
            searchType: 'tren',
            isSearchByTurno: false,
            
            lstTurnos: [] as ITurno[],
            personales: [] as IPersonal[],
            itinerario: [] as Itinerario[],
            novedades: [] as Novedad[],
            cambiosTurnos: [] as  CambioTurno[],
            ordenamientos: [] as Ordenamiento[],

            circulares: [] as string[],
            circularSeleccionada: [] as string[],
            
            turnosAImprimir: [] as ITurno[] ,
            horarios: {} as Itinerario | null,
            
            today: new Date(),
            inputDate: "" as string,
            inputIt: "" as string,
            days: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
        };
    },
    methods: {
        buscar() {
            /* Ejecuta en cada búsqueda todos los métodos necesarios. 
            Se ejecuta por v-on:change en el input  */
            //limpio variables globales
            this.horarios = null;
            this.turnosAImprimir = [];

            const fecha: Date = this.obtenerFecha(this.inputDate, this.today);
            const itinerario: string = this.itinerarioType(fecha);

            if (this.tren !== "") {
                // Define un objeto de prioridad para las especialidades
                const especialidadPrioridad: { [key: string]: number } = {
                    "Conductor electrico": 1,
                    "Conductor diesel": 2,
                    "Ayudante habilitado": 3, // Equivalente a conductor
                    "Ayudante conductor": 4,
                    "Guardatren electrico": 5,
                    "Guardatren diesel": 6,
                };
                function compararEspecialidades(a: ITurno, b: ITurno): number {
                    const prioridadA = especialidadPrioridad[a.especialidad];
                    const prioridadB = especialidadPrioridad[b.especialidad];

                    return prioridadA - prioridadB;
                }
                if(!this.isSearchByTurno){
                    this.turnosAImprimir = filtroTrenes(
                        itinerario,
                        this.lstTurnos,
                        this.circularSeleccionada,
                        this.tren
                    );
                    // Ordena el array utilizando la función de comparación
                    this.turnosAImprimir.sort(compararEspecialidades);
                    
                    this.horarios = filtroItinerario(
                        itinerario,
                        this.itinerario,
                        this.tren
                    );
                }else {
                    this.turnosAImprimir = filtrarPorTurno(
                        itinerario,
                        this.lstTurnos,
                        this.circularSeleccionada,
                        this.tren
                    );
                    //this.filtroTurno(itinerario);
                }
                buscarPersonalACargo(
                    fecha,
                    this.inputDate,
                    this.turnosAImprimir,
                    this.personales,
                    this.novedades,
                    this.cambiosTurnos
                );
                buscarCancelacionDiagrama(this.ordenamientos,this.inputDate,this.turnosAImprimir,this.tren)
            }
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
        itinerarioType(fecha: Date) {
            if (this.inputIt === "") {
                if (fecha.getDay() === 0) {
                    this.inputIt = "D";
                    return "D";
                } else if (fecha.getDay() === 6) {
                    this.inputIt = "S";
                    return "S";
                } else {
                    this.inputIt = "H";
                    return "H";
                }
            } else {
                return this.inputIt;
            }
        },
        cambioCirculares() {
            window.localStorage.setItem(
                "circularSeleccionada",
                this.circularSeleccionada.join(",")
            );
            this.buscar();
        },
        toggleSearchType() {
            this.isSearchByTurno = !this.isSearchByTurno;
            this.buscar();
        },
    },
    async mounted() {
        try {
            const circularSeleccionadaString = window.localStorage.getItem("circularSeleccionada");
            this.circularSeleccionada = circularSeleccionadaString ? circularSeleccionadaString.split(",") : [];

            this.lstTurnos = await loadTurnos() || [];
            this.circulares = obtenerTiposCirculares(this.lstTurnos);
            this.itinerario = await loadItinerarios() || [];
            this.cambiosTurnos = await loadCambiosTurnos() || [];
            this.personales = await loadPersonales() || [];
            this.novedades = await loadNovedades() || [];
            this.ordenamientos = await loadOrdenamientos() || [];
            this.today.setHours(12, 0, 0, 0);
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    computed: {},
    components: {
    },
});
</script>
<style>
main {
    margin-top: 5rem;
}
body {
    background: #ddd;
}
.Personal {
    background: #000;
    width: 150px;
    border-top: #000;
    color: #ddd;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    border-radius: 0.5rem;
}
.resaltado {
  background-color: red;
  color: white;
  margin-inline: 10px;
  padding: 5px; /* Opcional para agregar espaciado */
  border-radius: 4px; /* Opcional para bordes redondeados */
}
.resaltado-verde {
    background-color: lightgreen; /* Fondo verde claro */
    color: black;    
    margin-inline: 10px;
    padding: 5px; /* Opcional para agregar espaciado */
    border-radius: 4px; /* Opcional para bordes redondeados */  
    font-weight: bold;
}
</style>
