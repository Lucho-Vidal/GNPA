<template>
    <main>
        <h1>
            {{  titulo }}
        </h1>
        <div class="container d-flex">
            <div
                class="justify-content-center alert row"
                :class="[
                    message.status == 'danger'
                        ? 'alert-danger'
                        : message.status == 'success'
                        ? 'alert-success'
                        : message.status == 'warning'
                        ? 'alert-warning'
                        : '',
                ]"
                role="alert"
                v-if="message.activo"
            >
                <h4 class="alert-heading">{{ message.title }}</h4>
                <hr />
                {{ message.message }}
                <button
                    v-if="idNovedad !== 0"
                    class="btn btn-danger mx-3 col-2"
                    @click="goToEdit(idNovedad)"
                >
                    Ir a la novedad
                </button>
            </div>
        </div>
        
        <!-- Modal de búsqueda -->
        <div>
            <div class="modal" :class="{ 'd-block': mostrarModalSearch }"  @click.self="cerrarModal" @keyup.esc="cerrarModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Buscar personales</h5>
                            <button
                                type="button"
                                class="close btn btn-danger"
                                @click="cerrarModal"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input
                                ref="inputSearch"
                                type="text"
                                class="form-control my-3"
                                placeholder="Ingrese Nombre o Apellido"
                                list="personales"
                                v-model="search"
                                autofocus
                                @keyup="searchPersonal(selectRemplazo)"
                            />

                            <div class="table-container">
                                <table class="table table-hover" v-if="search">
                                    <thead>
                                        <tr>
                                            <th>Legajo</th>
                                            <th>Apellido</th>
                                            <th>Nombre</th>
                                            <th>Dotacion</th>
                                            <th>Turno</th>
                                            <th>Franco</th>
                                            <th>Especialidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(personal,
                                            index) in personalEncontrado"
                                            :key="index"
                                            @click="selectPersonal(personal)"
                                        >
                                            <td class="col-1">
                                                {{ personal.legajo }}
                                            </td>
                                            <td class="col-1">
                                                {{ personal.apellido }}
                                            </td>
                                            <td class="col-2">
                                                {{ personal.nombres }}
                                            </td>
                                            <td class="col-1">
                                                {{ personal.dotacion }}
                                            </td>
                                            <td class="col-1">
                                                {{ personal.turno }}
                                            </td>
                                            <td class="col-1">
                                                {{ days[personal.franco] }}
                                            </td>
                                            <td class="col-1">
                                                {{ personal.especialidad }}
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
        <div>
            <button class="btn btn-success btn-buscar-personal" @click="abrirModal(false)">Buscar Personal</button>
        </div>
        <!-- Formulario -->
        <form @submit.prevent="saveNovedad()" @keydown.enter.prevent="moverAlSiguienteElemento($event)">
            <div class="justify-content-between row">
                <div class="col-2">
                    <label for="legajo"></label>
                    Legajo
                    <input
                        class="form-control mb-3"
                        placeholder="Ingrese Legajo"
                        type="number"
                        name="legajo"
                        autofocus
                        required
                        @change="searchPersonalPorLegajo()"
                        v-model="novedad.legajo"
                    />
                </div>
                <div class="col-3">
                    <label for="Apellido"></label>
                    Apellido
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="apellido"
                        v-model="novedad.apellido"
                        disabled
                    />
                </div>
                <div class="col-4">
                    <label for="nombres"></label>
                    Nombre
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="nombres"
                        v-model="novedad.nombres"
                        disabled
                    />
                </div>
            </div>
            <div class="justify-content-between row">
                <div class="col-1">
                    <label for="base"></label>
                    Base
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base"
                        v-model="novedad.base"
                        disabled
                    />
                </div>
                <div class="col-3">
                    <label for="especialidad"></label>
                    Especialidad
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="especialidad"
                        v-model="novedad.especialidad"
                        disabled
                    />
                </div>
                <div class="col-2">
                    <label for="turno"></label>
                    Turno
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="turno"
                        v-model="novedad.turno"
                        disabled
                    />
                </div>
                <div class="col-2">
                    <label for="franco"></label>
                    Franco
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="franco"
                        v-model="novedad.franco"
                        disabled
                    />
                </div>
            </div>
            <div class="justify-content-between row">
                <div class="col-3">
                    <label for="tipoNovedad">Tipo de Novedad </label>
                    <select
                        name="tipoNovedad"
                        id="tipoNovedad"
                        class="form-control mb-3"
                        v-model="novedad.tipoNovedad"
                        required
                    >
                        //Enfermos
                        <optgroup label="Enfermos">
                            <option value="Enfermedad">Enfermedad</option>
                            <option value="ART">ART</option>
                        </optgroup>
                        <hr>
                        //res558
                        <optgroup label="Res558">
                            <option value="Arrollamiento 558">Arrollamiento 558</option>
                        </optgroup>
                        <hr>
                        //LicenciaAnual
                        <optgroup label="Licencia anual">
                            <option value="Licencia Anual">Licencia Anual</option>
                        </optgroup>
                        <hr>
                        //escTecnica
                        <optgroup label="Escuela técnica">
                            <option value="Capacitación">Capacitación</option>
                        </optgroup>
                        <hr>
                        //disciplinarios
                        <optgroup label="Disciplinarios">
                            <option value="Suspension">Suspension</option>
                        </optgroup>
                        <hr>
                        //Legales y convencionales
                        <optgroup label="Legales y convencionales">
                            <option value="Estudio">Estudio y examen</option>
                            <option value="Licencia Deportiva">Licencia Deportiva</option>
                            <option value="Licencia Gremial">Licencia Gremial</option>
                            <option value="Art17-23">Art 17 FT / Art 23 UF</option>
                            <option value="Donación Sangre">Donación Sangre</option>
                            <option value="Donación Plaqueta">Donación Plaqueta</option>
                            <option value="Casamiento">Casamiento</option>
                            <option value="Duelo">Duelo</option>
                            <option value="Mudanza">Mudanza</option>
                            <option value="Paternidad">Paternidad</option>
                        </optgroup>
                        <hr>
                        //OtrosMotivos
                        <optgroup label="Otros motivos">
                            <option value="Ausente">Ausente</option>
                        </optgroup>
                        <hr>
                        //Franco
                        <optgroup label="Franco">
                            <option value="Descanso Adeudado">Descanso Adeudado</option>
                        </optgroup>
                        <hr>
                        //sin efecto en el estadistico
                        <optgroup label="Sin efecto en el estadistico">
                            <option value="Practica">Practica via</option>
                            <option value="Sin Apto">Sin apto</option>
                            <option value="Revision Medica">Revision Medica</option>
                            <option value="Baja definitiva">Baja definitiva</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label for="fechaBaja"></label>
                    Fecha de inicio
                    <input
                        required
                        class="form-control mb-3"
                        type="Date"
                        name="fechaBaja"
                        v-model="novedad.fechaBaja"
                        @change="validaPersonalConNovedadActiva(novedad.legajo)"
                    />
                </div>
                <div class="form-check form-check-inline m-0">
                    <input
                        class="form-check-input valoresCheck"
                        type="checkbox"
                        name="HNA"
                        id="HNA"
                        checked
                        v-model="novedad.HNA"
                        @change="validaPersonalConNovedadActiva(novedad.legajo)"
                    />
                    <label class="form-check-label" for="HNA">HNA</label>
                </div>
                <div class="col-3" v-if="!novedad.HNA">
                    <label for="fechaAlta"></label>
                    Fecha de fin
                    <input
                        required
                        class="form-control mb-3"
                        type="Date"
                        name="fechaAlta"
                        v-model="novedad.fechaAlta"
                        @change="calcularDiasNovedad(true)"
                    />
                </div>
                <div class="col-2" v-if="!novedad.HNA">
                    <label for="fechaAlta"></label>
                    Cantidad de días
                    <input
                        required
                        class="form-control mb-3"
                        type="number"
                        name="cantidadDias"
                        v-model="cantDias"
                        @change="calcularDiasNovedad(false)"
                        @focus="handleInputFocus"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="detalle"></label>
                    Detalle
                    <textarea
                        class="form-control mb-3"
                        name="detalle"
                        v-model="novedad.detalle"
                    ></textarea>
                </div>
            </div>
            <!-- Llamada Modal búsqueda -->
            <button class="btn btn-success col-2 mb-3" @click.prevent="abrirModal(true)" >
                Buscar Remplazo
            </button>
            <!-- Tabla remplazo -->
            <table class="my-3">
                <thead>
                    <tr>
                        <th class="col-1 px-5">
                            <i
                                class="material-icons cursor-hand verde"
                                @click="agregarRemplazo()"
                                >person_add</i
                            >
                        </th>
                        <th>Legajo</th>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>Función</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(remplazo, index) in novedad.remplazo"
                        :key="index"
                    >
                        <td></td>
                        <td>
                            <input
                                type="number"
                                name="legajo"
                                class="form-control col-2 mb-3"
                                v-model="remplazo.legajo"
                                @change="asignarRelevoPorLegajo(remplazo.legajo,index)"
                            />
                        </td>
                        <td>{{ remplazo.apellido }}</td>
                        <td>{{ remplazo.nombres }}</td>
                        <td>{{ remplazo.especialidad }}</td>
                        <td>
                            <input
                                required
                                class="form-control mb-3"
                                type="Date"
                                name="FechaBaja"
                                v-model="remplazo.inicioRelevo"
                                @change="validaPersonalConNovedadActiva(remplazo.legajo,index)"
                            />
                        </td>
                        <td>
                            <input
                                class="form-control mb-3"
                                type="Date"
                                name="FechaBaja"
                                v-model="remplazo.finRelevo"
                                @change="validaPersonalConNovedadActiva(remplazo.legajo,index)"
                            />
                        </td>
                        <td>
                            <i
                                class="material-icons cursor-hand rojo"
                                @click="novedad.remplazo.splice(index, 1)"
                                >clear</i
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button class="btn btn-primary col-1 m-2">Guardar</button>
                <button class="btn btn-secondary col-1 m-2" @click="goBack">Cerrar</button>
            </div>
        </form>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Novedad, Remplazo } from "../../interfaces/INovedades";
