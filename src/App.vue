<template>
    <div id="sb-nav-fixed" >
        <NavBar  :isAsideBarVisible="isAsideBarVisible" @update:isAsideBarVisible="isAsideBarVisible = $event"/>
        <asideBar :isAsideBarVisible="isAsideBarVisible" />
        <!-- <router-view class="router-view"/> -->
    <router-view id="layoutSidenav_content"
            class="router-view zIndex"
            :class="[
                isAsideBarVisible
                    ? 'layoutSidenav_content-width-max'
                    : 'layoutSidenav_content-width-min',
            ]"/>
            <!-- <FooterPage :class="[
                isAsideBarVisible
                    ? 'layoutSidenav_content-width-max'
                    : 'layoutSidenav_content-width-min',
            ]"/> -->
    </div>
</template>

<script lang="ts">
import { defineComponent,ref } from "vue";
import NavBar from "./components/NavBar.vue";
import asideBar from "./components/asideBar.vue";
import FooterPage from "./components/FooterPage.vue";
import  "./styles.css"
// import  "./styles copy.css"

export default defineComponent({
    name: "App",
    watch: {
    $route(to) {
            document.title = to.meta.title || 'GNPA '; // Usar un título predeterminado si no hay meta.title
        }
    },
    setup() {
        const isAsideBarVisible = ref(true);
        return { isAsideBarVisible };
    },
    methods:{
        handleAsideBarVisibility(isVisible: boolean) {
        this.isAsideBarVisible = isVisible;
    },
    },
    components: {
        NavBar,
        asideBar,
        FooterPage,
    },
});
</script>

<style>
    asideBar{
        z-index: 0;
    }
    .zIndex{
        z-index: 3;
    }
</style>
