<template>
    <main>
        <h1>Cambio de turno</h1>
        <div
            class="alert row justify-content-center"
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
            <h4 class="alert-heading d-flex justify-content-center">{{ message.title }}</h4>
            <hr />
            {{ message.message }}
            <!-- <a
                    v-if="idNovedad !== 0"
                    class="btn btn-danger col-2"
                    @click="$router.push(`/editNovedades/${idNovedad}`)"
                    >Ir a la novedad</a
                > -->
        </div>
        <!-- Modal de búsqueda -->

        <div>
            <div class="modal" :class="{ 'd-block': mostrarModalSearch }"  @click.self="cerrarModal">
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
                                @keyup="
                                    searchPersonal(
                                        selectRemplazo,
                                        cambioTurno.personal[0].base,
                                        cambioTurno.personal[0].especialidad
                                    )
                                "
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
        <!-- Formulario -->
        <form @submit.prevent="saveNovedad()" @keydown.enter.prevent="moverAlSiguienteElemento($event)">
            <div class="justify-content-between row">
                <div class="col-3">
                    <label for="fechaBaja"></label>
                    Fecha del cambio
                    <input
                        required
                        class="form-control mb-3"
                        type="Date"
                        name="fechaBaja"
                        v-model="cambioTurno.fechaCambio"
                        @change="actualizarTurnos()"
                    />
                </div>
            </div>
            <div>
                <button
                    class="btn btn-success"
                    @click.prevent="abrirModal(false)"
                >
                    Buscar Personal
                </button>
            </div>
            <div class="row">
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
                        @change="buscarPersonalPorLegajo(0)"
                        v-model="cambioTurno.personal[0].legajo"
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
                        v-model="cambioTurno.personal[0].apellido"
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
                        v-model="cambioTurno.personal[0].nombres"
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
                        v-model="cambioTurno.personal[0].base"
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
                        v-model="cambioTurno.personal[0].especialidad"
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
                        v-model="cambioTurno.personal[0].turno"
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
                        v-model="cambioTurno.personal[0].franco"
                        disabled
                    />
                </div>
            </div>
            <div class="justify-content-between row">
                <label class="col-2">
                    Turno Efectivo
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base"
                        v-model="cambioTurno.personal[0].turnoEfectivo"
                        disabled
                    />
                </label>
                <label class="col-2">
                    Toma
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base"
                        v-model="cambioTurno.personal[0].tomada"
                        disabled
                    />
                </label>
                <label class="col-2">
                    Deja
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base"
                        v-model="cambioTurno.personal[0].dejada"
                        disabled
                    />
                </label>
            </div>
            <div>
                <button
                    class="btn btn-success"
                    @click.prevent="abrirModal(true)"
                >
                    Buscar Remplazo
                </button>
            </div>
            <!-- Tabla remplazo -->
            <div class="row">
                <div class="col-2">
                    <label for="legajo2"></label>
                    Legajo
                    <input
                        class="form-control mb-3"
                        placeholder="Ingrese Legajo"
                        type="number"
                        name="legajo2"
                        autofocus
                        required
                        @change="buscarPersonalPorLegajo(1)"
                        v-model="cambioTurno.personal[1].legajo"
                    />
                </div>
                <div class="col-3">
                    <label for="Apellido2"></label>
                    Apellido
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="apellido2"
                        v-model="cambioTurno.personal[1].apellido"
                        disabled
                    />
                </div>
                <div class="col-4">
                    <label for="nombres2"></label>
                    Nombre
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="nombres2"
                        v-model="cambioTurno.personal[1].nombres"
                        disabled
                    />
                </div>
            </div>
            <div class="justify-content-between row">
                <div class="col-1">
                    <label for="base2"></label>
                    Base
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base2"
                        v-model="cambioTurno.personal[1].base"
                        disabled
                    />
                </div>
                <div class="col-3">
                    <label for="especialidad2"></label>
                    Especialidad
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="especialidad2"
                        v-model="cambioTurno.personal[1].especialidad"
                        disabled
                    />
                </div>
                <div class="col-2">
                    <label for="turno2"></label>
                    Turno
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="turno2"
                        v-model="cambioTurno.personal[1].turno"
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
                        name="franco2"
                        v-model="cambioTurno.personal[1].franco"
                        disabled
                    />
                </div>
            <div class="justify-content-between row">
                <label class="col-2">
                    Turno Efectivo
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="turnoEfectivo"
                        v-model="cambioTurno.personal[1].turnoEfectivo"
                        disabled
                    />
                </label>
                <label class="col-2">
                    Toma
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="toma2"
                        v-model="cambioTurno.personal[1].tomada"
                        disabled
                    />
                </label>
                <label class="col-2">
                    Deja
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="deja2"
                        v-model="cambioTurno.personal[1].dejada"
                        disabled
                    />
                </label>
            </div>
            </div>
            <div>
                <button class="btn btn-primary col-1 m-2">Guardar</button>
                <button class="btn btn-secondary col-1 m-2" @click="$router.push('/cambioTurno')">Cerrar</button>
            </div>
        </form>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CambioTurno } from "../../interfaces/ICambioTurno";
