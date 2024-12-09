<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Registro de ordenamiento al Personal de Abordo
            </h2>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary mx-3" @click="$router.push('/newOrdenamiento')"
                    >Nuevo ordenamiento</button>
                    
                <button class="btn btn-warning" @click.prevent="abrirModal()">
                    Filtrar novedades
                </button>
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
                            <input
                                class="col-3 gap rounded"
                                type="text"
                                placeholder="Buscar por apellido y/o nombre"
                                v-model="search"
                                v-on:keyup="filtrar()"
                            />
                            <div class="my-3 form-check form-switch">
                                <h6>Solo las ordenes del dia:</h6>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="HNA"
                                        v-model="checkboxHoy"
                                        @change="filtrar()"
                                    />
                                    Solo hoy
                                </label>
                            </div>
                            <div class="my-3 ">
                                <h6>Filtro por Especialidad:</h6>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Conductor electrico"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Conductor eléctrico
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Conductor diesel"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Conductor Diesel
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Ayudante habilitado"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Ayudante Habilitado
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Ayudante conductor"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Ayudante Conductor
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Guardatren electrico"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Guarda Tren Electrico
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="Guardatren diesel"
                                        v-model="checkboxEspecialidad"
                                        @change="filtrar()"
                                    />
                                    Guarda Tren Diesel
                                </label>
                            </div>
                            <div class="my-3">
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="PC"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    PC
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="LLV"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    LLV
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="TY"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    TY
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="LP"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    LP
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="K5"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    K5
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="RE"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    RE
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="CÑ"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    CÑ
                                </label>
                                <label class="form-check-label mx-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value="AK"
                                        v-model="checkboxDotacion"
                                        @change="filtrar()"
                                    />
                                    AK
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 v-if="ordenamientosFiltrados.length == 0">
                No se encontró ninguna novedad con los requerimientos
                especificados.
            </h3>

            <table
                v-if="ordenamientosFiltrados.length > 0"
                class="table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">Fecha y hora</th>
                        <th class="col-1" colspan="1">Tipo</th>
                        <th class="col-1" colspan="1">Legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Base</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Turno Ef</th>
                        <th class="col-1" colspan="1">Franco</th>

                        <th class="col-1">Borrar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(orden, index) in ordenamientosFiltrados"
                    :key="index"
                >
                    <tr class="Small shadow">
                        <td class="col-1" rowspan="2">{{ orden.fecha }}</td>
                        <td class="col-1">{{ orden.tipo === 'ordenamiento' ?
                                    'Ordenamiento' :
                                orden.tipo === 'informe' ?
                                    'Informe' :
                                orden.tipo === 'cancelacionDiagrama' ?
                                    'Cancelación Diagrama': ''}}</td>
                        <td class="col-1">{{ orden.personal.legajo }}</td>
                        <td class="col-1">{{ orden.personal.apellido }}</td>
                        <td class="col-1">{{ orden.personal.nombres }}</td>
                        <td class="col-1">{{ orden.personal.dotacion }}</td>
                        <td class="col-1">{{orden.personal.turno +" / " +dia_laboral(orden.personal.franco,today.getDay())}}</td>
                        <td class="col-1">{{ orden.turnoEfectivo }}</td>
                        <td class="col-1">{{ obtenerDiaSemana(orden.personal.franco) }}</td>
                        <td class="col-1" rowspan="2">
                            <i class="material-icons cursor-hand rojo" @click="deleteOrdenamiento(orden._id, index)">delete_forever</i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Novedad } from "../../interfaces/INovedades";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import {
    guardarRegistro,
    handleRequestError,
} from "../../utils/funciones";
import { Ordenamiento } from "../../interfaces/IOrdenamientos";
import {
    getOrdenamientos,
    deleteOrdenamiento,
} from "../../services/ordenamientoService";
import { esFechaIgual } from "../../utils/fechas";

