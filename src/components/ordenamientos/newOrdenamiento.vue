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
                                            v-for="(personal, index) in personalEncontrado"
                                            :key="index"
                                            @click="selectPersonal(personal)"
                                        >
                                            <td class="col-1">{{ personal.legajo }}</td>
                                            <td class="col-1">{{ personal.apellido }}</td>
                                            <td class="col-2">{{ personal.nombres }}</td>
                                            <td class="col-1">{{ personal.dotacion }}</td>
                                            <td class="col-1">{{ personal.turno }}</td>
                                            <td class="col-1">{{ days[personal.franco] }}</td>
                                            <td class="col-1">{{ personal.especialidad }}</td>
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
                <label for="tipoNovedad">Tipo de Orden 
                    <select
                        name="tipoNovedad"
                        id="tipoNovedad"
                        class="form-control mb-3 w-100"
                        required
                        v-model="ordenamiento.tipo"
                        @change="verificarSiNecesitaCancelacion"
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
                        @keyup.enter="searchPersonalPorLegajo()"
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
                    Turno Efectivo
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="franco"
                        v-model="ordenamiento.turnoEfectivo"
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
                <div class="col-2">
                    <label for="franco"></label>
                    Toma
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="franco"
                        v-model="ordenamiento.toma"
                        disabled
                    />
                </div>
                <div class="col-2">
                    <label for="franco"></label>
                    Deja
                    <input
                        class="form-control mb-3"
                        placeholder=""
                        type="text"
                        name="franco"
                        v-model="ordenamiento.deja"
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

            <table v-if="ordenamiento.tipo === 'cancelacionDiagrama'" class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ref</th>
                        <th>tren</th>
                        <th>Desde</th>
                        <th>Sale</th>
                        <th>Hasta</th>
                        <th>Llega</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody class="Small">
                    <tr v-for="(tren, index) in ordenamiento?.turno?.vueltas" :key="index">
                        <td>{{ tren.refer}}</td>
                        <td>{{ tren.tren}}</td>
                        <td>{{ tren.origen}}</td>
                        <td>{{ tren.sale }}</td>
                        <td>{{ tren.destino }}</td>
                        <td>{{ tren.llega }}</td>
                        <td>{{ tren.observaciones }}</td>
                    </tr>
                </tbody>
            </table>
            <table v-if="ordenamiento.tipo === 'ordenamiento'">
                <thead>
                    <tr>
                        <th>Referencia</th>
                        <th>tren</th>
                        <th>Desde</th>
                        <th>Sale</th>
                        <th>Hasta</th>
                        <th>Llega</th>
                        <th>Observaciones</th>
                        <th>Borrar</th>
                        <th class="col-1 px-5">
                            <i class="material-icons cursor-hand verde"
                            @click="agregarTren()" >person_add</i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(tren, index) in ordenamiento?.turno?.vueltas" :key="index"
                    >   
                        
                        <td>
                            <select
                                name="ref"
                                id="ref"
                                class="form-control"
                                v-model="tren.refer"
                                >
                                    <option >
                                        
                                    </option>
                                    <option >
                                        PS
                                    </option>
                                    <option >
                                        W
                                    </option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control"
                                @change="cargarEstaciones(tren.tren,index)"
                                name="tren"
                                v-model="tren.tren"
                            />
                        </td>
                        <td>
                            <select
                                name="dotacion"
                                id="dotacion"
                                @change="cargarHorario(tren.tren,tren.origen,index,true)"
                                class="form-control"
                                v-model="tren.origen"
                                >
                                    <option 
                                        v-for="(dotacion, i) in estacionesDelTren[index]" 
                                        :key="i" 
                                        :value="dotacion"
                                        >
                                        {{ dotacion }}
                                    </option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control "
                                name="sale"
                                v-model="tren.sale"
                            />
                        </td>
                        <td>
                            <select
                                name="dotacion"
                                id="dotacion"
                                @change="cargarHorario(tren.tren,tren.destino,index,false)"
                                class="form-control"
                                v-model="tren.destino"
                                >
                                    <option v-for="(dotacion, i) in estacionesDelTren[index]" :key="i" :value="dotacion">
                                        {{ dotacion }}
                                    </option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control "
                                name="llega"
                                v-model="tren.llega"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                class="form-control "
                                name="llega"
                                v-model="tren.observaciones"
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
                <button class="btn btn-secondary col-1 m-2" @click="goBack">Cerrar</button>
            </div>
            
        </form>
        <div v-if="esDiagramado && !ordenamiento.turno.ordenes" class="container mt-5">
            <h5>El personal es diagramado, deberá cargar una cancelacion de diagrama para ordenarlo. </h5>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AxiosError } from "axios";
