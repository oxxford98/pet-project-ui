<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import ApiService from '@/service/ApiService';
import { useAuthStore } from '@/stores/auth.js';

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
            showError: false,
            // Variables para recuperación de contraseña
            showPasswordResetModal: false,
            resetEmail: '',
            resetCode: '',
            showOtpInput: false,
            loadingReset: false,
            resetErrorMessage: '',
            showResetError: false,
            resetSuccessMessage: '',
            showResetSuccess: false,
            // Variables para nueva contraseña
            newPassword: '',
            confirmNewPassword: '',
            passwordValidationErrors: []
        };
    },
    methods: {
        openPasswordResetModal() {
            this.showPasswordResetModal = true;
            this.resetEmail = '';
            this.resetCode = '';
            this.showOtpInput = false;
            this.loadingReset = false;
            this.resetErrorMessage = '';
            this.showResetError = false;
            this.resetSuccessMessage = '';
            this.showResetSuccess = false;
        },
        closePasswordResetModal() {
            this.showPasswordResetModal = false;
            this.resetEmail = '';
            this.resetCode = '';
            this.showOtpInput = false;
            this.loadingReset = false;
            this.resetErrorMessage = '';
            this.showResetError = false;
            this.resetSuccessMessage = '';
            this.showResetSuccess = false;
            this.newPassword = '';
            this.confirmNewPassword = '';
            this.passwordValidationErrors = [];
        },
        requestPasswordReset() {
            if (!this.resetEmail) {
                this.resetErrorMessage = 'Por favor ingresa tu correo electrónico';
                this.showResetError = true;
                return;
            }

            this.loadingReset = true;
            this.showResetError = false;
            this.showResetSuccess = false;

            const payload = {
                email: this.resetEmail
            };

            ApiService.post('/auth/password-reset/request', payload)
                .then(({ data }) => {
                    this.loadingReset = false;
                    this.showOtpInput = true;
                    this.resetSuccessMessage = 'Se ha enviado un código de verificación a tu correo electrónico';
                    this.showResetSuccess = true;
                })
                .catch(error => {
                    this.loadingReset = false;
                    this.resetErrorMessage =
                        'Error al enviar el código. Verifica tu correo electrónico e inténtalo de nuevo.';
                    this.showResetError = true;
                });
        },
        validatePassword() {
            const errors = [];

            if (this.newPassword.length < 8) {
                errors.push('La contraseña debe tener al menos 8 caracteres');
            }

            if (!/[a-z]/.test(this.newPassword)) {
                errors.push('La contraseña debe contener al menos una letra minúscula');
            }

            if (!/[A-Z]/.test(this.newPassword)) {
                errors.push('La contraseña debe contener al menos una letra mayúscula');
            }

            if (!/\d/.test(this.newPassword)) {
                errors.push('La contraseña debe contener al menos un número');
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) {
                errors.push('La contraseña debe contener al menos un símbolo especial');
            }

            if (this.newPassword !== this.confirmNewPassword) {
                errors.push('Las contraseñas no coinciden');
            }

            this.passwordValidationErrors = errors;
            return errors.length === 0;
        },
        confirmPasswordReset() {
            if (!this.resetCode) {
                this.resetErrorMessage = 'Por favor ingresa el código de verificación';
                this.showResetError = true;
                return;
            }

            if (!this.validatePassword()) {
                this.resetErrorMessage = 'Por favor corrige los errores en la contraseña';
                this.showResetError = true;
                return;
            }

            this.loadingReset = true;
            this.showResetError = false;
            this.showResetSuccess = false;

            const payload = {
                email: this.resetEmail,
                verify_code: this.resetCode,
                new_password: this.newPassword
            };

            ApiService.post('/auth/password-reset/confirm', payload)
                .then(({ data }) => {
                    this.loadingReset = false;
                    this.resetSuccessMessage =
                        'Tu contraseña ha sido cambiada exitosamente. Serás redirigido al login.';
                    this.showResetSuccess = true;

                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        this.closePasswordResetModal();
                    }, 2000);
                })
                .catch(error => {
                    this.loadingReset = false;
                    this.resetErrorMessage = 'Error al cambiar la contraseña. Verifica el código e inténtalo de nuevo.';
                    this.showResetError = true;
                });
        },
        attempLogin() {
            this.statusButton = false;
            this.textLogin = 'Iniciando Sesión...';
            this.showError = false;
            this.errorMessage = '';

            const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

            // Validar que reCAPTCHA esté cargado
            if (!window.grecaptcha) {
                this.statusButton = true;
                this.textLogin = 'Ingresar';
                this.errorMessage = 'Error de validación reCAPTCHA. Actualiza la página e inténtalo de nuevo.';
                this.showError = true;
                return;
            }

            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(siteKey, { action: 'login' })
                    .then(token => {
                        const payload = {
                            email: this.email,
                            password: this.password,
                            recaptcha: token // ← igual que en PQRSD
                        };

                        ApiService.post('/auth/login', payload)
                            .then(({ data }) => {
                                if (data.user) {
                                    this.store.getApiToken(data);
                                    this.$router.push({ name: 'dashboard' });
                                } else {
                                    this.statusButton = true;
                                    this.textLogin = 'Ingresar';
                                    this.errorMessage = 'Usuario o contraseña incorrectos';
                                    this.showError = true;
                                }
                            })
                            .catch(() => {
                                this.statusButton = true;
                                this.textLogin = 'Ingresar';
                                this.errorMessage = 'Usuario o contraseña incorrectos';
                                this.showError = true;
                            });
                    })
                    .catch(() => {
                        this.statusButton = true;
                        this.textLogin = 'Ingresar';
                        this.errorMessage = 'No fue posible obtener el reCAPTCHA. Inténtalo de nuevo.';
                        this.showError = true;
                    });
            });
        }
    }
};
</script>

