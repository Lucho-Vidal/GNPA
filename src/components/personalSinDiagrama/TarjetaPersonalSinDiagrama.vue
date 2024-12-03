<template>
    <main>
        <div class="container">
            <div class="justify-content-center alert row"
                :class="[
                    message.status == 'danger'
                        ? 'alert-danger'
                        : message.status == 'success'
                        ? 'alert-success'
                        : message.status == 'warning'
                        ? 'alert-warning'
                        : '',
                ]" role="alert" v-if="message.activo">
                <h4 class="alert-heading">ATENCIÓN! {{ message.title }}</h4>
                <hr />
                {{ message.message }}
            </div>
        </div>
        <!-- Modal de búsqueda -->
        <div>
            <div class="modal" :class="{ 'd-block': mostrarModalSearch }"  @click.self="cerrarModal" @keyup.esc="cerrarModal">
                <div class="modal-dialog modal-ancho-personalizado">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Asignar Relevo</h5>
                            <button
                                type="button"
                                class="close btn btn-danger"
                                @click="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                            <div class="table-container">
                                <table
                                    v-if="novedadesFiltradas.length > 0"
                                    class="table table-striped table-hover"
                                >
                                    <thead>
                                        <tr>
                                            <th class="col-1" colspan="1">Consecutivo</th>
                                            <th class="col-1" colspan="1">Fecha</th>
                                            <th class="col-1" colspan="1">Legajo</th>
                                            <th class="col-1" colspan="1">Apellido</th>
                                            <th class="col-1" colspan="1">Nombres</th>
                                            <th class="col-1" colspan="1">Base</th>
                                            <th class="col-1" colspan="1">Turno</th>
                                            <th class="col-1" colspan="1">Franco</th>
                                            <th class="col-1" colspan="1">Novedad</th>
                                            <th class="col-1" colspan="1">Fecha de Baja</th>
                                            <th class="col-1" colspan="1">Fecha de Alta</th>
                                            <th class="col-1">Ver</th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        v-for="(novedad, index) in novedadesFiltradas"
                                        :key="index"
                                        @dblclick="
                                            novedad.novedadInactiva ? null : goToNovedad(novedad._id)
                                        "
                                        @click="viewDetail(novedad)"
                                    >
                                        <tr
                                            v-if="!novedad.novedadInactiva"
                                            class="Small shadow"
                                            :class="{
                                                'fila-oscura': novedad.novedadInactiva,
                                            }"
                                        >
                                            <td class="col-1">{{ novedad._id }}</td>
                                            <td class="col-1">
                                                {{
                                                    novedad.fecha
                                                        ? new Date(
                                                            novedad.fecha + " 12:00"
                                                        ).toLocaleDateString()
                                                        : new Date(
                                                            novedad.fechaBaja + " 12:00"
                                                        ).toLocaleDateString()
                                                }}
                                            </td>
                                            <td class="col-1">{{ novedad.legajo }}</td>
                                            <td class="col-1">{{ novedad.apellido }}</td>
                                            <td class="col-2">{{ novedad.nombres }}</td>
                                            <td class="col-1">{{ novedad.base }}</td>
                                            <td class="col-1">{{ novedad.turno }}</td>
                                            <td class="col-1">{{ novedad.franco }}</td>
                                            <td class="col-1">{{ novedad.tipoNovedad }}</td>
                                            <td class="col-1">
                                                {{
                                                    new Date(
                                                        novedad.fechaBaja + " 12:00"
                                                    ).toLocaleDateString()
                                                }}
                                            </td>
                                            <td class="col-1">
                                                {{
                                                    !novedad.HNA
                                                        ? new Date(
                                                            novedad.fechaAlta + " 12:00"
                                                        ).toLocaleDateString()
                                                        : ""
                                                }}
                                            </td>
                                            <td class="col-1">
                                                <i
                                                    v-if="!novedad.novedadInactiva"
                                                    class="material-icons cursor-hand"
                                                    @click="goToNovedad(novedad._id)"
                                                >
                                                    edit_note
                                                </i>
                                            </td>
                                        </tr>
                                        <tr v-if="novedad.viewDetail">
                                            <td colspan="12">
                                                <div class="row" v-if="novedad.remplazo[0]">
                                                    <h6 class="col-1">Releva:</h6>
                                                    <p class="col-3">{{novedad.remplazo[novedad.remplazo.length - 1].apellido +" " +novedad.remplazo[novedad.remplazo.length - 1].nombres}}</p>
                                                    <h6 class="col-1">Desde:</h6>
                                                    <p class="col-1">{{ (novedad.remplazo[novedad.remplazo.length - 1].inicioRelevo)}}</p>
                                                    <h6 class="col-1">Hasta:</h6>
                                                    <p class="col-1">{{ (novedad.remplazo[novedad.remplazo.length - 1].finRelevo)}}</p>
                                                </div>
                                                <div v-else>
                                                    <h6>Sin Relevo</h6>
                                                </div>
                                                <div v-if="novedad.detalle">
                                                    <h6>Detalle:</h6>
                                                    <p>{{ novedad.detalle }}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-start m-3">Linea Roca</h2>
            <h2 class="d-flex justify-content-end m-3">Registro de servicios personal sin diagrama C.C.P.T.</h2>
        </div>
        <div class="container-fluid mt-5">
            <table class="table table-bordered cabecera" style="position: sticky; top: 0; background-color: white; z-index: 1000;">
                <thead>
                    <tr>
                        <th class="col-1">Legajo</th>
                        <th class="col-2">Apellido</th>
                        <th class="col-2">Nombres</th>
                        <th class="col-2">Especialidad</th>
                        <th class="col-2">Descanso</th>
                        <th class="col-1">Dotación</th>
                        <th class="col-2">Periodo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td>{{ personal.legajo }}</td>
                        <td>{{ personal.apellido }}</td>
                        <td>{{ personal.nombres }}</td>
                        <td>{{ personal.especialidad }}</td>
                        <td>{{`${diaSemanaStr(tarjetaPersonalSinDiagrama.francoInicio)} ${tarjetaPersonalSinDiagrama.HoraInicio}`}}</td>
                        <td>{{ personal.dotacion }}</td>
                        <td class="celdaFecha">
                            <input
                                type="month"
                                id="monthInput"
                                class="form-control m-0"
                                v-model="selectedMonth"
                                @change="seleccionPeriodo"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="barraBotones">
            <button class="btn btn-primary mx-3" @click="abrirModal()">Asignar Relevo</button>
            <button class="btn btn-warning mx-3" @click="goToNovedad()">Alta Novedad</button>
            <button class="btn btn-success mx-3" @click="guardarTarjeta()" >Guardar Cambios</button>
            <button class="btn btn-danger mx-3" @click="salir">Cerrar</button>
        </div>
        <div class="container-fluid">
            <table class="table table-bordered">
                <thead class="">
                    <tr class="">
                        <th class="col-1 cabecera" rowspan="2">Día</th>
                        <th class="col-1" rowspan="2">Diagrama</th>
                        <!-- <th scope="col" colspan="2">Desplazamiento</th> -->
                        <th class="col-1" rowspan="2">Disponible a la Hora</th>
                        <th class="col-2" colspan="2">Servicio</th>
                        <th class="col-1" rowspan="2">Total horas trabajadas</th>
                        <!-- <th class="" rowspan="2">Jornada</th> -->
                        <th class="col-6" rowspan="2">Observaciones</th>
                    </tr>
                    <tr>
                        <!-- <th scope="col">Desde</th>
                        <th scope="col">Hasta</th> -->
                        <th scope="col-12">Tomó</th>
                        <th scope="col-12">Dejó</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(day, index) in fechasDelMes" :key="index" :class="{ 'text-red': getJornadaForDay( day).deBaja }">
                        <td class="dia">{{   getDiaSemanaYMes(day,index) }}</td>
                        <!-- Columna Diagrama -->
                        <td class="celdaInput " @click="toggleEdit('tren', index)">
                            <select 
                                v-if="getJornadaForDay(day).editable && editField === 'tren' && editIndex === index"
                                name="diagrama" 
                                id="diagrama"
                                v-model="editValue"
                                @change="saveEdit('tren', index)"
                                class="form-control"
                            >
                                <option  value=""> </option>
                                <option  value="DH anticipado">DH anticipado</option>
                                <option  value="Orden">Orden</option>
                            </select>
                            <span class="celdaInputAncho" v-else>
                                {{ getJornadaForDay( day).tren || '-' }}
                            </span>
                        </td>

                        <!-- Columna Disponible a la Hora -->
                        <td class="celdaInput " @click="toggleEdit('disponibleHora', index)">
                            <input v-if="getJornadaForDay( day).editable && editField === 'disponibleHora' && editIndex === index" 
                                    type="time" 
                                    v-model="editValue" 
                                    :ref="'inputField-' + index"
                                    @change="saveEdit('disponibleHora', index)">
                            <span class="celdaInputAncho" v-else>
                                {{ getJornadaForDay( day).disponibleHora || '' }}
                            </span>
                        </td>

                        <!-- Columna Tomó -->
                        <td class="celdaInput " @click="toggleEdit('tomo', index)">
                            <input v-if="getJornadaForDay( day).editable && editField === 'tomo' && editIndex === index" 
                                    type="time" 
                                    v-model="editValue" 
                                    :ref="'inputField-' + index" 
                                    @change="saveEdit('tomo', index)">
                            <span class="celdaInputAncho" v-else>
                                {{ getJornadaForDay( day).tomo || '' }}
                            </span>
                        </td>

                        <!-- Columna Dejó -->
                        <td class="celdaInput " @click="toggleEdit('dejo', index)">
                            <input v-if="getJornadaForDay( day).editable && editField === 'dejo' && editIndex === index" 
                                    type="time" 
                                    v-model="editValue" 
                                    :ref="'inputField-' + index"
                                    @change="saveEdit('dejo', index)">
                            <span class="celdaInputAncho" v-else>
                                {{ getJornadaForDay( day).dejo || '' }}
                            </span>
                        </td>
                        <!-- Columna Total horas trabajadas -->
                        <td class="celdaInput" @click="toggleEdit('totalHoras', index)">
                            <input v-if="getJornadaForDay( day).editable && editField === 'totalHoras' && editIndex === index" 
                                    type="time" 
                                    v-model="editValue" 
                                    :ref="'inputField-' + index"
                                    @change="saveEdit('totalHoras', index)">
                            <span class="celdaInputAncho" v-else>
                                {{ getJornadaForDay( day).totalHoras || '' }}
                            </span>
                        </td>

                        <!-- Observaciones -->
                        <td class="celdaInput layout" @click="toggleEdit('observaciones', index)">
                            
                            <input v-if=" editField === 'observaciones' && editIndex === index" 
                                    type="text" v-model="editValue" 
                                    :ref="'inputField-' + index" 
                                    @change="saveEdit('observaciones', index)">
                            <span class="celdaInputAncho" v-else >
                                {{ getJornadaForDay( day).dia_laboral === 0 ? "-" : getJornadaForDay( day).dia_laboral?.toString() || '' }}
                                {{ getJornadaForDay( day).observaciones || '-' }}
                            </span>
                            <button class="btn btn-primary" v-if="getJornadaForDay(day).nroNovedad" 
                                @click="goToNovedad(getJornadaForDay( day).nroNovedad)">
                                Ir a la novedad <strong> {{ getJornadaForDay( day).nroNovedad }} </strong>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script lang="ts">