import {
    createNovedad,
    getNovedad,
    getNovedades,
    getUltimaNovedad,
    updateNovedad,
} from "../../services/novedadesService";
import { getPersonales } from "../../services/personalService";
import { IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";
import { esFechaMayor, seSolapanFechas } from "../../utils/fechas";

export default defineComponent({
    props: ['id', 'legajo'],
    data() {
        return {
            novedades: [] as Novedad[],
            novedad: {} as Novedad,
            titulo:"" as string,
            ultimoId: 0,
            today: new Date(),
            personales: [] as IPersonal[],
            days: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
            search: "" as string,
            selectRemplazo: false,
            personalEncontrado: [] as IPersonal[],
            mostrarModalSearch: false,
            cantDias: 1,
            idNovedad: 0,
            idParam: 0,
            cicloRelevando: false,
            message: {
                activo: false,
                status: "",
                title: "",
                message: "",
            },

        };
    },
    watch: {
        //esta función esta para cuando aparece un alerta con el botón ir a la novedad actualice los datos funciona junto goToEdit
        '$route.params.id': {
            immediate: true,
            handler(newId) {
                const id = parseInt(newId, 10);
                if (!isNaN(id)) {
                    this.loadNovedad(id);
                }
            }
        }
    },
    methods: {
        goToEdit(id:number) {
            this.message.activo = false
            this.$router.push(`/editNovedades/${id}`).then(() => {
                this.$forceUpdate(); // Forzar la actualización del componente
            });
        },
        goBack() {
            const fromRoute = localStorage.getItem('fromRoute') || '/novedades'; // Recuperar la ruta o usar 'novedades'
            localStorage.removeItem('fromRoute')
            this.$router.push(fromRoute);
        },
        moverAlSiguienteElemento(event: KeyboardEvent) {
            event.preventDefault();
            const focusable = Array.from(
                document.querySelectorAll<HTMLElement>(`button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])`)
            )
            .filter((el, index) => !el.hasAttribute('disabled') && index >= 13);
            let currentIndex = focusable.indexOf(event.target as HTMLElement);
            
            if(currentIndex === focusable.length -1) {
                currentIndex = 0 
            }

            // Encuentra el siguiente elemento habilitado y focusable
            const siguienteElemento = focusable.slice(currentIndex + 1).find(el => el);

            if (siguienteElemento) {
                siguienteElemento.focus();
            }
        },
        // Conexión con la API
        async obtenerUltimoId() {
            /* Este método obtiene a traves de una consulta HTML:GET el ultimo
            Id de los documentos guardados con el fin de asignarle a la nueva novedad el id proximo */
            const res = await getUltimaNovedad();
            this.ultimoId = res.data[0]._id;
        },
        /* Este método busca la novedad en el backend por medio de una consulta HTML:GET */
        async loadNovedad(id: number) {
            try {
                const { data } = await getNovedad(id);
                this.novedad = data;
            } catch (error) {
                console.error(error);
            }
        },
        async loadNovedades() {
            const res = await getNovedades();
            this.novedades = res.data;
        },
        async loadPersonales() {
            /* Este método trae la lista de todos los personales */
            const res = await getPersonales();
            this.personales = res.data;
        },
        async saveNovedad() {
            /* Método utilizado para realizar la consulta HTML:POST al backend para el guardado de los datos */
            try {
                
                // Validaciones
                if (this.cicloRelevando) {
                    this.message.activo = false;
                    this.actualizarRelevo();
                }
                
                console.log(
                    this.esInicioRelevoMayorIgualFechaBaja(),
                    this.esFinRelevoMayorFinNovedad(),
                    this.hayMasDeUnRelevo(),
                    this.esFechaBajaMayorFechaAlta() ,
                    this.message.activo
                )
                if (
                    this.esInicioRelevoMayorIgualFechaBaja() ||
                    this.esFinRelevoMayorFinNovedad() ||
                    this.hayMasDeUnRelevo() ||
                    this.esFechaBajaMayorFechaAlta() ||
                    this.message.activo
                ) {
                    if (this.message.activo) {
                        this.message.message =
                            "Ocurrió un problema con la validación. Si el error persiste, Contacte al administrador con capturas de pantalla del error.";
                        this.message.status = "danger";
                        this.idNovedad = 0;
                    }
                    return;
                }

                this.terminaNovedadMismaFechaFinRelevo();

                // Filtrar elementos vacíos en el array de remplazo
                if (this.novedad.remplazo) {
                    this.novedad.remplazo = this.novedad.remplazo.filter(
                        (remp:Remplazo) => remp.apellido !== ""
                    );
                }

                let accion = ""
                // Crear la novedad
                
                if (this.$route.params.id && this.$route.params.id !== 'undefined' && typeof this.$route.params.id === "string") {
                    accion = "Edito"
                    await updateNovedad(this.novedad._id, this.novedad);
                } else {
                    this.ultimoId++;
                    this.novedad._id = this.ultimoId;
                    this.novedad.fecha = this.today.toISOString().split("T")[0];
                    this.novedad.novedadInactiva = false;
                    accion = "Creo"
                    await createNovedad(this.novedad);
                }
                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toLocaleString(),
                    accion: accion,
                    novedad: this.novedad,
                };
                await createRegistro(registro);

                // Redireccionar
                this.goBack()
            } catch (error) {
                this.handleRequestError(error as AxiosError);
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
            } else if (error.response && error.response.status === 500) {
                this.message.message =
                    "Ocurrió un error al intentar guardar la novedad. Es posible que se deba a que el numero de novedad ya existe. por favor intente de nuevo.";
                this.message.activo = true;
                this.message.status = "danger";
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
        async actualizarRelevo() {
            const novedadesIndex = this.novedadesIndexada(this.novedades);
            novedadesIndex[this.idNovedad].remplazo.forEach((remp) => {
                if (remp.legajo === this.novedad.legajo) {
                    // const relevo:Remplazo = remp;
                    const fechaDiaAnterior = new Date(
                        this.novedad.fechaBaja
                    );
                    fechaDiaAnterior.setDate(fechaDiaAnterior.getDate() - 1);
                    const fechaFinRelevo = remp.finRelevo;
                    remp.finRelevo = fechaDiaAnterior
                        .toISOString()
                        .split("T")[0];
                    if (this.novedad.fechaAlta) {
                        const fechaDiaPosterior = new Date(
                            this.novedad.fechaAlta
                        );
                        fechaDiaPosterior.setDate(
                            fechaDiaPosterior.getDate() + 1
                        );
                        const remplazo: Remplazo = { ...remp };
                        remplazo.inicioRelevo = fechaDiaPosterior
                            .toISOString()
                            .split("T")[0];
                        remplazo.finRelevo = fechaFinRelevo;
                        novedadesIndex[this.idNovedad].remplazo.push(remplazo);
                    }
                }
            });

            if (novedadesIndex[this.idNovedad].detalle) {
                novedadesIndex[this.idNovedad].detalle =
                    novedadesIndex[this.idNovedad].detalle +
                    "\nEl Personal " +
                    this.novedad.apellido +
                    " " +
                    this.novedad.nombres +
                    " fue dado de baja por la novedad N*" + (this.idParam ? this.idNovedad : this.ultimoId + 1);
            } else {
                novedadesIndex[this.idNovedad].detalle =
                    "El Personal " +
                    this.novedad.apellido +
                    " " +
                    this.novedad.nombres +
                    " fue dado de baja por la novedad N*" + (this.idParam ? this.idNovedad : this.ultimoId + 1);
            }
            if (this.novedad.detalle) {
                this.novedad.detalle =
                    this.novedad.detalle +
                    "Este personal estaba relevando la Novedad N* " +
                    this.idNovedad;
            } else {
                this.novedad.detalle =
                    "Este personal estaba relevando la Novedad N* " +
                    this.idNovedad;
            }
            await updateNovedad(this.idNovedad, novedadesIndex[this.idNovedad]);
        },
        novedadesIndexada(novedades: Novedad[]) {
            return novedades.reduce(
                (acumulador: Record<number, Novedad>, novedad: Novedad) => {
                    acumulador[novedad._id] = novedad;
                    return acumulador;
                },
                {} as Record<number, Novedad>
            );
        },
        handleInputFocus(event: FocusEvent) {
            const inputElement = event.target as HTMLInputElement;
            if (inputElement) {
                inputElement.select(); // Selecciona el contenido del input cantidad de dias
            }
        },
        // Validaciones:
        
        esInicioRelevoMayorIgualFechaBaja() {
            if (this.novedad.remplazo !== undefined && this.novedad.remplazo.length > 0) {
                
                if (esFechaMayor(
                        this.novedad.fechaBaja,
                        this.novedad.remplazo?.[0].inicioRelevo
                    )
                ) {
                    this.message.message =
                        "La fecha de inicio del relevo no puede ser anterior a la del inicio de la novedad";
                    this.message.activo = true;
                    this.message.status = "danger";
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        esFechaBajaMayorFechaAlta() {
            if (!this.novedad.HNA) {
                if (esFechaMayor(this.novedad.fechaBaja,this.novedad.fechaAlta)) {
                    this.message.message =
                        "La fecha de fin de la novedad no puede ser anterior a la del inicio de la novedad";
                    this.message.activo = true;
                    this.message.status = "danger";
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        esFinRelevoMayorFinNovedad() {
            if (this.novedad.remplazo == undefined) {
                return false;
            }
            if (this.novedad.remplazo.length === 0) {
                return false;
            }
            console.log(this.novedad.remplazo[this.novedad.remplazo.length - 1].finRelevo == "");
            if (this.novedad.remplazo[this.novedad.remplazo.length - 1].finRelevo == "") {
                return false;
            }
            if (this.novedad.fechaAlta) {
                if (
                    esFechaMayor(
                        this.novedad.remplazo[
                            this.novedad.remplazo.length - 1
                        ].finRelevo,
                        this.novedad.fechaAlta
                    )
                ) {
                    this.message.message =
                        "La fecha de fin del relevo no puede ser posterior a la del fin de la novedad";
                    this.message.activo = true;
                    this.message.status = "danger";
                    return true;
                }
            }
        },
        hayMasDeUnRelevo() {
            if (this.novedad.remplazo !== undefined) {
                let sinFechaFin = 0;
                for (let i = 0; i < this.novedad.remplazo.length - 1; i++) {
                    if (!this.novedad.remplazo[i].finRelevo) {
                        sinFechaFin++;
                    }

                    if (
                        esFechaMayor(
                            this.novedad.remplazo[i].finRelevo,
                            this.novedad.remplazo[i + 1].inicioRelevo
                        )
                    ) {
                        this.message.message =
                            "Un turno no puede ser relevado por dos personas el mismo día. Y los relevos deben están ordenados consecutivamente.";
                        this.message.activo = true;
                        this.message.status = "danger";
                        return true;
                    }
                }
                if (sinFechaFin > 1) {
                    this.message.message =
                        "No puede haber más de un relevo sin fecha de finalización";
                    this.message.activo = true;
                    this.message.status = "danger";
                    return true;
                }
            }
            return false;
        },
        terminaNovedadMismaFechaFinRelevo() {
            if (this.novedad.remplazo !== undefined && this.novedad.remplazo.length > 0) {
                if (
                    !this.novedad.HNA &&
                    !this.novedad.remplazo[
                        this.novedad.remplazo.length - 1
                    ].finRelevo
                ) {
                    this.novedad.remplazo[
                        this.novedad.remplazo.length - 1
                    ].finRelevo = this.novedad.fechaAlta;
                }
            }
        },
        validaPersonalConNovedadActiva(legajo: number|null,index: number|null = null):void {
            /*
            Esta función se llama cuando 
                1) se asigna un personal a la novedad 
                2) se asigna el personal como relevo de la novedad.
                3) que el personal que se asigna al relevo no sea el mismo de la novedad
            En el 1er caso se debe chequear 
                a) que no este de baja en ninguna novedad activa dentro del rango de fechas de la novedad 

            En el 2do caso se debe chequear 
                a) que no este de baja en ninguna novedad activa dentro del rango de fechas de la novedad
                b) que no este relevando ninguna novedad activa dentro del rango de fechas de la novedad
            */
            this.message.activo = false;
            let estaDeBaja = false;
            const personal = this.personales.find((p: IPersonal) => p.legajo === legajo);
            if (!personal) {
                console.warn("No se encontró el personal con el legajo proporcionado.");
                return;
            }
            
            // Recorre las novedades para aplicar las validaciones
            const novedadEncontrada = this.novedades.some((novedadRegistrada:Novedad)=>{
                // Caso 1                
                // Validación para evitar que el personal tenga otra novedad activa inclusive si es de ciclo
                let mensaje: string="";
                let estado: string="";
                let titulo: string="";

                let inicio1: string = "";
                let fin1: string = "";
                let hna1: boolean = false;    
                let inicio2: string = "";
                let fin2: string = "";
                let hna2: boolean = false; 

                if (novedadRegistrada.legajo === personal.legajo && this.idParam !== novedadRegistrada._id && !novedadRegistrada.novedadInactiva){ 
                    // Variables inicializadas
                    inicio1 = novedadRegistrada.fechaBaja;
                    fin1 = novedadRegistrada.fechaAlta;
                    hna1 = novedadRegistrada.HNA;        
                    
                    if(index == null){
                        // Información del segundo rango (novedad actual)
                        inicio2 = this.novedad.fechaBaja;
                        fin2 = this.novedad.fechaAlta;
                        hna2 = this.novedad.HNA;
                    }else{
                        // Información del segundo rango (novedad actual)
                        inicio2 = this.novedad.remplazo[index].inicioRelevo
                        fin2 = this.novedad.remplazo[index].finRelevo
                        hna2 = !fin2;
                    }
                    estaDeBaja = seSolapanFechas(inicio1,fin1,hna1,inicio2,fin2,hna2)
                    // console.log("Caso 1");
                    // console.log("novedad",novedadRegistrada._id);
                    // console.log(inicio1,fin1,hna1,inicio2,fin2,hna2)
                    // console.log("estaDeBaja?",estaDeBaja);
                    if (estaDeBaja) {
                        const fechaBaja = new Date(novedadRegistrada.fechaBaja+"T12:00").toLocaleDateString();
                        const fechaAlta = !novedadRegistrada.HNA ? new Date(novedadRegistrada.fechaAlta+"T12:00").toLocaleDateString(): "HNA";
                        titulo = "Personal de baja";
                        estado = "danger";
                        mensaje = `Este personal ${personal.apellido} ${personal.nombres} se encuentra de baja por la siguiente novedad N°${novedadRegistrada._id}.
                        Desde: ${fechaBaja} Hasta: ${fechaAlta}
                        Por favor, finalice la novedad para poder continuar`;
                    }
                }
                // Caso 2
                // si el personal de baja es de ciclo se busca que no este relevando
                if (!estaDeBaja && personal.turno.toLowerCase().includes("ciclo") && novedadRegistrada.remplazo.some(remp=> remp.legajo === personal.legajo ) && this.idParam !== novedadRegistrada._id && !novedadRegistrada.novedadInactiva){

                    // Extraer datos comunes
                    const remplazo = novedadRegistrada.remplazo.filter(remp => remp.legajo === personal.legajo);

                    // Variables inicializadas
                    remplazo.some(remp=>{
                        inicio1 =  remp?.inicioRelevo || "";
                        fin1 =  remp?.finRelevo || "";
                        hna1  = !fin1;   
                        
                        if(index == null){
                            // Información del segundo rango (novedad actual)
                            inicio2 = this.novedad.fechaBaja;
                            fin2 = this.novedad.fechaAlta;
                            hna2 = this.novedad.HNA;
                            legajo = this.novedad.legajo
                        }else{
                            // Información del segundo rango (novedad actual)
                            inicio2 = this.novedad.remplazo[index].inicioRelevo
                            fin2 = this.novedad.remplazo[index].finRelevo
                            hna2 = !fin2;
                            legajo = this.novedad.remplazo[index].legajo!
    
                        }
                        estaDeBaja = seSolapanFechas(inicio1,fin1,hna1,inicio2,fin2,hna2)
                    // console.log("Caso 2");
                    // console.log(legajo);

                    // console.log("novedad",novedadRegistrada._id);
                    // console.log(inicio1,fin1,hna1,inicio2,fin2,hna2)
                    // console.log("estaDeBaja?",estaDeBaja);
                        if (estaDeBaja) {
                            const fechaBaja = new Date(remp?.inicioRelevo+"T12:00").toLocaleDateString();
                            const fechaAlta = remp?.finRelevo ? new Date(remp?.finRelevo+"T12:00").toLocaleDateString(): "HNA";
                            titulo = "Personal relevando";
                            estado = "warning";
                            mensaje = `El personal ${personal.apellido} ${personal.nombres} se encuentra relevando la novedad N°${novedadRegistrada._id}.
                            Desde: ${fechaBaja} Hasta: ${fechaAlta}
                            Por favor, finalice la novedad para poder continuar`;
                        }
                        return estaDeBaja
                    })
                }
                if (estaDeBaja) {
                    this.idNovedad = novedadRegistrada._id;
                    this.activarAlerta(
                        estaDeBaja,
                        titulo,
                        mensaje,
                        estado
                    )
                    return true
                }
                return false
            });
            if (!novedadEncontrada) {
                console.log("No se encontraron novedades activas o relevos conflictivos para este personal.");
            } 
        },
        activarAlerta(activarNovedad:boolean,title:string,message:string,status:string){
            if (activarNovedad) {
                this.message.title = title
                this.message.message = message;
                this.message.status = status;
                this.message.activo = activarNovedad;
                this.cicloRelevando = activarNovedad;
            }
        },
        // Funcionamiento del Formulario
        agregarRemplazo() {
            const remplazo:Remplazo = {
                    legajo: null,
                    apellido: "",
                    nombres: "",
                    especialidad: "",
                    inicioRelevo: this.today.toISOString().split("T")[0],
                    finRelevo: "",
                    base: "",
                    turno: "",
                    franco: "",
                    HNA: true,
                }
            this.novedad.remplazo !== undefined ?
                this.novedad.remplazo.push(remplazo) :
                this.novedad.remplazo = [remplazo];
            
        },
        calcularDiasNovedad(esFecha: boolean) {
            if (this.cantDias < 1) {
                this.cantDias = 1;
                return;
            }
            try {
                if (esFecha) {
                    const fecha1: Date = new Date(this.novedad.fechaBaja);
                    const fecha2: Date = new Date(this.novedad.fechaAlta);

                    // Calcula la diferencia en miliSegundos entre las dos fechas
                    const diferenciaEnMiliSegundos =
                        fecha2.getTime() - fecha1.getTime();

                    // Convierte la diferencia de miliSegundos a días
                    const diferenciaEnDias =
                        diferenciaEnMiliSegundos / (1000 * 60 * 60 * 24);

                    this.cantDias = diferenciaEnDias + 1;
                } else {
                    const newFechaAlta = new Date(this.novedad.fechaBaja);
                    newFechaAlta.setDate(
                        newFechaAlta.getDate() + this.cantDias - 1
                    );
                    this.novedad.fechaAlta = newFechaAlta
                        .toISOString()
                        .split("T")[0];
                }
                this.validaPersonalConNovedadActiva(this.novedad.legajo)

            } catch (error) {
                console.error(error)
            }
            
        },
        /* Este método cuando se hace click en el modal desplegado toma el item y asigna el novedad.legajo y
        llama a el método de búsqueda por legajo  */
        selectPersonal(personal: IPersonal) {
            if (this.selectRemplazo) {
                this.agregarRemplazo();
                // this.novedad.remplazo[this.novedad.remplazo.length - 1].legajo = personal.legajo;
                this.asignarRelevoPorLegajo(personal.legajo,this.novedad.remplazo.length - 1);
            } else {
                this.novedad.legajo = personal.legajo;
                this.searchPersonalPorLegajo();
            }

            this.search = "";
            this.cerrarModal();
        },
        abrirModal(selectRemplazo: boolean) {
            // Con este método abro el modal poniendo el focus en el input de búsqueda y asigno valor booleano
            // a la variable selectRemplazo la cual hace de bypass entre buscar personal de la novedad o al remplazo
            this.mostrarModalSearch = true;
            this.$nextTick(() => {
                if (this.$refs.inputSearch) {
                    (this.$refs.inputSearch as HTMLInputElement).focus();
                }
            });
            this.selectRemplazo = selectRemplazo;
        },
        cerrarModal() {
            this.mostrarModalSearch = false;
            this.search = "";
        },
        searchPersonal(soloCiclo: boolean) {
            /* Este método funciona dentro del modal, al escribir dentro del input filtra por
        nombre y apellido el personal */
            this.personalEncontrado = this.personales.filter(
                (personal: IPersonal) => {
                    if (soloCiclo) {
                        return (
                            //el remplazo debe ser personal de ciclo y de la misma base
                            //1 que apellido o nombre coincida
                            (personal.apellido.toLowerCase()+" "+personal.nombres.toLowerCase()
                            ).includes(this.search.toLowerCase()) &&
                            //2 que sea personal de ciclo
                            personal.turno.toLowerCase().includes("ciclo") &&
                            //3 que sea de la misma base
                            personal.dotacion.toUpperCase()
                                .includes(this.novedad.base.toUpperCase()) &&
                            //4  
                            //A) si es conductor también puede ser Ayudante habilitado
                            //B) sino que sea de la misma especialidad
                            (this.novedad.especialidad.toLowerCase().includes("conductor")
                                ? personal.especialidad.toLowerCase().includes("conductor") ||
                                    personal.especialidad.toLowerCase().includes(
                                        "ayudante habilitado"
                                    )
                                : personal.especialidad.toLowerCase() == this.novedad.especialidad.toLowerCase())
                        );
                        
                    } else {
                        
                        return (
                            personal.apellido.toLowerCase() +
                            " " +
                            personal.nombres.toLowerCase()
                        ).includes(this.search.toLowerCase());
                    }
                }
            );
        },
        searchPersonalPorLegajo() {
            /*  realiza la búsqueda por el legajo introducido en el respectivo input */
            this.message.message = "";
            this.message.status = "";
            this.message.activo = false;
            const personalEncontrado = this.personales.find((personal: IPersonal) => {
                    return personal.legajo == this.novedad.legajo;
                }
            );
            if (personalEncontrado) {
                this.validaPersonalConNovedadActiva(personalEncontrado.legajo);
                this.novedad.apellido = personalEncontrado.apellido;
                this.novedad.nombres = personalEncontrado.nombres;
                this.novedad.base = personalEncontrado.dotacion;
                this.novedad.especialidad = personalEncontrado.especialidad;
                this.novedad.turno = personalEncontrado.turno;
                this.novedad.franco = this.days[personalEncontrado.franco];
                this.novedad.fechaBaja = this.novedad.fechaBaja || this.today.toISOString().split("T")[0];
            }else{
                this.novedad.apellido = '';
                this.novedad.nombres = '';
                this.novedad.base = '';
                this.novedad.especialidad = '';
                this.novedad.turno = '';
                this.novedad.franco = '';
                // this.novedad.fechaBaja = '';
            }
        },
        asignarRelevoPorLegajo(legajo: number|null, index: number) {
            // al haber un cambio en el formulario remplazo.legajo se agregan el resto de los datos
            const personalEncontrado = this.personales.find((personal: IPersonal) => {
                    return personal.legajo == legajo;
            });
            if (personalEncontrado?.legajo === this.novedad.legajo){
                this.activarAlerta(
                        true,
                        "Personal repetido",
                        `El personal ${personalEncontrado.apellido} ${personalEncontrado.nombres} es el titular de esta novedad, por ello no puede ser asignado como relevo.`,
                        "danger"
                    )
                return
            }
            if (personalEncontrado) {
                this.validaPersonalConNovedadActiva(personalEncontrado.legajo,index);
                
                this.novedad.remplazo[index].legajo = personalEncontrado.legajo;
                this.novedad.remplazo[index].apellido = personalEncontrado.apellido;
                this.novedad.remplazo[index].nombres = personalEncontrado.nombres;
                this.novedad.remplazo[index].especialidad = personalEncontrado.especialidad;
                this.novedad.remplazo[index].base = personalEncontrado.dotacion;
                this.novedad.remplazo[index].turno = personalEncontrado.turno;
            } else {
                this.novedad.remplazo[index].apellido = "";
                this.novedad.remplazo[index].nombres = "";
                this.novedad.remplazo[index].especialidad = "";
                this.novedad.remplazo[index].base = "";
                this.novedad.remplazo[index].turno = "";
            }
        },
    },
    async mounted() {
        try {
            await this.loadPersonales();
            
            if (this.$route.params.id && typeof this.$route.params.id === "string" && this.$route.params.id !== 'undefined') {
                this.titulo = "Editar novedad"
                this.idParam = parseInt(this.$route.params.id)
                await this.loadNovedad(this.idParam);
                !this.novedad.HNA ? this.calcularDiasNovedad(true) : ""
            }else{
                this.titulo = "Cargar nueva novedad"                
                if(this.$route.params.legajo !== '' && this.$route.params.legajo !== 'undefined' && typeof this.$route.params.legajo === "string"){
                    this.novedad.legajo = parseInt(this.$route.params.legajo);                    
                    this.searchPersonalPorLegajo()
                    const tipoNovedadSelect = document.getElementById("tipoNovedad") as HTMLElement;
                    tipoNovedadSelect.focus();
                }
                await this.obtenerUltimoId();
                this.novedad.fechaBaja = new Date().toISOString().split("T")[0]
                this.novedad.HNA = true;
            }
            this.loadNovedades();
            // Obtener todos los elementos enfocados
            
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    components: {},
});
</script>
<style>
main {
    margin-top: 5rem;
    /* margin-left: 300px; */
}
h1 {
    display: flex;
    justify-content: center;
}
form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 250px;
    width: 75%;
}
.btn-buscar-personal{
    margin-left: 250px;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.row {
    margin-left: 0px;
}
</style>
