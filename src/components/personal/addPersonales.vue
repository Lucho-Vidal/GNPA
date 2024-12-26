<template>
    <main class="container-fluid px-4">
        <div v-if="personalesFiltrados.length == 0">
            <div class="d-flex justify-content-center m-3">
                <h2>Cargar nuevos Personales desde Excel</h2>
            </div>
            <div class="d-flex justify-content-center">
                <label for="nuevosTurnos" class="custom-file-upload">
                    Seleccionar archivo
                </label>
                <input
                    type="file"
                    name="nuevosTurnos"
                    id="nuevosTurnos"
                    @change="handleFileChange"
                    accept=".xlsx,.xls,xlsm"
                />
            </div>
        </div>
        <div v-if="personalesFiltrados.length > 0">
            <h2 class="d-flex justify-content-center m-3">
                Listado Personal de Abordo
            </h2>
            <div class="d-flex justify-content-end">
                <button
                    class="btn btn-primary d-flex end mx-3"
                    @click="enviarTurnos()"
                >
                    Guardar turnos
                </button>
                <router-link class="btn btn-danger d-flex end" to="/personal"
                    >Cancelar</router-link
                >
            </div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th class="col-1" colspan="1">legajo</th>
                        <th class="col-1" colspan="1">Apellido</th>
                        <th class="col-1" colspan="1">Nombres</th>
                        <th class="col-1" colspan="1">Turno</th>
                        <th class="col-1" colspan="1">Franco</th>
                        <th class="col-1" colspan="1">Especialidad</th>
                        <th class="col-1" colspan="1">Dotacion</th>
                        <th class="col-1" colspan="1">Observaciones</th>
                        <th class="col-1" colspan="1">Orden</th>
                        <th class="col-1">Eliminar</th>
                    </tr>
                </thead>
                <tbody
                    v-for="(personal, index) in personalesFiltrados"
                    :key="index"
                >
                    <tr>
                        <td class="col-1">{{ personal.legajo }}</td>
                        <td class="col-1">{{ personal.apellido }}</td>
                        <td class="col-2">{{ personal.nombres }}</td>
                        <td class="col-1">{{ personal.turno }}</td>
                        <td class="col-1">{{ days[personal.franco] }}</td>
                        <td class="col-1">{{ personal.especialidad }}</td>
                        <td class="col-1">{{ personal.dotacion }}</td>
                        <td class="col-2">{{ personal.observaciones }}</td>
                        <td class="col-1">{{ personal.orden }}</td>

                        <td class="col-1">
                            <i
                                class="material-icons cursor-hand rojo"
                                @click="deletePersonal(index)"
                                >delete_forever</i
                            >
                        </td>
                    </tr>
                    <tr v-if="personal.viewDetail && personal.conocimientos">
                        <td colspan="12">
                            <div class="row">
                                <h6 class="col-12">Conocimientos:</h6>
                                <p class="col-1">
                                    {{
                                        personal.conocimientos.CML === true
                                            ? "CML"
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.CKD === true
                                            ? "CKD"
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.RO === true
                                            ? "RO "
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.MPN === true
                                            ? "MPN "
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.OL === true
                                            ? "OL "
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.LCI === true
                                            ? "LCI "
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.ELEC === true
                                            ? "ELEC "
                                            : ""
                                    }}
                                    {{
                                        personal.conocimientos.DUAL === true
                                            ? "DUAL"
                                            : ""
                                    }}
                                </p>
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
import { IPersonal } from "../../interfaces/IPersonal";
import { newToken } from "../../services/signService";
import { AxiosError } from "axios";
import { createRegistro } from "../../services/registrosService";
import { Registro } from "../../interfaces/IRegistro";
import * as XLSX from "xlsx";
import {
    createMultiplePersonal,
    deleteMultiplePersonal,
} from "../../services/personalService";

const daysOfWeek: { [key: string]: number } = {
    DOMINGO: 0,
    LUNES: 1,
    MARTES: 2,
    MIÉRCOLES: 3,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SÁBADO: 6,
    SABADO: 6,
};

