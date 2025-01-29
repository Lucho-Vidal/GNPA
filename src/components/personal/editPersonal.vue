<template>
    <main>
        <h1>
            {{  titulo }}
        </h1>
        <div class="alert alert-danger container" role="alert" v-if="alerta">
            <h4 class="alert-heading">ATENCIÓN!</h4>
            <hr />
            {{ alerta }}
        </div>
        <!-- <modalBuscarPersonal:personales="personales" /> -->
        <form @submit.prevent="editPersonal()">
            <div class="image-container">
                <img
                    v-if="datoPersonal && datoPersonal.Img"
                    :src="`http://localhost:3000/${datoPersonal.Img}`"
                    class="image rounded-circle"
                    alt="Carnet"
                />
                <img
                    v-else
                    class="image rounded-circle"
                    src="../../assets/usuario.png"
                    alt="Carnet"
                />
            </div>
            <div class="d-flex justify-content-center" v-if="personal.legajo">
                <input
                    type="file"
                    name="Foto"
                    id="Foto"    
                    accept=".jpg,.jpeg,.png"
                    @change="handleFileChange"
                />
            </div>
            <div class="border border-dark rounded p-3 m-3">
                <div class="justify-content-between row">
                    <label class="col-2">
                        Legajo
                        <input
                            class="form-control mb-3"
                            placeholder="Ingrese Legajo"
                            type="number"
                            name="legajo"
                            autofocus
                            required
                            v-model="personal.legajo"
                            @change="searchPersonalPorLegajo()"
                        />
                    </label>
                    <label class="col-2">
                        Apellido
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="text"
                            name="apellido"
                            v-model="personal.apellido"
                            required
                        />
                    </label>
                    <label class="col-3">
                        Nombre
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="text"
                            name="nombres"
                            v-model="personal.nombres"
                            required
                        />
                    </label>
                </div>
                <div class="justify-content-between row">
                    <label class="col-2">
                        Base
                        <select
                            name="base"
                            id="base"
                            class="form-control mb-3"
                            v-model="personal.dotacion"
                        >
                            <option value="PC">PC</option>
                            <option value="LLV">LLV</option>
                            <option value="TY">TY</option>
                            <option value="LP">LP</option>
                            <option value="K5">K5</option>
                            <option value="CÑ">CÑ</option>
                            <option value="AK">AK</option>
                        </select>
                    </label>
                    <label class="col-2">
                        Especialidad
                        <select
                            name="especialidad"
                            id="especialidad"
                            class="form-control mb-3"
                            v-model="personal.especialidad"
                            required
                            @change="searchPersonalPorLegajo()"
                        >
                            <option value="Conductor Electrico"
                                >Conductor Eléctrico</option
                            >
                            <option value="Conductor Diesel"
                                >Conductor Diesel</option
                            >
                            <option value="Ayudante Habilitado"
                                >Ayudante Habilitado</option
                            >
                            <option value="Ayudante Conductor"
                                >Ayudante Conductor</option
                            >
                            <option value="Guardatren Electrico"
                                >Guardatren Eléctrico</option
                            >
                            <option value="Guardatren Diesel"
                                >Guardatren Diesel</option
                            >
                        </select>
                    </label>
                    <label class="col-2">
                        Turno/ Ciclo
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="text"
                            name="turno"
                            v-model="personal.turno"
                        />
                    </label>
                    <label class="col-2">
                        Franco
                        <select
                            name="franco"
                            id="franco"
                            class="form-control mb-3"
                            v-model="personal.franco"
                            required
                        >
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </label>
                    <label class="col-2">
                        Orden
                        <input
                            class="form-control mb-3"
                            placeholder=""
                            type="number"
                            name="orden"
                            v-model="personal.orden"
                        />
                    </label>
                </div>
            </div>
            <h6 v-if="personal.turno.toLowerCase().includes('ciclo')">Ciclo:</h6>
            <div class="d-flex flex-column border border-dark rounded p-3 m-3" v-if="personal.turno.toLowerCase().includes('ciclo')">
                <div class="justify-content-between row">
                    <label class="col-2">
                        Número de ciclo
                        <input
                            class="form-control mb-3"
                            placeholder="Ciclo"
                            type="number"
                            v-model="personalSinDiagrama.Ciclo"
                        />
                    </label>
                    <label class="col-2">
                        Inicio del franco
                        <select
                            name="francoInicio"
                            id="francoInicio"
                            class="form-control mb-3"
                            v-model="personalSinDiagrama.francoInicio"
                            required
                        >
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </label>
                    <label class="col-2">
                        Hora inicia el franco
                        <input
                            class="form-control mb-3"
                            placeholder="Ciclo"
                            type="time"
                            v-model="personalSinDiagrama.HoraInicio"
                        />
                    </label>
                    <label class="col-2">
                        Finaliza el franco
                        <select
                            name="francoHasta"
                            id="francoHasta"
                            class="form-control mb-3"
                            v-model="personalSinDiagrama.francoHasta"
                            required
                        >
                            <option value="0">Domingo</option>
                            <option value="1">Lunes</option>
                            <option value="2">Martes</option>
                            <option value="3">Miércoles</option>
                            <option value="4">Jueves</option>
                            <option value="5">Viernes</option>
                            <option value="6">Sábado</option>
                        </select>
                    </label>
                    <label class="col-2">
                        Hora finaliza el franco
                        <input
                            class="form-control mb-3"
                            placeholder="Ciclo"
                            type="time"
                            v-model="personalSinDiagrama.HoraHasta"
                        />
                    </label>
                </div>
            </div>
            <h6>Datos personales:</h6>
            <div class="d-flex flex-column border border-dark rounded p-3 m-3">
                <div class="justify-content-between row">
                    <label class="col-2">
                        DNI
                        <input
                            class="form-control mb-3"
                            placeholder="DNI"
                            type="number"
                            v-model="datoPersonal.Dni"
                        />
                    </label>
                    <label class="col-2">
                        Nacionalidad:
                        <input
                            class="form-control mb-3"
                            placeholder="Nacionalidad"
                            type="text"
                            v-model="datoPersonal.Nacionalidad"
                        />
                    </label>
                    <label class="col-2">
                        Fecha de nacimiento:
                        <input
                            class="form-control mb-3"
                            placeholder="Fecha de Nacimiento"
                            type="Date"
                            v-model="datoPersonal.Nacimiento"
                        />
                    </label>
                    
                    <label class="col-2">
                        Sexo:
                        <select
                            name="Sexo"
                            id="Sexo"
                            class="form-control mb-3"
                            v-model="datoPersonal.Sexo"
                        >
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </label>
                    <label class="col-2">
                        Grupo Sanguíneo:
                        <input
                            class="form-control mb-3"
                            placeholder="Grupo Sanguíneo"
                            type="text"
                            v-model="datoPersonal.GrupoSanguíneo"
                        />
                    </label>
                </div>
            </div>
            <h6>Dirección y contacto:</h6>
            <div class="d-flex flex-column border border-dark rounded p-3 m-3">
                <div class="row">
                    <label class="col-3">
                        Dirección:
                        <input
                            class="form-control mb-3"
                            placeholder="Dirección"
                            type="text"
                            v-model="datoPersonal.Calle"
                        />
                    </label>
                    <label class="col-2">
                        Nro:
                        <input
                            class="form-control mb-3"
                            placeholder="Numero"
                            type="number"
                            v-model="datoPersonal.Nro"
                        />
                    </label>
                    <label class="col-1">
                        Piso:
                        <input
                            class="form-control mb-3"
                            placeholder="Piso"
                            type="text"
                            v-model="datoPersonal.Piso"
                        />
                    </label>
                    <label class="col-2">
                        Dpto:
                        <input
                            class="form-control mb-3"
                            placeholder="Departamento"
                            type="text"
                            v-model="datoPersonal.Depto"
                        />
                    </label>
                    <label class="col-2">
                        Código Postal:
                        <input
                            class="form-control mb-3"
                            placeholder="Código Postal"
                            type="number"
                            v-model="datoPersonal.Postal"
                        />
                    </label>
                    <label class="col-2">
                        Localidad:
                        <input
                            class="form-control mb-3"
                            placeholder="Localidad"
                            type="text"
                            v-model="datoPersonal.Localidad"
                        />
                    </label>
                </div>
                <div class="justify-content-between row">
                    <label class="col-3">
                        Celular:
                        <input
                            class="form-control mb-3"
                            placeholder="Dirección"
                            type="text"
                            v-model="datoPersonal.Tel1"
                        />
                    </label>
                    <label class="col-3">
                        Teléfono:
                        <input
                            class="form-control mb-3"
                            placeholder="Teléfono"
                            type="text"
                            v-model="datoPersonal.Tel2"
                        />
                    </label>
                    <label class="col-4">
                        E-mail:
                        <input
                            class="form-control mb-3"
                            placeholder="Email"
                            type="text"
                            v-model="datoPersonal.Mail"
                        />
                    </label>
                </div>
            </div>
            <div v-if="
                        personal.especialidad.includes('Conductor') ||
                        personal.especialidad.includes('Ayudante')
                    ">
                <h6>Certificados:</h6>
                <div
                    class="d-flex justify-content-evenly border border-dark rounded p-3 m-3"
                >
                    <label class="col-3">
                        Apto Medico:
                        <input
                            class="form-control mb-3"
                            placeholder="Apto Medico"
                            type="Date"
                            v-model="datoPersonal.aptoMedico"
                        />
                    </label>
                    <label class="col-3">
                        Certificado Idoneidad:
                        <input
                            class="form-control mb-3"
                            placeholder="Certificado Idoneidad"
                            type="Date"
                            v-model="datoPersonal.certificadoIdoneidad"
                        />
                    </label>
                </div>
            </div>
            <div v-if="
                        personal.especialidad.includes('Conductor') ||
                        personal.especialidad.includes('Ayudante')
                    ">
                <h6>Conocimientos:</h6>
                <div
                    class="d-flex flex-column border border-dark rounded p-3 m-3"
                >
                    <div class="row justify-content-between">
                        <h6>Estudios:</h6>
                        <label class="col-1">
                            CML
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.CML"
                            />
                        </label>
                        <label class="col-1">
                            CKD
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.CKD"
                            />
                        </label>
                        <label class="col-1">
                            RO
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.RO"
                            />
                        </label>
                        <label class="col-1">
                            MPN
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.MPN"
                            />
                        </label>
                        <label class="col-1">
                            OL
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.OL"
                            />
                        </label>
                        <label class="col-1">
                            LCI
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.LCI"
                            />
                        </label>
                        <label class="col-1">
                            ELEC
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.ELEC"
                            />
                        </label>
                        <label class="col-1">
                            DUAL
                            <input
                                type="checkbox"
                                v-model="personal.conocimientos.DUAL"
                            />
                        </label>
                    </div>
                    <hr />
                    <div class="row justify-content-between my-5">
                        <h6>Vias:</h6>
                        <hr />
                        Sector Electrico:
                        <div
                            class="d-flex list-unstyled w-100 justify-content-between"
                        >
                            <label class="col-2">
                                PC-ZZ:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                />
                            </label>
                            <label class="col-2">
                                PC-AK:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Pcak"
                                />
                            </label>
                            <label class="col-2">
                                PC-TY-BQ:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Pctybq"
                                />
                            </label>
                            <label class="col-2">
                                PC-QL-BQ:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Pcqlbq"
                                />
                            </label>
                            <label class="col-2">
                                PC-QL-LP:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Pcqllp"
                                />
                            </label>
                            <label class="col-2">
                                PC-TY-LP:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Pctylp"
                                />
                            </label>
                        </div>
                        <hr class="mt-5" />
                        Sector Temperley y Universitario:
                        <div
                            class="d-flex list-unstyled w-100 justify-content-evenly"
                        >
                            <label class="col-2">
                                TY-HDO:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Tyhdo"
                                />
                            </label>
                            <label class="col-2">
                                TY-JG:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Tyjg"
                                />
                            </label>
                            <label class="col-2">
                                Universitario:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Universitario"
                                />
                            </label>
                        </div>
                        <hr class="mt-5" />
                        Sector Cañuelas:
                        <div
                            class="d-flex list-unstyled w-100 justify-content-between"
                        >
                            <label class="col-2">
                                ZZ-CÑ:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Zzcñ"
                                />
                            </label>
                            <label class="col-2">
                                CÑ-MN:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Cñmn"
                                />
                            </label>
                            <label class="col-2">
                                CÑ-LB:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Cñlb"
                                />
                            </label>
                            <label class="col-2">
                                CÑ-GL:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Cñgl"
                                />
                            </label>
                            <label class="col-2">
                                CÑ-OL:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Cñol"
                                />
                            </label>
                            <label class="col-2">
                                OL-BB:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Olbb"
                                />
                            </label>
                        </div>
                        <hr class="mt-5" />
                        Sector Alejandro Korn:
                        <div
                            class="d-flex list-unstyled w-100 justify-content-evenly"
                        >
                            <label class="col-2">
                                AK-CHC:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Akchc"
                                />
                            </label>
                            <label class="col-2">
                                AK-MPN:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Akmpn"
                                />
                            </label>
                            <label class="col-2">
                                GI-PX:
                                <input
                                    class="form-control mb-3"
                                    type="Date"
                                    v-model="conocimientoVia.Gipx"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h6>
                        Observaciones:
                    </h6>
                    <textarea
                        class="border border-dark rounded p-3 m-3"
                        name="detalle"
                        v-model="personal.observaciones"
                    ></textarea>
                </div>
            </div>
            <div class="mb-5">
                <button class="btn btn-primary col-1 m-2">Guardar</button>
                <button class="btn btn-secondary col-1 m-2" @click="cerrar()">
                    Cerrar
                </button>
            </div>
        </form>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    createConocimientoVia,
    createDatoPersonal,
    createPersonal,
    getConocimientoVia,
    getDatoPersonal,
    getPersonal,
    getPersonales,
    updateConocimientoVia,
    updateDatoPersonal,
    updatePersonal,
    uploadImg,
} from "../../services/personalService";
import {
    IPersonal,
    IDatoPersonal,
    IConocimientosVias,
} from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { Registro } from "../../interfaces/IRegistro";
import { createRegistro } from "../../services/registrosService";
import { AxiosError } from "axios";
import { createPersonalSinDiagrama, getPersonalSinDiagrama, updatePersonalSinDiagrama } from "../../services/personalSinDiagramaService";
import { IPersonalSinDiagrama } from "../../interfaces/IPersonalSinDiagrama";
import { defaultPersonal } from "../../utils/interfacesDefault";

