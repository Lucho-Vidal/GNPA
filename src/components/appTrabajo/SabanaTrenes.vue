<template>
    <div>
        <main class="container-fluid">
            <h2 class="d-flex justify-content-center m-3">Sabana de Trenes</h2>

            <div class="d-flex justify-content-end mx-5">
                <ul class="nav nav-tabs">
                    <li>
                        <select
                            name="itinerario"
                            id="itinerario"
                            class="form-control ms-3 w-auto"
                            required
                            v-model="inputIt"
                            @change="separarTrenesPorSentidoYPCOrdenar"
                        >
                            <option value=""></option>
                            <option value="H">Hábil</option>
                            <option value="S">Sábado</option>
                            <option value="D">Domingo</option>
                        </select>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            :class="[currentTab ? '' : 'active']"
                            @click="cambiarPestaña('ascendente')"
                        >
                            Sabana descendente
                        </button>
                    </li>
                    <li class="nav-item">
                        <button
                            class="nav-link"
                            :class="[currentTab ? 'active' : '']"
                            @click="cambiarPestaña('descendente')"
                        >
                            Sabana ascendente
                        </button>
                    </li>
                </ul>
            </div>
            <hr>

            <table
                v-if="!currentTab"
                class="col-6 table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th class="" colspan="1" rowspan="2">Tren</th>
                        <th class="" colspan="1" rowspan="2">Desde</th>
                        <th class="" colspan="1" rowspan="2">Hasta</th>
                        <th class="" colspan="1" rowspan="2">LLega</th>
                        <th class="" colspan="5" rowspan="1">Conductor</th>
                        <th class="" colspan="5" rowspan="1">Guarda</th>
                    </tr>
                    <tr>
                        <!-- Conductor -->
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Nombre</th>
                        <th class="" colspan="1" rowspan="1">Sale</th>
                        <th class="" colspan="1" rowspan="1">Hora</th>
                        <th class="" colspan="1" rowspan="1">Observación</th>
                        <!-- Guarda -->
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Nombre</th>
                        <th class="" colspan="1" rowspan="1">Sale</th>
                        <th class="" colspan="1" rowspan="1">Hora</th>
                        <th class="" colspan="1" rowspan="1">Observación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        class="Small shadow"
                        v-for="(desc, index) in sabanaDes"
                        :key="index"
                    >
                        <td class="col-1">{{ desc.tren }}</td>
                        <td class="col-1">{{ desc.desde }}</td>
                        <td class="col-1">{{ desc.hasta }}</td>
                        <td class="col-1">{{ desc.llega }}</td>
                        <td class="col-1">{{ desc.CtTurno }}</td>
                        <td class="col-2">{{ desc.CtNombre }}</td>
                        <td class="col-1">{{ desc.CtSale }}</td>
                        <td class="col-1">{{ desc.CtHora }}</td>
                        <td class="col-1">{{ desc.CtObs }}</td>
                        <td class="col-1">{{ desc.GdTurno }}</td>
                        <td class="col-3">{{ desc.GdNombre }}</td>
                        <td class="col-1">{{ desc.GdSale }}</td>
                        <td class="col-1">{{ desc.GdHora }}</td>
                        <td class="col-1">{{ desc.GdObs }}</td>
                    </tr>
                </tbody>
            </table>
            <table
                v-if="currentTab"
                class="col-6 table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th class="" colspan="1" rowspan="1" style="width: 10px;">R</th>
                        <th class="" colspan="2" rowspan="1">Tren  Sale</th>
                        <th class="" colspan="1" rowspan="1">Origen / Destino</th>
                        <th class="" colspan="2" rowspan="1">Para tren</th>
                    </tr>
                </thead>
                <tbody
                v-for="(tren, index) in sabanaAsc" :key="index"
                >
                    <tr class="bg-color" 
                        >
                        <td class="col-1" style="width: 10px;">{{ tren.rotacion }}</td>
                        <td class="col-1 negrita font-mayor" colspan="2">{{ tren.tren+' '+ tren.sale }}</td>
                        <td class="col-1 font-medio" >{{ tren.origen  }} <i class="fa-solid fa-arrow-right"></i> {{ tren.destino }}</td>
                        <td class="col-1" colspan="2">
                            {{ `${tren.paraTren} ` +
                                (itinerarioIndex[tren.paraTren]?.horarioXEst?.['PC'] ?
                                `PC: ${itinerarioIndex[tren.paraTren].horarioXEst['PC']}` :
                                tren.paraTrenHora) }}
                        </td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        
                    </tr>
                    <tr v-for="(item, i) in obtenerDatosMaximos(tren.turnos)" :key="i">
                        <!-- Conductores -->
                        <td class="col-1" style="width: 10px;">{{ item.conductor?.vueltas.find(vuelta => vuelta.tren === tren.tren)?.refer || '' }}</td>
                        <td class="col-1 font-medio">{{ item.conductor?.turno || '' }}</td>
                        <td class="col-3 negrita"> 
                            <span :class="{resaltado: item.conductor?.personal === 'Sin Cubrir' || 
                                    item.conductor?.personal === 'Diagrama Cancelado','resaltado-verde': 
                                    item.conductor?.personal.includes('Ordenado')}">
                                {{ item.conductor?.personal || '' }}
                            </span>
                        </td>
                        <td class="col-1">{{ buscarServicioAnterior(item.conductor,tren.tren) }}</td>
                        <td class="col-1">{{ item.conductor?.vueltas.find(vuelta => vuelta.tren === tren.tren)?.observaciones || '' }}</td>
                        
                        <!-- Guardas -->
                        <td class="col-1">{{ item.guarda?.vueltas.find(vuelta => vuelta.tren === tren.tren)?.refer || '' }}</td>
                        <td class="col-1 font-medio">{{ item.guarda?.turno || '' }}</td>
                        <td class="col-3 negrita"> 
                            <span :class="{resaltado: item.guarda?.personal === 'Sin Cubrir' || 
                                    item.guarda?.personal === 'Diagrama Cancelado','resaltado-verde': 
                                    item.guarda?.personal.includes('Ordenado')}">
                                {{ item.guarda?.personal || '' }}
                            </span>
                        </td>
                        
                        <td class="col-3">{{ buscarServicioAnterior(item.guarda,tren.tren)}}</td>
                        <td class="col-1">{{ item.guarda?.vueltas.find(vuelta => vuelta.tren === tren.tren)?.observaciones || '' }}</td>
                    </tr>
                </tbody>
            </table>
        </main>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ITurno } from "../../interfaces/ITurno";
