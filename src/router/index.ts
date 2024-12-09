import {
    RouteRecordRaw,
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    NavigationGuardNext,
} from "vue-router";

// Middleware para verificar si el usuario está autenticado
function requireAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    if (localStorage.getItem("token")) {
        if (to.path == "/" && from.path == "/login") {
            location.reload();
        }
        next();
    } else {
        next("/login");
    }
}

// Middleware para verificar si el usuario tiene el rol "moderator"
function requireModerator(next: NavigationGuardNext) {
    const roles = localStorage.getItem("roles")?.split(",") || [];
    if (roles.includes("moderator")) {
        next();
    } else {
        // Puedes redirigir a una página de error o a la página de inicio en caso de autorización insuficiente.
        next("/");
    }
}
function requireAdmin(next: NavigationGuardNext) {
    const roles = localStorage.getItem("roles")?.split(",") || [];
    if (roles.includes("admin")) {
        next();
    } else {
        // Puedes redirigir a una página de error o a la página de inicio en caso de autorización insuficiente.
        next("/");
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        redirect: "/",
    },
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/Home.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/components/sign/login.vue"),
        beforeEnter: (_, __, next) => {
            if (localStorage.getItem("token")) {
                next("/");
            } else {
                next();
            }
        },
    },
    {
        path: "/changePassword",
        name: "changePassword",
        meta: { title: "GNPA - Cambio de contraseña" },
        component: () => import("@/components/sign/changePassword.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/users",
        name: "users",
        meta: { title: "GNPA - Administración de  usuarios" },
        component: () => import("@/components/sign/lstUsers.vue"),
        beforeEnter: (_, __, next) => {
            requireAdmin(next);
        },
    },
    {
        path: "/newUser",
        name: "newUser",
        meta: { title: "GNPA - Nuevo usuario" },
        component: () => import("@/components/sign/newUser.vue"),
        beforeEnter: (_, __, next) => {
            requireAdmin(next);
        },
    },
    {
        path: "/editUser/:id",
        name: "editUser",
        meta: { title: "GNPA - Editar usuario" },
        component: () => import("@/components/sign/editUser.vue"),
        beforeEnter: (_, __, next) => {
            requireAdmin(next);
        },
    },
    {
        path: "/buscador",
        name: "Buscador",
        meta: { title: "GNPA - Buscador" },
        component: () => import("@/components/appTrabajo/BuscadorTrenes.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/Sabana",
        name: "Sabana",
        component: () => import("@/components/appTrabajo/SabanaTrenes.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/personal",
        name: "Personal",
        props: true,
        meta: { title: "GNPA - Personal" },
        component: () => import("@/components/personal/Personal.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/addpersonales",
        name: "addPersonales",
        meta: { title: "GNPA - Personal" },
        component: () => import("@/components/personal/addPersonales.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/editPersonal/:idPersonal?/:idDato?/:idVia?/:idTarjeta?",
        name: "editPersonal",
        props: true,
        meta: { title: "GNPA - Editar personal" },
        component: () => import("@/components/personal/editPersonal.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/novedades",
        name: "Novedades",
        meta: { title: "GNPA - Novedades" },
        component: () => import("@/components/novedades/Novedades.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/editNovedades/:id?/:legajo?",
        name: "NewNovedades",
        props: true,
        meta: { title: "GNPA - Nueva Novedad" },
        component: () => import("@/components/novedades/NewNovedades.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/personalSinDiagrama",
        name: "personalSinDiagrama",
        props: true,
        meta: { title: "GNPA - Servicio Irregular" },
        component: () => import("@/components/personalSinDiagrama/lstPersonalSinDiagrama.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/TarjetaPersonalSinDiagrama/:idPersonal?/:idPersonalSinDiagrama?",
        name: "TarjetaPersonalSinDiagrama",
        props: true,
        meta: { title: "GNPA - Servicio Irregular" },
        component: () => import("@/components/personalSinDiagrama/TarjetaPersonalSinDiagrama.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    // {
    //     path: "/editNovedades/:id?",
    //     name: "editNovedades",
    //     meta: { title: "GNPA - Editar Novedad" },
    //     component: () => import("@/components/novedades/EditNovedades.vue"),
    //     beforeEnter: (to, from, next) => {
    //         requireAuth(to, from, () => requireModerator(next));
    //     },
    // },
    {
        path: "/estadisticas",
        name: "estadisticas",
        meta: { title: "GNPA - Estadisticas" },
        component: () => import("@/components/novedades/estadisticas.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/turnos",
        name: "Turnos",
        meta: { title: "GNPA - Turnos" },
        component: () => import("@/components/turnos/Turnos.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireAdmin(next));
        },
    },
    {
        path: "/newTurno",
        name: "newTurno",
        meta: { title: "GNPA - Nuevo turno" },
        component: () => import("@/components/turnos/NewTurno.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireAdmin(next));
        },
    },
    {
        path: "/addTurnos",
        name: "addTurnos",
        meta: { title: "GNPA - Nuevos turnos" },
        component: () => import("@/components/turnos/addturnos.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireAdmin(next));
        },
    },
    {
        path: "/editTurno/:id",
        name: "editTurno",
        meta: { title: "GNPA - Editar turno" },
        component: () => import("@/components/turnos/EditTurno.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireAdmin(next));
        },
    },
    {
        path: "/registros",
        name: "registros",
        meta: { title: "GNPA - Registros" },
        component: () => import("@/components/registros.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireAdmin(next));
        },
    },
    {
        path: "/sinCubrir",
        name: "sinCubrir",
        meta: { title: "GNPA - Sin cubrir" },
        component: () => import("@/components/appTrabajo/lstCubrir.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/cambioTurno",
        name: "cambioTurno",
        meta: { title: "GNPA - Cambio de Turno" },
        component: () => import("@/components/cambioTurno/cambioTurno.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/newCambioTurno",
        name: "newCambioTurno",
        meta: { title: "GNPA - Nuevo Cambio de Turno" },
        component: () => import("@/components/cambioTurno/newCambioTurno.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/ordenamiento",
        name: "ordenamiento",
        meta: { title: "GNPA - Ordenamiento" },
        component: () => import("@/components/ordenamientos/ordenamiento.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/newOrdenamiento",
        name: "newOrdenamiento",
        meta: { title: "GNPA - Nuevo Ordenamiento" },
        component: () => import("@/components/ordenamientos/newOrdenamiento.vue"),
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
    {
        path: "/listadoPersonales",
        name: "listadoPersonales",
        meta: { title: "GNPA - Listado de personal" },
        component: () => import("@/components/appTrabajo/lstPersonales.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/listadoTrenesACubrir",
        name: "listadoTrenesACubrir",
        meta: { title: "GNPA - Listado de personal" },
        component: () => import("@/components/appTrabajo/lstCubrir.vue"),
        beforeEnter: requireAuth,
    },
    {
        path: "/pdf/:rutaPdf",
        name: "pdf",
        meta: { title: "GNPA - PDF" },
        component: () => import("@/components/pdf.vue"),
        // props: true,
        beforeEnter: (to, from, next) => {
            requireAuth(to, from, () => requireModerator(next));
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
