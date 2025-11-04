<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import ApiService from '@/service/ApiService.js';

const nombre = ref('');
const apellidos = ref('');
const celular = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const checked = ref(false);
const showError = ref('');
const showSuccess = ref('');

export default {
    data(){
        return {
            nombre,
            apellidos,
            celular,
            email,
            password,
            confirmPassword,
            checked,
            showError,
            showSuccess
        }
    },
    methods: {
        validatePassword() {
            if (password.value.length < 6) {
                showError.value = 'La contraseña debe tener al menos 6 caracteres.';
                return false;
            }
            // Validar mayúsculas, minúsculas, números y símbolos
            const hasUpperCase = /[A-Z]/.test(password.value);
            const hasLowerCase = /[a-z]/.test(password.value);
            const hasNumber = /\d/.test(password.value);
            const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value);
            
            if (!hasUpperCase) {
                showError.value = 'La contraseña debe contener al menos una letra mayúscula.';
                return false;
            }
            
            if (!hasLowerCase) {
                showError.value = 'La contraseña debe contener al menos una letra minúscula.';
                return false;
            }
            
            if (!hasNumber) {
                showError.value = 'La contraseña debe contener al menos un número.';
                return false;
            }
            
            if (!hasSymbol) {
                showError.value = 'La contraseña debe contener al menos un símbolo especial.';
                return false;
            }
            if (password.value !== confirmPassword.value) {
                showError.value = 'Las contraseñas no coinciden.';
                return false;
            }
            return true;
        },
        async setRegister() {
            // Validaciones básicas
            showError.value = '';
            showSuccess.value = '';

            if (!nombre.value || !email.value || !password.value || !confirmPassword.value) {
                showError.value = 'Por favor completa los campos obligatorios.';
                return;
            }

            let isPasswordValid = this.validatePassword();
            if (!isPasswordValid) {
                return;
            }

            // Payload mínimo para registro
            const payload = {
                nombre: nombre.value,
                apellidos: apellidos.value,
                celular: celular.value,
                email: email.value,
                password: password.value
            };

            // Intentar enviar al backend si ApiService está disponible
            try {
                if (ApiService && ApiService.post) {
                    // Ajusta la ruta según tu API (ej: 'auth/register')
                    const res = await ApiService.post('auth/register', payload);
                    // Si la API devuelve éxito, redirigir a login
                    showSuccess.value = 'Registro exitoso. Redirigiendo al login...';
                    setTimeout(() => {
                        this.$router.push({ name: 'login' });
                    }, 1200);
                } else {
                    // Si no hay backend configurado, simular éxito
                    showSuccess.value = 'Registro simulado correctamente. Redirigiendo al login...';
                    setTimeout(() => {
                        this.$router.push({ name: 'login' });
                    }, 1000);
                }
            } catch (err) {
                console.error('Error registrando:', err);
                showError.value = err?.response?.data?.message || 'Error al registrar. Intenta de nuevo.';
            }
        }
    }
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.2rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="flex flex-col items-center justify-center text-center mb-8">
                        <img src="@/assets/images/logo.png" alt="Logo CanEduca" class="w-48 h-48 mb-4" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">Crea tu cuenta</div>
                        <span class="text-muted-color font-medium">Regístrate para continuar</span>
                        <span class="text-muted-color font-medium">¿Ya tienes una cuenta? <router-link to="/auth/login" class="font-medium text-primary">Inicia sesión</router-link></span>
                    </div>


                    <div>
                        <label for="nombres" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nombre</label>
                        <InputText id="nombre" type="text" placeholder="Nombre completo" class="w-full md:w-[30rem] mb-8" v-model="nombre" />

                        <label for="apellidos" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Apellidos</label>
                        <InputText id="apellidos" type="text" placeholder="Apellidos completos" class="w-full md:w-[30rem] mb-8" v-model="apellidos" />

                        <label for="celular" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Celular</label>
                        <InputText id="celular" type="text" placeholder="Número de celular" class="w-full md:w-[30rem] mb-8" v-model="celular" />

                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmar contraseña</label>
                        <Password id="confirmPassword" v-model="confirmPassword" placeholder="Confirmar contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Message v-if="showError" class="mb-2" severity="error">{{ showError }}</Message>
                        <Message v-if="showSuccess" class="mb-2" severity="success">{{ showSuccess }}</Message>

                        <Button label="Registrarse" class="w-full" @click="setRegister"></Button>
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
