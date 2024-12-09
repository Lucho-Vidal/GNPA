<template>
    <main>
        <h1>Estadística de ausentismos</h1>
        <div class="d-flex justify-content-end">
            
            <div class="d-flex flex-wrap justify-content-center my-3">
                <h6>Dotaciones:</h6>
                <div
                    v-for="(dotacion, index) in dotacionesPermitidas"
                    :key="index"
                >
                    <label class="form-check-label mx-2">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :value="dotacion"
                            v-model="dotacionesSeleccionadas"
                            v-on:change="realizarCalculo()"
                        />
                        {{ dotacion }}
                        <!-- Mostrar el valor de la variable circular en el label -->
                    </label>
                </div>
            </div>
            <div>
                <input class="form-control" type="date" name="today" id="today" v-model="fecha" @change="realizarCalculo()" />
            </div>
            <div>
                <select
                    id="circulares-select"
                    class="form-select mx-4"
                    v-model="circularSeleccionada"
                    @change="realizarCalculo()"
                >
                    <option value="" disabled>Selecciona una circular</option>
                    <option
                        v-for="(circular, index) in circulares"
                        :key="index"
                        :value="circular"
                    >
                        {{ circular }}
                    </option>
                </select>
            </div>
            <!-- <button class="btn btn-primary mx-5" @click="actualizarChartData()">
                Calcular
            </button> -->
            <button class="btn btn-success mx-5" @click="exportToExcel">
                Descargar Excel
            </button>
        </div>
        <div
            class="alert alert-danger row d-flex justify-content-center container m-5 "
            role="alert"
            v-if="circularSeleccionada == ''"
        >
            <h4 class="alert-heading">Seleccione Circular</h4>
            <hr />
            Debe seleccionar la circular a cargar
            
        </div>

        <div v-if=" (circularSeleccionada == '' ) || isLoading  " class="d-flex justify-content-center m-5">
            Cargando...
        </div>
        <div v-else>
            <table class="tabla" ref="dataTable">
                <tr>
                    <th class="highlight-gray celda">Especialidad</th>
                    <th class="highlight-gray celda">fisico</th>
                    <th class="highlight-gray celda">Diagramas</th>
                    <th class="highlight-gray celda">Servicio Irregular</th>
                    <th class="highlight-gray celda">Enfermos</th>
                    <th class="highlight-gray celda">Res 558</th>
                    <th class="highlight-gray celda">Licencia anual</th>
                    <th class="highlight-gray celda">Esc Técnica</th>
                    <th class="highlight-gray celda">
                        Ausente disciplinarios y suspensiones
                    </th>
                    <th class="highlight-gray celda">
                        Lic. Legales y convención
                    </th>
                    <th class="highlight-gray celda">Ausente otros motivos</th>
                    <th class="highlight-gray celda">Ausentismo</th>
                    <th class="highlight-gray celda">
                        % Ausentismo Diagramado
                    </th>
                    <th class="highlight-gray celda">% Ausentismo Fis</th>
                    <th class="highlight-gray celda">Franco</th>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Conductores Eléctricos</td>
                    <td class="celda">
                        {{ estadistico.conductorElec.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.conductorElec.porAusDiag ? estadistico.conductorElec.porAusDiag :"-" }}
                    </td>
                    <td class="celda">
                        % {{ estadistico.conductorElec.porAusFisico ? estadistico.conductorElec.porAusFisico : "-" }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorElec.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Conductores Diesel</td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.conductorDiesel.porAusDiag ? estadistico.conductorDiesel.porAusDiag : "-" }}
                    </td>
                    <td class="celda">
                        % {{ estadistico.conductorDiesel.porAusFisico ? estadistico.conductorDiesel.porAusFisico :"-" }}
                    </td>
                    <td class="celda">
                        {{ estadistico.conductorDiesel.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Ayudantes Conductor</td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.ayudanteConductor.porAusDiag ? estadistico.ayudanteConductor.porAusDiag : "-" }}
                    </td>
                    <td class="celda">
                        % {{ estadistico.ayudanteConductor.porAusFisico ? estadistico.ayudanteConductor.porAusFisico :"-" }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteConductor.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Ayudantes Habilitados</td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.ayudanteHabilitado.porAusDiag ? estadistico.ayudanteHabilitado.porAusDiag : "-" }}
                    </td>
                    <td class="celda">
                        % {{ estadistico.ayudanteHabilitado.porAusFisico ?  estadistico.ayudanteHabilitado.porAusFisico: "-" }}
                    </td>
                    <td class="celda">
                        {{ estadistico.ayudanteHabilitado.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Guardatren Eléctrico</td>
                    <td class="celda">
                        {{ estadistico.guardaElec.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.guardaElec.porAusDiag? estadistico.guardaElec.porAusDiag:"-" }}
                    </td>
                    <td class="celda">
                        % {{ estadistico.guardaElec.porAusFisico ?estadistico.guardaElec.porAusFisico:"-"}}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaElec.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">Guardatren Diesel</td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.fisico }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.diagramas }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.servicioIrregular }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.enfermos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.res558 }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.licenciaAnual }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.escTecnica }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.ausenteDisciplinarios}}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.legalesConvencionales }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.otrosMotivos }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.ausentismo}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.guardaDiesel.porAusDiag ?estadistico.guardaDiesel.porAusDiag:"-"}}
                    </td>
                    <td class="celda">
                        % {{ estadistico.guardaDiesel.porAusFisico?estadistico.guardaDiesel.porAusFisico:"-" }}
                    </td>
                    <td class="celda">
                        {{ estadistico.guardaDiesel.franco }}
                    </td>
                </tr>
                <tr>
                    <td class="highlight-gray celda">
                        <strong>Totales</strong>
                    </td>
                    <td class="celda"><strong>{{ estadistico.totales.fisico }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.diagramas }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.servicioIrregular }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.enfermos }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.res558 }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.licenciaAnual }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.escTecnica }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.ausenteDisciplinarios }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.legalesConvencionales }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.otrosMotivos }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.ausentismo }}</strong></td>
                    <td class="celda"><strong>% {{ estadistico.totales.porAusDiag ?estadistico.totales.porAusDiag:"-" }}</strong></td>
                    <td class="celda"><strong>% {{ estadistico.totales.porAusFisico ? estadistico.totales.porAusFisico:"-" }}</strong></td>
                    <td class="celda"><strong>{{ estadistico.totales.franco }}</strong></td>
                </tr>
            </table>
            <!-- <div class="chart-container" ref="chartContainer">
                <Pie ref="pieChart" :data="chartData" :options="chartOptions" />
            </div> -->
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { Pie } from "vue-chartjs";
// import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
import { Novedad } from "../../interfaces/INovedades";
import { newToken } from "../../services/signService";
import {
    loadNovedades,
    loadPersonales,
    loadTurnos,
} from "../../utils/funciones";
import { IEstadistica, TipoAusentismo } from "../../interfaces/IEstadistica";
import { ITurno } from "../../interfaces/ITurno";
import { IPersonal } from "../../interfaces/IPersonal";
import { obtenerTiposCirculares } from "../../utils/turnos";
import { obtenerDotaciones } from "../../utils/personal";
import { itinerarioType } from "../../utils/fechas";
// ChartJS.register(ArcElement, Tooltip, Legend);

