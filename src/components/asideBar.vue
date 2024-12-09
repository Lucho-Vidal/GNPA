<template>
    <div v-if="login" id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <nav
                class="sb-sidenav accordion sb-sidenav-dark"
                id="sidenavAccordion"
            >
                <div class="sb-sidenav-menu mx-4">
                    <div class="nav">
                        <div
                            class="sb-sidenav-menu-heading "
                            v-if="
                                rolMayor == 'moderator' ||
                                rolMayor == 'admin' ||
                                rolMayor == 'user'
                            "
                        >
                            <h6 class="">Aplicaciones</h6>
                            <router-link
                                class="nav-link"
                                to="/buscador"
                            >
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </div>
                                Buscador de trenes
                            </router-link>
                            <router-link
                                class="nav-link"
                                to="/listadoPersonales"
                            >
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-list-ul"></i>
                                </div>
                                Personal por base
                            </router-link>
                            <router-link
                                class="nav-link"
                                to="/listadoTrenesACubrir"
                            >
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-list-ul"></i>
                                </div>
                                Trenes sin cubrir
                            </router-link>
                            <router-link class="nav-link" to="/" disabled>
                                <div class="sb-nav-link-icon">
                                    <i class="fa-regular fa-rectangle-list"></i>
                                </div>
                                Sabana de trenes
                            </router-link>
                        </div>
                        <div
                            class="sb-sidenav-menu-heading"
                            v-if="
                                rolMayor == 'moderator' || rolMayor == 'admin'
                            "
                        >
                        <h6 class="">Administración de Personal</h6>
                            <router-link class="nav-link" to="/ordenamiento">
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-address-book"></i>
                                </div>
                                Ordenamientos 
                            </router-link>
                            <router-link class="nav-link" to="/cambioTurno">
                                <div class="sb-nav-link-icon">
                                    <i class="fa fa-user-o"></i>
                                    <i class="fa fa-user-o"></i>
                                </div>
                                Cambios de turnos
                            </router-link>
                            <router-link class="nav-link" to="/novedades">
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-table"></i>
                                </div>
                                Novedades de personal
                            </router-link>
                            <router-link class="nav-link" to="/personalSinDiagrama">
                                <div class="sb-nav-link-icon">
                                    <i class="fa fa-address-card"></i>
                                </div>
                                Personal sin diagrama
                            </router-link>
                            <router-link class="nav-link" to="/personal">
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-database"></i>
                                </div>
                                Gestión de personal
                            </router-link>
                            <a
                                class="nav-link collapsed"
                                href="#"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsePages"
                                aria-expanded="false"
                                aria-controls="collapsePages"
                            >
                                <div class="sb-nav-link-icon">
                                    <i class="fas fa-book-open"></i>
                                </div>
                                Documentos
                                <div class="sb-sidenav-collapse-arrow">
                                    <i class="fas fa-angle-down"></i>
                                </div>
                            </a>
                            <div
                                class="collapse"
                                id="collapsePages"
                                aria-labelledby="headingTwo"
                                data-bs-parent="#sidenavAccordion"
                            >
                                <nav
                                    class="sb-sidenav-menu-nested nav accordion"
                                    id="sidenavAccordionPages"
                                >
                                    <button
                                        class="nav-link"
                                        @click="
                                            abrirPdf(
                                                '/src/assets/OPE.30.20.10.30 Gestión de Novedades del Personal de Abordo.pdf'
                                            )
                                        "
                                    >
                                        Procesos GNPA
                                    </button>
                                    <a
                                        class="nav-link collapsed"
                                        href="#"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#pagesCollapseAuth"
                                        aria-expanded="false"
                                        aria-controls="pagesCollapseAuth"
                                    >
                                        Convenios Colectivos
                                        <div class="sb-sidenav-collapse-arrow">
                                            <i class="fas fa-angle-down"></i>
                                        </div>
                                    </a>
                                    <div
                                        class="collapse"
                                        id="pagesCollapseAuth"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#sidenavAccordionPages"
                                    >
                                        <nav class="sb-sidenav-menu-nested nav">
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/CCT-La-Fraternidad-2023.pdf'
                                                    )
                                                "
                                            >
                                                Fraternidad
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/cct-1574-2018-e.pdf'
                                                    )
                                                "
                                            >
                                                Union Ferroviaria
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/con-cct-1575-2018-e_-_union_ferroviaria_-_regionales.pdf'
                                                    )
                                                "
                                            >
                                                Union Ferroviaria LD
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/convenio_apdfa.pdf'
                                                    )
                                                "
                                            >
                                                APDFA
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/con-cct-1519-16_-_asfa.pdf'
                                                    )
                                                "
                                            >
                                                ASFA
                                            </button>
                                        </nav>
                                    </div>
                                    <a
                                        class="nav-link collapsed"
                                        href="#"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#pagesCollapseError"
                                        aria-expanded="false"
                                        aria-controls="pagesCollapseError"
                                    >
                                        Leyes Ferroviarias
                                        <div class="sb-sidenav-collapse-arrow">
                                            <i class="fas fa-angle-down"></i>
                                        </div>
                                    </a>
                                    <div
                                        class="collapse"
                                        id="pagesCollapseError"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#sidenavAccordionPages"
                                    >
                                        <nav class="sb-sidenav-menu-nested nav">
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/rito.pdf'
                                                    )
                                                "
                                            >
                                                RITO
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/ley_2873.pdf'
                                                    )
                                                "
                                            >
                                                LEY GENERAL DE FERROCARRILES
                                                NACIONALES
                                            </button>
                                            <button
                                                class="nav-link"
                                                @click="
                                                    abrirPdf(
                                                        '/src/assets/suplemento_rgf.pdf'
                                                    )
                                                "
                                            >
                                                LEY GENERAL DE FERROCARRILES
                                                NACIONALES Suplemento
                                            </button>
                                        </nav>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div
                            class="sb-sidenav-menu-heading"
                            v-if="rolMayor == 'admin'"
                        >
                        <h6 class="">Administración del sistema</h6>
                            <router-link class="nav-link" to="/turnos">
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-address-card"></i>
                                </div>
                                Administración de turnos
                            </router-link>
                            <router-link class="nav-link" to="/users">
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-users"></i>
                                </div>
                                Administración de usuarios
                            </router-link>
                            <router-link
                                class="nav-link"
                                to="/registros"
                                disabled
                            >
                                <div class="sb-nav-link-icon">
                                    <i class="fa-solid fa-file-shield"></i>
                                </div>
                                Registro de actividades
                            </router-link>
                        </div>
                    </div>
                </div>
                <!-- <div class="sb-sidenav-footer">
                    <div class="small">Logged in as:</div>
                    Start Bootstrap
                </div> -->
            </nav>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getRoles } from "../services/signService";