export default defineComponent({
    data() {
        return {
            ordenamientos: [] as Ordenamiento[],
            ordenamientosFiltrados: [] as Ordenamiento[],
            mostrarModalSearch: false,
            checkboxDotacion: [] as string[],
            checkboxEspecialidad: [] as string[],
            checkboxDescubierto: false,
            checkboxHoy: false,
            username: "" as string,
            today: new Date(),
            search: "" as string,
        };
    },
    methods: {
        async loadOrdenamientos() {
            try {
                const res = await getOrdenamientos();
                this.ordenamientos = res.data;
                this.filtrar();
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        async deleteOrdenamiento(id: string, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar esta novedad?"
                );
                if (confirmacion) {
                    try {
                        await deleteOrdenamiento(id);

                        //se guarda registro
                        guardarRegistro(this.today, "Elimino Ordenamiento");

                        // se quita de la lista impresa
                        this.ordenamientosFiltrados.splice(index, 1);
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                handleRequestError(error as AxiosError);
            }
        },
        abrirModal() {
            this.mostrarModalSearch = true;
        },
        cerrarModal() {
            this.mostrarModalSearch = false;
        },
        obtenerDiaSemana(num: number): string {
            const days = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ];
            return days[num];
        },
        obtenerNumeroDia(dia: string) {
            const diasDeLaSemana = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ];

            // Obtén el índice del día en el array
            const indice = diasDeLaSemana.findIndex((nombre) => nombre === dia);

            // Si se encuentra, devuelve el índice (0-6); de lo contrario, devuelve -1
            return indice;
        },
        cambiosTurnosIndexado(novedades: Novedad[]) {
            return novedades.reduce(
                (acumulador: Record<number, Novedad>, novedad: Novedad) => {
                    acumulador[novedad._id] = novedad;
                    return acumulador;
                },
                {} as Record<number, Novedad>
            );
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
        ordenarDescendente(list: any[]) {
            return list.sort((a: any, b: any) => (b._id > a._id ? 1 : -1));
        },
        edit(id: number) {
            this.$router.push(`/editNovedades/${id}`);
        },
        viewDetail(novedad: Novedad) {
            novedad.viewDetail = !novedad.viewDetail;
        },
        dia_laboral(diaLaboral: number, hoy: number) {
            /*   # devuelve el día de la semana como un número entero donde el Domingo
            está indexado como 0 y el Sábado como 6
            Al ingresarle por parámetros la cantidad de días del turno pos franco y
            el dia de la semana actual devuelve el dia del franco del turno mismo. */
            if (diaLaboral === -1) {
                return "S/F";
            } else {
                const diagrama = [
                    [0, 1, 2, 3, 4, 5, 6],
                    [6, 0, 1, 2, 3, 4, 5],
                    [5, 6, 0, 1, 2, 3, 4],
                    [4, 5, 6, 0, 1, 2, 3],
                    [3, 4, 5, 6, 0, 1, 2],
                    [2, 3, 4, 5, 6, 0, 1],
                    [1, 2, 3, 4, 5, 6, 0],
                ];
                return diagrama[diaLaboral][hoy]; //:franco
            }
        },
        filtrar() {
            
            let cDotacion = ["PC", "LLV", "TY", "LP", "K5", "RE", "CÑ", "AK"];
            let cEspecialidad = [
                "Conductor electrico",
                "Conductor diesel",
                "Ayudante habilitado",
                "Guardatren diesel",
                "Ayudante conductor",
                "Guardatren electrico",
            ];
            let filtrar = false;
            let ordenamientosFiltrados: Ordenamiento[] = this.ordenamientos;

            if (this.search.length !== 0) {
                filtrar = true;
            }
            if (this.checkboxDotacion.length > 0) {
                cDotacion = this.checkboxDotacion;
                filtrar = true;
            }
            if (this.checkboxEspecialidad.length > 0) {
                cEspecialidad = this.checkboxEspecialidad;
                filtrar = true;
            }
            if (filtrar) {
                ordenamientosFiltrados = ordenamientosFiltrados.filter(
                    (ordenamiento: Ordenamiento) => {
                        return (
                            cDotacion.includes(
                                ordenamiento.personal.dotacion
                            ) &&
                            cEspecialidad.includes(
                                ordenamiento.personal.especialidad
                            ) &&
                            (
                                ordenamiento.personal.apellido.toLowerCase() +
                                " " +
                                ordenamiento.personal.nombres.toLowerCase()
                            ).includes(this.search.toLowerCase().trim())
                        );
                    }
                );
            }
            if (this.checkboxHoy) {
                    ordenamientosFiltrados = ordenamientosFiltrados.filter((orden: Ordenamiento) => {
                        return esFechaIgual(orden.fecha.split(",")[0], this.today.toLocaleDateString());
                    }
                );
            }

            this.ordenamientosFiltrados = this.ordenarDescendente(ordenamientosFiltrados);
        },
    },
    created() {
        try {
            this.loadOrdenamientos();
            newToken();
            this.username = localStorage.getItem("username") || "";
        } catch (error) {
            console.error(error);
        }
    },
    name: "App",
    components: {},
});
</script>
<style>
main {
    margin-top: 5rem;
}

.hidden-row {
    display: none;
}

.fila-oscura {
    background-color: #888; /* Cambia este color según tus preferencias */
    color: #fff; /* Cambia este color según tus preferencias */
}
.cursor-hand {
    cursor: pointer;
}
.verde {
    color: #0f0;
}
.rojo {
    color: #f00;
}
.gris {
    color: #aaa;
}
.grisClaro {
    background: #dfdfdf;
}
.grisOscuro {
    color: #7b7b7b;
}
</style>
