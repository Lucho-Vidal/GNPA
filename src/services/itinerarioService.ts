import { Itinerario } from "@/interfaces/Itinerario";
import axios from "./axios";
import { AxiosResponse } from "axios";

export const getItinerarios = async (): Promise<AxiosResponse<Itinerario[]>> =>
    await axios.get("/itinerario");

export const getItinerario = async (id: string): Promise<AxiosResponse<Itinerario>> =>
    await axios.get(`/itinerario/${id}`);

export const createMultipleItinerario = async (itinerario: Itinerario[]): Promise<AxiosResponse> => {
    const res = await axios.post("/itinerario/multiple", itinerario);
    return res;
};

export const createItinerario = async (itinerario: Itinerario): Promise<AxiosResponse> => {
    const res = await axios.post("/itinerario", itinerario);
    return res;
};

export const updateItinerario = async (
    id: string,
    newItinerario: Itinerario
): Promise<AxiosResponse<Itinerario>> => 
    await axios.put(`/itinerario/${id}`,newItinerario);

export const deleteItinerario =async (id: string): Promise<AxiosResponse> => 
    await axios.delete(`/itinerario/${id}`);

// export const getItinerarioPaginado = async (
//     page: number,
//     pageSize: number
// ): Promise<AxiosResponse<Itinerario[]>> => {
//     return axios
//         .get(`/itinerario?page=${page}&pageSize=${pageSize}`)
//         .then((response: AxiosResponse<Itinerario[]>) => {
//             // Verificar si la respuesta tiene la forma esperada (ajusta según tus necesidades)
//             const itinerarioData: Itinerario[] = response.data;
//             return { ...response, data: itinerarioData };
//         })
//         .catch((error) => {
//             // Manejar errores aquí
//             throw error;
//         });
// };
