<template>
    <main>
        <h2 class="d-flex justify-content-center m-3">Itinerario de trenes</h2>
        <div class="d-flex justify-content-end">
            <router-link class="btn btn-success d-flex end mx-3" to='/addItinerario'>Cargar desde Excel</router-link>
            <router-link class="btn btn-secondary d-flex end mx-3" to='/turnos'>Cerrar</router-link>
        </div>
        <h3 v-if="lstItinerariosTrenes.length == 0">
                No se encontró ninguna novedad con los requerimientos
                especificados.
            </h3>
    <div class="container-fluid px-4" v-if="lstItinerariosTrenes.length > 0">
            
        <div class="d-flex justify-content-evenly my-3 row">
                <input
                    class="form-control"
                    style="width: 300px;"
                    type="text"
                    placeholder="Buscar por tren"
                    autofocus
                    v-on:keyup="filtrar"
                    v-model="search"
                />
                
        </div>

        <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th class="col-1">N°</th>
                <th class="col-1">Turno</th>
                <th class="col-1">Itinerario</th>
                <th class="col-1">Circular</th>
                <th class="col-1">Rotación</th>
                <th class="col-1">Tren Siguiente</th>
                <th class="col-1">Hora Tren Siguiente</th>
                <th class="col-1"></th>
                <th class="col-1">Editar</th>
                <th class="col-1">Borrar</th>
            </tr>
        </thead>
        <tbody
            v-for="(tren, index) in lstItinerariosTrenes"
            :key=" index"
            class="Small shadow"
            @dblclick="viewDetail(tren)">
            <tr>
            <td class="col-1">{{ index + 1 }}</td>
            <td class="col-1">
                <input class="form-control" type="text" v-model="tren.tren" />
            </td>
            <td class="col-1">
                <select class="form-control" v-model="tren.itinerario">
                <option value="H">Hábil</option>
                <option value="S">Sábado</option>
                <option value="D">Domingo</option>
                </select>
            </td>
            <td class="col-1">
                <input class="form-control" type="text" v-model="tren.circular" />
            </td>
            <td class="col-1">
                <input class="form-control" type="text" v-model="tren.rotacion" />
            </td>
            <td class="col-1">
                <input class="form-control" type="text" v-model="tren.trenSiguiente" />
            </td>
            <td class="col-1">
                <input class="form-control" type="text" v-model="tren.trenSiguienteHora" />
            </td>
            <td></td>
            <td class="col-1">
                <i class="material-icons cursor-hand verde" @click="editTurno(index)">edit_note</i>
            </td>
            <td class="col-1">
                <i class="material-icons cursor-hand rojo" @click="deleteTurno(index)">delete_forever</i>
            </td>
            </tr>
            <tr v-if="tren.viewDetail" class="details-row">
                <td class="col-1">
                    <i class="material-icons cursor-hand verde" @click=" addInicio(index) ">add</i>
                </td>
                <td colspan="7">
                    <div class="d-flex flex-nowrap justify-content-center">
                    <input
                        v-for="(estacion, idx) in tren.estaciones"
                        :key="'estacion-' + idx"
                        class="form-control mx-2 mb-2 col-1"
                        type="text"
                        :placeholder="estacion"
                        v-model="tren.estaciones[idx]"
                        style="width: 200px;"
                    />
                    </div>
                </td>
                <td class="col-1">
                    <i class="material-icons cursor-hand verde" @click="addFin(index)">add</i>
                </td>
            </tr>
            <tr v-if="tren.viewDetail" class="details-row">
                <td></td>
                <td colspan="7">
                    <div class="d-flex flex-nowrap justify-content-center">
                    <input
                        v-for="(horario, idx) in tren.horarios"
                        :key="'estacion-' + idx"
                        class="form-control mx-2 mb-2 col-1"
                        type="text"
                        :placeholder="horario"
                        v-model="tren.horarios[idx]"
                        style="width: 200px;"
                    />
                    </div>
                </td>
                <td></td>
            </tr>
        </tbody>
        </table>
    </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as XLSX from 'xlsx';
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { Itinerario } from '../../interfaces/Itinerario';
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";
import { loadItinerarios } from "../../utils/funciones";
import { deleteItinerario, updateItinerario } from "../../services/itinerarioService";

export default defineComponent({
    data() {
        return {
            
            search: "",
            
            lstItinerariosTrenes: [] as Itinerario[],
            ItinerariosTrenes: [] as Itinerario[],
            
            username: "" as string,
            itSeleccionado: "" as string,
            today: new Date(),
            workbook: null as XLSX.WorkBook | null,
            sheetNames: [] as string[],
            sheetNamesSeleccionado: [] as string[],
            especialidad: "", 
            itinerario:"",
            circular:"",
        };
    },
    methods: {
        async deleteTurno(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este tren?"
                );
                if (confirmacion && this.lstItinerariosTrenes[index]._id) {
                    await deleteItinerario(this.lstItinerariosTrenes[index]._id);

                    this.lstItinerariosTrenes.splice(index, 1);
                    // guardamos registro
                    const registro: Registro = {
                        usuario: window.localStorage.getItem("username") || "",
                        fecha: this.today.toString(),
                        accion: "Elimino itinerario "+ this.lstItinerariosTrenes[index].tren,
                    };
                    await createRegistro(registro);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async editTurno(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas editar este tren?"
                );
                if (confirmacion && this.lstItinerariosTrenes[index]._id) {

                    this.eliminarCampos(this.lstItinerariosTrenes[index].estaciones,this.lstItinerariosTrenes[index].horarios)
                    this.actualizarObjHXEst(index);

                    await updateItinerario(this.lstItinerariosTrenes[index]._id,this.lstItinerariosTrenes[index]);

                    // guardamos registro
                    const registro: Registro = {
                        usuario: window.localStorage.getItem("username") || "",
                        fecha: this.today.toString(),
                        accion: "Edito itinerario "+ this.lstItinerariosTrenes[index].tren,
                    };
                    await createRegistro(registro);
                }
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        filtrar() {
            try {
                this.lstItinerariosTrenes = this.ItinerariosTrenes.filter((t) => {
                    return (
                        t.tren
                            .toLowerCase()
                            .includes(this.search.toLowerCase()) 
                    );
                });
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
        actualizarObjHXEst(index:number){
            this.lstItinerariosTrenes[index].horarioXEst =  {};
                    this.lstItinerariosTrenes[index].estaciones.forEach((estacion:string,i:number)=>{
                        this.lstItinerariosTrenes[index].horarioXEst[estacion] =  this.lstItinerariosTrenes[index].horarios[i];

                    })
        },
        addInicio(index:number){
            this.lstItinerariosTrenes[index].estaciones.unshift("")
            this.lstItinerariosTrenes[index].horarios.unshift("")
        },
        addFin(index:number){
            this.lstItinerariosTrenes[index].estaciones.push("")
            this.lstItinerariosTrenes[index].horarios.push("")
        },
        viewDetail(itinerario: Itinerario) {
            itinerario.viewDetail = !itinerario.viewDetail;
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
    },
    async created() {
        newToken();  
        this.lstItinerariosTrenes = await loadItinerarios() || [];
        this.ItinerariosTrenes = this.lstItinerariosTrenes;
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
