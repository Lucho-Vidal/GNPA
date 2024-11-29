<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Novedades del Personal de Abordo
            </h2>
            <div class="d-flex justify-content-end">
                <router-link
                    class="btn btn-primary "
                    to="/editNovedades"
                >
                    Nueva Novedad
                </router-link>
                <router-link
                    class="btn btn-success mx-3"
                    to="/estadisticas"
                >
                    Estadísticas
                </router-link>
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
                        <div class="my-3">
                            <input
                                class="col-3 gap rounded"
                                type="text"
                                placeholder="Buscar por apellido y/o nombre"
                                v-model="search"
                                v-on:keyup="filtrar()"
                            />
                        </div>
                        <div class="my-3">
                            <h6>Filtrar por HNA / descubiertos:</h6>
                            <label class="form-check-label mx-2">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="HNA"
                                    v-model="checkboxHna"
                                    @change="filtrar()"
                                />
                                HNA
                            </label>
                            <label class="form-check-label mx-2">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="descubierto"
                                    v-model="checkboxDescubierto"
                                    @change="filtrar()"
                                />
                                Sin Cubrir
                            </label>
                            <label class="form-check-label mx-2" v-if="!checkboxTodas">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="Finalizadas"
                                    v-model="checkboxFinalizadas"
                                    @change="filtrar()"
                                />
                                Finalizadas
                            </label>
                            <label class="form-check-label mx-2">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value="Todas"
                                    v-model="checkboxTodas"
                                    @change="filtrar()"
                                />
                                Todas las Novedades
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
            </div>
            <h3 v-if="novedadesFiltradas.length == 0">
                No se encontró ninguna novedad con los requerimientos
                especificados.
            </h3>

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
                        <th class="col-1">Borrar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(novedad, index) in novedadesFiltradas"
                    :key="index"
                    @dblclick="
                        novedad.novedadInactiva ? null : edit(novedad._id)
                    "
                    @click="viewDetail(novedad)"
                >
                    <tr
                        v-if="checkboxTodas || !novedad.novedadInactiva"
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
                        <td class="col-1">
                            {{
                                novedad.turno +
                                " / " +
                                dia_laboral(
                                    obtenerNumeroDia(novedad.franco),
                                    today.getDay()
                                )
                            }}
                        </td>
                        <td class="col-1">{{ novedad.franco }}</td>
                        <td class="col-1">{{ novedad.tipoNovedad }}</td>
                        <td class="col-1">
                            {{
                                new Date(
                                    novedad.fechaBaja + " 12:00"
                                ).toLocaleDateString()
                            }}
                        </td>
                        <td class="col-1">{{!novedad.HNA ? new Date(novedad.fechaAlta + " 12:00").toLocaleDateString(): ""}}</td>
                        <td class="col-1">
                            <i
                                v-if="!novedad.novedadInactiva"
                                class="material-icons cursor-hand"
                                @click="edit(novedad._id)"
                            >
                                edit_note
                            </i>
                        </td>
                        <td class="col-1">
                            <i
                                v-if="!novedad.novedadInactiva"
                                class="material-icons cursor-hand rojo"
                                @click="deleteNovedad(novedad._id, index)"
                                >delete_forever</i
                            >
                        </td>
                    </tr>
                    <tr v-if="novedad.viewDetail">
                        <td colspan="12">
                            <div class="row" v-if="novedad.remplazo[0]">
                                <h6 class="col-1">Releva:</h6>
                                <p class="col-3">
                                    {{
                                        novedad.remplazo[
                                            novedad.remplazo.length - 1
                                        ].apellido +
                                        " " +
                                        novedad.remplazo[
                                            novedad.remplazo.length - 1
                                        ].nombres
                                    }}
                                </p>
                                <h6 class="col-1">Desde:</h6>
                                <p class="col-1">
                                    {{
                                        formatearFecha(
                                            novedad.remplazo[
                                                novedad.remplazo.length - 1
                                            ].inicioRelevo
                                        )
                                    }}
                                </p>
                                <h6 class="col-1">Hasta:</h6>
                                <p class="col-1">
                                    {{
                                        formatearFecha(
                                            novedad.remplazo[
                                                novedad.remplazo.length - 1
                                            ].finRelevo
                                        )
                                    }}
                                </p>
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
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Novedad } from "../../interfaces/INovedades";
import { getNovedades, updateNovedad } from "../../services/novedadesService";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";

