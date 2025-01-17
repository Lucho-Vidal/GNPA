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

            <table
                v-if="!currentTab"
                class="col table table-striped table-hover"
            >
                <thead >
                    <tr class="border-enX border-arriba">
                        <th class="" colspan="1" rowspan="1" style="width: 10px;">R</th>
                        <th class="" colspan="2" rowspan="1">Tren - Llega</th>
                        <th class="" colspan="7" rowspan="1">Origen / Destino</th>
                        
                    </tr>
                    <tr class="border-enX">
                        <th class="" colspan="5" rowspan="1">Conductores</th>
                        <th class="" colspan="5" rowspan="1">Guardas</th>
                    </tr>
                    <tr class="border-enX">
                        <th class="" colspan="1" rowspan="1">Ref</th>
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Apellido y nombres</th>
                        <th class="" colspan="1" rowspan="1">LLega con</th>
                        <th class="" colspan="1" rowspan="1">Observaciones</th>

                        <th class="" colspan="1" rowspan="1">Ref</th>
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Apellido y nombres</th>
                        <th class="" colspan="1" rowspan="1">LLega con</th>
                        <th class="" colspan="1" rowspan="1">Observaciones</th>
                    </tr>
                </thead>
                <tbody
                v-for="(tren, index) in sabanaDes" :key="index"
                >
                    <tr class="border-arriba border-enX" 
                        >
                        <td class="col-1" style="width: 10px;">{{ tren.rotacion }}</td>
                        <td class="col-1 negrita font-mayor" colspan="2">{{ tren.tren+' '+ tren.llega }}</td>
                        <td class="col-1 font-medio" >{{ tren.desde  }} <i class="fa-solid fa-arrow-right"></i> {{ tren.hasta }}</td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                        <td class="col-1"></td>
                    </tr>
                    <tr class="border-enX" v-for="(item, i) in obtenerDatosMaximos(tren.turnos)" :key="i">
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
                        <td class="col-1">{{ buscarServicioPosterior(item.conductor,tren.tren) }}</td>
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
                        <td class="col-3">{{ buscarServicioPosterior(item.guarda,tren.tren)}}</td>
                        <td class="col-1">{{ item.guarda?.vueltas.find(vuelta => vuelta.tren === tren.tren)?.observaciones || '' }}</td>
                    </tr>
                </tbody>
            </table>
            <table
                v-if="currentTab"
                class="col table table-striped table-hover"
            >
                <thead>
                    <tr class="border-enX border-arriba">
                        <th class="" colspan="1" rowspan="1" style="width: 10px;">R</th>
                        <th class="" colspan="2" rowspan="1">Tren  Sale</th>
                        <th class="" colspan="1" rowspan="1">Origen / Destino</th>
                        <th class="" colspan="2" rowspan="1">Para tren</th>
                        <th class="" colspan="2" rowspan="1"></th>
                        <th class="" colspan="2" rowspan="1"></th>
                    </tr>
                    <tr class="border-enX">
                        <th class="" colspan="5" rowspan="1">Conductores</th>
                        <th class="" colspan="5" rowspan="1">Guardas</th>
                    </tr>
                    <tr class="border-enX">
                        <th class="" colspan="1" rowspan="1">Ref</th>
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Apellido y nombres</th>
                        <th class="" colspan="1" rowspan="1">LLega con</th>
                        <th class="" colspan="1" rowspan="1">Observaciones</th>

                        <th class="" colspan="1" rowspan="1">Ref</th>
                        <th class="" colspan="1" rowspan="1">Turno</th>
                        <th class="" colspan="1" rowspan="1">Apellido y nombres</th>
                        <th class="" colspan="1" rowspan="1">LLega con</th>
                        <th class="" colspan="1" rowspan="1">Observaciones</th>
                    </tr>
                </thead>
                <tbody
                v-for="(tren, index) in sabanaAsc" :key="index"
                >
                    <tr class="border-arriba border-enX" 
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
                    <tr class="border-enX" v-for="(item, i) in obtenerDatosMaximos(tren.turnos)" :key="i">
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
            <!-- Botón flotante volver arriba -->
            <button 
                @click="scrollToTop" 
                class="btn-flotante up"
            >
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
            </button>
            <button 
                @click="scrollToBottom" 
                class="btn-flotante down"
            >
                <i class="fa fa-arrow-down" aria-hidden="true"></i>
            </button>
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
            currentTab: false,
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
            currentPageAsc: 1, // Página actual
            currentPageDes: 1, // Página actual


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
        loadItemsAsc() {
            const start = (this.currentPageAsc - 1) * this.itemsPerPage;
            const end = this.currentPageAsc * this.itemsPerPage;
            
            const itinerarioACargar = this.itinerarioAsc.slice(start,end)
            let sabanaACargar:SabanaAscendente[] = [];

            itinerarioACargar.forEach(itinerario=>{
                sabanaACargar.push(this.crearItemSabanaAsc(itinerario))
            })
            // this.visibleItems.push(...this.allItems.slice(start, end));
            this.sabanaAsc.push(...sabanaACargar);
            this.currentPageAsc++;
        },
        loadItemsDes() {
            const start = (this.currentPageDes - 1) * this.itemsPerPage;
            const end = this.currentPageDes * this.itemsPerPage;
            
            const itinerarioACargar = this.itinerarioDes.slice(start,end)
            let sabanaACargar:SabanaDescendente[] = [];

            itinerarioACargar.forEach(itinerario=>{
                sabanaACargar.push(this.crearItemSabanaDes(itinerario))
            })
            this.sabanaDes.push(...sabanaACargar);
            this.currentPageDes++;
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
        buscarServicioPosterior(turno:ITurno,tren:string){
            if ( !turno ) return '-';
            const vueltaActual = turno?.vueltas?.find(v => v.tren === tren);            
            if (vueltaActual?.vuelta === turno?.vueltas?.length) return `Deja: ${turno?.deja}`
            else if (vueltaActual?.vuelta && vueltaActual.vuelta > 1) {
                // Busca la vuelta Posterior 
                console.warn("TODO revisar el caso que la siguiente vuelta este disponible. cambiar ternarios por ifs")
                const vueltaPosterior = turno?.vueltas.find(v => v.vuelta === vueltaActual.vuelta + 1);
                return vueltaPosterior?.refer.toLowerCase().includes('descanso') ? `Deja: ${turno?.toma}` :
                vueltaPosterior?.tren === '' ? `${vueltaPosterior?.refer}`:
                vueltaPosterior?.tren ? `${vueltaPosterior?.tren}  ${vueltaPosterior?.llega}` : `${vueltaPosterior?.refer.replace(/ /g, "").toLowerCase()}`;
            }
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
        crearItemSabanaDes(itinerario:Itinerario):SabanaDescendente{
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
            
            const itemSabana:SabanaDescendente = {
                rotacion:itinerario.rotacion,
                tren: itinerario.tren,
                desde: itinerario.estaciones[0],
                hasta:itinerario.estaciones[itinerario.estaciones.length -1],
                llega: itinerario.horarios[itinerario.estaciones.length -1],
                turnos: turnosDelTren
            } 
            return itemSabana
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Desplazamiento suave
            });
        },
        scrollToBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth" // Desplazamiento suave
            });
        },
        handleScroll() {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.offsetHeight;
            console.log(scrollTop,windowHeight,documentHeight);
            
            console.log('ho',scrollTop , this.scrollTop);

            // Verifica si el usuario está cerca del final del scroll
            if ( scrollTop + windowHeight >= documentHeight - 100) {
                console.log('hii',this.currentTab  );
                if(this.currentTab){
                    this.loadItemsAsc();
                }else{
                    this.loadItemsDes();
                }
                // console.log('hi',scrollTop , this.scrollTop);
                
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
            this.loadItemsAsc()
            this.loadItemsDes()
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
.border-arriba{
    border-top: #000 3px solid;
}
.border-enX{
    border-left: 2px solid #000;
    border-right: 2px solid #000;
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
.table thead th {
    position: sticky;
    top: 60px; /* Mantenerlo al principio del contenedor */
    z-index: 2; /* Asegúrate de que esté encima del contenido */
    background-color: #ddd; /* Fondo para mayor visibilidad */
    border-bottom: 1px solid #fff; /* Agregar una línea para separarlos del contenido */
    border-left: 1px solid #aaa;
}
.btn-flotante {
    position: fixed;
    z-index: 3; /* Encima de otros elementos */
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 10px 15px;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
}
.up{
    bottom: 80px;
    right: 20px;
}
.down{
    bottom: 20px;
    right: 20px;
}

.btn-flotante:hover {
    font-size: 30px;
    background-color: #0056b3;
}
html, body {
    overflow-x: hidden; /* Oculta la barra de desplazamiento horizontal */
}

</style>
