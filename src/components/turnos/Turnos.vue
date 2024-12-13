<template>
    <main>
        <div class="container-fluid px-4">
            <h2 class="d-flex justify-content-center m-3">
                Administración de Turnos
            </h2>
            <div class="d-flex justify-content-end">
                <router-link
                    class="btn btn-primary d-flex end"
                    to="/newTurno"
                    >Nuevo Turno</router-link
                >
                <router-link class="btn btn-secondary d-flex end mx-3" to='/itinerariosTrenes'>Itinerario de trenes</router-link>
                <router-link class="btn btn-success d-flex end" to="/addturnos"
                    >Cargar desde Excel</router-link
                >
            </div>
            <div class="d-flex justify-content-evenly my-3 row">
                <input
                    class="col-3 gap col"
                    type="text"
                    placeholder="Buscar por turno"
                    autofocus
                    v-on:keyup="filtrar"
                    v-model="search"
                />
                <label class="form-check-label mx-2 col-1">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :value="'H'"
                        v-model="itSeleccionado"
                        v-on:change="filtrar()"
                    />
                    Hábil
                </label>
                <label class="form-check-label mx-2 col-1">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :value="'S'"
                        v-model="itSeleccionado"
                        v-on:change="filtrar()"
                    />
                    Sábado
                </label>
                <label class="form-check-label mx-2 col-2">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :value="'D'"
                        v-model="itSeleccionado"
                        v-on:change="filtrar()"
                    />
                    Domingo
                </label>
            </div>

            <h3 v-if="Filtradas.length == 0">
                No se encontró ningún turno con los requerimientos
                especificados.
            </h3>

            <table
                v-if="Filtradas.length > 0"
                class="table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Itinerario</th>
                        <th class="col-1" colspan="1">Circular</th>
                        <th class="col-1" colspan="1">Dotación</th>
                        <th class="col-1" colspan="1">Especialidad</th>
                        <th class="col-1" colspan="1">Ordenes</th>
                        <th class="col-1" colspan="1">Toma</th>
                        <th class="col-1" colspan="1">Deja</th>
                        <th class="col-1">Ver</th>
                        <th class="col-1">Borrar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(turno, index) in Filtradas"
                    :key="index"
                    @click="viewDetail(turno)"
                >
                    <tr class="Small shadow">
                        <td class="col-1">{{ turno.turno }}</td>
                        <td class="col-1">{{ turno.itinerario }}</td>
                        <td class="col-1">{{ turno.circular }}</td>
                        <td class="col-1">{{ turno.dotacion }}</td>
                        <td class="col-1">{{ turno.especialidad }}</td>
                        <td class="col-1">{{ turno.ordenes ? "Orden" : "" }}
                        </td>
                        <td class="col-1">{{ turno.toma }}</td>
                        <td class="col-1">{{ turno.deja }}</td>
                        <td class="col-1">
                            <i
                                class="material-icons cursor-hand"
                                @click="edit(turno._id)"
                                >edit_note</i
                            >
                        </td>
                        <td class="col-1">
                            <i
                                class="material-icons cursor-hand rojo"
                                @click="deleteTurno(turno._id, index)"
                                >delete_forever</i
                            >
                        </td>
                    </tr>
                        <tr class="custom-orange" v-if="turno.viewDetail">
                            <th></th>
                            <th class="col-1" colspan="1">Vuelta</th>
                            <th class="col-1" colspan="1">Referencia</th>
                            <th class="col-1" colspan="1">Tren</th>
                            <th class="col-1" colspan="1">Origen</th>
                            <th class="col-1" colspan="1">Sale</th>
                            <th class="col-1" colspan="1">Destino</th>
                            <th class="col-1" colspan="1">Llega</th>
                            <th class="col-1" colspan="1">Observaciones</th>
                        </tr>
                    <tr
                        class="custom-orange"
                        v-for="(vuelta, index) in turno.vueltas"
                        :key="index"
                    >
                        <td  v-if="turno.viewDetail"></td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.vuelta }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.refer }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.tren }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.origen }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.sale }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.destino }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.llega }}</td>
                        <td colspan="1" v-if="turno.viewDetail">{{ vuelta.observaciones }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ITurno } from "../../interfaces/ITurno";
import { deleteTurno, getTurnos } from "../../services/turnosService";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";

export default defineComponent({
    data() {
        return {
            search: "",
            turnos: [] as ITurno[],
            Filtradas: [] as ITurno[],
            username: "" as string,
            itSeleccionado: ["H", "S", "D"] as string[],
            today: new Date(),
        };
    },
    methods: {
        async loadTurnos() {
            try {
                const res = await getTurnos();
                this.turnos = res.data;
                this.filtrar();
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async deleteTurno(id: string, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este turno?"
                );
                if (confirmacion) {
                    await deleteTurno(id);

                    // guardamos registro
                    const registro: Registro = {
                        usuario: window.localStorage.getItem("username") || "",
                        fecha: this.today.toString(),
                        accion: "Elimino",
                        turno: this.turnos[index],
                    };
                    await createRegistro(registro);

                    this.Filtradas.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        handleRequestError(error: AxiosError) {
            console.error("Error en la solicitud:", error);

            if (error.response && error.response.status === 401) {
                // Manejar la lógica de redirección a la página de inicio de sesión
                this.$router.push("/login");
            } else {
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
        edit(id: string) {
            this.$router.push(`/editTurno/${id}`);
        },
        viewDetail(turno: ITurno) {
            if (turno.viewDetail) {
                turno.viewDetail = false;
            } else {
                turno.viewDetail = true;
            }
        },

        filtrar() {
            try {
                this.Filtradas = this.turnos.filter((t) => {
                    return (
                        t.turno
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) &&
                        this.itSeleccionado.includes(t.itinerario)
                    );
                });
            } catch (error) {
                console.error(error);
            }
        },
    },
    created() {
        this.loadTurnos();
        newToken();
        this.username = localStorage.getItem("username") || "";
    },
    name: "App",
    components: {},
});
</script>
<style>
main {
    margin-top: 5rem;
}
.custom-orange{
    background-color: #fd7d1485;
}

.hidden-row {
    display: none;
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