export default defineComponent({
    props: ["idPersonal", "idDato", "idVia","idTarjeta"],
    data() {
        return {
            legajoPersonal: 0 as number,

            personales: [] as IPersonal[],

            personal: defaultPersonal() as IPersonal,
            datoPersonal: {} as IDatoPersonal,
            conocimientoVia: {} as IConocimientosVias,
            personalSinDiagrama: {} as IPersonalSinDiagrama,

            days: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
            titulo: "" as string,
            alerta: "" as string,
            today: new Date(),
        };
    },
    methods: {
        async editPersonal() {
            try {
                if (this.alerta) {
                    this.alerta =
                        " ATENCIÓN!!! NO ES POSIBLE ACTUALIZAR ESTE PERSONAL!      " +
                        this.alerta;
                        return;
                }
                
                let accion = ""
                this.datoPersonal.Legajo = this.personal.legajo
                this.conocimientoVia.Legajo = this.personal.legajo
                if(this.personal._id){
                    await updatePersonal(this.personal._id, this.personal)
                    accion = "Edito"
                }else{
                    await createPersonal(this.personal)
                    accion = "Creo"
                }
                console.log(this.Personal); 
                console.log(this.datoPersonal); 
                console.log(this.conocimientoVia); 
                console.log(this.personalSinDiagrama); 

                this.datoPersonal._id ?
                await updateDatoPersonal(this.datoPersonal._id, this.datoPersonal):
                await createDatoPersonal(this.datoPersonal)

                if(this.personal.especialidad.includes("Conductor") || this.personal.especialidad.includes("Ayudante")){
                    this.conocimientoVia._id ?
                    await updateConocimientoVia(this.conocimientoVia._id, this.conocimientoVia):
                    await createConocimientoVia(this.conocimientoVia)
                }
                if(this.personal.turno.toLowerCase().includes('ciclo')){
                    this.personalSinDiagrama.legajo ? 
                    await updatePersonalSinDiagrama(this.personalSinDiagrama.legajo,this.personalSinDiagrama):
                    this.personalSinDiagrama.legajo = this.personal.legajo
                    await createPersonalSinDiagrama(this.personalSinDiagrama)
                }

                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: accion,
                    personal: this.personal,
                    conocimientoVia: this.conocimientoVia ? this.conocimientoVia : "",
                    datoPersonal: this.datoPersonal
                };
                await createRegistro(registro);

                this.$router.push({ name: "Personal" });
            } catch (error) {
                this.handleRequestError(error as AxiosError);
            }
        },
        async handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const formData = new FormData();
                formData.append('myFile', file);

                try {
                const response = await uploadImg(formData,this.datoPersonal._id);
                this.datoPersonal.Img = response.data.Img; // Ajusta según el nombre del campo en la respuesta
                formData.append('id', this.datoPersonal._id);
                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "Cambio Fotografía",
                    personal: this.personal,
                    conocimientoVia: this.conocimientoVia,
                    datoPersonal: this.datoPersonal
                };
                await createRegistro(registro);
                
                } catch (error) {
                console.error('Error al subir el archivo:', error);
                }
                
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
        cerrar() {
            this.$router.push({ name: "Personal" });
        },
        /* Este método trae la lista de todos los personales */
        async loadPersonales() {
            const res = await getPersonales();
            this.personales = res.data;
        },
        /* Este método trae el personal */
        async loadPersonal(id: string) {
            try {
                const res = await getPersonal(id);
                this.personal = res.data;
                this.legajoPersonal = this.personal.legajo
            } catch (error) {
                console.error(error);
            }
        },
        async loadDatoPersonal(id: string) {
            try {
                if(!id) return
                const res = await getDatoPersonal(id);
                this.datoPersonal = res.data;
            } catch (error) {
                console.error(error);
            }
        },
        async loadConocimientoVia(id: string) {
            try {
                if(!id) return
                const res = await getConocimientoVia(id);
                this.conocimientoVia = res.data;
            } catch (error) {
                console.error(error);
            }
        },
        async loadPersonalSinDiagrama(id: string) {
            try {
                if(!id) return
                const res = await getPersonalSinDiagrama(id);
                this.personalSinDiagrama = res.data;                
            } catch (error) {
                console.error(error);
            }
        },
        searchPersonalPorLegajo() {
            this.alerta = "";
            this.personales.forEach((personal: IPersonal) => {
                if (personal.legajo == this.personal.legajo && this.legajoPersonal != this.personal.legajo ) {
                    this.alerta =
                        "El personal ya existe!!! No es posible carga dos personales con el mismo legajo";
                }
            });
        },
    },
    mounted() {
        // if (typeof this.$route.params.id === "string") {
        if (this.$route.params && this.$route.params.idPersonal != "") {
            this.titulo = "Editar personal"
            const idPersonal = Array.isArray(this.$route.params.idPersonal)
                ? this.$route.params.idPersonal[0]
                : this.$route.params.idPersonal;

            const idDato = Array.isArray(this.$route.params.idDato)
                ? this.$route.params.idDato[0]
                : this.$route.params.idDato;

            const idVia = Array.isArray(this.$route.params.idVia)
                ? this.$route.params.idVia[0]
                : this.$route.params.idVia;

            const idTarjeta = Array.isArray(this.$route.params.idTarjeta)
                ? this.$route.params.idTarjeta[0]
                : this.$route.params.idTarjeta;
                        
            this.loadPersonal(idPersonal);
            this.loadDatoPersonal(idDato);
            this.loadConocimientoVia(idVia);
            this.loadPersonalSinDiagrama(idTarjeta);
        }else{
            this.titulo = "Cargar nuevo personal"
        }
        this.loadPersonales();
        newToken();
    },
    components: {},
});
</script>
<style>
main {
    margin-top: 5rem;
    /* margin-left: 300px; */
}
h1 {
    display: flex;
    justify-content: center;
}
form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 300px;
    width: 75%;
}
h1{
    width: 75%;
    margin-left: 300px;
}

</style>