import { Itinerario } from '../../interfaces/Itinerario';
import { IPersonal } from "../../interfaces/IPersonal";
import { Novedad } from "../../interfaces/INovedades";
import { newToken } from "../../services/signService";
import { SabanaAscendente, SabanaDescendente } from "../../interfaces/ISabana";
import { esUltimoCaracterPar, loadCambiosTurnos, loadItinerarios, loadNovedades, loadPersonales, loadTurnos } from "../../utils/funciones";
import { CambioTurno } from "../../interfaces/ICambioTurno";
import { Ordenamiento } from '../../interfaces/IOrdenamientos';
import { itinerarioType } from "../../utils/fechas";
import { filtroTrenes } from "../../utils/turnos";
import { buscarCancelacionDiagrama, buscarPersonalACargo } from "../../utils/personal";

export default defineComponent({
    data() {
        return {
            currentTab: true,
            itinerarioAsc: [] as Itinerario[],
            itinerarioDes: [] as Itinerario[],
            sabanaAsc: [] as SabanaAscendente[],
            sabanaDes: [] as SabanaDescendente[],

            pageSize: 10, // Tamaño de la página, ajusta según tus necesidades
            loading: false, // Indicador de carga

            scrollTop: 0,
            allItems: [], // Todos los datos cargados
            visibleItems: [], // Elementos que se mostrarán en pantalla
            itemsPerPage: 20, // Cantidad de elementos a cargar por página
            currentPage: 1, // Página actual


            lstTurnos: [] as ITurno[],
            personales: [] as IPersonal[],
            itinerario: [] as Itinerario[],
            novedades: [] as Novedad[],
            itinerarioIndex: {} as Record<string,Itinerario>,
            cambiosTurnos: [] as  CambioTurno[],
            ordenamientos: [] as Ordenamiento[],

            today: new Date(),
            inputIt: '',
        };
    },
    methods: {
        cambiarPestaña(sabana:string) {
            if(sabana === "ascendente"){
                this.currentTab = false;
            }else if(sabana === "descendente"){
                this.currentTab = true;
            }
        },
        obtenerDatosMaximos(turnos: ITurno[]) {
            const conductores = turnos.filter(turno => turno.especialidad.toLowerCase().includes('cond'));
            const guardas = turnos.filter(turno => turno.especialidad.toLowerCase().includes('guarda'));

            const maxLongitud = Math.max(conductores.length, guardas.length);

            // Estructuramos los datos para que coincidan con el máximo
            return Array.from({ length: maxLongitud }, (_, i) => ({
                conductor: conductores[i] || null,
                guarda: guardas[i] || null,
            }));
        },
        loadItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            
            const itinerarioACargar = this.itinerarioAsc.slice(start,end)
            let sabanaACargar:SabanaAscendente[]=[];

            itinerarioACargar.forEach(itinerario=>{
                sabanaACargar.push(this.crearItemSabanaAsc(itinerario))
            })
            // this.visibleItems.push(...this.allItems.slice(start, end));
            this.sabanaAsc.push(...sabanaACargar);
            this.currentPage++;
        },
        buscarServicioAnterior(turno:ITurno,tren:string){
            
            const vueltaActual = turno?.vueltas?.find(v => v.tren === tren);
            if (vueltaActual?.vuelta === 1) return `Toma: ${turno?.toma}`
            else if (vueltaActual?.vuelta && vueltaActual.vuelta > 1) {
                // Busca la vuelta anterior
                const vueltaAnterior = turno?.vueltas.find(v => v.vuelta === vueltaActual.vuelta - 1);
                return vueltaAnterior?.tren ? `${vueltaAnterior?.tren}  ${vueltaAnterior?.llega}` : `${vueltaAnterior?.refer.replace(/ /g, "").toLowerCase()}`;
            }
            return '-';
        },
        crearItemSabanaAsc(itinerario:Itinerario):SabanaAscendente{
            console.warn('Provisorio: circular');
            const turnosDelTren = filtroTrenes(this.inputIt,this.lstTurnos,['Dic24'],itinerario.tren);
            buscarPersonalACargo(
                    this.today,
                    itinerario.tren,
                    turnosDelTren,
                    this.personales,
                    this.novedades,
                    this.cambiosTurnos
                );
            buscarCancelacionDiagrama(this.ordenamientos,this.today.toISOString().split('T')[0],turnosDelTren,itinerario.tren)
            // const conductores = turnosDelTren.filter(turno=> turno.especialidad.includes('cond'));
            // const guardas = turnosDelTren.filter(turno=> turno.especialidad.includes('guar'));

            
            const itemSabana:SabanaAscendente = {
                rotacion:itinerario.rotacion,
                tren: itinerario.tren,
                sale: itinerario.horarios[0],
                origen: itinerario.estaciones[0],
                destino:itinerario.estaciones[itinerario.estaciones.length -1],
                paraTren: itinerario.trenSiguiente,
                paraTrenHora: itinerario.trenSiguienteHora,
                turnos: turnosDelTren
            } 
            return itemSabana
        },
        handleScroll() {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.offsetHeight;
            console.log(scrollTop,windowHeight,documentHeight);
            
            console.log('ho',scrollTop , this.scrollTop);

            // Verifica si el usuario está cerca del final del scroll
            if (scrollTop > this.scrollTop && scrollTop + windowHeight >= documentHeight - 100) {
                this.loadItems();
                console.log('hi',scrollTop , this.scrollTop);
                
                this.scrollTop = scrollTop;
            }
        },
        separarTrenesPorSentidoYPCOrdenar(){
            const ordenarPorHorario = (itinerario:Itinerario[])=>{
                itinerario.sort((it,it2)=>{
                    // return esHoraMayor(it.horarios[0],it2.horarios[0])
                    const [hora1, minuto1] = it.horarios[0].split(':').map(Number);
                    const [hora2, minuto2] = it2.horarios[0].split(':').map(Number);

                    const minutosTotales1 = hora1 * 60 + minuto1;
                    const minutosTotales2 = hora2 * 60 + minuto2;

                    return minutosTotales1 - minutosTotales2;
                })
            }

            this.itinerarioAsc = this.itinerario.filter(it=>{
                return (!esUltimoCaracterPar(it.tren) && (it.estaciones.includes('PC')||it.estaciones.includes('TY')) && it.itinerario === this.inputIt)
            })
            this.itinerarioDes = this.itinerario.filter(it=>{
                return (esUltimoCaracterPar(it.tren) && (it.estaciones.includes('PC')||it.estaciones.includes('TY')) && it.itinerario === this.inputIt)
            })
            ordenarPorHorario(this.itinerarioAsc)
            ordenarPorHorario(this.itinerarioDes)
        },
        indexarItinerario(itinerarios: Itinerario[]) {
            return itinerarios.reduce(
                (acumulador: Record<string, Itinerario>, itinerario: Itinerario) => {
                    acumulador[itinerario.tren] = itinerario;
                    return acumulador;
                },
                {} as Record<string, Itinerario>
            );
        },
        
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    async created() {
        try {
            this.lstTurnos = await loadTurnos() || [];
            this.itinerario = await loadItinerarios() || [];
            this.cambiosTurnos = await loadCambiosTurnos() || [];
            this.personales = await loadPersonales() || [];
            this.novedades = await loadNovedades() || [];
            this.itinerarioIndex = this.indexarItinerario(this.itinerario)

            this.inputIt = itinerarioType(this.today);
            this.separarTrenesPorSentidoYPCOrdenar()

            
            this.today.setHours(12, 0, 0, 0);
            this.loadItems()
            newToken();
        } catch (error) {
            console.error(error);
        }
    },
    computed: {},
    components: {
    },
});
</script>
<style>
main {
    margin-top: 5rem;
}
.Personal {
    background: #000;
    width: 150px;
    border-top: #0e0ee0;
    color: #fff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    border-radius: 0.5rem;
}
.bg-color{
    border-top: #000 3px solid;
}
.negrita{
    font-weight: bold;
}
.font-mayor{
    font-size: 1.8rem;
}
.font-medio{
    font-size: 1.3rem;
}
.resaltado {
    background-color: red;
    color: white;
    margin-inline: 10px;
    padding: 5px 50px; /* Opcional para agregar espaciado */
    border-radius: 4px; /* Opcional para bordes redondeados */
}
.resaltado-verde {
    background-color: lightgreen; /* Fondo verde claro */
    color: black;    
    margin-inline: 10px;
    padding: 5px; /* Opcional para agregar espaciado */
    border-radius: 4px; /* Opcional para bordes redondeados */  
    font-weight: bold;
}
</style>
