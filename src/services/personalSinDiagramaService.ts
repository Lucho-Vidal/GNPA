import {IPersonalSinDiagrama} from "@/interfaces/IPersonalSinDiagrama";
import axios from "./axios";
import { AxiosResponse } from "axios";

export const getPersonalesSinDiagrama = async (): Promise<AxiosResponse<IPersonalSinDiagrama[]>> =>
    await axios.get("/PersonalSinDiagrama");

export const getPersonalSinDiagrama = async (id: string): Promise<AxiosResponse<IPersonalSinDiagrama>> => 
    await axios.get(`/PersonalSinDiagrama/${id}`);

export const getPersonalSinDiagramaPorLegajoYMes = async (legajo: number, mes: string): Promise<AxiosResponse<IPersonalSinDiagrama>> => {
    const res = await axios.get(`/PersonalSinDiagramaPorMes?legajo=${legajo}&mes=${mes}`);
    return res.data
}

export const createPersonalSinDiagrama = async (personal: IPersonalSinDiagrama): Promise<AxiosResponse> => {
    const res = await axios.post("/PersonalSinDiagrama", personal);
    return res;
};

export const updatePersonalSinDiagrama = async (legajo: number,newPersonal: IPersonalSinDiagrama): Promise<AxiosResponse<IPersonalSinDiagrama>> => {
    return await axios.put(`/PersonalSinDiagrama/${legajo}`, newPersonal)
};

export const deletePersonalSinDiagrama = async (id: string): Promise<AxiosResponse> =>
    await axios.delete(`/PersonalSinDiagrama/${id}`);

export const createMultiplePersonalSinDiagrama = async (
    personales: IPersonalSinDiagrama[]
): Promise<AxiosResponse> => {
    console.log(
        `Tamaño del payload: ${JSON.stringify(personales).length} bytes`
    );
    const res = await axios.post("/PersonalSinDiagrama-multiple", personales);
    return res;
};

export const deleteMultiplePersonalSinDiagrama = async (): Promise<AxiosResponse> =>
    await axios.delete("/PersonalSinDiagrama-multiple");