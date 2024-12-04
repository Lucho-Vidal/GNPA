<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Cambios de turno del Personal de Abordo
            </h2>
            <div class="d-flex justify-content-end">
                <button class="btn btn-primary" @click="$router.push('/newCambioTurno')">
                    Nuevo cambio de Turno
                </button>
                <button class="btn btn-warning mx-3" @click="abrirModal()">
                    Filtrar turnos
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
                        </div>
                        <div class="my-3">
                            <h6>Solo los cambios de la fecha:</h6>
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
                        <div class="my-3">
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
            <h3 v-if="cambiosTurnosFiltrados.length == 0">
                No se encontró ninguna novedad con los requerimientos
                especificados.
            </h3>

            <table
                v-if="cambiosTurnosFiltrados.length > 0"
                class="table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">Consecutivo - Fecha</th>

                        <th class="col-1" colspan="1">Legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Base</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Franco</th>

                        <th class="col-1">Borrar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(cambio, index) in cambiosTurnosFiltrados"
                    :key="index"
                >
                    <tr class="Small shadow">
                        <td class="col-1" rowspan="2">
                            {{
                                cambio._id +
                                " - " +
                                new Date(
                                    cambio.fechaCambio + " 12:00"
                                ).toLocaleDateString()
                            }}
                        </td>

                        <td class="col-1">{{ cambio.personal[0].legajo }}</td>
                        <td class="col-1">{{ cambio.personal[0].apellido }}</td>
                        <td class="col-1">{{ cambio.personal[0].nombres }}</td>
                        <td class="col-1">{{ cambio.personal[0].base }}</td>
                        <td class="col-1">{{cambio.personal[0].turnoEfectivo +" / " +
                                dia_laboral(
                                    obtenerNumeroDia(cambio.personal[0].franco),
                                    today.getDay()
                                )
                            }}
                        </td>
                        <td class="col-1">{{ cambio.personal[0].franco }}</td>
                        <td class="col-1" rowspan="2">
                            <i
                                class="material-icons cursor-hand rojo"
                                @click="deleteCambio(cambio._id, index)"
                                >delete_forever</i
                            >
                        </td>
                    </tr>
                    <tr>
                        <td class="col-1">{{ cambio.personal[1].legajo }}</td>
                        <td class="col-1">{{ cambio.personal[1].apellido }}</td>
                        <td class="col-1">{{ cambio.personal[1].nombres }}</td>
                        <td class="col-1">{{ cambio.personal[1].base }}</td>
                        <td class="col-1">{{cambio.personal[1].turnoEfectivo +" / " +dia_laboral(
                                    obtenerNumeroDia(cambio.personal[1].franco),
                                    today.getDay()
                                )
                            }}
                        </td>
                        <td class="col-1">{{ cambio.personal[1].franco }}</td>
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
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";
import {
    deleteCambioTurno,
    getCambioTurnos,
} from "../../services/cambioTurnoService";
import { CambioTurno } from "../../interfaces/ICambioTurno";

export default defineComponent({
    data() {
        return {
            cambiosTurnos: [] as CambioTurno[],
            cambiosTurnosFiltrados: [] as CambioTurno[],
            checkboxDotacion: [] as string[],
            checkboxEspecialidad: [] as string[],
            checkboxDescubierto: false,
            checkboxHoy: true,
            mostrarModalSearch: false,
            username: "" as string,
            today: new Date(),
            search: "" as string,
        };
    },
    methods: {
        async loadCambiosTurnos() {
            try {
                const res = await getCambioTurnos();
                this.cambiosTurnos = res.data;
                this.filtrar();
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async deleteCambio(id: number, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar esta novedad?"
                );
                if (confirmacion) {
                    try {
                        await deleteCambioTurno(id);

                        //se guarda registro
                        const registro: Registro = {
                            usuario:
                                window.localStorage.getItem("username") || "",
                            fecha: this.today.toString(),
                            accion: "Elimino cambio turno",
                        };
                        await createRegistro(registro);
                        // se quita de la lista impresa
                        this.cambiosTurnosFiltrados.splice(index, 1);
                    } catch (error) {
                        console.error(error);
                    }
                }
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
            } else {
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
        abrirModal() {
            this.mostrarModalSearch = true;
        },
        cerrarModal() {
            this.mostrarModalSearch = false;
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
            if (novedad.viewDetail) {
                novedad.viewDetail = false;
            } else {
                novedad.viewDetail = true;
            }
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
        esFechaMayorIgual(dateMayor: string, dateMenor: string) {
            if (dateMayor !== undefined && dateMenor !== undefined) {
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
            let filtrar = this.checkboxHoy;
            let cambiosTurnosFiltrados: CambioTurno[] = this.cambiosTurnos;

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
                cambiosTurnosFiltrados = cambiosTurnosFiltrados.filter(
                    (cambio: CambioTurno) => {
                        return (
                            cDotacion.includes(cambio.personal[0].base) &&
                            cEspecialidad.includes(
                                cambio.personal[0].especialidad
                            ) &&
                            (
                                cambio.personal[0].apellido.toLowerCase() +
                                " " +
                                cambio.personal[0].nombres.toLowerCase() +
                                cambio.personal[1].apellido.toLowerCase() +
                                " " +
                                cambio.personal[1].nombres.toLowerCase().trim()
                            ).includes(this.search.toLowerCase().trim())
                        );
                    }
                );
            }
            if (this.checkboxHoy) {
                cambiosTurnosFiltrados = cambiosTurnosFiltrados.filter(
                    (cambio) => {
                        return this.esFechaIgual(
                            cambio.fechaCambio,
                            this.today.toString()
                        );
                    }
                );
            }
            this.cambiosTurnosFiltrados = this.ordenarDescendente(
                cambiosTurnosFiltrados
            );
        },
    },
    created() {
        try {
            this.loadCambiosTurnos();
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
