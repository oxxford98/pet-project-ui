module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential' // Cambio a essential (menos estricto)
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {
        // Solo errores críticos que pueden romper la aplicación
        'no-undef': 'error',
        'no-debugger': 'warn', // Solo advertencia, no error
        
        // Variables no usadas solo como advertencia y muy permisivo
        'no-unused-vars': 'off', // Deshabilitado completamente
        
        // Console permitido sin restricciones
        'no-console': 'off',
        
        // Variables y funciones - muy permisivo
        'prefer-const': 'off',
        'no-var': 'off',
        
        // Vue.js - Solo reglas esenciales, muy permisivo
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-components': 'off',
        'vue/no-unused-vars': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/no-mutating-props': 'warn', // Solo advertencia
        'vue/no-v-html': 'off',
        'vue/no-reserved-component-names': 'off', // Permitir nombres reservados
        'vue/no-deprecated-v-on-native-modifier': 'off', // Permitir .native
        
        // Formato completamente deshabilitado
        'vue/html-indent': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        
        // Errores de parsing muy permisivos
        'vue/no-parsing-error': 'warn',
        
        // Otras reglas deshabilitadas
        'eqeqeq': 'off',
        'curly': 'off',
        'no-duplicate-imports': 'off',
        'no-template-curly-in-string': 'off',
        'no-useless-escape': 'off'
    },
    globals: {
        // Variables globales permitidas
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
    }
};