export default defineComponent({
    // components: {
    //     // Pie,
    // },
    data() {
        return {
            isLoading: true,
            lstNovedades: [] as Novedad[],
            lstTurnos: [] as ITurno[],
            lstPersonales: [] as IPersonal[],
            circulares: [] as string[],
            circularSeleccionada: "",
            fecha: "" as string,
            itinerario: "" as string,
            dotacionesPermitidas: [] as string[],
            dotacionesSeleccionadas: ["PC", "LLV", "TY", "LP", "K5", "RE", "CÑ", "AK","OA"] as string[],
            estadistico: {
                conductorElec: new TipoAusentismo(),
                conductorDiesel: new TipoAusentismo(),
                ayudanteConductor: new TipoAusentismo(),
                ayudanteHabilitado: new TipoAusentismo(),
                guardaElec: new TipoAusentismo(),
                guardaDiesel: new TipoAusentismo(),
                totales: new TipoAusentismo(),
            } as IEstadistica,
            chartData: {
                labels: [] as string[],
                datasets: [
                    {
                        label: "Distribución de Totales por Categoría",
                        data: [0, 0, 0, 0, 0, 0, 0, 0] as number[],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#4BC0C0",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#FF9F40",
                            "#FFCD56",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "right" as const, // Asegura que la posición sea una cadena literal
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context: any) {
                                let label = context.label || "";
                                if (context.raw !== undefined) {
                                    label += ": " + context.raw;
                                }
                                return label;
                            },
                        },
                    },
                },
            },
        };
    },
    methods: {
        async exportToExcel() {
            await this.$nextTick(); // Espera a que el DOM se actualice

            const table = this.$refs.dataTable as HTMLTableElement;
            // const chartContainer = this.$refs.chartContainer as HTMLDivElement;

            if (!table ) {
                console.error(
                    "El contenedor de la tabla o del gráfico no se encontró."
                );
                return;
            }

            try {
                // Captura la imagen del gráfico
                // const chartCanvas = await html2canvas(chartContainer);
                // const imageData = chartCanvas.toDataURL("image/png");

                // Crear un nuevo libro de trabajo
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Datos");

                // Agregar los encabezados solo una vez
                const headers = [
                    "fisico",
                    "Especialidad",
                    "Diagramas",
                    "Servicio Irregular",
                    "Enfermos",
                    "Res 558",
                    "Licencia anual",
                    "Esc Técnica",
                    "Ausente disciplinarios y suspensiones",
                    "Lic. Legales y convención",
                    "Ausente otros motivos",
                    "Ausentismo",
                    "% Ausentismo Diagramado",
                    "% Ausentismo Fis",
                    "Franco",
                ];
                worksheet.addRow(headers);

                // Agregar las filas de datos
                const rows = Array.from(table.querySelectorAll("tr")).map(
                    (tr) => {
                        return Array.from(tr.querySelectorAll("td, th")).map(
                            (td) => td.textContent || ""
                        );
                    }
                );

                // Si el primer row contiene encabezados, los omitimos
                rows.shift(); // Elimina el primer elemento del array (los encabezados si están presentes en la tabla)

                rows.forEach((row) => worksheet.addRow(row));

                // Ajustar el ancho de las columnas
                worksheet.columns.forEach((column: any) => {
                    const maxLength = column.values.reduce(
                        (max: any, value: any) =>
                            Math.max(max, value ? value.toString().length : 0),
                        0
                    );
                    column.width = maxLength + 2; // +2 for padding
                });

                // Agregar la imagen del gráfico
                // const imageId = workbook.addImage({
                //     base64: imageData,
                //     extension: "png",
                // });
                // worksheet.addImage(imageId, {
                //     tl: { col: 0, row: rows.length + 1 },
                //     ext: { width: 600, height: 300 },
                // });

                // Guardar el archivo
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                saveAs(blob, "Estadística de ausentismo.xlsx");
            } catch (error) {
                console.error(
                    "Error al capturar la imagen del gráfico o al exportar el archivo:",
                    error
                );
            }
        },
        realizarCalculo() {

            this.itinerario = itinerarioType(new Date(this.fecha));

            this.calcularValores(
                "conductorElec",
                this.contarPersonal("conductor electrico"),
                this.contarTurnos("conductor electrico"),
                this.contarServicioIrregular("conductor electrico")
            );
            this.calcularValores(
                "conductorDiesel",
                this.contarPersonal("conductor diesel"),
                this.contarTurnos("conductor diesel"),
                this.contarServicioIrregular("conductor diesel")
            );
            this.calcularValores(
                "ayudanteConductor",
                this.contarPersonal("ayudante conductor"),
                this.contarTurnos("conductor diesel"),//asumo que los diagramas de ayudantes a conductor son los mismo que los conductores
                this.contarServicioIrregular("ayudante conductor")
            );
            this.calcularValores(
                "ayudanteHabilitado",
                this.contarPersonal("ayudante habilitado"),
                this.contarTurnos("ayudante habilitado"),
                this.contarServicioIrregular("ayudante habilitado")
            );
            this.calcularValores(
                "guardaElec",
                this.contarPersonal("guardatren electrico"),
                this.contarTurnos("guardatren electrico"),
                this.contarServicioIrregular("guardatren electrico")
            );
            this.calcularValores(
                "guardaDiesel",
                this.contarPersonal("guardatren diesel"),
                this.contarTurnos("guardatren diesel"),
                this.contarServicioIrregular("guardatren diesel")
            );

            //Calculo de enfermos
            this.calcularEstadisticasAusentismo('conductorElec', 'conductor electrico');
            this.calcularEstadisticasAusentismo('conductorDiesel', 'Conductor diesel');
            this.calcularEstadisticasAusentismo('ayudanteConductor', 'Ayudante conductor');
            this.calcularEstadisticasAusentismo('ayudanteHabilitado', 'Ayudante habilitado');
            this.calcularEstadisticasAusentismo('guardaElec', 'Guardatren electrico');
            this.calcularEstadisticasAusentismo('guardaDiesel', 'Guardatren diesel');

            // Calculo de Ausentismo
            this.estadistico.conductorElec.ausentismo =
                this.estadistico.conductorElec.enfermos +
                this.estadistico.conductorElec.res558 +
                this.estadistico.conductorElec.licenciaAnual +
                this.estadistico.conductorElec.escTecnica +
                this.estadistico.conductorElec.legalesConvencionales +
                this.estadistico.conductorElec.otrosMotivos;

            this.estadistico.conductorDiesel.ausentismo =
                this.estadistico.conductorDiesel.enfermos +
                this.estadistico.conductorDiesel.res558 +
                this.estadistico.conductorDiesel.licenciaAnual +
                this.estadistico.conductorDiesel.escTecnica +
                this.estadistico.conductorDiesel.legalesConvencionales +
                this.estadistico.conductorDiesel.otrosMotivos;

            this.estadistico.ayudanteConductor.ausentismo =
                this.estadistico.ayudanteConductor.enfermos +
                this.estadistico.ayudanteConductor.res558 +
                this.estadistico.ayudanteConductor.licenciaAnual +
                this.estadistico.ayudanteConductor.escTecnica +
                this.estadistico.ayudanteConductor.legalesConvencionales +
                this.estadistico.ayudanteConductor.otrosMotivos;

            this.estadistico.ayudanteHabilitado.ausentismo =
                this.estadistico.ayudanteHabilitado.enfermos +
                this.estadistico.ayudanteHabilitado.res558 +
                this.estadistico.ayudanteHabilitado.licenciaAnual +
                this.estadistico.ayudanteHabilitado.escTecnica +
                this.estadistico.ayudanteHabilitado.legalesConvencionales +
                this.estadistico.ayudanteHabilitado.otrosMotivos;

            this.estadistico.guardaElec.ausentismo =
                this.estadistico.guardaElec.enfermos +
                this.estadistico.guardaElec.res558 +
                this.estadistico.guardaElec.licenciaAnual +
                this.estadistico.guardaElec.escTecnica +
                this.estadistico.guardaElec.legalesConvencionales +
                this.estadistico.guardaElec.otrosMotivos;

            this.estadistico.guardaDiesel.ausentismo =
                this.estadistico.guardaDiesel.enfermos +
                this.estadistico.guardaDiesel.res558 +
                this.estadistico.guardaDiesel.licenciaAnual +
                this.estadistico.guardaDiesel.escTecnica +
                this.estadistico.guardaDiesel.legalesConvencionales +
                this.estadistico.guardaDiesel.otrosMotivos;

            //Porcentaje de Ausentes Diagramados
            this.estadistico.conductorElec.porAusDiag = parseFloat(((this.estadistico.conductorElec.ausentismo *100)/this.estadistico.conductorElec.diagramas).toFixed(2));
            this.estadistico.conductorDiesel.porAusDiag = parseFloat(((this.estadistico.conductorDiesel.ausentismo *100)/this.estadistico.conductorDiesel.diagramas).toFixed(2));
            this.estadistico.ayudanteConductor.porAusDiag = parseFloat(((this.estadistico.ayudanteConductor.ausentismo *100)/this.estadistico.ayudanteConductor.diagramas).toFixed(2));
            this.estadistico.ayudanteHabilitado.porAusDiag = this.estadistico.ayudanteHabilitado.diagramas !== 0 ? parseFloat(((this.estadistico.ayudanteHabilitado.ausentismo *100)/this.estadistico.ayudanteHabilitado.diagramas).toFixed(2)) : 0 ;
            this.estadistico.guardaElec.porAusDiag = parseFloat(((this.estadistico.guardaElec.ausentismo *100)/this.estadistico.guardaElec.diagramas).toFixed(2));
            this.estadistico.guardaDiesel.porAusDiag = parseFloat(((this.estadistico.guardaDiesel.ausentismo *100)/this.estadistico.guardaDiesel.diagramas).toFixed(2));
            this.estadistico.totales.porAusDiag = parseFloat(((this.estadistico.totales.ausentismo *100)/this.estadistico.totales.diagramas).toFixed(2));

            //Porcentaje de Ausentes Fisico
            this.estadistico.conductorElec.porAusFisico = parseFloat(((this.estadistico.conductorElec.ausentismo *100)/this.estadistico.conductorElec.fisico).toFixed(2));
            this.estadistico.conductorDiesel.porAusFisico = parseFloat(((this.estadistico.conductorDiesel.ausentismo *100)/this.estadistico.conductorDiesel.fisico).toFixed(2));
            this.estadistico.ayudanteConductor.porAusFisico = parseFloat(((this.estadistico.ayudanteConductor.ausentismo *100)/this.estadistico.ayudanteConductor.fisico).toFixed(2));
            this.estadistico.ayudanteHabilitado.porAusFisico = parseFloat(((this.estadistico.ayudanteHabilitado.ausentismo *100)/this.estadistico.ayudanteHabilitado.fisico).toFixed(2));
            this.estadistico.guardaElec.porAusFisico = parseFloat(((this.estadistico.guardaElec.ausentismo *100)/this.estadistico.guardaElec.fisico).toFixed(2));
            this.estadistico.guardaDiesel.porAusFisico = parseFloat(((this.estadistico.guardaDiesel.ausentismo *100)/this.estadistico.guardaDiesel.fisico).toFixed(2));
            this.estadistico.totales.porAusFisico = parseFloat(((this.estadistico.totales.ausentismo *100)/this.estadistico.totales.fisico).toFixed(2));

            //Francos
            const francos = this.contarFranco(this.lstPersonales,this.fecha)
            
            this.estadistico.conductorElec.franco = francos["conductor electrico"]
            this.estadistico.conductorDiesel.franco = francos["conductor diesel"]
            this.estadistico.ayudanteConductor.franco = francos["ayudante conductor"]
            this.estadistico.ayudanteHabilitado.franco = francos["ayudante habilitado"]
            this.estadistico.guardaElec.franco = francos["guardatren electrico"]
            this.estadistico.guardaDiesel.franco = francos["guardatren diesel"]

            
            // Actualiza los totales
            this.estadistico.totales.fisico =
                this.estadistico.conductorElec.fisico +
                this.estadistico.conductorDiesel.fisico +
                this.estadistico.ayudanteConductor.fisico +
                this.estadistico.ayudanteHabilitado.fisico +
                this.estadistico.guardaElec.fisico +
                this.estadistico.guardaDiesel.fisico;

            this.estadistico.totales.diagramas =
                this.estadistico.conductorElec.diagramas +
                this.estadistico.conductorDiesel.diagramas +
                this.estadistico.ayudanteConductor.diagramas +
                this.estadistico.ayudanteHabilitado.diagramas +
                this.estadistico.guardaElec.diagramas +
                this.estadistico.guardaDiesel.diagramas;

            this.estadistico.totales.servicioIrregular =
                this.estadistico.conductorElec.servicioIrregular +
                this.estadistico.conductorDiesel.servicioIrregular +
                this.estadistico.ayudanteConductor.servicioIrregular +
                this.estadistico.ayudanteHabilitado.servicioIrregular +
                this.estadistico.guardaElec.servicioIrregular +
                this.estadistico.guardaDiesel.servicioIrregular;

            this.estadistico.totales.enfermos =
                this.estadistico.conductorElec.enfermos +
                this.estadistico.conductorDiesel.enfermos +
                this.estadistico.ayudanteConductor.enfermos +
                this.estadistico.ayudanteHabilitado.enfermos +
                this.estadistico.guardaElec.enfermos +
                this.estadistico.guardaDiesel.enfermos;

            this.estadistico.totales.res558 =
                this.estadistico.conductorElec.res558 +
                this.estadistico.conductorDiesel.res558 +
                this.estadistico.ayudanteConductor.res558 +
                this.estadistico.ayudanteHabilitado.res558 +
                this.estadistico.guardaElec.res558 +
                this.estadistico.guardaDiesel.res558;

            this.estadistico.totales.licenciaAnual =
                this.estadistico.conductorElec.licenciaAnual +
                this.estadistico.conductorDiesel.licenciaAnual +
                this.estadistico.ayudanteConductor.licenciaAnual +
                this.estadistico.ayudanteHabilitado.licenciaAnual +
                this.estadistico.guardaElec.licenciaAnual +
                this.estadistico.guardaDiesel.licenciaAnual;

            this.estadistico.totales.ausenteDisciplinarios =
                this.estadistico.conductorElec.ausenteDisciplinarios +
                this.estadistico.conductorDiesel.ausenteDisciplinarios +
                this.estadistico.ayudanteConductor.ausenteDisciplinarios +
                this.estadistico.ayudanteHabilitado.ausenteDisciplinarios +
                this.estadistico.guardaElec.ausenteDisciplinarios +
                this.estadistico.guardaDiesel.ausenteDisciplinarios;
            
            this.estadistico.totales.legalesConvencionales =
                this.estadistico.conductorElec.legalesConvencionales +
                this.estadistico.conductorDiesel.legalesConvencionales +
                this.estadistico.ayudanteConductor.legalesConvencionales +
                this.estadistico.ayudanteHabilitado.legalesConvencionales +
                this.estadistico.guardaElec.legalesConvencionales +
                this.estadistico.guardaDiesel.legalesConvencionales;
            
            this.estadistico.totales.otrosMotivos =
                this.estadistico.conductorElec.otrosMotivos +
                this.estadistico.conductorDiesel.otrosMotivos +
                this.estadistico.ayudanteConductor.otrosMotivos +
                this.estadistico.ayudanteHabilitado.otrosMotivos +
                this.estadistico.guardaElec.otrosMotivos +
                this.estadistico.guardaDiesel.otrosMotivos;
            
            this.estadistico.totales.ausentismo =
                this.estadistico.conductorElec.ausentismo +
                this.estadistico.conductorDiesel.ausentismo +
                this.estadistico.ayudanteConductor.ausentismo +
                this.estadistico.ayudanteHabilitado.ausentismo +
                this.estadistico.guardaElec.ausentismo +
                this.estadistico.guardaDiesel.ausentismo;

            this.estadistico.totales.porAusDiag =
                this.estadistico.conductorElec.porAusDiag +
                this.estadistico.conductorDiesel.porAusDiag +
                this.estadistico.ayudanteConductor.porAusDiag +
                this.estadistico.ayudanteHabilitado.porAusDiag +
                this.estadistico.guardaElec.porAusDiag +
                this.estadistico.guardaDiesel.porAusDiag;

            this.estadistico.totales.porAusFisico =
                this.estadistico.conductorElec.porAusFisico +
                this.estadistico.conductorDiesel.porAusFisico +
                this.estadistico.ayudanteConductor.porAusFisico +
                this.estadistico.ayudanteHabilitado.porAusFisico +
                this.estadistico.guardaElec.porAusFisico +
                this.estadistico.guardaDiesel.porAusFisico;

            this.estadistico.totales.franco =
                this.estadistico.conductorElec.franco +
                this.estadistico.conductorDiesel.franco +
                this.estadistico.ayudanteConductor.franco +
                this.estadistico.ayudanteHabilitado.franco +
                this.estadistico.guardaElec.franco +
                this.estadistico.guardaDiesel.franco;


            //Dibujamos grafico
            // this.actualizarChartData();
            this.cambioCirculares();

        },
        contarFranco(personales: IPersonal[], fecha: string): { [especialidad: string]: number } {
            const date = new Date(fecha);
            const diaSemana = date.getDay(); // 0 para domingo, 6 para sábado

            const conteoPorEspecialidad: { [especialidad: string]: number } = {
                "conductor electrico":0,
                "conductor diesel":0,
                "ayudante conductor":0,
                "ayudante habilitado":0,
                "guardatren electrico":0,
                "guardatren diesel":0,
            };

            personales.forEach((personal) => {
                if (personal.franco === diaSemana && this.dotacionesSeleccionadas.includes(personal.dotacion)) {
                    const especialidad = personal.especialidad.toLowerCase();
                    if (!conteoPorEspecialidad[especialidad]) {
                        conteoPorEspecialidad[especialidad] = 0;
                    }
                    conteoPorEspecialidad[especialidad]++;
                }
            });

            return conteoPorEspecialidad;
        },
        // actualizarChartData() {
        //     this.chartData.datasets[0].data = [
        //         this.estadistico.totales.enfermos,
        //         this.estadistico.totales.res558,
        //         this.estadistico.totales.licenciaAnual,
        //         this.estadistico.totales.escTecnica,
        //         this.estadistico.totales.ausenteDisciplinarios,
        //         this.estadistico.totales.legalesConvencionales,
        //         this.estadistico.totales.otrosMotivos,
        //         this.estadistico.totales.franco,
        //     ];
        //     this.chartData.labels = [
        //         "Enfermos",
        //         "Res 558",
        //         "Licencia anual",
        //         "Esc Técnica",
        //         "Ausente disciplinarios y suspensiones",
        //         "Lic. Legales y convención",
        //         "Ausente otros motivos",
        //         "Franco",
        //     ];
            
        //     // Forzar actualización del gráfico
        //     this.$forceUpdate();
        // },
        contarNovedadesPorFechaYEspecialidad(novedades: Novedad[],fecha: string,especialidad: string, tipoNovedad: string): number {
            return novedades.filter((novedad: Novedad) => {
                const fechaParametro = new Date(fecha);
                const fechaBaja = new Date(novedad.fechaBaja);
                const fechaAlta = novedad.fechaAlta ? new Date(novedad.fechaAlta) : null;

                const esEspecialidadCorrecta = novedad.especialidad.toLowerCase() === especialidad.toLowerCase();
                const esTipoNovedadCorrecta = novedad.tipoNovedad.toLowerCase() === tipoNovedad.toLowerCase() 
                const esDotacionSeleccionada = this.dotacionesSeleccionadas.includes(novedad.base);
                                
                const estaDentroDeRango = 
                    fechaParametro >= fechaBaja &&
                    (fechaAlta === null || fechaParametro <= fechaAlta);

                return esEspecialidadCorrecta && estaDentroDeRango && esTipoNovedadCorrecta && esDotacionSeleccionada;
            }).length;
        },
        calcularValores(
            tipo: string,
            valorFisico: number,
            valorDiagramas: number,
            valorServicioIrregular: number
        ) {
            if (this.estadistico[tipo]) {
                this.estadistico[tipo].fisico = valorFisico;
                this.estadistico[tipo].diagramas = valorDiagramas;
                this.estadistico[tipo].servicioIrregular = valorServicioIrregular;
            } else {
                console.error(`Tipo ${tipo} no existe en estadistico`);
            }
        },
        calcularEstadisticasAusentismo(tipo: string, especialidad: string) {
            this.estadistico[tipo].enfermos = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Enfermedad") +
                                            this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "ART");
            this.estadistico[tipo].res558 = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Arrollamiento 558");
            this.estadistico[tipo].licenciaAnual = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Licencia Anual");
            this.estadistico[tipo].escTecnica = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Estudio");
            this.estadistico[tipo].ausenteDisciplinarios = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Suspension");
            this.estadistico[tipo].otrosMotivos = this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, "Ausente");
            this.estadistico[tipo].legalesConvencionales = [
                "Licencia Deportiva", "Licencia Gremial", "Examen", "Art17-23", 
                "Donación Sangre", "Donación Plaqueta", "Casamiento", "Duelo"
            ].reduce((sum, motivo) => sum + this.contarNovedadesPorFechaYEspecialidad(this.lstNovedades, this.fecha, especialidad, motivo), 0);
        },
        calcularEstadisticas() {
            const tipos = [
                {
                    tipo: "conductor electrico",
                    tipoTurno: "conductor electrico",
                },
                { tipo: "conductor diesel", tipoTurno: "conductor diesel" },
                { tipo: "ayudante conductor", tipoTurno: "ayudante conductor" },
                {
                    tipo: "ayudante habilitado",
                    tipoTurno: "ayudante habilitado",
                },
                {
                    tipo: "guardatren electrico",
                    tipoTurno: "guardatren electrico",
                },
                { tipo: "guardatren diesel", tipoTurno: "guardatren diesel" },
            ];

            tipos.forEach(({ tipo, tipoTurno }) => {
                const {
                    fisico,
                    diagramas,
                    servicioIrregular,
                } = this.actualizarEstadistico(tipo, tipoTurno);
                const key = tipo.replace(/\s+/g, ""); // Remueve espacios para obtener la clave en estadistico

                this.estadistico[key].fisico = fisico;
                this.estadistico[key].diagramas = diagramas;
                this.estadistico[key].servicioIrregular = servicioIrregular;
            });

            // Calcular totales
            const keys = [
                "conductorElec",
                "conductorDiesel",
                "ayudanteConductor",
                "ayudanteHabilitado",
                "guardaElec",
                "guardaDiesel",
            ];

            keys.forEach((key) => {
                this.estadistico.totales.fisico += this.estadistico[key].fisico;
                this.estadistico.totales.diagramas += this.estadistico[
                    key
                ].diagramas;
                this.estadistico.totales.servicioIrregular += this.estadistico[
                    key
                ].servicioIrregular;
            });
        },
        actualizarEstadistico(tipo: string, tipoTurno: string) {
            const fisico = this.contarPersonal(tipo);
            const diagramas = this.contarTurnos(tipoTurno);
            const servicioIrregular = fisico - diagramas;

            return { fisico, diagramas, servicioIrregular };
        },
        contarTurnos(especialidad: string) {
            return this.lstTurnos.filter((turno: ITurno) =>
                    turno.especialidad.toLowerCase() === especialidad.toLowerCase() &&
                    turno.circular === this.circularSeleccionada &&
                    turno.itinerario === this.itinerario &&
                    this.dotacionesSeleccionadas.includes(turno.dotacion) 
            ).length;
        },
        contarServicioIrregular(especialidad: string): number {
            return this.lstPersonales.filter((personal: IPersonal) =>
                personal.especialidad.toLowerCase() === especialidad.toLowerCase() &&
                personal.turno.toLowerCase().includes('ciclo')
            ).length;
        },
        contarPersonal(especialidad: string) {
            return this.lstPersonales.filter(
                (personal: IPersonal) =>
                    personal.especialidad.toLowerCase() === especialidad &&
                    this.dotacionesSeleccionadas.includes(personal.dotacion)
            ).length;
        },
        cambioCirculares() {
            window.localStorage.setItem(
                "circularSeleccionada",
                this.circularSeleccionada
            );

            // this.filtrar();
        },
    },
    mounted() {
        // // Aquí se ejecuta el código después de que el componente se ha montado
        // this.$nextTick(() => {
        //     console.log(this.chartData); // Verifica si los datos están configurados
        // console.log(this.chartOptions); // Verifica si las opciones están configuradas
        // console.log(this.$refs); // Verifica si 'pieChart' está en 'this.$refs'

        //     const pieChartInstance = this.$refs.pieChart as any;

        //     if (pieChartInstance) {
        //         this.actualizarChartData();
        //         pieChartInstance.__chartjs.update(); // Actualiza el gráfico
        //     } else {
        //         console.error("No se pudo encontrar el gráfico Pie.");
        //     }
        // });
    },
    async created() {
        try {
            this.lstNovedades = (await loadNovedades()) || [];
            this.lstTurnos = (await loadTurnos()) || [];
            this.lstPersonales = (await loadPersonales()) || [];
            this.circulares = obtenerTiposCirculares(this.lstTurnos);
            this.dotacionesPermitidas = obtenerDotaciones(this.lstPersonales);
            this.circularSeleccionada =
                window.localStorage.getItem("circularSeleccionada") || "";
            this.fecha = new Date().toISOString().split("T")[0];
            this.realizarCalculo();
            // this.actualizarChartData();
            newToken();
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    },
});
</script>

<style>
main {
    margin-top: 5rem;
}
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh; /* Ajusta la altura del gráfico */
}
.tabla {
    width: 80%;
    margin-top: 5rem;
    margin-left: 200px;
    border-collapse: collapse;
}
h1 {
    display: flex;
    justify-content: center;
}

.celda {
    border: 2px solid black;
    padding: 2px;
    text-align: center;
}
.highlight {
    background-color: rgba(90, 90, 90, 0.712);
}
.highlight-gray {
    background-color: lightgray;
}
</style>
