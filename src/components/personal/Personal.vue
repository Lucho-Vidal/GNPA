<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Listado Personal de Abordo
            </h2>
            <!-- <p class="d-flex justify-content-end m-2">
                Fecha: {{ days[today.getDay()] }}
                {{ today.toLocaleDateString() }}
            </p> -->
            <div class="d-flex justify-content-end">
                <router-link
                    class="btn btn-primary d-flex end"
                    to="/editPersonal"
                    >Nuevo Personal</router-link
                >
                <router-link
                    class="btn btn-success d-flex end mx-3"
                    to="/addPersonales"
                    >Cargar desde Excel</router-link
                >
                <button class="btn btn-warning" @click.prevent="abrirModal()">
                    Filtrar Personal
                </button>
            </div>
            <div class="modal" :class="{ 'd-block': mostrarModalDetalle }" v-if="detalleLegajo!=0" @click.self="cerrarModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalle del personal</h5>
                            <button
                                type="button"
                                class="close btn btn-danger"
                                @click="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="image-container ">
                                <img v-if="datosPersonalesIndexados[detalleLegajo] && datosPersonalesIndexados[detalleLegajo].Img" 
                                :src="`http://localhost:3000/${datosPersonalesIndexados[detalleLegajo].Img}`"
                                class="image rounded-circle" alt="Carnet">
                                <img v-else class="image rounded-circle "  src="../../assets/usuario.png" alt="Carnet">
                            </div>
                            <h6>Personal:</h6>
                            <div class=" border border-dark rounded p-3 m-3">
                                <div class="my-3 d-flex ">
                                <ul class="d-flex list-unstyled w-100 justify-content-evenly ">
                                    <li class="list-inline-item">Legajo:  {{ personalIndexado[detalleLegajo].legajo }}</li>
                                    <li class="list-inline-item">Apellido: {{ personalIndexado[detalleLegajo].apellido }}</li>
                                    <li class="list-inline-item">Nombre: {{ personalIndexado[detalleLegajo].nombres }}</li>
                                </ul>
                            </div>
                            <div class="my-3 d-flex" v-if="personalIndexado[detalleLegajo]">
                                <ul class="d-flex list-unstyled w-100 justify-content-between">
                                    <li class="list-inline-item">Base: {{ personalIndexado[detalleLegajo].dotacion }}</li>
                                    <li class="list-inline-item">Especialidad: {{ personalIndexado[detalleLegajo].especialidad }}</li>
                                    <li class="list-inline-item">Turno: {{ personalIndexado[detalleLegajo].turno }}</li>
                                    <li class="list-inline-item">Franco: {{ days[personalIndexado[detalleLegajo].franco] }}</li>
                                    <li class="list-inline-item">Orden: {{ personalIndexado[detalleLegajo].orden }}</li>
                                </ul>
                            </div>
                            </div>
                            <h6>Datos Personales:</h6>
                            <div class="my-3 d-flex row  border border-dark rounded p-3 m-3" v-if="datosPersonalesIndexados[detalleLegajo]">
                                <ul class="d-flex list-unstyled w-100 justify-content-between">
                                    <li class="list-inline-item">DNI: {{ datosPersonalesIndexados[detalleLegajo].Dni }}</li>
                                    <li class="list-inline-item">Nacionalidad: {{ datosPersonalesIndexados[detalleLegajo].Nacionalidad }}</li>
                                    <li class="list-inline-item">Fecha de Nacimiento: {{ formatearFecha(datosPersonalesIndexados[detalleLegajo].Nacimiento) }}</li>
                                    <li class="list-inline-item">Sexo: {{ datosPersonalesIndexados[detalleLegajo].Sexo }}</li>
                                    <li class="list-inline-item">Grupo Sanguíneo: {{ datosPersonalesIndexados[detalleLegajo].GrupoSanguíneo }}</li>
                                </ul>
                                <h6>Dirección y contacto: </h6>
                                <ul class="d-flex list-unstyled w-100 justify-content-between">
                                    <li class="list-inline-item">Dirección: {{ datosPersonalesIndexados[detalleLegajo].Calle }}</li>
                                    <li class="list-inline-item">Nro: {{ datosPersonalesIndexados[detalleLegajo].Nro }}</li>
                                    <li class="list-inline-item">Piso: {{ datosPersonalesIndexados[detalleLegajo].Piso }}</li>
                                    <li class="list-inline-item">Dpto: {{ datosPersonalesIndexados[detalleLegajo].Depto }}</li>
                                    <li class="list-inline-item">Código Postal: {{ datosPersonalesIndexados[detalleLegajo].Postal }}</li>
                                    <li class="list-inline-item">Localidad: {{ datosPersonalesIndexados[detalleLegajo].Localidad }}</li>
                                </ul>
                                <ul class="d-flex list-unstyled w-100 justify-content-between">
                                    <li class="list-inline-item">Celular: {{ datosPersonalesIndexados[detalleLegajo].Tel1 }}</li>
                                    <li class="list-inline-item">Teléfono: {{ datosPersonalesIndexados[detalleLegajo].Tel2 }}</li>
                                    <li class="list-inline-item">Mail: {{ datosPersonalesIndexados[detalleLegajo].Mail }}</li>
                                </ul>
                            </div>
                            <div class="d-flex list-unstyled w-100 justify-content-evenly"  v-if="datosPersonalesIndexados[detalleLegajo]" >
                                <ul v-if="datosPersonalesIndexados[detalleLegajo].aptoMedico">
                                    <h6>Apto Medico</h6>
                                    <li class="list-inline-item"> {{ formatearFecha(datosPersonalesIndexados[detalleLegajo].aptoMedico) }} </li>
                                </ul>
                                <ul v-if="datosPersonalesIndexados[detalleLegajo].certificadoIdoneidad">
                                    <h6>Certificado Idoneidad</h6>
                                    <li class="list-inline-item"> {{ formatearFecha(datosPersonalesIndexados[detalleLegajo].certificadoIdoneidad) }} </li>
                                </ul>
                            </div>
                            <h6>Observaciones:</h6>
                            <div class="my-3 d-flex  border border-dark rounded p-3 m-3">
                                <ul class="d-flex list-unstyled w-100 justify-content-between">
                                    <li class="list-inline-item"> {{ personalIndexado[detalleLegajo].observaciones }}</li>
                                    
                                </ul>
                            </div>
                            <div v-if="
                                personalIndexado[detalleLegajo].especialidad.includes('Conductor') ||
                                personalIndexado[detalleLegajo].especialidad.includes('Ayudante')
                                ">
                                <h6>Conocimientos:</h6>
                                <div class="my-3 d-flex row border border-dark rounded p-3 m-3">
                                    <h6>Estudios:</h6>
                                    <ul class="d-flex list-unstyled w-100 justify-content-start">
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.CML ? "CML" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.CKD ? "CKD" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.RO ? "RO" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.MPN ? "MPN" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.OL ? "OL" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.LCI ? "LCI" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.ELEC ? "ELEC" : "" }}</li>
                                        <li class="list-inline-item">{{ personalIndexado[detalleLegajo].conocimientos.DUAL ? "DUAL" : "" }}</li>
                                    </ul>
                                    <div v-if="conocimientosViasIndexados[detalleLegajo]">
                                        <h6>Vias:</h6>
                                        <ul class="d-flex list-unstyled w-100 justify-content-between">
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pczz">PC-ZZ: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pczz))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pcak">PC-AK: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pcak))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pctybq">PC-TY-BQ: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pctybq))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pcqlbq">PC-QL-BQ: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pcqlbq))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pcqllp">PC-QL-LP: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pcqllp))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Pctylp">PC-TY-LP: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Pctylp))  }}</li>
                                        </ul>
                                        <ul class="d-flex list-unstyled w-100 justify-content-between">   
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Tyhdo">TY-HDO: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Tyhdo))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Tyjg">TY-JG: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Tyjg))  }}</li>
                                        </ul>
                                        <ul class="d-flex list-unstyled w-100 justify-content-between">   
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Zzcñ">ZZ-CÑ: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Zzcñ))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Cñmn">CÑ-MN: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Cñmn))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Cñlb">CÑ-LB: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Cñlb))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Cñgl">CÑ-GL: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Cñgl))  }}</li>             
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Cñol">CÑ-OL: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Cñol))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Olbb">OL-BB: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Olbb))  }}</li>
                                        </ul>
                                        <ul class="d-flex list-unstyled w-100 justify-content-between">    
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Akchc">AK-CHC: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Akchc))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Akmpn">AK-MPN: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Akmpn))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Gipx">GI-PX: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Gipx))  }}</li>
                                            <li class="list-inline-item" v-if="conocimientosViasIndexados[detalleLegajo].Universitario">Universitario: {{ formatFecha(new Date(conocimientosViasIndexados[detalleLegajo].Universitario))  }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="m-3 d-flex justify-content-center">
                            <button
                                class="btn btn-primary mx-3"
                                @click="edit(
                                    personalIndexado[detalleLegajo]._id,
                                    datosPersonalesIndexados[detalleLegajo]?._id || '',
                                    conocimientosViasIndexados[detalleLegajo]?._id ||'',
                                    personalSinDiagramaIndexados[detalleLegajo]?._id ||''
                                    )"
                                >Editar personal</button>
                                <button
                                    type="button"
                                    class="close btn btn-danger px-5"
                                    @click="cerrarModal">
                                    Cerrar
                                </button>
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
                                @click="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="my-2">
                                <input
                                    class="col-2 gap rounded-3"
                                    type="number"
                                    ref="inputSearch"
                                    placeholder="Buscar Legajo"
                                    autofocus
                                    v-model="searchLegajo"
                                    @keyup.enter="handleEnterKey"
                                />
                                <input
                                    class="col-3 gap mx-3 rounded"
                                    type="text"
                                    placeholder="Buscar por apellido y/o nombre"
                                    v-model="search"
                                    v-on:change="filtrarPersonales()"
                                />
                                <input
                                    class="col-3 gap col rounded"
                                    type="text"
                                    placeholder="Buscar por turno"
                                    autofocus
                                    v-model="searchTurno"
                                    v-on:change="filtrarPersonales()"
                                />
                                <h6>Filtro por Dotación:</h6>
                                <div class="d-flex flex-wrap justify-content-center my-3">
                                    <div
                                        v-for="(dotacion, index) in dotacionesPermitidas"
                                        :key="index"
                                    >
                                        <label class="form-check-label mx-2">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :value="dotacion"
                                                v-model="dotacionesSeleccionadas"
                                                v-on:change="filtrarPersonales()"
                                            />
                                            {{ dotacion }}
                                            <!-- Mostrar el valor de la variable circular en el label -->
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="my-3">
                                <h6>Filtro por Especialidad:</h6>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Conductor Electrico"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Conductor eléctrico
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Conductor diesel"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Conductor Diesel
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Ayudante habilitado"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Ayudante Habilitado
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Ayudante conductor"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Ayudante Conductor
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Guardatren Electrico"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Guarda Tren Electrico
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Guardatren diesel"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrarPersonales()"
                                    />
                                    Guarda Tren Diesel
                                </label>
                            </div>
                            <div class="my-3">
                                <h6>Filtro por Turno:</h6>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="turno"
                                        v-model="checkboxTurno"
                                        @change="filtrarPersonales()"
                                    />
                                    Turnos
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="PROG"
                                        v-model="checkboxTurno"
                                        @change="filtrarPersonales()"
                                    />
                                    Programas
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="ciclo"
                                        v-model="checkboxTurno"
                                        @change="filtrarPersonales()"
                                    />
                                    Ciclos
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 v-if="personalesFiltrados.length == 0">
                No se encontró ningún personal
            </h3>
            <table
                class="table table-striped table-hover"
                v-if="personalesFiltrados.length > 0"
            >
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Franco</th>
                        <th class="col-1" colspan="1">Especialidad</th>
                        <th class="col-1" colspan="1">Dotacion</th>
                        <th class="col-1" colspan="1">Observaciones</th>
                        <th class="col-1" colspan="1">Orden</th>
                        <th class="col-1">Detalle</th>
                        <th class="col-1">Eliminar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(personal, index) in personalesFiltrados"
                    :key="index"
                    @dblclick="abrirModalDetalle(personal.legajo)"
                >
                    <tr>
                        <td class="col-1">{{ personal.legajo }}</td>
                        <td class="col-1">{{ personal.apellido }}</td>
                        <td class="col-2">{{ personal.nombres }}</td>
                        <td class="col-1">{{ personal.turno }}</td>
                        <td class="col-1">{{ days[personal.franco] }}</td>
                        <td class="col-1">{{ personal.especialidad }}</td>
                        <td class="col-1">{{ personal.dotacion }}</td>
                        <td class="col-2">{{ personal.observaciones }}</td>
                        <td class="col-1">{{ personal.orden }}</td>
                        <td class="col-1">
                            <i
                                class="material-icons cursor-hand"
                                @click="abrirModalDetalle(personal.legajo)"
                                >edit_note</i
                            >
                        </td>
                        <td class="col-1">
                            <i
                                class="material-icons cursor-hand rojo"
                                @click="deletePersonal(personal._id, index)"
                                >delete_forever</i
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    deletePersonal,
    getConocimientosVias,
    getDatosPersonales,
    getPersonales,
} from "../../services/personalService";
import { IConocimientosVias, IDatoPersonal, IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";
import { IPersonalSinDiagrama } from "../../interfaces/IPersonalSinDiagrama";
import { getPersonalesSinDiagrama } from "../../services/personalSinDiagramaService";
import { obtenerDotaciones } from "../../utils/personal";

export default defineComponent({
    // props: ['idPersonal', 'idDato', 'idVia'],
    data() {
        return {
            personales: [] as IPersonal[],
            personalesFiltrados: [] as IPersonal[],
            datosPersonales: [] as IDatoPersonal[],
            conocimientosVias: [] as IConocimientosVias[],
            personalSinDiagrama: [] as IPersonalSinDiagrama[],
            
            personalIndexado: {} as Record<number, IPersonal>,
            datosPersonalesIndexados: {} as Record<number, IDatoPersonal>,
            conocimientosViasIndexados: {} as Record<number, IConocimientosVias>,
            personalSinDiagramaIndexados: [] as Record<number,IPersonalSinDiagrama>,
            
            dotacionesPermitidas: [] as string[],
            dotacionesSeleccionadas: [] as string[],
            
            detalleLegajo: 0 ,
            checkboxDotacion: [] as string[],
            checkboxEspecialidad: [] as string[],
            checkboxTurno: [] as string[],
            mostrarModalDetalle: false,
            mostrarModalSearch: false,
            
            today: new Date(),
            
            search: "" as string,
            searchTurno: "" as string,
            searchLegajo: null,
            
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
        async loadPersonales() {
            try {
                const res = await getPersonales();
                this.personales = res.data;
                this.filtrarPersonales();
                this.personalIndexado = this.indexarPersonal(this.personales)
                this.dotacionesPermitidas = obtenerDotaciones(this.personales);

                
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async loadDatosPersonales() {
            try {
                const res = await getDatosPersonales();
                this.datosPersonales = res.data;
                this.datosPersonalesIndexados = this.IndexarDatosPersonales(this.datosPersonales);
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async loadConocimientoVias() {
            try {
                const res = await getConocimientosVias();
                this.conocimientosVias = res.data;
                this.conocimientosViasIndexados = this.IndexarConocimientoVias(this.conocimientosVias);
                
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async loadPersonalSinDiagrama() {
            try {
                const res = await getPersonalesSinDiagrama();
                this.personalSinDiagrama = res.data;
                this.personalSinDiagramaIndexados = this.IndexarPersonalSinDiagrama(this.personalSinDiagrama);                
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async deletePersonal(id: string, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este Personal?"
                );
                if (confirmacion) {
                    await deletePersonal(id);

                    // guardamos registro
                    const registro: Registro = {
                        usuario: window.localStorage.getItem("username") || "",
                        fecha: this.today.toString(),
                        accion: "Elimino",
                        personal: this.personales[index],
                    };
                    await createRegistro(registro);
                    this.personalesFiltrados.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
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
        IndexarDatosPersonales(datosPersonales: IDatoPersonal[]): Record<number, IDatoPersonal> {
            return datosPersonales.reduce(
                (acumulador: Record<number, IDatoPersonal>, dato: IDatoPersonal) => {
                    acumulador[dato.Legajo] = dato;
                    return acumulador;
                },
                {} as Record<number, IDatoPersonal>
            );
        },
        IndexarConocimientoVias(datosPersonales: IConocimientosVias[]): Record<number, IConocimientosVias> {
            return datosPersonales.reduce(
                (acumulador: Record<number, IConocimientosVias>, dato: IConocimientosVias) => {
                    acumulador[dato.Legajo] = dato;
                    return acumulador;
                },
                {} as Record<number, IConocimientosVias>
            );
        },
        IndexarPersonalSinDiagrama(personalSinDiagrama: IPersonalSinDiagrama[]): Record<number, IPersonalSinDiagrama> {
            return personalSinDiagrama.reduce(
                (acumulador: Record<number, IPersonalSinDiagrama>, dato: IPersonalSinDiagrama) => {
                    acumulador[dato.legajo] = dato;
                    return acumulador;
                },
                {} as Record<number, IPersonalSinDiagrama>
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
            this.mostrarModalDetalle = false;
        },
        handleEnterKey() {
            this.filtrarPersonales();
            this.cerrarModal();
        },
        abrirModalDetalle(legajo:number) {
            this.detalleLegajo = legajo;
            this.mostrarModalDetalle = true;
        },
        filtrarPersonales() {
            let cDotacion = [];
            let cEspecialidad = [];
            let cTurno = [];
            let filtrar = false;
            this.personalesFiltrados = [];

            if (this.search.length != 0) {
                filtrar = true;
            }
            if (this.searchLegajo ) {
                filtrar = true;
            }
            if (this.searchTurno.length != 0) {
                filtrar = true;
            }
            if (
                this.dotacionesSeleccionadas.length == 0 ||
                this.dotacionesSeleccionadas == undefined
            ) {
                cDotacion = this.dotacionesPermitidas;
            } else {
                cDotacion = this.dotacionesSeleccionadas;
                filtrar = true;
            }
            if (this.checkboxEspecialidad.length == 0) {
                cEspecialidad = [
                    "Conductor electrico",
                    "Conductor diesel",
                    "Ayudante habilitado",
                    "Guardatren diesel",
                    "Ayudante conductor",
                    "Guardatren electrico",
                ];
            } else {
                cEspecialidad = this.checkboxEspecialidad;
                filtrar = true;
            }
            if (this.checkboxTurno.length == 0) {
                cTurno = ["turno", "prog", "ciclo"];
            } else {
                cTurno = this.checkboxTurno;
                filtrar = true;
            }

            if (filtrar) {
                cDotacion.forEach((dotacion: string) => {
                    for (let i = 0; i < this.personales.length; i++) {
                        if (this.personales[i].dotacion == dotacion) {
                            this.personalesFiltrados.push(this.personales[i]);
                        }
                    }
                });

                let auxPersonales: IPersonal[] = this.personalesFiltrados;
                this.personalesFiltrados = [];

                cEspecialidad.forEach((especialidad: string) => {
                    for (let i = 0; i < auxPersonales.length; i++) {
                        if (
                            auxPersonales[i].especialidad.toLowerCase() ==
                            especialidad.toLowerCase()
                        ) {
                            this.personalesFiltrados.push(auxPersonales[i]);
                        }
                    }
                });

                auxPersonales = this.personalesFiltrados;
                this.personalesFiltrados = [];

                cTurno.forEach((turno: string) => {
                    for (let i = 0; i < this.personales.length; i++) {
                        if (auxPersonales[i] != undefined) {
                            if (
                                turno.toLowerCase().includes("ciclo") &&
                                auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("ciclo")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            } else if (
                                turno.toLowerCase().includes("prog") &&
                                auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("prog")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            } else if (
                                turno.toLowerCase().includes("turno") &&
                                !auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("prog") &&
                                !auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("ciclo")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            }
                        }
                    }
                });
                if (this.search.length != 0) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return (
                                personal.apellido.toLowerCase() +
                                " " +
                                personal.nombres.toLowerCase().trim()
                            ).includes(this.search.toLowerCase().trim());
                        }
                    );
                }
                if (this.searchTurno.length != 0) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return personal.turno.includes(
                                this.searchTurno.toLowerCase().trim()
                            );
                        }
                    );
                }
                if (this.searchLegajo ) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return personal.legajo === this.searchLegajo;
                        }
                    );
                }
            } else {
                this.personalesFiltrados = this.personales;
            }
        },
        edit(idPersonal: string,idDato: string,idVia: string,idTarjeta:string) {   
            this.$router.push({ name: 'editPersonal', params: { idPersonal: idPersonal, idDato: idDato, idVia: idVia, idTarjeta: idTarjeta } });
        },
    },
    created() {
        try {
            this.loadPersonales();
            this.loadDatosPersonales();
            this.loadConocimientoVias();
            this.loadPersonalSinDiagrama();
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    name: "Personal",
    components: {},
});
</script>
<style>
main{
    margin-top: 5rem;
}

</style>