import { newToken } from "../../services/signService";
import { defineComponent } from "vue";

import {  loadNovedades, loadPersonal, loadPersonalSinDiagrama, loadTarjetaPersonalSinDiagramaPorLegajoYMes, loadTurnos } from "../../utils/funciones";
import { defaultJornada, defaultNovedad, defaultPersonal, defaultPersonalSinDiagrama, defaultTurnos, defaultTarjetaPersonalSinDiagrama} from '../../utils/interfacesDefault';
import { itinerarioType, diaAnterior, diaPosterior, diferenciaHoras, dosDiasAnterior, esFechaMayorIgual,  obtenerNumeroDia,  sumarHoras, } from '../../utils/fechas'
import { dia_laboral } from "../../utils/personal";
import { filtrarPorTurno } from "../../utils/turnos";

import { IPersonal } from '../../interfaces/IPersonal';
import { IPersonalSinDiagrama } from '../../interfaces/IPersonalSinDiagrama';
import { Novedad, Remplazo } from "../../interfaces/INovedades";
import { ITurno } from "../../interfaces/ITurno";
import { ITarjetaPersonalSinDiagrama, Jornada } from "../../interfaces/ITarjetaPersonalSinDiagrama";
import { createTarjetaPersonalSinDiagrama, updateTarjetaPersonalSinDiagrama } from "../../services/tarjetaPersonalSinDiagramaService";
import { calcularTotalHoras } from "../../utils/fechas";
import { filtrarNovedadesPorLegajo, filtrarRelevosPorLegajo } from "../../utils/novedades";
export default defineComponent({
    props: ['idPersonal', 'idPersonalSinDiagrama'],
    data() {
        return {
            personal: {} as IPersonal,
            personalSinDiagrama: {} as IPersonalSinDiagrama,
            tarjetaPersonalSinDiagrama: {} as ITarjetaPersonalSinDiagrama,

            lstNovedades: [] as Novedad[],
            lstTurnos: [] as ITurno[],
            novedadesFiltradas: [] as Novedad[],

            novedades: [] as Novedad[],
            relevos: [] as Novedad[],

            today: new Date(),

            selectedMonth: "",
            fechasDelMes: [] as string[],

            editField: null as string | null, // Campo en edición
            editIndex: null as number | null, // Índice de la fila en edición
            editValue: '' as string,          // Valor que se está editando
            cambioSinGuardar:false,
            mostrarModalSearch:false,

            message: {
                activo: false,
                status: "",
                title: "",
                message: "",
            },
        };
    },
    methods: {
        async guardarTarjeta(){
            try {
                if (this.tarjetaPersonalSinDiagrama.mes === '') {
                    this.tarjetaPersonalSinDiagrama.mes = this.selectedMonth; 
                }
                if(this.tarjetaPersonalSinDiagrama._id) {
                    await updateTarjetaPersonalSinDiagrama(this.tarjetaPersonalSinDiagrama._id,this.tarjetaPersonalSinDiagrama)
                    this.message.message = 'Se ha actualizado la tarjeta satisfactoriamente!'
                }else{
                    await createTarjetaPersonalSinDiagrama(this.tarjetaPersonalSinDiagrama)
                    this.message.message = 'Se ha creado la tarjeta satisfactoriamente!'
                }

                this.message.activo = true
                this.message.status = 'success'
                this.message.title = 'Tarjeta guardada con éxito'
                setTimeout(()=>{
                    this.message.activo = false
                },5000)
                this.cambioSinGuardar = false
            } catch (error) {
                console.error('Error al guardar la tarjeta:', error);
                this.message.activo = true
                this.message.status = 'danger'
                this.message.title = 'Ocurrió un error al guardar'
                this.message.message = 'Se produjo un error al intentar guardar, re intente nuevamente más tarde o comuníquese con el administrador'
                setTimeout(()=>{
                    this.message.activo = false
                },5000)
            }
        },
        async seleccionPeriodo(){
            if(this.cambioSinGuardar){
                const salir: boolean = confirm("Hay cambios sin guardar, ¿desea salir sin guardar?")
                if(!salir){
                    return
                }
            }
            //Borro todas la fechas que estén
            this.tarjetaPersonalSinDiagrama = defaultTarjetaPersonalSinDiagrama();

            //Busco si esta la tarjeta sino la creo vacía
            this.tarjetaPersonalSinDiagrama = await loadTarjetaPersonalSinDiagramaPorLegajoYMes(this.personal.legajo,this.selectedMonth) || defaultTarjetaPersonalSinDiagrama();
            
            // Arma la tabla
            this.daysInMonth();
            this.tarjetaPersonalSinDiagrama['mes'] = this.selectedMonth

            //si no existe id es porque sea acaba de crear la tarjeta
            if(!this.tarjetaPersonalSinDiagrama._id){
                this.tarjetaPersonalSinDiagrama.Ciclo = this.personalSinDiagrama.Ciclo;
                this.tarjetaPersonalSinDiagrama.legajo = this.personalSinDiagrama.legajo;
                this.tarjetaPersonalSinDiagrama.francoInicio = this.personalSinDiagrama.francoInicio;
                this.tarjetaPersonalSinDiagrama.francoHasta = this.personalSinDiagrama.francoHasta;
                this.tarjetaPersonalSinDiagrama.HoraInicio = this.personalSinDiagrama.HoraInicio;
                this.tarjetaPersonalSinDiagrama.HoraHasta = this.personalSinDiagrama.HoraHasta;
                                
                this.buscarNovedadesActivas();

                //alertamos la creación de la nueva tarjeta
                this.message.activo = true
                this.message.status = 'warning'
                this.message.title = 'Se creo una nueva tarjeta'
                this.message.message = 'No se encontró una tarjeta guardada con los requerimientos solicitados y se procedió a crear una nueva '
                setTimeout(()=>{
                    this.message.activo = false
                },5000)
            }else{
                //tengo que verificar que las novedades estén actualizadas
                this.fechasDelMes.forEach((fechaStr:string)=>{
                    const fecha = new Date(fechaStr + "T12:00");
                    const campoTren = this.tarjetaPersonalSinDiagrama.days[fechaStr].tren;
                    if(campoTren !== '' && campoTren !== 'Orden' && campoTren !== 'DH anticipado'){
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].tren = '';
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].disponibleHora = '';
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].tomo = '';
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].dejo = '';
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].totalHoras = '';
                        // this.tarjetaPersonalSinDiagrama.days[fechaStr].observaciones = '';
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].editable = true;
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].deBaja = true;
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].relevando = true;
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].estilo = false;
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].nroNovedad = null;
                    }
                    //3 Calculamos jornada y relevos
                    this.procesarRelevo(this.relevos, fechaStr, fecha);
                    
                    //4 Calculamos disponibilidad
                    this.calcularDisponibilidad(fechaStr);

                    //5 Verificamos si estuvo de baja por enfermedad
                    this.procesarBajaPorEnfermedad(this.novedades, fechaStr);
                });
            }
        },
        abrirModal() {
            this.mostrarModalSearch = true;
            this.filtrarNovedades();
        },
        cerrarModal() {
            this.mostrarModalSearch = false;
        },
        viewDetail(novedad: Novedad) {
            novedad.viewDetail = !novedad.viewDetail;
        },
        salir(){
            if(this.cambioSinGuardar){
                const salir: boolean = confirm("Hay cambios sin guardar, ¿desea salir sin guardar?")
                if(!salir){
                    return
                }
            }
            this.$router.push('/personalSinDiagrama')
        },
        filtrarNovedades() {
            this.novedadesFiltradas = this.lstNovedades.filter((novedad: Novedad) => {
                    return (
                        this.personal.dotacion === novedad.base &&
                        this.personal.especialidad === novedad.especialidad &&
                        this.personal.legajo !== novedad.legajo &&
                        !novedad.novedadInactiva &&
                        !novedad.turno.toLowerCase().includes('ciclo') &&
                        (novedad.fechaAlta ? esFechaMayorIgual(novedad.fechaAlta, this.fechasDelMes[0]):true)
                    );
                }
            );
        },
        daysInMonth() {
            const days = [];
            const date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1 // 0-indexed
            if(this.selectedMonth === ''){
                year = date.getFullYear()
                month = date.getMonth() + 1 // 0-indexed
            }else{
                year = parseInt(this.selectedMonth.split("-")[0])
                month = parseInt(this.selectedMonth.split("-")[1])
            }
            
            const diasDelMes = new Date(year, month, 0).getDate();
            
            for (let i = 1; i <= diasDelMes; i++) {
                days.push(new Date(year, month - 1, i).toISOString().split('T')[0]);
            }
            
            this.fechasDelMes = days
        },
        getDiaSemanaYMes(day:string,index:number):string{
            const fecha = new Date(day+'T12:00');
            return `${this.diaSemanaStr(fecha.getDay())} - ${index + 1}` 
        },
        getColorClass(especialidad:string) {
            if (especialidad.includes("Ayudante")) {
                return "ayudante-clase";
            } else if (especialidad.includes("Guardatren")) {
                return "guarda-clase";
            }
            return ""; // No aplicar ninguna clase si no coincide
        },
        getJornadaForDay( day: string): Jornada {
            // Verifica si 'tarjetaPersonalSinDiagrama' y 'meses' están definidos
            if (!this.tarjetaPersonalSinDiagrama || !this.tarjetaPersonalSinDiagrama.days) {
                return defaultJornada(); // Devuelve un objeto vacío si no están definidos
            }

            // Obtén el mes correspondiente al periodo
            const days = this.tarjetaPersonalSinDiagrama.days;

            // Verifica si el mes y el día existen
            if ( !days || !days[day]) {
                return defaultJornada(); // Devuelve un objeto vacío si no existen
            }

            // Retorna la jornada correspondiente al día
            return days[day];
        },
        goToNovedad(nroNovedad?:number|null) {
            localStorage.setItem('fromRoute', this.$route.fullPath); // Guardar la ruta actual en localStorage
            nroNovedad ? this.$router.push(`/editNovedades/${nroNovedad}`) : this.$router.push(`/editNovedades/${nroNovedad}/${this.personal.legajo}`)
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
        toggleEdit(field: string, index: number) {
            const jornada = this.getJornadaForDay(this.fechasDelMes[index]);
            if (jornada) {
                this.editField = field;
                this.editIndex = index;

                // Verifica si el campo existe en la jornada antes de acceder a él
                if (field in jornada) {
                    this.editValue = jornada[field] || '-';
                } else {
                    this.editValue = '-'; // Valor por defecto si no existe el campo
                }

                if (!jornada.editable && field !== 'observaciones') {
                    alert("Editar desde la novedad asignada en este día");
                }

                this.$nextTick(() => {
                    const inputElement = this.$refs['inputField-' + index] as HTMLInputElement | null;
                    if (inputElement && typeof inputElement.focus === 'function') {
                        inputElement.focus();
                        inputElement.select();
                    }
                });
            }
        },
        saveEdit(field: string, index: number) {
            // Guardar el valor editado en el campo correspondiente            
            // const jornadaAnt = this.getJornadaForDay( diaAnterior(this.fechasDelMes[index]));
            const jornada = this.getJornadaForDay( this.fechasDelMes[index]);
            const jornadaPos = this.getJornadaForDay( diaPosterior(this.fechasDelMes[index]));
            const especialidad = this.personal.especialidad.toLowerCase();
            this.cambioSinGuardar = true;
            
            if (jornada) {
                jornada[field] = this.editValue ;  // Actualiza directamente la propiedad
            }
            //Diagrama
            if(field === 'tren' && this.editValue === 'Orden' && jornada['disponibleHora'] !== ''){
                jornada['tomo'] = jornada['tomo'] || jornada['disponibleHora']
                jornada['dejo'] = jornada['dejo'] || sumarHoras(jornada['tomo'], especialidad.includes('guardatren diesel') ? 7 : 6)
                jornadaPos['disponibleHora'] = jornadaPos['tomo'] !== 'DH' ? sumarHoras(jornada['dejo'],especialidad.includes('guardatren diesel') ? 17 : 18):'';
            }
            if(field === 'tren' && this.editValue === 'DH anticipado'){
                jornada['tomo'] = 'DH'
                jornada['dejo'] = 'DH'
                jornadaPos['disponibleHora'] = ''
            }
            if(field === 'tren' && this.editValue === ''){
                jornada['tomo'] = ''
                jornada['dejo'] = ''
                jornada['totalHoras'] = ''
            }
            //Tomo
            if(field === 'tomo' ){
                jornada['dejo'] = sumarHoras(jornada['tomo'], especialidad.includes('guardatren diesel') ? 7 : 6)
                jornada['totalHoras'] = diferenciaHoras(jornada['tomo'],jornada['dejo'])
                jornadaPos['disponibleHora'] = sumarHoras(jornada['dejo'],especialidad.includes('guardatren diesel') ? 41 : 42)
            }
            //Dejo
            if(field === 'dejo' ){
                jornadaPos['disponibleHora'] = jornadaPos['tomo'] !== 'DH' ? sumarHoras(jornada['dejo'],especialidad.includes('guardatren diesel') ? 41 : 42):''
            }
            // if(field === 'disponibleHora' ){
            //     jornada['dejo'] = sumarHoras(jornada['tomo'], especialidad.includes('guardatren diesel') ? 7 : 6)
            //     jornada['totalHoras'] = diferenciaHoras(jornada['tomo'],jornada['dejo'])
            //     jornadaPos['disponibleHora'] = sumarHoras(jornadaAnt['dejo'],especialidad.includes('guardatren diesel') ? 41 : 42)
            // }
            this.tarjetaPersonalSinDiagrama.days = calcularTotalHoras(this.tarjetaPersonalSinDiagrama.days)

            this.editField = null;
            this.editIndex = null;
            this.editValue = '';
        },
        handleKeydown(event: KeyboardEvent, field: string, index: number) {
            
            if (event.key === 'Enter') {
                this.saveEdit(field, index);
                event.preventDefault();  // Evitar el comportamiento por defecto del enter
            }
        },

        //Desde aca están las funciones que crean la tarjeta por primera vez
        // Busca las novedades activas relacionadas con el legajo de la persona y calcula disponibilidad, jornadas y relevos.
        buscarNovedadesActivas() {
            
            
            this.fechasDelMes.forEach((dia: string) => {
                //1
                this.inicializarDiaSiNoExiste(dia);

                //2
                const fecha = new Date(dia + "T12:00");
                this.calcularFranco(dia, fecha);

                //3 Calculamos jornada y relevos
                this.procesarRelevo(this.relevos, dia, fecha);
                
                //4 Calculamos disponibilidad
                this.calcularDisponibilidad(dia);

                //5 Verificamos si estuvo de baja por enfermedad
                this.procesarBajaPorEnfermedad(this.novedades, dia);
            });
        },
        //1
        inicializarDiaSiNoExiste(dia: string) {
            if (!this.tarjetaPersonalSinDiagrama.days) {
                this.tarjetaPersonalSinDiagrama.days = {};
            }
            if (!this.tarjetaPersonalSinDiagrama.days[dia]) {
                this.tarjetaPersonalSinDiagrama.days[dia] = defaultJornada();
            }
        },
        //2
        calcularFranco(dia: string, fecha: Date) {
            const diaAnt = diaAnterior(dia + "T12:00");
            const diaFrancoMasUno = this.tarjetaPersonalSinDiagrama.francoInicio === 6 ? 0 : this.tarjetaPersonalSinDiagrama.francoInicio + 1
            if (fecha.getDay() === this.tarjetaPersonalSinDiagrama.francoInicio) {
                this.tarjetaPersonalSinDiagrama.days[dia].observaciones = `DH del ciclo // desde ${this.diaSemanaStr(this.tarjetaPersonalSinDiagrama.francoInicio)} ${this.tarjetaPersonalSinDiagrama.HoraInicio}`;
                this.tarjetaPersonalSinDiagrama.days[dia].dia_laboral = 6;
                this.tarjetaPersonalSinDiagrama.days[dia].dejo = this.tarjetaPersonalSinDiagrama.HoraInicio;
                if(this.tarjetaPersonalSinDiagrama.days[diaAnt].dia_laboral == null){
                    let [y,m,d] = dia.split("-")
                    let j = 5;
                    for(let i = parseInt(d) -1 ;i > 0; i-- ){
                        let fechaStr = `${y}-${m}-0${i}`                        
                        this.tarjetaPersonalSinDiagrama.days[fechaStr].dia_laboral = j;
                        if(j === 0){
                            this.tarjetaPersonalSinDiagrama.days[fechaStr].tomo = "DH";
                            this.tarjetaPersonalSinDiagrama.days[fechaStr].dejo = "DH";
                        }
                        j--
                    }
                }
            } else if (fecha.getDay() === diaFrancoMasUno) {
                this.tarjetaPersonalSinDiagrama.days[dia].disponibleHora = this.tarjetaPersonalSinDiagrama.HoraHasta;
                this.tarjetaPersonalSinDiagrama.days[dia].tomo = 'DH';
                this.tarjetaPersonalSinDiagrama.days[dia].dejo = 'DH';
                this.tarjetaPersonalSinDiagrama.days[dia].dia_laboral = 0;
                this.tarjetaPersonalSinDiagrama.days[dia].observaciones = `DH del ciclo // hasta ${this.diaSemanaStr(this.tarjetaPersonalSinDiagrama.francoHasta)} ${this.tarjetaPersonalSinDiagrama.HoraHasta}`;
            } else {
                this.calcularJornadaPosFranco(this.tarjetaPersonalSinDiagrama.days?.[diaAnt]?.dia_laboral, dia);
            }
            this.tarjetaPersonalSinDiagrama.days[dia].deBaja = false;
            this.tarjetaPersonalSinDiagrama.days[dia].relevando = false;
        },
        // Calcula el número de días laborales consecutivos después de un franco.
        calcularJornadaPosFranco (diaAnteriorLaboral:number|null,dia:string)  {
            if (typeof diaAnteriorLaboral === 'number') {
                if (this.tarjetaPersonalSinDiagrama.days?.[dia]) {
                    this.tarjetaPersonalSinDiagrama.days[dia].dia_laboral = diaAnteriorLaboral + 1;
                }
            }
        },
        //3
        procesarRelevo(relevos: Novedad[], dia: string, fecha: Date) {
            relevos.forEach((novedad: Novedad) => {
                novedad.remplazo.forEach((remplazo: Remplazo) => {
                    if (remplazo.legajo === this.personal.legajo && esFechaMayorIgual(dia, remplazo.inicioRelevo) && 
                        (remplazo.finRelevo === '' || esFechaMayorIgual(remplazo.finRelevo, dia))) {
                        this.registrarRelevo(dia, novedad,  fecha);
                    }
                });
            });
        },
        // Registra un relevo para un día específico, actualizando la tarjeta de la persona con los detalles del turno.
        registrarRelevo(dia: string, novedad: Novedad, fecha: Date) {
            this.tarjetaPersonalSinDiagrama.days[dia].tren = novedad.turno;
            this.tarjetaPersonalSinDiagrama.days[dia].franco = novedad.franco;
            this.tarjetaPersonalSinDiagrama.days[dia].observaciones = `Relevando en la novedad N°${novedad._id} vice ${novedad.apellido} ${novedad.nombres} de baja por ${novedad.tipoNovedad}`;
            this.tarjetaPersonalSinDiagrama.days[dia].nroNovedad = novedad._id;
            this.tarjetaPersonalSinDiagrama.days[dia].deBaja = false;
            this.tarjetaPersonalSinDiagrama.days[dia].relevando = true;

            const francoNroSemana = obtenerNumeroDia(novedad.franco);
            const jornada = dia_laboral(francoNroSemana, fecha.getDay());

            if (francoNroSemana === fecha.getDay()) {
                this.tarjetaPersonalSinDiagrama.days[dia].tomo = 'DH';
                this.tarjetaPersonalSinDiagrama.days[dia].dejo = 'DH';
            } else {
                const { tomo, dejo } = this.buscarJornadasDelTurno(dia, novedad.turno, jornada);

                this.tarjetaPersonalSinDiagrama.days[dia].tomo = tomo;
                this.tarjetaPersonalSinDiagrama.days[dia].dejo = dejo;
                this.tarjetaPersonalSinDiagrama.days[dia].totalHoras = diferenciaHoras(tomo, dejo);
            }
        },
        buscarJornadasDelTurno(fecha:string, nombreTurno:string,jornada:number){
            const date = new Date(fecha+"T12:00")
            const itinerario: string = itinerarioType(date);
            const turnosEncontrados = filtrarPorTurno(
                itinerario,
                this.lstTurnos,
                ["Jul24"],// provisorio
                nombreTurno
            );
            console.warn("TODO: itinerario provisorio");
            
            let turno:ITurno = defaultTurnos();
            if (turnosEncontrados.length > 1) 
                turno = turnosEncontrados.find((turno:ITurno) => turno.turno === `${nombreTurno}.${jornada}`) || defaultTurnos();
            else [turno] = turnosEncontrados
                        
            return turno ?  {tomo:turno.toma,dejo:turno.deja} :  {tomo: '',dejo: ''}
        },
        //4
        // Calcula la disponibilidad de una persona para un día específico.
        calcularDisponibilidad(dia: string) {
            const mes = this.tarjetaPersonalSinDiagrama.days;
            const especialidad = this.personal.especialidad.toLowerCase();
            this.tarjetaPersonalSinDiagrama.days[dia].disponibleHora = this.calcularDisponibilidadDiaAnterior(dia, mes, especialidad);
            // if(esHoraMayor(this.tarjetaPersonalSinDiagrama.days[dia].disponibleHora,this.tarjetaPersonalSinDiagrama.days[dia].dejo)){
            //     this.tarjetaPersonalSinDiagrama.days[dia].estilo = true
            // }
        },
        calcularDisponibilidadDiaAnterior(dia: string, mes: any, especialidad: string) {
            const diaAnt = mes[diaAnterior(dia + 'T12:00')];
            const dosDiasAnt = mes[dosDiasAnterior(dia + 'T12:00')];
            if (!diaAnt) return '';

            let horasASumar = especialidad.includes('guardatren diesel') ? 17 : 18;

            if (diaAnt.tomo === 'DH' && dosDiasAnt && dosDiasAnt.dejo !== '') {
                horasASumar = especialidad.includes('guardatren diesel') ? 41 : 42;
                return sumarHoras(dosDiasAnt.dejo, horasASumar);
            // } else if (diaAnt.dejo !== 'DH' && diaAnt.dejo !== '' ) { // comente esta linea porque me calcula la disponibilidad el dia del DH
                // return sumarHoras(diaAnt.dejo, horasASumar);
            } else {
                return '';
            }
        },

        // 5 puse por enfermedad pero en realidad contempla cualquier novedad
        procesarBajaPorEnfermedad(novedades: Novedad[], dia: string) {
            novedades.forEach((novedad: Novedad) => {
                if (esFechaMayorIgual(dia, novedad.fechaBaja) && 
                    (novedad.fechaAlta === undefined || esFechaMayorIgual(novedad.fechaAlta, dia))) {
                    this.registrarBajaPorEnfermedad(dia, novedad);
                }
            });
        },
        registrarBajaPorEnfermedad(dia: string, novedad: Novedad) {
            this.tarjetaPersonalSinDiagrama.days[dia].tren = novedad.tipoNovedad;
            this.tarjetaPersonalSinDiagrama.days[dia].disponibleHora = '-';
            this.tarjetaPersonalSinDiagrama.days[dia].tomo = '';
            this.tarjetaPersonalSinDiagrama.days[dia].dejo = '';
            this.tarjetaPersonalSinDiagrama.days[dia].totalHoras = '-';
            this.tarjetaPersonalSinDiagrama.days[dia].observaciones = `De baja por la novedad N°${novedad._id}`;
            this.tarjetaPersonalSinDiagrama.days[dia].nroNovedad = novedad._id;
            this.tarjetaPersonalSinDiagrama.days[dia].deBaja = true;
            this.tarjetaPersonalSinDiagrama.days[dia].relevando = false;
            this.tarjetaPersonalSinDiagrama.days[dia].editable = false;
        },
    },
    async mounted() {
        const [year, month] = this.today.toISOString().split("-")
        this.selectedMonth = `${year}-${month}`;
        
        if (this.$route.params && this.$route.params.idPersonal != "") {
            const idPersonal = Array.isArray(this.$route.params.idPersonal)
                ? this.$route.params.idPersonal[0]
                : this.$route.params.idPersonal;

            const idPersonalSinDiagrama = Array.isArray(this.$route.params.idPersonalSinDiagrama)
                ? this.$route.params.idPersonalSinDiagrama[0]
                : this.$route.params.idPersonalSinDiagrama;
                
            this.personal = await loadPersonal(idPersonal) || defaultPersonal();
            this.personalSinDiagrama = await loadPersonalSinDiagrama(idPersonalSinDiagrama) || defaultPersonalSinDiagrama();
            this.tarjetaPersonalSinDiagrama =  await loadTarjetaPersonalSinDiagramaPorLegajoYMes(this.personal.legajo,this.selectedMonth) || defaultTarjetaPersonalSinDiagrama();
            this.lstNovedades = await loadNovedades() || [defaultNovedad()];
            this.lstTurnos = await loadTurnos() || [defaultTurnos()];

            this.novedades = filtrarNovedadesPorLegajo(this.personal.legajo, this.lstNovedades);
            this.relevos = filtrarRelevosPorLegajo(this.personal.legajo, this.lstNovedades);
            
            this.seleccionPeriodo()
            
        }
        // this.loadPersonales();
        newToken();
    },
    name: "App",
    components: {},
});
</script>

