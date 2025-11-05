<template>
    <Toast />
    <Card>
        <template #header>
            <div class="p-4">
                <div class="font-semibold text-xl">Mi Perfil</div>
            </div>
        </template>
        <template #content>
            <div v-if="loading" class="flex justify-center items-center p-8">
                <ProgressSpinner />
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
                <FloatLabel class="my-4">
                    <InputText
                        id="first_name"
                        v-model="formData.first_name"
                        class="w-full"
                        :disabled="!isEditing"
                        :invalid="validate && !formData.first_name"
                    />
                    <label for="first_name">Primer Nombre *</label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText id="second_name" v-model="formData.second_name" class="w-full" :disabled="!isEditing" />
                    <label for="second_name">Segundo Nombre</label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText
                        id="last_name"
                        v-model="formData.last_name"
                        class="w-full"
                        :disabled="!isEditing"
                        :invalid="validate && !formData.last_name"
                    />
                    <label for="last_name">Primer Apellido *</label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText
                        id="second_last_name"
                        v-model="formData.second_last_name"
                        class="w-full"
                        :disabled="!isEditing"
                    />
                    <label for="second_last_name">Segundo Apellido</label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText id="address" v-model="formData.address" class="w-full" :disabled="!isEditing" />
                    <label for="address">Dirección </label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText
                        id="email"
                        v-model="formData.email"
                        class="w-full"
                        type="email"
                        :disabled="!isEditing"
                        :invalid="validate && validateEmail()"
                    />
                    <label for="email">Correo Electrónico *</label>
                </FloatLabel>
                <Message v-if="validate && validateEmail()" severity="error" size="small" class="col-span-2">
                    Debes indicar un email válido
                </Message>

                <FloatLabel class="my-4">
                    <InputText id="cellphone" v-model="formData.cellphone" class="w-full" :disabled="!isEditing" />
                    <label for="cellphone">Celular</label>
                </FloatLabel>

                <FloatLabel class="my-4">
                    <InputText
                        id="identification"
                        v-model="formData.identification"
                        class="w-full"
                        :disabled="!isEditing"
                    />
                    <label for="identification">Número de Identificación</label>
                </FloatLabel>

                <!-- Toggle para cambiar contraseña -->
                <div v-if="isEditing" class="col-span-2 flex items-center my-4">
                    <span class="mr-2">¿Cambiar contraseña?</span>
                    <ToggleSwitch v-model="changePassword" />
                </div>

                <!-- Campos de contraseña -->
                <div v-if="isEditing && changePassword" class="my-4">
                    <FloatLabel>
                        <Password
                            v-model="formData.password"
                            input-class="w-full"
                            class="w-full"
                            toggle-mask
                            :feedback="false"
                            :invalid="
                                validate && (!formData.password || formData.password !== formData.password_confirm)
                            "
                        >
                            <template #header>
                                <h6>Ingrese una contraseña</h6>
                            </template>
                        </Password>
                        <label for="password">Nueva Contraseña *</label>
                    </FloatLabel>
                </div>

                <div v-if="isEditing && changePassword" class="my-4">
                    <FloatLabel>
                        <Password
                            v-model="formData.password_confirm"
                            input-class="w-full"
                            class="w-full"
                            toggle-mask
                            :feedback="false"
                            :invalid="validate && formData.password !== formData.password_confirm"
                        />
                        <label for="password_confirm">Confirmar Contraseña *</label>
                    </FloatLabel>
                </div>
                <Message
                    v-if="validate && changePassword && formData.password !== formData.password_confirm"
                    severity="error"
                    size="small"
                    class="col-span-2"
                >
                    Las contraseñas no coinciden
                </Message>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2 p-4">
                <Button
                    v-if="!isEditing"
                    label="Editar Información"
                    icon="pi pi-pencil"
                    severity="info"
                    @click="enableEdit"
                />
                <template v-else>
                    <Button label="Cancelar" icon="pi pi-times" severity="secondary" outlined @click="cancelEdit" />
                    <Button
                        label="Guardar Cambios"
                        icon="pi pi-check"
                        severity="success"
                        :loading="saving"
                        @click="saveProfile"
                    />
                </template>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import ToggleSwitch from 'primevue/toggleswitch';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth.js';
