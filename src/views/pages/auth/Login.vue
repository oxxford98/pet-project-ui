<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import ApiService from "@/service/ApiService";
import { useAuthStore } from "@/stores/auth.js";

const store = useAuthStore();

export default {
    name: 'Login',
    data() {
        return {
            store,
            email: '',
            password: '',
            checked: false,
            textLogin: 'Ingresar',
            statusButton: true,
            errorMessage: '',
            showError: false
        };
    },
    methods: {
        attempLogin() {
            this.statusButton = false;
            this.textLogin = 'Iniciando Sesión...';
            this.showError = false;
            this.errorMessage = '';

            let payload = {
                email: this.email,
                password: this.password
            }

            ApiService.post("/auth/login", payload)
                .then(({ data }) => {
                    console.log(data);
                    if (data.user) {
                        store.getApiToken(data);
                        this.$router.push({ name: "dashboard" });
                    } else {
                        this.statusButton = true;
                        this.textLogin = 'Ingresar';
                        this.errorMessage = "Usuario o contraseña incorrectos";
                        this.showError = true;
                    }
                })
                .catch(({ response }) => {
                    this.statusButton = true;
                    this.textLogin = 'Ingresar';
                    this.errorMessage = "Usuario o contraseña incorrectos";
                    this.showError = true;
                });
        }
    }
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="flex flex-col items-center justify-center text-center mb-8">
                        <img src="@/assets/images/logo.png" alt="Logo CanEduca" class="w-60 h-60 mb-4" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">Bienvenido!</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>


                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuérdame</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste tu contraseña?</span>
                        </div>
                        
                        <Message v-if="showError" class="mb-2" severity="error">{{ errorMessage }}</Message>
                        
                        <Button :disabled="!statusButton" :label="textLogin" class="w-full" @click="attempLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
