<template>
    <main>
        <h2 class="d-flex justify-content-center m-3">Servicio ciclo</h2>
        <div class="d-flex justify-content-end">
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
import { IPersonalSinDiagrama } from "../../interfaces/IPersonalSinDiagrama";

export default defineComponent({
    data() {
        return {
            search: "",
            
            lstCiclo: [] as IPersonalSinDiagrama[],
            lstCicloAImprimir: [] as IPersonalSinDiagrama[],
            
            username: "" as string,
            today: new Date(),
        };
    },
    methods: {
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
