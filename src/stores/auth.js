import ApiService from "@/service/ApiService";
import JwtService from "@/service/JwtService.js";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const errors = ref({});
    const user = ref({});
    const isAuthenticated = ref(false);

    function setAuth(data) {
        isAuthenticated.value = true;
        user.value = data;
        errors.value = {};
        // JwtService.saveToken(user.value.api_token);
    }

    function setError(error) {
        errors.value = { ...error };
    }

    function purgeAuth() {
        isAuthenticated.value = false;
        user.value = {};
        errors.value = [];
        JwtService.destroyToken();
    }

    function logout() {
        purgeAuth();
    }

    function verifyToken() {
        if (!!JwtService.getToken()) {
            purgeAuth();
            // getApiToken();
        }
    }

    function verifyAuth() {
        return new Promise((resolve, reject) => {
            if (JwtService.getToken()) {
                ApiService.setHeader();
                ApiService.get(`/auth/me`)
                .then(({ data }) => {
                    console.log(data);
                    if (data.id) {
                        console.log("autenticando desde me")
                        let dataFlow = {
                            "user": data,
                            "access": JwtService.getToken(),
                        };
                        setAuth(dataFlow);
                        resolve(data);
                    } else {
                        isAuthenticated.value = false;
                        purgeAuth();
                        resolve();
                        // reject(new Error("Authentication failed"));
                    }
                })
                .catch(({ response }) => {
                    console.log(response);
                    isAuthenticated.value = false;
                    purgeAuth();
                    resolve();
                });
            } else {
                purgeAuth();
                resolve();
            }
        });
    }

    async function getApiToken(data) {
        localStorage.setItem('trd', JSON.stringify(data.trd));
        setAuth(data);
        JwtService.saveToken(data.access);
    }

    return {
        errors,
        user,
        isAuthenticated,
        logout,
        verifyToken,
        verifyAuth,
        setAuth,
        getApiToken
    };
});
