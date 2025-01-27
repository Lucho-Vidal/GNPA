import express from "express";
import morgan from "morgan";
import cors from "cors";
import pkg from "../package.json";
import path from "path";
import { createRoles } from "./libs/initialSetup";

import personales from "./routers/personal.routes";
import personalSinDiagrama from "./routers/personalSinDiagrama.routes";
import tarjetaPersonalSinDiagrama from "./routers/tarjetaPersonalSinDiagrama.routes";
import itinerario from "./routers/itinerario.routes";
import novedades from "./routers/novedades.routes";
import novedadesHome from "./routers/novedadesHome.routes";
import turno from "./routers/turno.routes";
import authRoutes from "./routers/auth.routes";
import usersRoutes from "./routers/user.routes";
import registrosRoutes from "./routers/registro.routes";
import cambioTurnoRoutes from "./routers/cambioTurno.routes";
import ordenamientoRoutes from "./routers/ordenamientos.routes";
import { callBackup } from "./createBackup";

const app = express();
createRoles();

app.set("pkg", pkg);

app.use(morgan("dev"));
app.use(express.json());

const corsOptions = {
    origin: ["http://172.22.108.43:5173","http://localhost:5173"],
    // origin: "http://localhost:8080", // Reemplaza con la URL de tu frontend
    // origin: "http://172.22.108.29:5173/", // Reemplaza con la URL de tu frontend
    // origin: ["http://localhost:5173","http://localhost:8080","https://gnpa-trenesargentinos.web.app"], // Reemplaza con la URL de tu frontend
    //origin: "https://gnpa-trenesargentinos.web.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    credentials: true
};

app.use(cors(corsOptions));

callBackup("D:/backup")
// callBackup("") agregar compartidas PCT

app.use("/api", personales);
app.use("/api", personalSinDiagrama);
app.use("/api", tarjetaPersonalSinDiagrama);
app.use("/api", itinerario);
app.use("/api", novedades);
app.use("/api", novedadesHome);
app.use("/api", turno);
app.use("/api/auth", authRoutes);
app.use("/api", usersRoutes);
app.use("/api", registrosRoutes);
app.use("/api", cambioTurnoRoutes);
app.use("/api", ordenamientoRoutes);


app.use(express.static(path.join(__dirname,"..","..","dist"),{extensions:["html","css","js"]}));
app.use('/uploads', express.static(path.join(__dirname,"..", 'uploads')));
console.log(__dirname);

export default app;