import { IPersonal } from "../../interfaces/IPersonal";
import { Ordenamiento } from "../../interfaces/IOrdenamientos";
import { Itinerario } from "../../interfaces/Itinerario";
import { ITurno, TrenesDescubiertos } from '../../interfaces/ITurno';
import { createOrdenamiento } from '../../services/ordenamientoService';
import { newToken } from "../../services/signService";
import { guardarRegistro, loadItinerarios, loadOrdenamientos, loadPersonales, loadTarjetaPersonalSinDiagramaPorLegajoYMes, loadTurnos } from '../../utils/funciones';
import { dia_laboral } from "../../utils/personal";
import { itinerarioType, obtenerNumeroDia } from "../../utils/fechas";
import { defaultOrdenamiento, defaultTarjetaPersonalSinDiagrama, defaultTurnos } from "../../utils/interfacesDefault";
import { ITarjetaPersonalSinDiagrama } from "../../interfaces/ITarjetaPersonalSinDiagrama";

export default defineComponent({
    data() {
        return {
            today: new Date(),
            personales: [] as IPersonal[],
            personalAOrdenar: {} as IPersonal | undefined,
            personalEncontrado: [] as IPersonal[],
            personalSinDiagrama: {} as ITarjetaPersonalSinDiagrama,
            vuelta: null as TrenesDescubiertos | null, // Declara la variable para almacenar los datos

            turnos:[] as ITurno[],
            // turnosEncontrado:{} as ITurno,
            dotacionesPermitidas: [
                'PC','ALL','K5','KM5','RE','TY','BO','GW','AK','LLV','MG','ZZ','CÑ','MN','LB','QL','BZ','VE','OA','LP','CY','FV','BQ','JG'
            ] as string[],
            estacionesDelTren:[] as Array<string[]>,
            ordenamiento: defaultOrdenamiento() as Ordenamiento,
            ordenamientos: [] as Ordenamiento[],
            itinerario: [] as Itinerario[],
            itIndex: {} as Record<string,Itinerario>,
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
            this.ordenamiento.fecha = this.today.toLocaleString();
            if (this.message.activo){
                return
            }
            if (this.ordenamiento.personal.apellido === "" ){
                return
            }
            try {
                // Crear la novedad
                await createOrdenamiento(this.ordenamiento);

                // guardamos registro
                guardarRegistro(this.today, "Ordenamiento");

                // Redireccionar
                // this.$router.push({ name: "ordenamiento" });
                this.goBack()
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        itinerarioIndexado(itinerarios: Itinerario[]):Record<string, Itinerario> {
            return itinerarios.reduce(
                (acumulador: Record<string, Itinerario>, itinerario: Itinerario) => {
                    acumulador[itinerario.tren] = itinerario;
                    return acumulador;
                },
                {} as Record<string, Itinerario>
            );
        },
        cargarEstaciones(tren:string,index:number){
            this.estacionesDelTren[index] = this.itIndex[tren].estaciones
        },
        cargarHorario(tren:string, estacion:string,index:number,esSale:boolean){
            esSale ?
            this.ordenamiento.turno.vueltas[index].sale = this.itIndex[tren].horarioXEst[estacion]:
            this.ordenamiento.turno.vueltas[index].llega = this.itIndex[tren].horarioXEst[estacion];
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
        goBack() {
            const fromRoute = localStorage.getItem('fromRoute') || '/ordenamiento'; // Recuperar la ruta o usar 'ordenamientos'
            localStorage.removeItem('fromRoute')
            this.$router.push(fromRoute);
        },
        searchPersonal() {
            /* Este método funciona dentro del modal, al escribir dentro del input filtra por
        nombre y apellido el personal */
            this.personalEncontrado = this.personales.filter(
                (personal: IPersonal) => {
                    return (
                        personal.apellido.toLowerCase() +
                        " " +
                        personal.nombres.toLowerCase()
                    ).includes(this.search.toLowerCase());
                }
            );
        },
        async searchPersonalPorLegajo() {
            /*  realiza la búsqueda por el legajo introducido en el respectivo input */
            this.message.message = "";
            this.message.status = "";
            this.message.activo = false;
            // this.ordenamiento = defaultOrdenamiento()
            // this.ordenamiento.turno = defaultTurnos()
            const personalAOrdenar = this.personales.find((personal: IPersonal) => {
                return (personal.legajo == this.ordenamiento.personal.legajo);
            }) ;

            if ( personalAOrdenar) {
                // this.validaPersonalConNovedadActiva(this.personalEncontrado[0]);
                this.ordenamiento.personal.apellido = personalAOrdenar.apellido;
                this.ordenamiento.personal.nombres = personalAOrdenar.nombres;
                this.ordenamiento.personal.dotacion = personalAOrdenar.dotacion;
                this.ordenamiento.personal.especialidad = personalAOrdenar.especialidad;
                this.ordenamiento.personal.turno = personalAOrdenar.turno;
                this.ordenamiento.turnoEfectivo = personalAOrdenar.turno;
                this.ordenamiento.personal.franco = personalAOrdenar.franco;

            }else{
                // this.ordenamiento.turno = defaultTurnos()
                this.ordenamiento.personal.apellido = '';
                this.ordenamiento.personal.nombres ='';
                this.ordenamiento.personal.dotacion ='';
                this.ordenamiento.personal.especialidad ='';
                this.ordenamiento.personal.turno ='';
                this.ordenamiento.turnoEfectivo = '';
                this.ordenamiento.personal.franco = -1
                return
            }
            
            const fechaHoy = this.today.toISOString().split("T")[0];
            if(this.ordenamiento.personal.turno.toLowerCase().includes("ciclo")){
                const [anio,mes] = fechaHoy.split("-")
                this.personalSinDiagrama = await loadTarjetaPersonalSinDiagramaPorLegajoYMes(this.ordenamiento.personal.legajo,`${anio}-${mes}`) || defaultTarjetaPersonalSinDiagrama()
                if(this.personalSinDiagrama._id){
                    this.ordenamiento.turnoEfectivo = this.personalSinDiagrama.days[fechaHoy].tren
                    this.ordenamiento.toma = this.personalSinDiagrama.days[fechaHoy].tomo
                    this.ordenamiento.deja = this.personalSinDiagrama.days[fechaHoy].dejo
                    this.ordenamiento.personal.franco = obtenerNumeroDia(this.personalSinDiagrama.days[fechaHoy].franco)
                }
            }
            const turnoPersonalSeleccionado = this.buscarTurno(this.ordenamiento.turnoEfectivo,this.ordenamiento.personal.franco,this.today,this.turnos)
            if(!this.ordenamiento.turno.vueltas[0].tren){
                this.ordenamiento.turno = turnoPersonalSeleccionado
            }else{
                this.ordenamiento.turno.ordenes = turnoPersonalSeleccionado.ordenes
                this.ordenamiento.toma = turnoPersonalSeleccionado.toma
                this.ordenamiento.deja = turnoPersonalSeleccionado.deja
                
                this.ordenamiento.turno.turno = turnoPersonalSeleccionado.turno
                this.ordenamiento.turno.itinerario = turnoPersonalSeleccionado.itinerario
                this.ordenamiento.turno.circular = turnoPersonalSeleccionado.circular
                // this.ordenamiento.turno.personal = turnoPersonalSeleccionado.personal
                this.ordenamiento.turno.toma = turnoPersonalSeleccionado.toma
                this.ordenamiento.turno.deja = turnoPersonalSeleccionado.deja
                this.ordenamiento.turno.dotacion = turnoPersonalSeleccionado.dotacion
                this.ordenamiento.turno.especialidad = turnoPersonalSeleccionado.especialidad

                // const long = this.ordenamiento.turno.vueltas.length
                // const longB = turnoPersonalSeleccionado.vueltas.length
                // let j = 0;
                // for(let i=long;i<long + longB -1;i++){
                //     this.agregarTren()
                //     this.ordenamiento.turno.vueltas[i] = turnoPersonalSeleccionado.vueltas[j]
                //     j++
                // }

            }
            this.ordenamiento.toma = this.ordenamiento.toma || this.ordenamiento.turno.toma
            this.ordenamiento.deja = this.ordenamiento.deja || this.ordenamiento.turno.deja
            
            this.verificarSiNecesitaCancelacion()

            // this.turnosEncontrado = this.buscarTurno(this.personalAOrdenar.turno,this.personalAOrdenar.franco,this.today,this.turnos)
            
        },
        verificarOrdenamientos():boolean{
            return this.ordenamientos.some(orden=>{                
                if(orden.fecha.split(",")[0] === this.today.toLocaleDateString() && 
                    orden.personal.legajo === this.ordenamiento.personal.legajo &&
                    orden.tipo === "cancelacionDiagrama"){
                    
                    return true;
                }
                return false;
            })
        },
        buscarTurno(turnoABuscar:string,franco:number,fecha:Date,turnos:ITurno[]){
            const diaLaboral = dia_laboral(franco,fecha.getDay());
            this.esDiagramado = false;
            let encontrados: ITurno = defaultTurnos();
            // let titular: IPersonal;
            // let diagrama: ITurno;
            let turnosEncontrados = turnos.filter((turno)=> 
                turno.turno.includes(turnoABuscar) && 
                turno.itinerario === itinerarioType(this.today));
            
            if(turnosEncontrados.length === 1){
                [encontrados] = turnosEncontrados
            }else if(turnosEncontrados.length > 1){
                [encontrados] = turnosEncontrados.filter(turno => {
                    const indexPunto = turno.turno.indexOf(".");
                    const diaLab = Number(turno.turno[indexPunto + 1]);
                    return diaLab === diaLaboral &&
                        turno.itinerario === itinerarioType(this.today) &&
                        turno.circular === 'Jul24' //Provisorio
                    })
                    console.warn("TODO provisorio  'Jul24' ")
            }
            return encontrados
        },
        verificarSiNecesitaCancelacion(){
            this.message.activo = false;
            const cancelacionCargada = this.verificarOrdenamientos()

            if(cancelacionCargada && this.ordenamiento.tipo == 'cancelacionDiagrama'){
                this.message = {
                    activo: true,
                    status: "danger",
                    title: "Cancelacion de diagrama ya cargada",
                    message: "El personal ya tiene una cancelacion para la fecha",
                }
                // setTimeout(()=>{
                    //     this.message.activo = false
                    // },5000)
            }
            // console.log(this.ordenamiento.turno.vueltas);
            console.log(this.ordenamiento.turno);
            console.log(!this.ordenamiento.turno.ordenes , this.ordenamiento?.turno?.vueltas.length > 1 , !cancelacionCargada)
            if(!this.ordenamiento.turno.ordenes && this.ordenamiento?.turno?.vueltas.length > 1 && !cancelacionCargada){
                this.esDiagramado = true
                
                this.ordenamiento.tipo = 'cancelacionDiagrama'
            }
            if(cancelacionCargada && this.ordenamiento.tipo == 'ordenamiento'){
                this.ordenamiento.turnoEfectivo = this.ordenamiento.turnoEfectivo + "- Cancelado"
                this.ordenamiento.turno = defaultTurnos()
            }
        },
        agregarTren() {
            this.ordenamiento.turno.vueltas = [...this.ordenamiento.turno.vueltas,
                {
                    vuelta: 0,
                    refer:'',
                    tren: "",
                    origen:'',
                    sale:'',
                    destino:'',
                    llega:'',
                    observaciones:''
                }
            ]
        },
    },
    async mounted() {
        try {
            this.personales = await loadPersonales() || [];
            this.turnos = await loadTurnos() || [];
            this.itinerario = await loadItinerarios() || [];
            this.ordenamientos = await loadOrdenamientos() || [];
            this.itIndex = this.itinerarioIndexado(this.itinerario)
            
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    created() {
        const queryData = this.$route.query.data;
        if (queryData) {
            this.vuelta = JSON.parse(queryData as string); // Convierte el string JSON de nuevo a un objeto

            const long:number = this.ordenamiento.turno?.vueltas.length
            console.log("🚀 ~ created ~ this.ordenamiento.turno?.vueltas?.[long -1].tren:", this.ordenamiento.turno?.vueltas)
            if(!this.ordenamiento.turno?.vueltas?.[long -1].tren){
                // this.agregarTren()
                console.log("🚀 ~ created ~ agregarTren:")
            }

            if(this.vuelta){
                this.ordenamiento.turno.vueltas[0].vuelta = this.vuelta?.vueltaA
                this.ordenamiento.turno.vueltas[0].refer = this.vuelta?.referA
                this.ordenamiento.turno.vueltas[0].tren = this.vuelta?.trenA
                this.ordenamiento.turno.vueltas[0].origen = this.vuelta?.origenA
                this.ordenamiento.turno.vueltas[0].sale = this.vuelta?.saleA
                this.ordenamiento.turno.vueltas[0].destino = this.vuelta?.destinoA
                this.ordenamiento.turno.vueltas[0].llega = this.vuelta?.llegaA
                this.ordenamiento.turno.vueltas[0].observaciones = this.vuelta?.observacionesA
                this.agregarTren()
                this.ordenamiento.turno.vueltas[1].vuelta = this.vuelta?.vueltaD
                this.ordenamiento.turno.vueltas[1].refer = this.vuelta?.referD
                this.ordenamiento.turno.vueltas[1].tren = this.vuelta?.trenD
                this.ordenamiento.turno.vueltas[1].origen = this.vuelta?.origenD
                this.ordenamiento.turno.vueltas[1].sale = this.vuelta?.saleD
                this.ordenamiento.turno.vueltas[1].destino = this.vuelta?.destinoD
                this.ordenamiento.turno.vueltas[1].llega = this.vuelta?.llegaD
                this.ordenamiento.turno.vueltas[1].observaciones = this.vuelta?.observacionesD
            }
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
