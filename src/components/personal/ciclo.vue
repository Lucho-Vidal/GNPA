<template>
    <main>
        <h2 class="d-flex justify-content-center m-3">Servicio ciclo</h2>
        <div class="d-flex justify-content-end">
            <button class="btn btn-primary d-flex end mx-3" @click="abrirFormulario()" >{{mostrarForm?"Cerrar formulario" :"Agregar ciclo" }}</button>
            <router-link class="btn btn-success d-flex end mx-3" to='/addCiclo'>Cargar desde Excel</router-link>
            <router-link class="btn btn-secondary d-flex end mx-3" to='/turnos'>Cerrar</router-link>
        </div>
        <h3 v-if="lstCiclo.length == 0">No se encontró ningún ciclo con los requerimientos especificados.</h3>
        <div class="container-fluid px-4" v-if="lstCiclo.length > 0">
            <div class="d-flex justify-content-evenly my-3 row">
                    <input
                        class="form-control"
                        style="width: 300px;"
                        type="text"
                        placeholder="Buscar por legajo"
                        autofocus
                        v-on:change="filtrar"
                        v-model="search"
                    />
                    
            </div>
            <div v-if="mostrarForm" >
                <hr>
                <h4 class="d-flex justify-content-center m-3">Nuevo ciclo</h4>
                <form class="d-flex justify-content-center my-5 row" @submit.prevent="addPersonalSinDiagrama()">
                    <label class="col-1">
                        Ciclo
                        <input class="form-control" type="number" v-model="newCiclo.Ciclo" required/></label>
                    <label class="col-1">
                        Legajo
                        <input class="form-control" type="text" v-model="newCiclo.legajo" required/></label>
                    <label class="col-1">
                        Franco inicio
                        <select class="form-control" v-model="newCiclo.francoInicio"  required>
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </label>
                    <label class="col-1">
                        Hora
                        <input class="form-control" type="time" v-model="newCiclo.HoraInicio" required/></label>
                    <label class="col-1">
                        Franco fin
                        <select class="form-control" v-model="newCiclo.francoHasta" required>
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </label>
                    <label class="col-1">
                        Hora
                        <input class="form-control" type="time" v-model="newCiclo.HoraHasta" required/></label>
                    <div class="mb-5 d-flex justify-content-end ">
                        <button class="btn btn-primary col-1 mt-5 mx-5">Guardar</button>
                    </div>
            </form>
            <hr>
        </div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th class="col-1">N°</th>
                        <th class="col-1">Ciclo</th>
                        <th class="col-1">Legajo</th>
                        <th class="col-1">Franco inicio</th>
                        <th class="col-1">hora</th>
                        <th class="col-1">Franco Fin</th>
                        <th class="col-1">hora</th>
                        <th class="col-1">Eliminar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(ciclo, index) in lstCicloAImprimir"
                    :key=" index"
                    class="Small shadow">
                    <tr>
                        <td class="col-1">{{ index + 1 }}</td>
                        <td class="col-1">{{ ciclo.Ciclo }}</td>
                        <td class="col-1">{{ ciclo.legajo }}</td>
                        <td class="col-1">{{ obtenerDiaSemana(ciclo.francoInicio) }}</td>
                        <td class="col-1">{{ ciclo.HoraInicio }}</td>
                        <td class="col-1">{{ obtenerDiaSemana(ciclo.francoHasta) }}</td>
                        <td class="col-1">{{ ciclo.HoraHasta }}</td>
                        <td class="col-1">
                        <i class="material-icons cursor-hand rojo" @click="deleteCiclo(ciclo._id,index)">delete_forever</i>
                    </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import {  loadPersonalesSinDiagrama } from "../../utils/funciones";
import { IPersonalSinDiagrama } from '../../interfaces/IPersonalSinDiagrama';
import { createPersonalSinDiagrama, deletePersonalSinDiagrama } from "../../services/personalSinDiagramaService";
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";

export default defineComponent({
    data() {
        return {
            search: "",
            newCiclo: {} as IPersonalSinDiagrama,
            mostrarForm: false,
            
            lstCiclo: [] as IPersonalSinDiagrama[],
            lstCicloAImprimir: [] as IPersonalSinDiagrama[],
            
            username: "" as string,
            today: new Date(),
        };
    },
    methods: {
        async deleteCiclo(id: string, index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este Personal?"
                );
                if (confirmacion) {
                    await deletePersonalSinDiagrama(id);

                    // guardamos registro
                    const registro: Registro = {
                        usuario: window.localStorage.getItem("username") || "",
                        fecha: this.today.toString(),
                        accion: "Elimino el ciclo "+ this.lstCiclo[index].legajo,
                    };
                    await createRegistro(registro);
                    this.lstCiclo.splice(index, 1);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async addPersonalSinDiagrama(){
            try {
                const res = await createPersonalSinDiagrama(this.newCiclo);
                this.newCiclo = {
                    _id:'',
                    legajo:0,
                    Ciclo:0,
                    francoInicio:0,
                    HoraInicio:'',
                    francoHasta:0,
                    HoraHasta:''
                }
                this.mostrarForm = false;

                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "creo el ciclo "+ this.newCiclo.legajo,
                };
                await createRegistro(registro);
                this.lstCiclo.unshift(res.data);
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        abrirFormulario(){
            this.mostrarForm = !this.mostrarForm
        },
        filtrar() {
            try {
                if(this.search){
                    this.lstCicloAImprimir = this.lstCiclo.filter((t) => {
                        return (t.legajo === parseInt(this.search) );
                    });
                }else{
                    this.lstCicloAImprimir = this.lstCiclo
                }
            } catch (error) {
                console.error(error);
            }
        },
        eliminarCampos(estaciones: Array<string>, horarios: Array<string>) {
            for (let index = estaciones.length - 1; index >= 0; index--) {
                if (!estaciones[index]) {
                    estaciones.splice(index, 1);
                    horarios.splice(index, 1);
                }
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
        obtenerDiaSemana(num: number): string | undefined {
            const diasDeLaSemana = [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ];
            return diasDeLaSemana[num];
        }
    },
    async created() {
        newToken();  
        this.lstCiclo = await loadPersonalesSinDiagrama() || [];
        this.filtrar()
        
        this.username = localStorage.getItem("username") || "";
                
    },
    name: "App",
    components: {
    },
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
    color: rgb(6, 92, 6);
}

.rojo {
    color: #f00;
}

.gris {
    color: #aaa;
}

</style>
