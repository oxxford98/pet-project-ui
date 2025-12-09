# ⚛️ Frontend — Pet Project (React)

Este proyecto es la interfaz de usuario para el backend Django REST API. Está construido con React y diseñado para consumir los endpoints del backend de forma eficiente y amigable.

---

## 🚀 Requisitos previos

- Node.js 20 instalado
- npm instalado
- Git instalado
- Backend Corriendo en el puerto 8000

---

## 📦 Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pet-project-frontend.git
cd pet-project-frontend
```

## 📦 Paso 2: Instalar Dependencias

```bash
npm install
```

## 📦 Paso 3: Crear archivo .env

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

## 📦 Paso 4: Ejecutar el Proyecto en local

```bash
npm run dev
```

#### La app estará corriendo en http://localhost:5173
#### Cuando se realicen cambios en el código el navegador los tomará sin necesidad de detenerlo o reiniciarlo.

#### Estos pasos solo se deben de ejecutar la primera vez. A partir de eso, solo se debe ejecutar el paso 4

---

## 🔍 Comandos de Calidad de Código

### ESLint (Revisión de código)

```bash
# Verificar código sin corregir errores
npm run lint:check

# Corregir automáticamente errores de linting
npm run lint:fix

# Ejecutar linting con corrección automática (alias)
npm run lint
```

### Prettier (Formato de código)

```bash
# Verificar formato sin cambiar archivos
npm run format:check

# Formatear automáticamente el código
npm run format
```

### Build y Preview

```bash
# Construir el proyecto para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 🤖 GitHub Actions

Este proyecto incluye GitHub Actions que se ejecutan automáticamente en:
- **Push** a las ramas `main` y `develop`
- **Pull Requests** a las ramas `main` y `develop`

### Lo que verifica GitHub Actions:
- ✅ **ESLint**: Revisa calidad del código (solo advertencias, no bloquea)
- ✅ **Build**: Verifica que el proyecto compile correctamente
- ⚠️ **Prettier**: Verifica formato del código (opcional)

### Configuración de Linting:
- **Estándar moderado**: Solo errores críticos como errores
- **Variables no usadas**: Permitidas
- **Console.log**: Permitido
- **Formato flexible**: Líneas largas y formato relajado