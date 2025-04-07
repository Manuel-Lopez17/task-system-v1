# Task System v1 📝

Un sistema de gestión de tareas simple con frontend en Astro + React y backend en Express con persistencia en archivos usando LowDB.

## 📦 Requisitos previos

- Node.js >= 18
- pnpm (si no lo tenés, lo podés instalar con el siguiente comando)

```bash
npm install -g pnpm
```

## 🚀 Instalación

Cloná el repositorio y luego ejecutá:

```bash
pnpm install
```

Esto instalará las dependencias tanto del frontend como del backend.

## 📁 Estructura del proyecto

```
task_system_v1/
│
├── apps/
│   ├── backend/
│   └── frontend/
│
├── .gitignore
├── pnpm-workspace.yaml
└── README.md
```

## 🖥️ Levantar la aplicación

### En el root del proyecto

```bash
pnpm dev
```

Esto levanta el servidor en `http://localhost:3000`.  
Esto levanta el cliente en `http://localhost:4321`.

## 🧹 Formateo y Linter

- **Ejecutar linter** (para detectar errores y advertencias de estilo/código):

```bash
pnpm lint
```

- **Formatear automáticamente el código** con Prettier:

```bash
pnpm format
```

## 🧪 Testing

1. Navegar a la carpeta apps/backend
2. Ejecutar el comando

```bash
pnpm test
```

## ✅ Checklist de features

- [x] Crear tareas con subtareas
- [x] Evitar dependencias circulares
- [x] Validación con Valibot
- [x] Persistencia con LowDB
- [x] Notificaciones con toasts (efímeros)

## 🧑‍💻 Desarrollado con

- [Astro](https://astro.build)
- [React](https://react.dev)
- [Express](https://expressjs.com/)
- [LowDB](https://github.com/typicode/lowdb)
- [Valibot](https://valibot.dev)
- [pnpm](https://pnpm.io)

---