import {
    createCambioTurno,
    getCambioTurnos,
    getUltimoCambioTurno,
} from "../../services/cambioTurnoService";
import { getPersonales } from "../../services/personalService";
import { IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";
import { ITurno } from "../../interfaces/ITurno";
import { loadTarjetaPersonalSinDiagramaPorLegajoYMes, loadTurnos } from '../../utils/funciones';
import { dia_laboral } from "../../utils/personal";
import { filtrarPorTurno } from "../../utils/turnos";
import { itinerarioType, diaPosterior, obtenerNumeroDia, hayMenosDe10HorasEntreJornadas } from '../../utils/fechas';
import { defaultPersonal, defaultTarjetaPersonalSinDiagrama } from "../../utils/interfacesDefault";
import { ITarjetaPersonalSinDiagrama } from "../../interfaces/ITarjetaPersonalSinDiagrama";

export default defineComponent({
    data() {
        return {
            today: new Date(),
            lstTurnos: [] as ITurno[],
            cambiosTurnos: [] as CambioTurno[],
            personales: [] as IPersonal[],
            personalEncontrado: [] as IPersonal[],

            cambioTurno: {
                fechaCambio: "",
                personal: [
                    {
                        legajo: null,
                        apellido: "",
                        nombres: "",
                        base: "",
                        especialidad: "",
                        turno: "",
                        franco: "",
                    },
                    {
                        legajo: null,
                        apellido: "",
                        nombres: "",
                        base: "",
                        especialidad: "",
                        turno: "",
                        franco: "",
                    },
                ],
            } as CambioTurno,

            ultimoId: 0,
            idNovedad: 0,

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
            mostrarModalSearch: false,
            cicloRelevando: false,
            message: {
                activo: false,
                status: "",
                title: "",
                message: "",
            },
            tarjetaPersonalSinDiagrama: defaultTarjetaPersonalSinDiagrama() as ITarjetaPersonalSinDiagrama  

        };
    },
    methods: {
        // Conexión con la API
        async obtenerUltimoId() {
            /* Este método obtiene a traves de una consulta HTML:GET el ultimo
            Id de los documentos guardados con el fin de asignarle a la nueva novedad el id proximo */
            const res = await getUltimoCambioTurno();
            this.ultimoId = res.data.length > 0 ? res.data[0]._id : 0;
        },
        async loadCambioTurnos() {
            const res = await getCambioTurnos();
            this.cambiosTurnos = res.data;
        },
        async loadPersonales() {
            /* Este método trae la lista de todos los personales */
            const res = await getPersonales();
            this.personales = res.data;
        },
        async saveNovedad() {
            /* Método utilizado para realizar la consulta HTML:POST al backend para el guardado de los datos */
            this.ultimoId++;
            this.cambioTurno._id = this.ultimoId;
            this.cambioTurno.fecha = this.today.toLocaleString();

            if(this.message.activo && this.message.status === "danger"){
                alert("Hay un conflicto para cargar este cambio de turno. Por favor verifique los datos");
                return
            }else if(this.message.activo && this.message.status === "warning"){
                if( !confirm("Hay un conflicto con la jornada de este cambio de turno. ¿Desea continuar de todas formas?")) return
            }

            if (
                this.mismoPersonal(this.cambioTurno) ||
                this.faltaPersonal(this.cambioTurno) ||
                this.tieneCambioCargado(this.cambioTurno)
            ) {
                if(this.message.activo){
                    this.message.message = "Ocurrió un problema con la validación. Si el error persiste, Contacte al administrador con capturas de pantalla del error."
                    this.message.status = 'danger'
                    this.idNovedad = 0;
                }
                return;
            }
            try {
                // Crear la novedad
                await createCambioTurno(this.cambioTurno);

                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "Creo cambio turno",
                };
                await createRegistro(registro);

                // Redireccionar
                this.$router.push({ name: "cambioTurno" });
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
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

        // Validaciones:
        esFechaMayor(dateMayor: string, dateMenor: string) {
            if (dateMayor && dateMenor) {
                const formattedDateMayor = new Date(dateMayor)
                    .toISOString()
                    .split("T")[0];
                const formattedDateMenor = new Date(dateMenor)
                    .toISOString()
                    .split("T")[0];
                return formattedDateMayor > formattedDateMenor;
            } else {
                return false;
            }
        },
        esFechaMayorIgual(dateMayor: string, dateMenor: string) {
            if (dateMayor && dateMenor) {
                const formattedDateMayor = new Date(dateMayor)
                    .toISOString()
                    .split("T")[0];
                const formattedDateMenor = new Date(dateMenor)
                    .toISOString()
                    .split("T")[0];
                return formattedDateMayor >= formattedDateMenor;
            } else {
                return false;
            }
        },
        esFechaIgual(dateMayor: string, dateMenor: string) {
            if (dateMayor && dateMenor) {
                const formattedDateMayor = new Date(dateMayor)
                    .toISOString()
                    .split("T")[0];
                const formattedDateMenor = new Date(dateMenor)
                    .toISOString()
                    .split("T")[0];
                return formattedDateMayor === formattedDateMenor;
            } else {
                return false;
            }
        },
        tieneCambioCargado(cambio: CambioTurno) {
            let res = false;
            let num = -1;
            const [repetido] = this.cambiosTurnos.filter((cambioTurno) => {
                return (
                    this.esFechaIgual(
                        cambioTurno.fechaCambio,
                        cambio.fechaCambio
                    ) &&
                    (cambioTurno.personal[0].legajo ===
                        cambio.personal[0].legajo ||
                        cambioTurno.personal[0].legajo ===
                            cambio.personal[1].legajo ||
                        cambioTurno.personal[1].legajo ===
                            cambio.personal[0].legajo ||
                        cambioTurno.personal[1].legajo ===
                            cambio.personal[1].legajo)
                );
            });
            if (repetido !== undefined) {
                if (
                    repetido.personal[0].legajo === cambio.personal[0].legajo ||
                    repetido.personal[0].legajo === cambio.personal[1].legajo
                ) {
                    num = 0;
                } else if (
                    repetido.personal[0].legajo === cambio.personal[0].legajo ||
                    repetido.personal[0].legajo === cambio.personal[1].legajo
                ) {
                    num = 1;
                }
            }
            if (repetido) {
                res = true;
                this.message.activo = true;
                this.message.title = "Personal con cambio de turno asignado";
                this.message.message = `El personal ${
                    repetido.personal[num].apellido +
                    " " +
                    repetido.personal[num].nombres
                } 
                    ya tiene cargado un cambio de turno para la fecha asignada. Con el consecutivo N* ${
                        repetido._id
                    }. Finalicé para continuar `;
                this.message.status = "danger";
            }
            return res;
        },
        mismoPersonal(cambio: CambioTurno): boolean {
            let res = false;
            if (cambio.personal[0].legajo === cambio.personal[1].legajo) {
                res = true;
                this.message.activo = true;
                this.message.title = "Personal repetido";
                this.message.message =
                    "No se puede cargar un cambio de turno con el mismo personal";
                this.message.status = "danger";
            }
            return res;
        },
        faltaPersonal(cambio: CambioTurno): boolean {
            let res = false;
            if (
                cambio.personal[0].apellido == "" ||
                cambio.personal[1].apellido == ""
            ) {
                res = true;
                this.message.activo = true;
                this.message.title = "Falta Personal";
                this.message.message =
                    "Tiene que estar ambos personales para realizar un cambio de turno";
                this.message.status = "danger";
                console.log(
                    cambio.personal[0].apellido,
                    cambio.personal[1].apellido
                );
                console.log(
                    cambio.personal[0].apellido == "" ||
                        cambio.personal[1].apellido == ""
                );
            }
            return res;
        },

        /* Este método cuando se hace click en el modal desplegado toma el item y asigna el novedad.legajo y
        llama a el método de búsqueda por legajo  */
        selectPersonal(personal: IPersonal) {
            if (this.selectRemplazo) {
                this.cambioTurno.personal[1].legajo = personal.legajo;
                this.buscarPersonalPorLegajo(1);
            } else {
                this.cambioTurno.personal[0].legajo = personal.legajo;
                this.buscarPersonalPorLegajo(0);
            }

            this.search = "";
            this.cerrarModal();
            // this.searchPersonalPorLegajo();
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
        searchPersonal(soloCiclo: boolean, base: string, especialidad: string) {
            /* Este método funciona dentro del modal, al escribir dentro del input filtra por
        nombre y apellido el personal */
            this.personalEncontrado = this.personales.filter(
                (personal: IPersonal) => {
                    if (!soloCiclo) {
                        return (
                            personal.apellido.toLowerCase() +
                            " " +
                            personal.nombres.toLowerCase()
                        ).includes(this.search.toLowerCase());
                    } else {
                        //el remplazo debe ser personal de ciclo y de la misma base
                        return (
                            (
                                personal.apellido.toLowerCase() +
                                " " +
                                personal.nombres.toLowerCase()
                            ).includes(this.search.toLowerCase()) &&
                            personal.dotacion
                                .toUpperCase()
                                .includes(base.toUpperCase()) &&
                            (especialidad.includes("Conductor")
                                ? personal.especialidad.includes("Conductor") ||
                                  personal.especialidad.includes(
                                      "Ayudante habilitado"
                                  )
                                : personal.especialidad == especialidad)
                        );
                    }
                }
            );
        },
        actualizarTurnos(){
            this.buscarPersonalPorLegajo(0)
            this.buscarPersonalPorLegajo(1)
        },
        async buscarPersonalPorLegajo(index:number) {
            /*  realiza la búsqueda por el legajo introducido en el respectivo input */
            this.message.title = "";
            this.message.message = "";
            this.message.status = "";
            this.message.activo = false;
            let personalEncontrado: IPersonal 
            let turno: ITurno;
            
            if (!this.cambioTurno.personal[index].legajo) {
                return
            }
            if (!this.cambioTurno.fechaCambio) {
                this.cambioTurno.fechaCambio = diaPosterior(this.today.toISOString().split("T")[0]);
            }
            const fecha = new Date(this.cambioTurno.fechaCambio+ "T12:00")
            const itinerario: string = itinerarioType(fecha);

            personalEncontrado = this.personales.find((personal: IPersonal) => personal.legajo == this.cambioTurno.personal[index].legajo) ?? defaultPersonal();
            let turnoEfec = personalEncontrado.turno
            let jornada = dia_laboral(personalEncontrado.franco, fecha.getDay());

            if (personalEncontrado) {
                // this.validaPersonalConNovedadActiva(this.personalEncontrado[0]);
                this.cambioTurno.personal[index].apellido = personalEncontrado.apellido;
                this.cambioTurno.personal[index].nombres = personalEncontrado.nombres;
                this.cambioTurno.personal[index].base = personalEncontrado.dotacion;
                this.cambioTurno.personal[index].especialidad = personalEncontrado.especialidad;
                this.cambioTurno.personal[index].turno = personalEncontrado.turno;
                this.cambioTurno.personal[index].franco = this.days[personalEncontrado.franco];
            }

            if(personalEncontrado?.turno.toLowerCase().includes('ciclo')){
                //TODO cuando se desarrolle servicio irregular
                const [year, month] = this.cambioTurno.fechaCambio.split("-")
                const selectedMonth = year + '-' + month
                this.tarjetaPersonalSinDiagrama =  await loadTarjetaPersonalSinDiagramaPorLegajoYMes(personalEncontrado.legajo ,selectedMonth) || defaultTarjetaPersonalSinDiagrama();
                if (this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].tren === "Orden"){
                    this.cambioTurno.personal[index].turnoEfectivo = "Orden"
                    this.cambioTurno.personal[index].tomada = this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].tomo
                    this.cambioTurno.personal[index].dejada = this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].dejo
                    return
                }else if(this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].tomo === "DH"){
                    // alert(`El personal ${personalEncontrado.apellido} ${personalEncontrado.nombres} es de servicio Irregular y tiene asignado un DH para la fecha seleccionada`)
                    this.message.title = "Personal de franco";
                    this.message.message = `${personalEncontrado.apellido} ${personalEncontrado.nombres} se encuentra de franco para la fecha seleccionada.`;
                    this.message.status = "danger";
                    this.message.activo = true;
                    this.cambioTurno.personal[index].turnoEfectivo = ""
                    this.cambioTurno.personal[index].tomada = ''
                    this.cambioTurno.personal[index].dejada = ''
                    return
                }else if(this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].tren === ""){
                    // alert(`El personal ${personalEncontrado.apellido} ${personalEncontrado.nombres} es de servicio Irregular y aun no tiene cargado el servicio para la fecha seleccionada`)
                    this.message.title = "Personal sin servicio asignado";
                    this.message.message = `${personalEncontrado.apellido} ${personalEncontrado.nombres} aun no tiene cargado el servicio para la fecha seleccionada.`;
                    this.message.status = "danger";
                    this.message.activo = true;
                    this.cambioTurno.personal[index].turnoEfectivo = ""
                    this.cambioTurno.personal[index].tomada = ''
                    this.cambioTurno.personal[index].dejada = ''
                    return
                }else if (this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].deBaja){
                    this.message.title = "Personal de baja por novedad";
                    this.message.message = `${personalEncontrado.apellido} ${personalEncontrado.nombres} se encuentra de baja por 
                    la novedad ${this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].nroNovedad}. No se puede cargar la novedad hasta que no se de el alta a la novedad.`;
                    this.message.status = "danger";
                    this.message.activo = true;
                    this.cambioTurno.personal[index].turnoEfectivo = ""
                    this.cambioTurno.personal[index].tomada = ''
                    this.cambioTurno.personal[index].dejada = ''
                    return
                }else if (this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].relevando){
                    turnoEfec = this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].tren
                    const francoNum = obtenerNumeroDia(this.tarjetaPersonalSinDiagrama.days[this.cambioTurno.fechaCambio].franco)
                    jornada = dia_laboral(francoNum, fecha.getDay());
                }
            }
            console.warn("TODO: provisorio ['Jul24']");
            const turnos: ITurno[] = filtrarPorTurno(
                itinerario,
                this.lstTurnos,
                ["Jul24"],// provisorio
                turnoEfec
            );
            
            if(jornada === 0){
                this.message.title = "Personal de franco";
                this.message.message = `${personalEncontrado.apellido} ${personalEncontrado.nombres} se encuentra de franco para la fecha seleccionada.`;
                this.message.status = "danger";
                this.message.activo = true;
                return
            }
            
            turno = turnos[0];
            if (turnos.length > 1) {
                turno = turnos.find( (turno: ITurno) => turno.turno === `${turnoEfec}.${jornada}`) || turno;
            }

            this.cambioTurno.personal[index].turnoEfectivo = turno.turno;
            this.cambioTurno.personal[index].tomada = turno.toma;
            this.cambioTurno.personal[index].dejada = turno.deja;
            if(this.cambioTurno.personal[0].tomada && this.cambioTurno.personal[1].tomada){
                const noLeDaElDescanso =hayMenosDe10HorasEntreJornadas(
                    this.cambioTurno.personal[0].tomada,
                    this.cambioTurno.personal[0].dejada,
                    this.cambioTurno.personal[1].tomada,
                    this.cambioTurno.personal[1].dejada
                )
                if(noLeDaElDescanso) {
                    this.message.title = "El descanso es insuficiente!";
                    this.message.message = `No alcanzan las horas de descanso entre ambos personales. Por favor revise las jornadas.`;
                    this.message.status = "warning";
                    this.message.activo = true;
                }
            }
        },
    },
    async mounted() {
        try {
            
            this.obtenerUltimoId();
            this.loadPersonales();
            this.loadCambioTurnos();
            this.lstTurnos = await loadTurnos() || [];
            // this.novedad.HNA = true;
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
.row {
    margin-left: 0px;
}
</style>
