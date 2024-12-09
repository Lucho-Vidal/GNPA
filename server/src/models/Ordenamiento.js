import { model, Schema } from "mongoose";

const OrdenamientoSchema = new Schema({
    fecha: String,
    tipo: String,
    turnoEfectivo:String,
    toma:String,
    deja:String,
    personal: {},
    turno: {},
    detalle: String,
},{
    timestamps: true
});
export default model("Ordenamiento",OrdenamientoSchema);