<template>
    <FloatingConfigurator />

    <!-- Modal de Recuperación de Contraseña -->
    <Dialog
        v-model:visible="showPasswordResetModal"
        modal
        header="Recuperar Contraseña"
        :style="{ width: '25rem' }"
        @hide="closePasswordResetModal"
    >
        <div v-if="!showOtpInput" class="flex flex-col gap-4">
            <p class="text-surface-500 dark:text-surface-400 mb-4">
                Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </p>

            <div class="flex flex-col gap-2">
                <label for="resetEmail" class="font-semibold">Correo Electrónico</label>
                <InputText id="resetEmail" v-model="resetEmail" placeholder="tu@correo.com" class="w-full" />
            </div>

            <Message v-if="showResetError" severity="error" class="mt-2">
                {{ resetErrorMessage }}
            </Message>

            <Message v-if="showResetSuccess" severity="success" class="mt-2">
                {{ resetSuccessMessage }}
            </Message>
        </div>

        <div v-else class="flex flex-col gap-4">
            <!-- Mostrar solo el mensaje de éxito si el cambio fue exitoso -->
            <div v-if="showResetSuccess" class="text-center">
                <i class="pi pi-check-circle text-green-500 text-6xl mb-4"></i>
                <Message severity="success" class="mt-2">
                    {{ resetSuccessMessage }}
                </Message>
            </div>

            <!-- Mostrar campos solo si no se ha mostrado el éxito -->
            <div v-else>
                <p class="text-surface-500 dark:text-surface-400 mb-4">
                    Ingresa el código de 6 dígitos que enviamos a <strong>{{ resetEmail }}</strong> y tu nueva
                    contraseña
                </p>

                <div class="flex flex-col gap-2">
                    <label for="resetCode" class="font-semibold">Código de Verificación</label>
                    <InputOtp v-model="resetCode" :length="6" class="w-full" />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="newPassword" class="font-semibold">Nueva Contraseña</label>
                    <Password
                        id="newPassword"
                        v-model="newPassword"
                        placeholder="Nueva contraseña"
                        :toggle-mask="true"
                        class="w-full"
                        :feedback="false"
                        @input="validatePassword"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="confirmNewPassword" class="font-semibold">Confirmar Nueva Contraseña</label>
                    <Password
                        id="confirmNewPassword"
                        v-model="confirmNewPassword"
                        placeholder="Confirma tu nueva contraseña"
                        :toggle-mask="true"
                        class="w-full"
                        :feedback="false"
                        @input="validatePassword"
                    />
                </div>

                <!-- Mostrar errores de validación de contraseña -->
                <div v-if="passwordValidationErrors.length > 0" class="bg-red-50 border border-red-200 rounded p-3">
                    <ul class="text-red-600 text-sm space-y-1">
                        <li v-for="error in passwordValidationErrors" :key="error" class="flex items-center gap-2">
                            <i class="pi pi-times-circle text-xs"></i>
                            {{ error }}
                        </li>
                    </ul>
                </div>

                <Message v-if="showResetError" severity="error" class="mt-2">
                    {{ resetErrorMessage }}
                </Message>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="closePasswordResetModal" />

                <Button
                    v-if="!showOtpInput"
                    type="button"
                    label="Enviar Código"
                    :loading="loadingReset"
                    @click="requestPasswordReset"
                />

                <Button
                    v-else-if="!showResetSuccess"
                    type="button"
                    label="Cambiar Contraseña"
                    :loading="loadingReset"
                    @click="confirmPasswordReset"
                />
            </div>
        </template>
    </Dialog>

    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
        <div class="flex flex-col items-center justify-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
                "
            >
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="flex flex-col items-center justify-center text-center mb-8">
                        <img src="@/assets/images/logo.png" alt="Logo CanEduca" class="w-60 h-60 mb-4" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-2">Bienvenido!</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                        <span class="text-muted-color font-medium">¿Aún no tienes una cuenta?
                            <router-link to="/auth/register" class="font-medium text-primary">Regístrate</router-link></span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText
                            id="email1"
                            v-model="email"
                            type="text"
                            placeholder="Email address"
                            class="w-full md:w-[30rem] mb-8"
                        />

                        <label
                            for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                        >Password</label>
                        <Password
                            id="password1"
                            v-model="password"
                            placeholder="Password"
                            :toggle-mask="true"
                            class="mb-4"
                            fluid
                            :feedback="false"
                        ></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox id="rememberme1" v-model="checked" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuérdame</label>
                            </div>
                            <span
                                class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
                                @click="openPasswordResetModal"
                            >¿Olvidaste tu contraseña?</span>
                        </div>

                        <Message v-if="showError" class="mb-2" severity="error">{{ errorMessage }}</Message>

                        <Button
                            :disabled="!statusButton"
                            :label="textLogin"
                            class="w-full"
                            @click="attempLogin"
                        ></Button>
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