export default defineComponent({
    data() {
        return {
            novedades: [] as Novedad[],
            novedadesFiltradas: [] as Novedad[],
            checkboxDotacion: [] as string[],
            checkboxHna: false,
            checkboxEspecialidad: [] as string[],
            checkboxDescubierto: false,
            checkboxFinalizadas: false,
            checkboxTodas: false,
            mostrarModalSearch: false,
            username: "" as string,
            today: new Date(),
            search: "" as string,
        };
    },
    methods: {
        async loadNovedades() {
            try {
                const res = await getNovedades();
                this.novedades = res.data;
                this.filtrar();
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async deleteNovedad(id: number, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar esta novedad?"
                );
                if (confirmacion) {
                    try {
                        const novedadesIndex = this.novedadesIndexada(
                            this.novedades
                        );
                        novedadesIndex[id].novedadInactiva = true;
                        //await deleteNovedad(id);
                        // dejamos de hacer un borrado físico y empezamos a hacer un borrado lógico
                        await updateNovedad(id, novedadesIndex[id]);

                        //se guarda registro
                        const registro: Registro = {
                            usuario:
                                window.localStorage.getItem("username") || "",
                            fecha: this.today.toString(),
                            accion: "Elimino",
                            novedad: novedadesIndex[id],
                        };
                        await createRegistro(registro);
                        // se quita de la lista impresa
                        this.novedadesFiltradas.splice(index, 1);
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
        novedadesIndexada(novedades: Novedad[]) {
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
        ordenarNovedades() {
            this.novedadesFiltradas.sort((a, b) => (b._id > a._id ? 1 : -1));
        },
        edit(id: number) {
            this.$router.push(`/editNovedades/${id}`);
        },
        viewDetail(novedad: Novedad) {
            novedad.viewDetail = !novedad.viewDetail;
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
            let filtrarNovedades = false;
            let novedadesFiltradas: Novedad[] = this.novedades;

            if (this.search.length !== 0) {
                filtrarNovedades = true;
            }
            if (this.checkboxDotacion.length > 0) {
                cDotacion = this.checkboxDotacion;
                filtrarNovedades = true;
            }
            if (this.checkboxEspecialidad.length > 0) {
                cEspecialidad = this.checkboxEspecialidad;
                filtrarNovedades = true;
            }
            if (this.checkboxHna) {
                novedadesFiltradas = novedadesFiltradas.filter(
                    (novedad: Novedad) => novedad.HNA
                );
            }
            if (this.checkboxDescubierto) {
                novedadesFiltradas = novedadesFiltradas.filter(
                    (novedad: Novedad) => novedad.remplazo.length === 0
                );
            }
            if (this.checkboxTodas) {
                novedadesFiltradas;
            } else if (this.checkboxFinalizadas) {
                novedadesFiltradas = novedadesFiltradas.filter(
                    (novedad: Novedad) =>
                        novedad.fechaAlta &&
                        this.esFechaMayorIgual(
                            this.today.toString(),
                            novedad.fechaAlta
                        )
                );
            } else {
                novedadesFiltradas = novedadesFiltradas.filter(
                    (novedad: Novedad) =>
                        !novedad.fechaAlta ||
                        this.esFechaMayorIgual(
                            novedad.fechaAlta,
                            this.today.toString()
                        )
                );
            }

            if (filtrarNovedades) {
                novedadesFiltradas = novedadesFiltradas.filter(
                    (novedad: Novedad) => {
                        return (
                            cDotacion.includes(novedad.base) &&
                            cEspecialidad.includes(novedad.especialidad) &&
                            (
                                novedad.apellido.toLowerCase() +
                                " " +
                                novedad.nombres.toLowerCase().trim()
                            ).includes(this.search.toLowerCase().trim())
                        );
                    }
                );
            }
            this.novedadesFiltradas = novedadesFiltradas;
            this.ordenarNovedades();
        },
    },
    created() {
        try {
            this.loadNovedades();
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
</style>
