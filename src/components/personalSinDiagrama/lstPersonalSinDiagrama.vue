<template>
    <main>
        <div class="container-fluid px-4">
            <div class="d-flex justify-content-between m-3">
                <span class="fs-3 ">Fecha: {{ today.toLocaleDateString() }}</span>
                <h2 class="">Tarjetas  de personal sin diagrama</h2>
            </div>

            <div class="d-flex justify-content-end">
                <label class="col-2">
                    Especialidad:
                    <select
                        name="especialidad"
                        id="especialidad"
                        class="form-control "
                        v-model="CEspecialidad"
                        required
                        @change="loadLists()"
                    >
                        <option value="Conductor Electrico"
                            >Conductor Eléctrico</option
                        >
                        <option value="Conductor Diesel"
                            >Conductor Diesel</option
                        >
                        <option value="Ayudante Habilitado"
                            >Ayudante Habilitado</option
                        >
                        <option value="Ayudante Conductor"
                            >Ayudante Conductor</option
                        >
                        <option value="Guardatren Electrico"
                            >Guardatren Eléctrico</option
                        >
                        <option value="Guardatren Diesel"
                            >Guardatren Diesel</option
                        >
                    </select>
                </label>
                <label for="dotacion" class="col-1 mx-3">
                    Dotación:
                    <select
                    name="dotacion"
                    id="dotacion"
                    class="form-control"
                    @change="loadLists()"
                    v-model="dotacionesSeleccionadas"
                    >
                    <option v-for="(dotacion, index) in dotacionesPermitidas" :key="index" :value="dotacion">
                        {{ dotacion }}
                    </option>
                    </select>
                </label>
                
                <!-- <progress value="0.99"></progress> -->
                <button class="btn btn-warning mx-5" @click.prevent="abrirModal()">
                    Filtrar Personal
                </button>
            </div>
            <!-- v-if="detalleLegajo!=0" para que no genere error -->
            <div class="modal my-5" :class="{ 'd-block': message.activo }"  @click.self="cerrarModal">
                <div class="modal-dialog">
                    <div class="modal-content" :class="message.status">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ message.title }}</h5>
                            <button
                                type="button"
                                class="close btn btn-danger"
                                @click.prevent="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3 justify-content-center"
                                
                            >
                                <div class="col-md-8">
                                    <p> {{ message.message }}</p>
                                </div>
                            </div>
                            <div class="mt-5 d-flex justify-content-center">
                                <button 
                                class="btn btn-primary mx-3"
                                @click="$router.push(`/personal/`)"
                                >Ir a gestión de personal</button>
                                <button 
                                class="btn btn-secondary"
                                @click="cerrarModal"
                                >Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal" :class="{ 'd-block': mostrarModalSearch }"  @click.self="cerrarModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Filtrar personales</h5>
                            <button
                                type="button"
                                class="close btn btn-danger"
                                @click.prevent="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3 justify-content-center">
                                <div class="col-md-4">
                                    <input
                                        class="form-control rounded-3"
                                        ref="inputSearch"
                                        type="number"
                                        placeholder="Buscar Legajo"
                                        autofocus
                                        v-model="searchLegajo"
                                        @keyup.enter="handleEnterKey"
                                    />
                                </div>
                                <div class="col-md-4">
                                    <input
                                        class="form-control rounded"
                                        type="text"
                                        placeholder="Buscar por apellido y/o nombre"
                                        v-model="search"
                                        v-on:change="filtrarPersonales()"
                                        @keyup.enter="handleEnterKey"
                                    />
                                </div>
                                <div class="col-md-4">
                                    <input
                                        class="form-control col rounded"
                                        type="text"
                                        placeholder="Buscar por turno"
                                        v-model="searchTurno"
                                        v-on:change="filtrarPersonales()"
                                        @keyup.enter="handleEnterKey"
                                    />
                                </div>
                            </div>
                            <div class="mt-5 d-flex justify-content-center">
                                <button 
                                class="btn btn-primary"
                                @click="limpiarFiltro()"
                                >Limpiar Filtros y cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <h2 class="d-flex justify-content-center">Lista de tarjetas Disponibles</h2>
                <div>
                    <button class="btn btn-info mx-1" @click.prevent="toggleExpandirTarjetas(firstList,'Disponible')">
                        {{ tarjetasDisponibleExpandido ? 'Contraer todas las Tarjetas' : 'Expandir todas las Tarjetas' }}
                    </button>
                    <button class="btn btn-warning mx-1 " @click.prevent="ordenarPorDisponibilidad(firstList)">
                            Ordenar Por Disponibilidad
                    </button>
                </div>
            </div>
            <table class="table table-striped table-hover ">
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">N</th>
                        <th class="col-1" colspan="1">legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Franco</th>
                        <th class="col-1" colspan="1">Especialidad</th>
                        <th class="col-1" colspan="1">Dotacion</th>
                        <th class="col-1" colspan="1">Observaciones</th>
                        <th class="col-1">Abrir</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(personal, index) in firstList"
                    :key="personal._id"
                    @click="viewDetail(personal)"
                    @dragstart="handleDragStart(index, $event, 'todo')"
                    @drop="handleDrop(index, $event, 'todo')"
                    @dragover="handleDragOver($event)"
                    draggable="true"
                    :class="getColorClass(personal.especialidad)"
                >
                    <tr>
                        <td class="index-column" v-if="personal.legajo !== 0">{{ index +1 }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1"  v-if="personal.legajo !== 0">{{ personal.legajo }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1">{{ personal.apellido }}</td>
                        <td class="col-2">{{ personal.nombres }}</td>
                        <td class="col-1">{{ personal.turno }}</td>
                        <td class="col-1"  v-if="personal.legajo !== 0">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo] ? 
                                                `${diaSemanaStr(tarjetaPersonalSinDiagramaIndexado[personal.legajo].francoInicio)} 
                                                ${tarjetaPersonalSinDiagramaIndexado[personal.legajo].HoraInicio}`
                                                :"-" }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1">{{ personal.especialidad }}</td>
                        <td class="col-1">{{ personal.dotacion }}</td>
                        <td class="col-2">{{ personal.observaciones }}</td>
                        <td class="col-1" v-if="personal.legajo !== 0">
                            <i
                                class="material-icons cursor-hand"
                                @click="edit(personal)"
                                >edit_note</i
                            >
                        </td>
                        <td class="col-1" v-else></td>
                    </tr>
                    <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo] && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes">
                    <!-- <tr  class='custom-orange' v-if="personal.viewDetail  && tarjetaPersonalSinDiagramaIndexado[personal.legajo].meses[selectedMonth]"> -->
                        <th class="col-1" colspan="1">fecha</th>
                        <th class="col-1" colspan="1">Diagrama</th>
                        <th class="col-1" colspan="1">Disponible a </th>
                        <th class="col-1" colspan="1">Toma</th>
                        <th class="col-1" colspan="1">Deja</th>
                        <th class="col-1" colspan="1">Total hs trabajado</th>
                        <th class="col-1" colspan="6">Observaciones</th>
                        
                    </tr>
                    <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo] && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes">
                    <!-- <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo].meses[selectedMonth]"> -->
                        <td colspan="1">{{ today.toLocaleDateString() }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].tren }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].disponibleHora }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].tomo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].dejo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].totalHoras }}</td>
                        <td colspan="6">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].observaciones }}</td>
                    </tr>
                    <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo] && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes && tarjetaPersonalSinDiagramaIndexado[personal.legajo].mes">
                    <!-- <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo].meses[selectedMonth]"> -->
                        <td colspan="1">{{ new Date(tomorrowStr+'T12:00').toLocaleDateString() }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].tren }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].disponibleHora }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].tomo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].dejo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].totalHoras }}</td>
                        <td colspan="6">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].observaciones }}</td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <div class="d-flex justify-content-between">
                <h2 class="d-flex justify-content-center">Lista de tarjetas HTT</h2>
                <div>
                    <button class="btn btn-info mx-1" @click.prevent="toggleExpandirTarjetas(secondList,'HTT')">
                        {{ tarjetasHTTExpandido ? 'Contraer todas las Tarjetas' : 'Expandir todas las Tarjetas' }}
                    </button>
                    <button class="btn btn-warning mx-1 " @click.prevent="ordenarPorDisponibilidad(secondList)">
                            Ordenar Por Disponibilidad
                    </button>
                </div>
            </div>
            <table class="table table-striped table-hover ">
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">N</th>
                        <th class="col-1" colspan="1">legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Franco</th>
                        <th class="col-1" colspan="1">Especialidad</th>
                        <th class="col-1" colspan="1">Dotacion</th>
                        <th class="col-1" colspan="1">Observaciones</th>
                        <th class="col-1">Abrir</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(personal, index) in secondList"
                    :key="personal._id"
                    @click="viewDetail(personal)"
                    @dragstart="handleDragStart(index, $event, 'done')"
                    @drop="handleDrop(index, $event, 'done')"
                    @dragover="handleDragOver($event)"
                    draggable="true"
                    :class="getColorClass(personal.especialidad)"
                >
                <tr>
                        <td class="index-column" v-if="personal.legajo !== 0">{{ index +1 }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1"  v-if="personal.legajo !== 0">{{ personal.legajo }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1">{{ personal.apellido }}</td>
                        <td class="col-2">{{ personal.nombres }}</td>
                        <td class="col-1">{{ personal.turno }}</td>
                        <td class="col-1"  v-if="personal.legajo !== 0">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo] ? 
                                                `${diaSemanaStr(tarjetaPersonalSinDiagramaIndexado[personal.legajo].francoInicio)} 
                                                ${tarjetaPersonalSinDiagramaIndexado[personal.legajo].HoraInicio}`
                                                :"-" }}</td>
                        <td class="col-1" v-else></td>
                        <td class="col-1">{{ personal.especialidad }}</td>
                        <td class="col-1">{{ personal.dotacion }}</td>
                        <td class="col-2">{{ personal.observaciones }}</td>
                        <td class="col-1" v-if="personal.legajo !== 0">
                            <i
                                class="material-icons cursor-hand"
                                @click="edit(personal)"
                                >edit_note</i
                            >
                        </td>
                        <td class="col-1" v-else></td>
                    </tr>
                    <tr  class='custom-orange' v-if="personal.viewDetail  && tarjetaPersonalSinDiagramaIndexado[personal.legajo]">
                        <th class="col-1" colspan="1">fecha</th>
                        <th class="col-1" colspan="1">Diagrama</th>
                        <th class="col-1" colspan="1">Disponible a </th>
                        <th class="col-1" colspan="1">Toma</th>
                        <th class="col-1" colspan="1">Deja</th>
                        <th class="col-1" colspan="1">Total hs trabajado</th>
                        <th class="col-1" colspan="1">Jornada</th>
                        <th class="col-1" colspan="6">Observaciones</th>
                        
                    </tr>
                    <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo]">
                        <td colspan="1">{{ today.toLocaleDateString() }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].tren }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].disponibleHora }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].tomo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].dejo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].totalHoras }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].dia_laboral }}</td>
                        <td colspan="5">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[today.toISOString().split('T')[0]].observaciones }}</td>
                    </tr>
                    <tr class='custom-orange' v-if="personal.viewDetail && tarjetaPersonalSinDiagramaIndexado[personal.legajo]">
                        <td colspan="1">{{ new Date(tomorrowStr+'T12:00').toLocaleDateString() }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].tren }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].disponibleHora }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].tomo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].dejo }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].totalHoras }}</td>
                        <td colspan="1">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].dia_laboral }}</td>
                        <td colspan="5">{{ tarjetaPersonalSinDiagramaIndexado[personal.legajo].days[tomorrowStr].observaciones }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getPersonales } from "../../services/personalService";
import { IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { getPersonalesSinDiagrama } from "../../services/personalSinDiagramaService";
import { IPersonalSinDiagrama } from "../../interfaces/IPersonalSinDiagrama";
import { ITarjetaPersonalSinDiagrama } from "../../interfaces/ITarjetaPersonalSinDiagrama";
import { getTarjetaPersonalesSinDiagrama } from "../../services/tarjetaPersonalSinDiagramaService";
import { obtenerDotaciones } from "../../utils/personal";
import { defaultPersonal } from "../../utils/interfacesDefault";
import { diaPosterior } from "../../utils/fechas";

export default defineComponent({
    props: ['idPersonal', 'idPersonalSinDiagrama', 'idTarjetaPersonalSinDiagrama'],
    data() {
        return {
            personales: [] as IPersonal[],
            personalesSinDiagrama: [] as IPersonalSinDiagrama[],
            tarjetasPersonalesSinDiagrama: [] as ITarjetaPersonalSinDiagrama[],
            
            personalIndexado: {} as Record<number, IPersonal>,
            personalSinDiagramaIndexado: {} as Record<number, IPersonalSinDiagrama>,
            tarjetaPersonalSinDiagramaIndexado: {} as Record<number, ITarjetaPersonalSinDiagrama>,
            
            dotacionesPermitidas: [] as string[],
            dotacionesSeleccionadas: "" as string,
            CEspecialidad: "Conductor Electrico" as string,
            
            today: new Date(),
            tomorrowStr: '' as string,

            search: "" as string,
            searchTurno: "" as string,
            searchLegajo: null,
            
            tarjetasDisponibleExpandido: false,
            tarjetasHTTExpandido: false,

            mostrarModalSearch: false,

            //drag And Drop
            firstList: [] as IPersonal[], // Lista de 'todo'
            secondList: [] as IPersonal[], // Lista de 'done'
            dragIndex: null as number | null,
            draggedItem: null as IPersonal | null,

            days: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],

            message: {
                id: "",
                activo: false,
                status: "",
                title: "",
                message: "",
            },
        };
    },
    methods: {
        async loadPersonales(){
            try {
                const res = await getPersonales();
                this.personales = this.filtrarCiclo(res.data);                
                this.personalIndexado = this.indexarPersonal(this.personales);
                this.dotacionesPermitidas = obtenerDotaciones(this.personales);
                // this.loadPersonalesFiltrados()
                this.loadLists()
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async loadPersonalSinDiagrama() {
            try {
                const res = await getPersonalesSinDiagrama();
                this.personalesSinDiagrama = res.data;
                this.personalSinDiagramaIndexado = this.indexarPersonalSinDiagrama(this.personalesSinDiagrama)
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async loadTarjetaPersonalSinDiagrama() {
            try {
                const res = await getTarjetaPersonalesSinDiagrama();
                this.tarjetasPersonalesSinDiagrama = res.data;
                console.log(this.tarjetasPersonalesSinDiagrama);
                this.tarjetaPersonalSinDiagramaIndexado = this.indexarTarjetasPersonalesSinDiagrama(this.tarjetasPersonalesSinDiagrama)
                console.log(this.tarjetaPersonalSinDiagramaIndexado);

            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        diaSemanaStr(dia:number):string{
            const dias =[
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ]
            return dias[dia]
        },

        // drag and drop
        handleDragStart(index: number, event: DragEvent, listType: string) {
            this.dragIndex = index;
            this.draggedItem = listType === 'todo' ? this.firstList[index] : this.secondList[index];
            if (event.dataTransfer) {
                event.dataTransfer.setData('text/plain', index.toString());
                event.dataTransfer.effectAllowed = 'move';
            }
        },
        handleDragOver(event: DragEvent) {
            event.preventDefault(); // Necesario para permitir el drop
        },
        handleDrop(index: number, event: DragEvent, listType: string) {
            event.preventDefault();
            const draggedIndex = this.dragIndex;
            if (this.draggedItem && draggedIndex !== null) {
                // Si se suelta en la misma lista (reordenar)
                if (listType === 'todo' && this.firstList.includes(this.draggedItem)) {
                    if (draggedIndex !== index) {
                        const [item] = this.firstList.splice(draggedIndex, 1);
                        this.firstList.splice(index, 0, item);
                    }
                } else if (listType === 'done' && this.secondList.includes(this.draggedItem)) {
                    if (draggedIndex !== index) {
                        const [item] = this.secondList.splice(draggedIndex, 1);
                        this.secondList.splice(index, 0, item);
                    }
                }
                // Si se suelta en la otra lista (mover entre listas)
                else if (listType === 'todo' && this.secondList.includes(this.draggedItem)) {
                    if(this.firstList.length === 1 && this.firstList[0].legajo === 0) this.firstList = []
                    const [item] = this.secondList.splice(draggedIndex, 1);
                    this.firstList.splice(index, 0, item);
                    if(this.secondList.length === 0 ) this.secondList.push(defaultPersonal())

                } else if (listType === 'done' && this.firstList.includes(this.draggedItem)) {
                    if(this.secondList.length === 1 && this.secondList[0].legajo === 0) this.secondList = []
                    const [item] = this.firstList.splice(draggedIndex, 1);
                    this.secondList.splice(index, 0, item);
                    if(this.firstList.length === 0 ) this.firstList.push(defaultPersonal())
                }

                // Guardar las listas en localStorage después de cada cambio
                this.saveLists();
            }

            // Resetear dragIndex y draggedItem después de soltar
            this.dragIndex = null;
            this.draggedItem = null;
        },
        saveLists() {
            // Guardar ambas listas en localStorage
            localStorage.setItem(`firstDragAndDrop${this.dotacionesSeleccionadas}-${this.CEspecialidad}`, JSON.stringify(this.firstList));
            localStorage.setItem(`secondDragAndDrop${this.dotacionesSeleccionadas}-${this.CEspecialidad}`, JSON.stringify(this.secondList));
        },
        loadLists() {
            localStorage.setItem('dotacion', this.dotacionesSeleccionadas );
             // Cargar las listas desde localStorage
            const savedFirstList = localStorage.getItem(`firstDragAndDrop${this.dotacionesSeleccionadas}-${this.CEspecialidad}`);
            const savedSecondList = localStorage.getItem(`secondDragAndDrop${this.dotacionesSeleccionadas}-${this.CEspecialidad}`);
            
            if (savedFirstList && savedSecondList) {
                this.firstList = JSON.parse(savedFirstList);
                this.secondList = JSON.parse(savedSecondList);                
            } else {
                // Si no hay datos en localStorage, cargar datos iniciales
                this.filtrarPersonales();
            }
            
        },
        ordenarPorDisponibilidad(list: IPersonal[]) {
            const fechaStr: string = this.today.toISOString().split('T')[0];
            
            list.sort((a: IPersonal, b: IPersonal) => {
                const mesA = this.tarjetaPersonalSinDiagramaIndexado[a.legajo]?.days; // Acceso a un solo mes
                const mesB = this.tarjetaPersonalSinDiagramaIndexado[b.legajo]?.days;

                // Acceder a los días de ese mes
                const dispA = mesA?.days?.[fechaStr]?.disponibleHora ? new Date(mesA.days[fechaStr].disponibleHora) : null;
                const dispB = mesB?.days?.[fechaStr]?.disponibleHora ? new Date(mesB.days[fechaStr].disponibleHora) : null;

                // Si ambos son null, mantener el orden
                if (dispA === null && dispB === null) return 0;

                // Si `dispA` es null, queremos que A aparezca antes en la lista
                if (dispA === null) return -1;

                // Si `dispB` es null, queremos que B aparezca antes en la lista
                if (dispB === null) return 1;

                // Comparar las horas si ambos son válidos
                return dispA.getTime() - dispB.getTime();
            });
        },
        toggleExpandirTarjetas(list: IPersonal[],lista:string) {
            let tarjetasExpandido: boolean = false;

            if(lista === 'Disponible'){
                tarjetasExpandido = !this.tarjetasDisponibleExpandido  
                this.tarjetasDisponibleExpandido = tarjetasExpandido 
            }
            else if(lista === 'HTT'){
                tarjetasExpandido = !this.tarjetasHTTExpandido  
                this.tarjetasHTTExpandido = tarjetasExpandido 
            }

            list.forEach((personal: IPersonal) => {
                personal.viewDetail = tarjetasExpandido; // Expande o contrae las tarjetas
            });
        },
        edit(personal: IPersonal) { 
            if (!this.personalSinDiagramaIndexado[personal.legajo]){
                //TODO crear Alerta 
                this.message.activo = true;
                this.message.title = 'No existen datos del ciclo!';
                this.message.message = 'Para cargar la tarjeta primero debe editar el personal y cargar los datos correspondientes al ciclo';
                this.message.status = 'orange';
                this.message.id = personal._id;
                return
            }
            const idPersonalSinDiagrama = this.personalSinDiagramaIndexado[personal.legajo]._id;
            
            this.$router.push({ name: 'TarjetaPersonalSinDiagrama', params: { idPersonal: personal._id ,idPersonalSinDiagrama:idPersonalSinDiagrama}});
        },
        filtrarCiclo(personales:IPersonal[]){
            return personales.filter((personal:IPersonal)=> personal.turno.toLowerCase().includes("ciclo"))
        },
        indexarPersonal(personales: IPersonal[]): Record<number, IPersonal> {
            return personales.reduce(
                (acumulador: Record<number, IPersonal>, personal: IPersonal) => {
                    acumulador[personal.legajo] = personal;
                    return acumulador;
                },
                {} as Record<number, IPersonal>
            );
        },
        indexarPersonalSinDiagrama(personales: IPersonalSinDiagrama[]): Record<number, IPersonalSinDiagrama> {
            return personales.reduce(
                (acumulador: Record<number, IPersonalSinDiagrama>, personal: IPersonalSinDiagrama) => {
                    acumulador[personal.legajo] = personal;
                    return acumulador;
                },
                {} as Record<number, IPersonalSinDiagrama>
            );
        },
        indexarTarjetasPersonalesSinDiagrama(personales: ITarjetaPersonalSinDiagrama[]): Record<number, ITarjetaPersonalSinDiagrama> {
            return personales.reduce(
                (acumulador: Record<number, ITarjetaPersonalSinDiagrama>, personal: ITarjetaPersonalSinDiagrama) => {
                    acumulador[personal.legajo] = personal;
                    return acumulador;
                },
                {} as Record<number, ITarjetaPersonalSinDiagrama>
            );
        },
        formatFecha(fecha: Date): string {
            const day = fecha.getDate().toString().padStart(2, '0');
            const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const year = fecha.getFullYear();
            return `${day}/${month}/${year}`;
        },
        formatearFecha(fechaString: string): string {
            if (fechaString) {
                const fecha: Date = new Date(fechaString);
                const opcionesDeFormato: Intl.DateTimeFormatOptions = {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                };
                const formatoFecha = new Intl.DateTimeFormat(
                    "es-AR",
                    opcionesDeFormato
                );
                return formatoFecha.format(fecha);
            } else {
                return "";
            }
        },
        handleRequestError(error: AxiosError) {
            console.error("Error en la solicitud:", error);

            if (error.response && error.response.status === 401) {
                // Manejar la lógica de redirección a la página de inicio de sesión
                localStorage.removeItem("username");
                localStorage.removeItem("roles");
                localStorage.removeItem("token");
                this.$router.push("/login");
            } else {
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
        limpiarFiltro(){
            this.search = ''
            this.searchLegajo = null
            this.searchTurno = ''
            this.filtrarPersonales()
            this.cerrarModal()
        },
        abrirModal() {
            this.mostrarModalSearch = true;
            this.$nextTick(() => {
                if (this.$refs.inputSearch) {
                    (this.$refs.inputSearch as HTMLInputElement).focus();
                }
            });
        },
        cerrarModal() {
            this.mostrarModalSearch = false;
            this.message.activo = false;
        },
        handleEnterKey() {
            this.filtrarPersonales();
            this.cerrarModal();
        },
        viewDetail(personal: IPersonal) {
            personal.viewDetail ? personal.viewDetail = false :
                personal.viewDetail = true;
        },
        ordenarPorTurno(personalList: IPersonal[]): IPersonal[] {
            return personalList.sort((a, b) => {
                const cicloA = parseInt(a.turno.split(' ')[1]);
                const cicloB = parseInt(b.turno.split(' ')[1]);
                return cicloA - cicloB;
            })
        },
        filtrarPersonales() {
            this.firstList = [];
            this.secondList = [];
            let cDotacion:string[] = [this.dotacionesSeleccionadas];
            let cEspecialidad = [this.CEspecialidad];
            let auxPersonales: IPersonal[] =  this.personales;
            
            if (this.search !== "" || this.searchLegajo !== null || this.searchTurno !=="") {
                //si se busca por los input´s quiero que se incluyan todas las bases y especialidades 
                //de lo contrario las seleccionadas en los input´s 
                cDotacion = this.dotacionesPermitidas;                
                cEspecialidad = [
                    "Conductor electrico",
                    "Conductor diesel",
                    "Ayudante habilitado",
                    "Guardatren diesel",
                    "Ayudante conductor",
                    "Guardatren electrico",
                ];
                if (this.search !== "") {
                    auxPersonales = auxPersonales.filter((personal) => {
                            return (personal.apellido.toLowerCase() +" " + personal.nombres.toLowerCase().trim()
                            ).includes(this.search.toLowerCase().trim());
                        }
                    );
                }
                //Filtro por turno
                if (this.searchTurno !=="") {
                    auxPersonales = auxPersonales.filter((personal) => {
                            return personal.turno.includes(this.searchTurno.toLowerCase().trim());
                        }
                    );
                }
                //Filtro por legajo
                if (this.searchLegajo !== null) {
                    auxPersonales = auxPersonales.filter((personal) => {
                            return personal.legajo === this.searchLegajo;
                        }
                    );
                }
                this.dotacionesSeleccionadas = "";
                this.CEspecialidad = "";
            } else{
                // filtro dotacion y especialidad
                auxPersonales = auxPersonales.filter((personal:IPersonal) =>{
                    return cDotacion.includes(personal.dotacion) && 
                        cEspecialidad.includes(personal.especialidad)
                })
            }

            //Ordeno la lista
            this.firstList = this.ordenarPorTurno(auxPersonales)
            this.secondList.push(defaultPersonal())
        },
        getColorClass(especialidad:string) {
            if (especialidad.includes("Ayudante")) {
                return "ayudante-clase";
            } else if (especialidad.includes("Guardatren")) {
                return "guarda-clase";
            }
            return ""; // No aplicar ninguna clase si no coincide
        },
    },
    created() {
        try {
            // this.loadPersonalesFiltrados();
            this.dotacionesSeleccionadas = localStorage.getItem('dotacion')||'PC';
            this.loadPersonales();
            this.loadPersonalSinDiagrama()
            this.loadTarjetaPersonalSinDiagrama()            
            this.tomorrowStr = diaPosterior(this.today.toISOString().split('T')[0])
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
.guarda-clase{
    background-color: #c957bf67;
}
.ayudante-clase{
    background-color: #e0de5873;
}
.custom-orange{
    background-color: #fd7d1485;
}
.index-column {
    width: 50px !important;
}
.orange{
    background-color: #e0c49f;
}
</style>
