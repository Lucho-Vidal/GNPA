<template>
    <main>
        <h1 >{{ 
            ordenamiento.tipo === 'ordenamiento' ?
                'Ordenamiento' :
            ordenamiento.tipo === 'informe' ?
                'Informe' :
            ordenamiento.tipo === 'cancelacionDiagrama' ?
                'Cancelación Diagrama': ''
            }}
        </h1>
        <div class="container d-flex">
            <div
            class="justify-content-center alert row "
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
                <!-- <a
                    v-if="idNovedad !== 0"
                    class="btn btn-danger col-2"
                    @click="$router.push(`/editNovedades/${idNovedad}`)"
                    >Ir a la novedad</a
                > -->
            </div>
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
                                @keyup="searchPersonal()"
                            />

                            <div class="table-container">
                                <table
                                    class="table table-hover"
                                    v-if="search"
                                >
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
                                            v-for="(
                                                personal, index
                                            ) in personales"
                                            :key="index"
                                            @click="
                                                selectPersonal(personal)
                                            "
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
            <div class="col-3 btn-buscar-personal" >
                <label for="tipoNovedad">Tipo de Novedad 
                    <select
                        name="tipoNovedad"
                        id="tipoNovedad"
                        class="form-control mb-3 w-100"
                        required
                        v-model="ordenamiento.tipo"
                    >
                        <option value="ordenamiento" selected>Ordenamiento</option>
                        <option value="informe">Informe</option>
                        <option value="cancelacionDiagrama">Cancelación Diagrama</option>
                    </select>
                </label>
            </div>
        </div>
        <div class=" btn-buscar-personal">
            <button
                class="btn btn-success "
                @click.prevent="abrirModal(false)"
            >
                Buscar Personal
            </button>
        </div>
        <!-- Formulario -->
        <form @submit.prevent="saveNovedad()" @keydown.enter.prevent="" >
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
                        v-model="ordenamiento.personal.legajo"
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
                        v-model="ordenamiento.personal.apellido"
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
                        v-model="ordenamiento.personal.nombres"
                        disabled
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-1">
                    <label for="base"></label>
                    Base
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="base"
                        v-model="ordenamiento.personal.dotacion"
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
                        v-model="ordenamiento.personal.especialidad"
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
                        v-model="ordenamiento.personal.turno"
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
                        v-model="days[ordenamiento.personal.franco]"
                        disabled
                    />
                </div>
            </div>
            
            <div class="row" v-if="ordenamiento.tipo === 'informe'">
                <div class="col">
                    <label for="detalle"></label>
                    Detalle
                    <textarea
                        class="form-control mb-3"
                        name="detalle"
                    ></textarea>
                </div>
            </div>

            <table v-if="ordenamiento.tipo === 'ordenamiento'||ordenamiento.tipo === 'cancelacionDiagrama'">
                <thead>
                    <tr>
                        <th>tren</th>
                        <th>Desde</th>
                        <th>Sale</th>
                        <th>Hasta</th>
                        <th>Llega</th>
                        <th>Borrar</th>
                        <th class="col-1 px-5">
                            <i class="material-icons cursor-hand verde"
                            @click="agregarTren()" >person_add</i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(tren, index) in ordenamiento.turno.vueltas"
                        :key="index"
                    >
                        <td>
                            <input
                                type="number"
                                class="form-control mb-3"
                                name="tren"
                                v-model="tren.tren"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control mb-3"
                                name="desde"
                                v-model="tren.origen"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control mb-3"
                                name="sale"
                                v-model="tren.sale"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control mb-3"
                                name="llega"
                                v-model="tren.llega"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control mb-3"
                                name="hasta"
                                v-model="tren.destino"
                            />
                        </td>
                        <td>    
                            <i class="material-icons cursor-hand rojo"
                                @click="ordenamiento.turno.vueltas.splice(index, 1)"
                            >clear</i>
                            
                        </td>
                    </tr>
                    
                </tbody>
            </table>
            <div>
                <button class="btn btn-primary col-1 m-2">Guardar</button>
                <button
                    class="btn btn-secondary col-1 m-2"
                    @click="$router.push('/ordenamiento')"
                >
                    Cerrar
                </button>
            </div>
            
        </form>
        <div v-if="esDiagramado && !turnosEncontrado.ordenes" class="container mt-5">
            <h5>El personal es diagramado, deberá cargar una cancelacion de diagrama para ordenarlo. Cargue los trenes que no va a correr</h5>
        
            <!-- <table  class="table table-striped table-hover">
                <thead v-if="turnosEncontrado" class="">
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
                        v-for="(vuelta, index) in turnosEncontrado.vueltas"
                        :key="index"
                    >
                        <td class="col-3">{{ vuelta.vuelta }}</td>
                        <td class="col-1">{{ vuelta.refer }}</td>
                        <td class="col-1">{{ vuelta.tren }}</td>
                        <td class="col-1">{{ vuelta.origen }}</td>
                        <td class="col-1">{{ vuelta.sale }}</td>
                        <td class="col-1">{{ vuelta.destino }}</td>
                        <td class="col-1">{{ vuelta.llega }}</td>
                        <td class="col-3">
                            {{ vuelta.observaciones }}
                        </td>
                    </tr>
                </tbody>
            </table> -->
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { guardarRegistro, itinerarioType, loadPersonales, loadTurnos } from '../../utils/funciones';
import { Ordenamiento } from "../../interfaces/IOrdenamientos";
import { Itinerario } from "../../interfaces/Itinerario";
import { createOrdenamiento } from '../../services/ordenamientoService';
import { ITurno } from '../../interfaces/ITurno';
import { dia_laboral } from "../../utils/personal";
import { defaultTurnos } from "../../utils/interfacesDefault";