<style scoped>

main{
    margin-top: 5rem;
    font-size: 20px;
}
.table-bordered {
  border: 2px solid #aaa; /* Borde más grueso */
}

.table th,
.table td {
  text-align: center; /* Alineación centrada */

}
.layout {
    /* width: 100%; */
    display: flex;
    /* gap: 16px; */
    justify-content: space-between;
}

th {
    background-color: #ddd;
}

th,
td {
    padding: 5px; 
}
td{
    margin-top: 3px;
}
input{
    widows: 100%;
}
.barraBotones{
    display:flex;
    justify-content: end;
    margin-bottom: 1rem;
    margin-right: 1rem;
}
/* .barraBotones > button{
    margin-top: 2px;
} */
.modal-content{
    width: 100%;
}
.modal-ancho-personalizado {
    max-width: 90%; /* Cambia el valor según lo necesites */
}

.dia{
    display:flex;
    justify-content: end;
}
.celdaFecha{
    padding: 0;
}
.celdaInput{
    padding: 0;
}
.celdaInput input {
    width: 100%;
    box-sizing: border-box; /* Asegura que el padding y el borde se incluyan en el ancho total */
}
.celdaInputAncho {
    width: 100%;
    text-align: left;
    margin-top: 2px;
}
.text-red td {
    color: red; /* Asegurar que el estilo también se aplique a los td dentro del tr */
    font-weight: bold;
}

</style>