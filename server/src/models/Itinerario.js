import { Schema, model } from "mongoose";

const itinerarioSchema = new Schema({
    tren: {
        type: String,
        required: true,
    },
    circular:String,
    itinerario: String,
    estaciones:[],
    horarios:[],
    horarioXEst:{},
});

export default model("Itinerario", itinerarioSchema);