export default defineComponent({
    data() {
        return {
            today: new Date(),
            personales: [] as IPersonal[],
            personalEncontrado: {} as IPersonal,
            turnos:[] as ITurno[],
            turnosEncontrado:{} as ITurno,
            ordenamiento: {
                _id:'',
                fecha: '',
                tipo: 'ordenamiento',
                personal: {
                    _id: '',
                    legajo: 0,
                    apellido: '',
                    nombres: '',
                    turno: '',
                    franco: 7,
                    especialidad: '',
                    dotacion: '',
                    observaciones: '',
                    orden: 0,
                    conocimientos: {
                        CML: false,
                        CKD: false,
                        RO: false,
                        MPN: false,
                        OL: false,
                        LCI: false,
                        ELEC: false,
                        DUAL: false
                    },
                    viewDetail: false
                },
                turno: {},
                detalle: ''
            } as Ordenamiento,
            itinerario: [] as Itinerario[],
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
            message: {
                activo: false,
                status: "",
                title: "",
                message: "",
            },
            esDiagramado:false,
        };
    },
    methods: {
        // Conexión con la API

        async saveNovedad() {
            // if (this.mismoPersonal(this.cambioTurno) || this.faltaPersonal(this.cambioTurno) || this.tieneCambioCargado(this.cambioTurno)) {
            //     // if(this.message.activo){
            //     //     this.message.message = "Ocurrió un problema con la validación. Si el error persiste, Contacte al administrador con capturas de pantalla del error."
            //     //     this.message.status = 'danger'
            //     //     this.idNovedad = 0;
            //     // }
            //     return;
            // }
            try {
                // Crear la novedad
                await createOrdenamiento(this.ordenamiento);

                // guardamos registro
                guardarRegistro(this.today, "Ordenamiento");

                // Redireccionar
                this.$router.push({ name: "ordenamiento" });
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
        /* Este método cuando se hace click en el modal desplegado toma el item y asigna el novedad.legajo y
        llama a el método de búsqueda por legajo  */
        selectPersonal(personal: IPersonal) {
            this.ordenamiento.personal.legajo = personal.legajo;
            this.search = "";
            this.cerrarModal();
            this.searchPersonalPorLegajo();
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
        searchPersonal() {
            /* Este método funciona dentro del modal, al escribir dentro del input filtra por
        nombre y apellido el personal */
            [this.personalEncontrado] = this.personales.filter(
                (personal: IPersonal) => {
                    return (
                        personal.apellido.toLowerCase() +
                        " " +
                        personal.nombres.toLowerCase()
                    ).includes(this.search.toLowerCase());
                }
            );
        },
        searchPersonalPorLegajo() {
            /*  realiza la búsqueda por el legajo introducido en el respectivo input */
            this.message.message = "";
            this.message.status = "";
            this.message.activo = false;
            [this.personalEncontrado] = this.personales.filter(
                (personal: IPersonal) => {
                    return (
                        personal.legajo == this.ordenamiento.personal.legajo
                    );
                }
            );
            if (this.personalEncontrado) {
                // this.validaPersonalConNovedadActiva(this.personalEncontrado[0]);
                this.ordenamiento.personal.apellido = this.personalEncontrado.apellido;
                this.ordenamiento.personal.nombres = this.personalEncontrado.nombres;
                this.ordenamiento.personal.dotacion = this.personalEncontrado.dotacion;
                this.ordenamiento.personal.especialidad = this.personalEncontrado.especialidad;
                this.ordenamiento.personal.turno = this.personalEncontrado.turno;
                this.ordenamiento.personal.franco = this.personalEncontrado.franco;
                this.ordenamiento.fecha = this.today.toISOString().split("T")[0];
            }
            this.turnosEncontrado = this.buscarTurno(this.personalEncontrado.turno,this.personalEncontrado.franco,this.today,this.turnos)
        },
        buscarTurno(turnoABuscar:string,franco:number,fecha:Date,turnos:ITurno[]){
            const diaLaboral = dia_laboral(franco,fecha.getDay());
            this.esDiagramado = false;
            let encontrados: ITurno = defaultTurnos();
            // let titular: IPersonal;
            // let diagrama: ITurno;
            let turnosEncontrados = turnos.filter((turno)=> turno.turno.includes(turnoABuscar));
            
            if(turnosEncontrados.length === 1){
                encontrados = turnosEncontrados[0]
            }else if(turnosEncontrados.length > 1){
                [encontrados] = turnosEncontrados.filter(turno => {
                    const indexPunto = turno.turno.indexOf(".");
                    const diaLab = Number(turno.turno[indexPunto + 1]);
                    return diaLab === diaLaboral &&
                        turno.itinerario === itinerarioType(this.today) &&
                        turno.circular === 'HD32' || turno.circular === 'Dic23'
                })
            }
            if(encontrados.vueltas.length > 0){
                this.esDiagramado = true
                this.ordenamiento.tipo = 'cancelacionDiagrama'
            }
            this.ordenamiento.turno.vueltas = encontrados.vueltas
            return encontrados
        },
        agregarTren() {
            this.ordenamiento.turno.vueltas = [...this.ordenamiento.turno.vueltas,
                {
                    vuelta: 0,
                    tren: "",
                    refer:'',
                    origen:'',
                    sale:'',
                    destino:'',
                    llega:'',
                    observaciones:''
                }]
        },
    },
    async mounted() {
        try {
            this.personales = await loadPersonales() || [];
            this.turnos = await loadTurnos() || [];
            console.log(this.personalEncontrado);
            
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    components: {
    },
});
</script>
<style>
main {
    margin-top: 5rem;
}
h1 {
    display: flex;
    justify-content: center;
}
main{
    margin-left: 150px;
}
form {
    display: flex;
    justify-content: start;
    flex-direction: column;
    margin-left: 250px;
    width: 75%;
}
.btn-buscar-personal{
    margin-left: 250px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 50%;
}
</style>
