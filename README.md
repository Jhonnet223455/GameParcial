# React + Vite Project Setup

Este proyecto utiliza **React** y **Vite** como base para el desarrollo de aplicaciones web rápidas y modernas. Sigue los pasos a continuación para configurar tu entorno y empezar a trabajar en el proyecto.

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina:

1. **Node.js** (versión recomendada: LTS)
   - Puedes descargarlo desde: [Node.js](https://nodejs.org/)
2. **npm** o **yarn** (incluido con Node.js)
   - npm viene preinstalado con Node.js, pero también puedes optar por Yarn.

---

## Instrucciones de Instalación

Sigue estos pasos para clonar el proyecto, instalar dependencias y ejecutarlo localmente.

### 1. Clonar el Repositorio

Primero, clona este repositorio en tu máquina local:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar las Dependencias

Asegúrate de estar en la carpeta raíz del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

Esto instalará todas las bibliotecas y dependencias definidas en el archivo `package.json`.

### 3. Ejecutar el Proyecto

Inicia el servidor de desarrollo de Vite para ver tu aplicación en acción:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo y podrás acceder a tu aplicación en `http://localhost:5173`.

### 4. Crear la Carpeta `node_modules`

Si estás configurando este proyecto en una máquina nueva o necesitas regenerar la carpeta `node_modules`, simplemente ejecuta nuevamente:

```bash
npm install
```

---

## Comandos Disponibles

Aquí tienes los comandos principales que puedes usar:

- **`npm run dev`**: Inicia el servidor de desarrollo.
- **`npm run build`**: Construye la aplicación para producción.
- **`npm run preview`**: Previsualiza la aplicación construida localmente.
- **`npm run lint`**: Revisa el código utilizando ESLint.

---

## Instalación de Dependencias Adicionales

Para instalar las dependencias adicionales necesarias para este proyecto, ejecuta los siguientes comandos:

```bash
npm install three tailwindcss gsap
```

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente forma:

```
.
├── public/          # Archivos públicos accesibles desde el navegador
├── src/             # Código fuente de la aplicación
│   ├── assets/      # Archivos estáticos (imágenes, fuentes, etc.)
│   ├── components/  # Componentes reutilizables
│   ├── App.jsx      # Componente raíz de la aplicación
│   └── main.jsx     # Punto de entrada de la aplicación
├── .gitignore       # Archivos y carpetas a ignorar por Git
├── package.json     # Configuración del proyecto y dependencias
├── vite.config.js   # Configuración de Vite
└── README.md        # Documentación del proyecto
```

---

## Notas

- Este proyecto utiliza Vite para un desarrollo rápido y un entorno optimizado para React.
- Si encuentras problemas al instalar dependencias, asegúrate de que tu versión de Node.js sea compatible.

Para más información sobre Vite, consulta la [documentación oficial de Vite](https://vitejs.dev/).

---

¡Disfruta desarrollando! 🚀