import ApiService from '@/service/ApiService';
import { ref } from 'vue';

ApiService.setHeader();
const store = ref();
const user = ref();

export default {
    name: 'ProfileUser',
    components: {
        Card,
        InputText,
        FloatLabel,
        Password,
        Button,
        Message,
        Toast,
        ToggleSwitch,
        ProgressSpinner
    },
    data() {
        return {
            toast: null,
            loading: false,
            isEditing: false,
            changePassword: false,
            validate: false,
            saving: false,
            originalData: {},
            formData: {
                first_name: '',
                second_name: '',
                last_name: '',
                second_last_name: '',
                username: '',
                email: '',
                cellphone: '',
                identification: '',
                address: '',
                password: '',
                password_confirm: ''
            }
        };
    },
    async mounted() {
        //store.value = useAuthStore();
        //user.value = store.value.user;
        this.toast = useToast();
        await this.loadProfile();
    },
    methods: {
        async loadProfile() {
            this.loading = true;
            try {
                const { data } = await ApiService.get(`/auth/me`);

                this.formData = {
                    first_name: data.first_name || '',
                    second_name: data.second_name || '',
                    last_name: data.last_name || '',
                    second_last_name: data.second_last_name || '',
                    username: data.username || '',
                    email: data.email || '',
                    cellphone: data.cellphone || '',
                    identification: data.identification || '',
                    address: data.address || '',
                    password: '',
                    password_confirm: ''
                };

                // Guardar una copia para poder cancelar
                this.originalData = { ...this.formData };
            } catch (error) {
                console.error('Error al cargar perfil:', error);
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el perfil',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        enableEdit() {
            this.isEditing = true;
        },

        cancelEdit() {
            this.isEditing = false;
            this.changePassword = false;
            this.validate = false;
            this.formData = { ...this.originalData };
            this.formData.password = '';
            this.formData.password_confirm = '';
        },

        validateEmail() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return this.formData.email && !emailPattern.test(this.formData.email);
        },

        validateForm() {
            this.validate = true;

            // Validar campos obligatorios
            if (
                !this.formData.first_name ||
                !this.formData.last_name ||
                !this.formData.username ||
                !this.formData.email
            ) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Los campos marcados son obligatorios',
                    life: 3000
                });
                return false;
            }

            // Validar email
            if (this.validateEmail()) {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'El email no es válido',
                    life: 3000
                });
                return false;
            }

            // Validar contraseñas si está habilitado el cambio
            if (this.changePassword) {
                if (!this.formData.password || this.formData.password !== this.formData.password_confirm) {
                    this.toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Las contraseñas no coinciden',
                        life: 3000
                    });
                    return false;
                }
            }

            return true;
        },

        async saveProfile() {
            if (!this.validateForm()) {
                return;
            }

            this.saving = true;

            try {
                const payload = {
                    first_name: this.formData.first_name,
                    second_name: this.formData.second_name,
                    last_name: this.formData.last_name,
                    second_last_name: this.formData.second_last_name,
                    username: this.formData.username,
                    email: this.formData.email,
                    cellphone: this.formData.cellphone,
                    identification: this.formData.identification,
                    address: this.formData.address
                };

                // Solo incluir password si se está cambiando
                if (this.changePassword && this.formData.password) {
                    payload.password = this.formData.password;
                }

                const { data } = await ApiService.patch(`/user/edit-client`, payload);

                this.toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Perfil actualizado correctamente',
                    life: 3000
                });
                this.isEditing = false;
                this.changePassword = false;
                this.validate = false;
                await this.loadProfile();
            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response?.data?.detail || 'No se pudo actualizar el perfil',
                    life: 3000
                });
            } finally {
                this.saving = false;
            }
        }
    }
};
</script>