export default defineComponent({
    data() {
        return {
            personales: [] as IPersonal[],
            personalesFiltrados: [] as IPersonal[],
            checkboxDotacion: [] as string[],
            checkboxEspecialidad: [] as string[],
            checkboxTurno: [] as string[],
            today: new Date(),
            search: "" as string,
            searchTurno: "" as string,
            workbook: null as XLSX.WorkBook | null,
            sheetNames: [] as string[],
            searchLegajo: 0,
            days: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
        };
    },
    methods: {
        async handleFileChange(event: Event) {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const arrayBuffer = await file.arrayBuffer();
                this.workbook = XLSX.read(arrayBuffer, { type: "array" });
                // Obtener nombres de las hojas
                this.sheetNames = this.workbook.SheetNames;
                this.ConvertirPersonalJson();
            }
        },
        async enviarTurnos() {
            try {
                console.log(
                    "cantidad de registros: ",
                    this.personalesFiltrados.length
                );

                const confirmacion = window.confirm(
                    "¿Desea eliminar los personales anteriores? esta acción eliminara los personales ya cargados y cargara los nuevos. Esto recomendable en caso de que ya no este vigente."
                );
                if (confirmacion) {
                    await deleteMultiplePersonal();
                }
                const batchSize = 300;
                const batches = [];

                for (
                    let i = 0;
                    i < this.personalesFiltrados.length;
                    i += batchSize
                ) {
                    const batch = this.personalesFiltrados.slice(
                        i,
                        i + batchSize
                    );
                    batches.push(batch);
                }
                for (const batch of batches) {
                    console.log("Enviando lote de tamaño: ", batch.length);
                    await createMultiplePersonal(batch);
                }

                // guardamos registro
                const registro: Registro = {
                    usuario: window.localStorage.getItem("username") || "",
                    fecha: this.today.toString(),
                    accion: "Agrego lista de personales",
                };

                await createRegistro(registro);
                alert("Se cargaron los personales satisfactoriamente.");

                this.$router.push("/personal");
            } catch (error) {
                console.error("Error al crear turnos:", error);
            }
        },
        capitalize(text: string): string {
            return text
                .toLowerCase()
                .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
        },
        separarNombreApellido(apellidoNombre: string) {
            let apellidos = "";
            let nombres = "";
            let nombresLen = 0;
            let array = apellidoNombre.split(/(?=[A-ZÑ])/).map((e) => e.trim());

            nombres += array
                .filter((str) => str.length > 1)
                .map((nombre) => {
                    nombresLen += 1;
                    return nombre + " ";
                });
            nombres = nombres.trim();

            array = apellidoNombre.split(" ").map((e) => e.trim());

            for (let i = 0; i < nombresLen; i++) {
                //elimino los nombres del array
                array.pop();
            }
            for (let i = 0; i < array.length; i++) {
                apellidos +=
                    array[i].charAt(0).toUpperCase() +
                    array[i].slice(1).toLowerCase() +
                    " ";
            }
            apellidos = apellidos.trim();

            return { nombres: nombres, apellidos: apellidos };
        },
        ConvertirPersonalJson() {
            const sheet = this.workbook!.Sheets[this.sheetNames[0]];
            if (!sheet) {
                console.error(
                    `La hoja ${this.sheetNames[0]} no se pudo leer correctamente.`
                );
                alert(
                    "ocurrió un error al tratar de leer una hoja, recargue la pagina e intente nuevamente"
                );
                return;
            }
            const rangeRef = sheet["!ref"];
            if (rangeRef) {
                const range = XLSX.utils.decode_range(rangeRef);
                const rows = range.e.r;

                let row = 2;
                while (row <= rows + 1) {
                    const cell = sheet[`A${row}`];
                    if (cell && cell.v !== undefined) {
                        const fullName = this.separarNombreApellido(
                            sheet[`C${row}`]?.w
                        );

                        // Leer los datos del personal
                        const personal: IPersonal = {
                            _id: "",
                            legajo: sheet[`A${row}`]?.v || 0,
                            apellido: fullName.apellidos,
                            nombres: fullName.nombres,
                            turno: sheet[`D${row}`]?.w || "",
                            franco:
                                daysOfWeek[
                                    (
                                        sheet[`E${row}`]?.w?.trim() || ""
                                    ).toUpperCase()
                                ],
                            especialidad: this.capitalize(
                                sheet[`F${row}`]?.v || ""
                            ),
                            dotacion: sheet[`G${row}`]?.v || "",
                            observaciones: sheet[`Q${row}`]?.v || "",
                            orden: sheet[`R${row}`]?.v || 0,
                            conocimientos: {
                                CML: sheet[`H${row}`]?.v === "SI",
                                CKD: sheet[`I${row}`]?.v === "SI",
                                RO: sheet[`J${row}`]?.v === "SI",
                                MPN: sheet[`K${row}`]?.v === "SI",
                                OL: sheet[`L${row}`]?.v === "SI",
                                LCI: sheet[`M${row}`]?.v === "SI",
                                ELEC: sheet[`N${row}`]?.v === "SI",
                                DUAL: sheet[`O${row}`]?.v === "SI",
                            },
                            viewDetail: false,
                        };

                        if (personal.turno.toUpperCase().includes("PROG")) {
                            const numero = parseInt(
                                personal.turno.match(/\d+/)?.[0] || "",
                                10
                            );
                            const especialidad = personal.especialidad
                                .toLowerCase()
                                .includes("conductor")
                                ? "C"
                                : personal.especialidad
                                      .toLowerCase()
                                      .includes("guardatren")
                                ? "G"
                                : "";
                            personal.turno =
                                "PROG." +
                                numero +
                                especialidad +
                                personal.dotacion;
                        }

                        this.personalesFiltrados.push(personal);
                    }
                    row++;
                }
            }
        },
        async deletePersonal(index: number) {
            try {
                const confirmacion = window.confirm(
                    "¿Estás seguro de que deseas eliminar este Personal?"
                );
                if (confirmacion) {
                    // await deletePersonal(id);

                    // // guardamos registro
                    // const registro: Registro = {
                    //     usuario: window.localStorage.getItem("username") || '',
                    //     fecha: this.today.toString(),
                    //     accion: "Elimino",
                    //     personal: this.personales[index],
                    // }
                    // await createRegistro(registro);
                    this.personalesFiltrados.splice(index, 1);
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
        viewDetail(personal: IPersonal) {
            if (personal.viewDetail) {
                personal.viewDetail = false;
            } else {
                personal.viewDetail = true;
            }
        },
        filtrarPersonales() {
            let cDotacion = [];
            let cEspecialidad = [];
            let cTurno = [];
            let filtrar = false;
            this.personalesFiltrados = [];

            if (this.search.length != 0) {
                filtrar = true;
            }
            if (this.searchLegajo != 0) {
                filtrar = true;
            }
            if (this.searchTurno.length != 0) {
                filtrar = true;
            }
            if (
                this.checkboxDotacion.length == 0 ||
                this.checkboxDotacion == undefined
            ) {
                cDotacion = ["PC", "LLV", "TY", "LP", "K5", "RE", "CÑ", "AK"];
            } else {
                cDotacion = this.checkboxDotacion;
                filtrar = true;
            }
            if (this.checkboxEspecialidad.length == 0) {
                cEspecialidad = [
                    "Conductor electrico",
                    "Conductor diesel",
                    "Ayudante habilitado",
                    "Guardatren diesel",
                    "Ayudante conductor",
                    "Guardatren electrico",
                ];
            } else {
                cEspecialidad = this.checkboxEspecialidad;
                filtrar = true;
            }
            if (this.checkboxTurno.length == 0) {
                cTurno = ["turno", "prog", "ciclo"];
            } else {
                cTurno = this.checkboxTurno;
                filtrar = true;
            }

            if (filtrar) {
                cDotacion.forEach((dotacion: string) => {
                    for (let i = 0; i < this.personales.length; i++) {
                        if (this.personales[i].dotacion == dotacion) {
                            this.personalesFiltrados.push(this.personales[i]);
                        }
                    }
                });

                let auxPersonales: IPersonal[] = this.personalesFiltrados;
                this.personalesFiltrados = [];

                cEspecialidad.forEach((especialidad: string) => {
                    for (let i = 0; i < auxPersonales.length; i++) {
                        if (auxPersonales[i].especialidad == especialidad) {
                            this.personalesFiltrados.push(auxPersonales[i]);
                        }
                    }
                });

                auxPersonales = this.personalesFiltrados;
                this.personalesFiltrados = [];

                cTurno.forEach((turno: string) => {
                    for (let i = 0; i < this.personales.length; i++) {
                        if (auxPersonales[i] != undefined) {
                            if (
                                turno.toLowerCase().includes("ciclo") &&
                                auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("ciclo")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            } else if (
                                turno.toLowerCase().includes("prog") &&
                                auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("prog")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            } else if (
                                turno.toLowerCase().includes("turno") &&
                                !auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("prog") &&
                                !auxPersonales[i].turno
                                    .toLowerCase()
                                    .includes("ciclo")
                            ) {
                                this.personalesFiltrados.push(auxPersonales[i]);
                            }
                        }
                    }
                });

                if (this.search.length != 0) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return (
                                personal.apellido.toLowerCase() +
                                " " +
                                personal.nombres.toLowerCase().trim()
                            ).includes(this.search.toLowerCase().trim());
                        }
                    );
                }
                if (this.searchTurno.length != 0) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return personal.turno.includes(
                                this.searchTurno.toLowerCase().trim()
                            );
                        }
                    );
                }
                if (this.searchLegajo != 0) {
                    auxPersonales = this.personalesFiltrados;
                    this.personalesFiltrados = auxPersonales.filter(
                        (personal) => {
                            return personal.legajo === this.searchLegajo;
                        }
                    );
                }
            } else {
                this.personalesFiltrados = this.personales;
            }
        },
        edit(id: string) {
            this.$router.push(`/editPersonal/${id}`);
        },
    },
    created() {
        try {
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    name: "App",
    components: {},
});
</script>
<style>

</style>
