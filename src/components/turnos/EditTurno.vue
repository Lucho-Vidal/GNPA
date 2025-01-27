<template>
        <main>
            <h1>
                Cargar Nuevo Turno
            </h1>
            <div class="alert alert-danger" role="alert" v-if="alerta">
                <h4 class="alert-heading">ATENCIÓN!</h4>
                <hr />
                {{ alerta }}
            </div>
            <!-- <modalBuscarPersonal :personales="personales" /> -->

            <form @submit.prevent="upTurno()">
                <div class="justify-content-between row">
                    
                    <label for="turno" class="col-1">
                        Turno
                        <input
                            class="form-control mb-3"
                            placeholder="Ingrese turno"
                            type="text"
                            name="turno"
                            autofocus
                            required
                            v-model="newTurno.turno"
                        />
                    </label>
                    <label for="especialidad" class="col-2">
                        Especialidad
                        <select
                                name="especialidad"
                                id="especialidad"
                                class="form-control mb-3"
                                v-model="newTurno.especialidad"
                                required
                            >
                                <option value="Conductor electrico">
                                    Conductor Eléctrico
                                </option>
                                <option value="Conductor diesel">
                                    Conductor Diesel
                                </option>
                                <option value="Guardatren electrico">
                                    GuardaTren Eléctrico
                                </option>
                                <option value="Guardatren diesel">
                                    GuardaTren Diesel
                                </option>
                            </select>
                    </label>
                    <label for="itinerario" class="col-2">
                        Itinerario
                        <select
                            name="itinerario"
                            id="itinerario"
                            class="form-control mb-3"
                            required
                            v-model="newTurno.itinerario"
                        >
                            <option value="H">Hábil</option>
                            <option value="S">Sábado</option>
                            <option value="D">Domingo</option>
                        </select>
                    </label>
                    <label for="nombres" class="col-2">
                        Circular
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="text"
                            name="nombres"
                            v-model="newTurno.circular"
                        />
                    </label>
                    <label for="nombres" class="col-1">
                        Toma
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="time"
                            name="nombres"
                            v-model="newTurno.toma"
                        />
                    </label>
                    <label for="nombres" class="col-1">
                        Deja
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="time"
                            name="nombres"
                            v-model="newTurno.deja"
                        />
                    </label>
                    <label for="ordenes" class="form-check form-switch col-2 mt-4 ">
                        Ordenes
                        <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="newTurno.ordenes"
                        />
                    </label>
                </div>
                <hr>
                <table>
                    <thead>
                        <tr>
                            <th class="col-1" colspan="1">Vuelta</th>
                            <th class="col-1" colspan="1">Referencia</th>
                            <th class="col-1" colspan="1">Tren</th>
                            <th class="col-1" colspan="1">Origen</th>
                            <th class="col-1" colspan="1">Sale</th>
                            <th class="col-1" colspan="1">Destino</th>
                            <th class="col-1" colspan="1">Llega</th>
                            <th class="col-1" colspan="1">Observaciones</th>
                            <th class="col-1 px-5">
                                <i
                                    class="fa-solid fa-circle-plus"
                                    @click="agregarVuelta()"
                                ></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        v-for="(vuelta, index) in newTurno.vueltas"
                        :key="index"
                    >
                        <tr class="">
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="vuelta"
                                    v-model="vuelta.vuelta"
                                    disabled
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="refer"
                                    v-model="vuelta.refer"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="tren"
                                    v-model="vuelta.tren"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="origen"
                                    v-model="vuelta.origen"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="time"
                                    name="sale"
                                    v-model="vuelta.sale"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="destino"
                                    v-model="vuelta.destino"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="time"
                                    name="llega"
                                    v-model="vuelta.llega"
                                />
                            </td>
                            <td class="col-1">
                                <input
                                    class="form-control mb-3"
                                    placeholder=""
                                    type="text"
                                    name="observaciones"
                                    v-model="vuelta.observaciones"
                                />
                            </td>
                            <td class="col-1 px-5 ">
                                <i
                                    class="fa-solid fa-circle-minus"
                                    @click="eliminarVuelta(index)"
                                ></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr>
                <div class="d-flex justify-content-end mx-5">
                    <button class="btn btn-primary col-1 m-2">Guardar</button>
                    <button class="btn btn-secondary col-1 m-2" @click="cerrar()">Cerrar</button>
                </div>
            </form>
        </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ITurno } from "../../interfaces/ITurno";
import { newToken } from "../../services/signService";
import {  getTurno, updateTurno } from "../../services/turnosService";
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";
import { AxiosError } from "axios";
import { defaultTurnos } from "../../utils/interfacesDefault";

export default defineComponent({
    data() {
        return {
            id:"",
            newTurno: defaultTurnos() as ITurno,
            today: new Date(),
            alerta: "" as string,
        };
    },
    methods: {
        /* Método utilizado para realizar la consulta HTML:POST al backend para el guardado de los datos */
        async loadTurno(id: string) {
            try {
                const { data } = await getTurno(id);
                this.newTurno = data;
            } catch (error) {
                this.handleRequestError(error as AxiosError)

            }
        },
        async upTurno() {
            try {
                await updateTurno(this.id,this.newTurno);
                // guardamos registro
                const registro: Registro = {
                            usuario : window.localStorage.getItem("username")||'',
                            fecha : this.today.toString() ,
                            accion: "Edito",
                            turno: this.newTurno,
                        }
                await createRegistro(registro);
                this.$router.push({ name: "Turnos" });
            } catch (error) {
                this.handleRequestError(error as AxiosError)
            }
        },
        handleRequestError(error: AxiosError) {
            console.error('Error en la solicitud:', error);

            if (error.response && error.response.status === 401) {
                // Manejar la lógica de redirección a la página de inicio de sesión
                this.$router.push("/login");
            } else {
                // Manejar otros errores de solicitud
                // Puedes mostrar un mensaje de error o tomar otras acciones según tus necesidades
            }
        },
        agregarVuelta() {
            this.newTurno.vueltas.push({
                vuelta: this.newTurno.vueltas.length + 1,
                tren: "", // Valor inicial
                refer: "",
                origen: "",
                sale: "",
                destino: "",
                llega: "",
                observaciones: "",
            });
        },
        eliminarVuelta(index: number) {
            this.newTurno.vueltas.splice(index, 1);
            this.reorganizarNumerosDeVuelta();
        },
        reorganizarNumerosDeVuelta() {
            this.newTurno.vueltas.forEach((vuelta, index) => {
                vuelta.vuelta = index + 1;
            });
        },
        cerrar() {
            this.$router.push({ name: "Turnos" });
        },
    },
    mounted() {
        
        if (typeof this.$route.params.id === "string") {
            this.id = this.$route.params.id
            this.loadTurno(this.id);
        }
        newToken();
    },
    components: {
    },
});
</script>
<style>
main {
    margin-top: 5rem;
}
h1{
    display: flex;
    justify-content: center;
}
form{
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 250px;
    width: 75%;
}
.row{
    margin-left: 0px;
}
</style>