// import "@/assets/styles.css";

export default defineComponent({
    name: "asideBar",
    data() {
        return {
            login: false as boolean,
            username: "" as string,
            roles: [] as string[],
            rolMayor: "" as string,
            isDropdownOpen: false,
        };
    },
    methods: {
        getRol() {
            if (
                getRoles().length == 0 &&
                localStorage.getItem("roles") != null
            ) {
                this.roles = localStorage.getItem("roles")?.split(",") || [];
            } else {
                this.roles = getRoles();
            }
        },
        getRolMayor() {
            this.rolMayor =
                this.roles.find((rol: string) => rol == "admin") ||
                this.roles.find((rol: string) => rol == "moderator") ||
                this.roles.find((rol: string) => rol == "user") ||
                "";
        },
        abrirPdf(pdf: string) {
            this.$router.push({ name: "pdf", params: { rutaPdf: pdf } });
        },
    },
    created() {
        this.login = localStorage.getItem("token") ? true : false;
        this.username = localStorage.getItem("username") || "";
        this.getRol();
        this.getRolMayor();
    },
    mounted() {
        // Attach click event listener to document
        // document.addEventListener('click', this.closeDropdown);
    },
    beforeUnmount() {
        this.rolMayor = "";
        // Remove click event listener when component is unmounted
        // document.removeEventListener('click', this.closeDropdown);
    },
});
</script>

<style>
.dropdown-menu-custom {
    right: 0;
}
#layoutSidenav_nav {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 25vw;
}
.sb-sidenav-menu::-webkit-scrollbar{
    display: none;
}
</style>
