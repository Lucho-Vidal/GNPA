import { User } from "@/interfaces/IUser";
import axios from "./axios";
import { AxiosResponse } from "axios";
import router from "../router";

let roles = [] as string[];
let rolMayor = "";

export const getRolMayor = (): string => {
    return rolMayor;
};
export const setRolMayor = (newRol: string): void => {
    rolMayor = newRol.includes("admin")
        ? "admin"
        : newRol.includes("moderator")
        ? "moderator"
        : newRol.includes("user")
        ? "user"
        : "";
};
export const getRoles = (): string[] => {
    return roles;
};
export const setRoles = (newRoles: string[]): void => {
    roles = newRoles;
};

export const getUsers = async (): Promise<AxiosResponse> => {
    const res = await axios.get("/users");
    return res;
};

export const getUser = async (id: string): Promise<AxiosResponse<User>> => {
    const res = await axios.get(`/user/${id}`);
    return res;
};

export const updateUser = async (
    id: string,
    newUser: User
): Promise<AxiosResponse<User>> => await axios.put(`/user/${id}`, newUser);

export const deleteUser = async (
    id: string,
): Promise<AxiosResponse<User>> => await axios.delete(`/user/${id}`);

export const signIn = async (user: User): Promise<AxiosResponse> => {
    const res = await axios.post("/auth/signin", {
        email: user.email,
        password: user.password,
    });
    return res;
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string
) => {
    const res = await axios.put("/auth/change-password", {
        currentPassword: currentPassword,
        newPassword: newPassword,
    });
    return res;
};

export const refreshToken = async (): Promise<AxiosResponse> => {
    const res = await axios.get("/auth/refresh");
    return res;
};

export const signUp = async (user: User): Promise<AxiosResponse> => {
    const res = await axios.post("/auth/signup", {
        legajo: user.legajo,
        username: user.username,
        email: user.email,
        password: user.password,
        roles: user.roles,
        updatePass: user.updatePass
    });
    return res;
};

export const newToken = async () => {
    try {
        const res = await refreshToken();
        if (res.status === 200) {
            window.localStorage.setItem("token", res.data.token);
            window.localStorage.setItem("username", res.data.username);
            window.localStorage.setItem("roles", res.data.role);
            setRoles(res.data.role);
        }
    } catch (error) {
        window.localStorage.clear();
        router.push("/login");
    }
};
