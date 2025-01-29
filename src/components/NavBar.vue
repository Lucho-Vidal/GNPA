<template>
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <!-- Navbar Brand-->
        <router-link class="navbar-brand mx-4" to="/" >GNPA - Trenes Argentinos</router-link>
        <!-- Sidebar Toggle-->
        <!-- <a @click="toggleSidebar" id="sidebarToggle" class="material-icons">list</a> -->
        <!-- <button v-if="login" class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" @click="toggleAsideBar"><i class="fas fa-bars"></i></button> -->
        <!-- Navbar username-->
        <span  v-if="login" class="ms-auto me-0 me-md-3 my-2 my-md-0" style="color: white;">{{ username }}</span>

        <!-- Navbar-->
        <ul  v-if="login" class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" aria-expanded="false" @click="toggleDropdown"><i class="fas fa-user fa-fw"></i></a>
                <!-- menu desplegable -->
                <ul ref="dropdownMenu" class="dropdown-menu dropdown-menu-custom" aria-labelledby="navbarDropdown">
                    <li><router-link class="dropdown-item" to="/changePassword" >Cambio contraseña</router-link></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><button class="dropdown-item" @click="logOut">Cerrar Sesión</button></li>
                </ul>
            </li>
        </ul>
    </nav>
    
    
</template>

<script lang="ts">
import { defineComponent,ref } from "vue";
import { getRoles } from "../services/signService";
// import "@/assets/styles.css";


export default defineComponent({
    data() {
        return {
            login: false as boolean,
            username: "" as string,
            roles: [] as string[],
            rolMayor: "" as string,
            isDropdownOpen: false
        };
    },
    setup(props, { emit }) {
        const isAsideBarVisible = ref(true);
        props
        function toggleAsideBar() {
            // isAsideBarVisible.value = localStorage.getItem('isAsideBarVisible') === 'true'
            isAsideBarVisible.value = !isAsideBarVisible.value;
            const body = document.body;
            body.classList.toggle('sb-sidenav-toggled');
            emit('update:isAsideBarVisible', isAsideBarVisible.value);
            // localStorage.setItem('isAsideBarVisible',(isAsideBarVisible.value ? 'true':'false'))
        }

        return {isAsideBarVisible,toggleAsideBar};
    },
    methods: {
        logOut() {
            //localStorage.clear();
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            localStorage.removeItem("token");
            this.rolMayor = "";
            this.login = false;
            this.$router.push("/login");
        },
        toggleDropdown() {
            const dropdownMenu = this.$refs.dropdownMenu as HTMLElement;
            if (dropdownMenu) {
                // Alternar la clase para mostrar u ocultar el menú desplegable
                dropdownMenu.classList.toggle('show');
                // Alternar el estado de isDropdownOpen
                this.isDropdownOpen = !this.isDropdownOpen;
            }
        },
        closeDropdown(event: MouseEvent) {
            // Check if the click event is outside the dropdown
            const dropdownMenu = this.$el.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                if (!dropdownMenu.contains(event.target)) {
                    this.isDropdownOpen = false;
                }
            }
        },
        toggleSidebar() {
            const body = document.body;
            body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', body.classList.contains('sb-sidenav-toggled').toString());
        },
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
.dropdown-menu-custom{
    right: 0;
}
#layoutSidenav{
    position: relative;
}
</style>

