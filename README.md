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
│   ├── backend/         # Servidor Express + LowDB
│   └── frontend/        # Cliente Astro + React
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

## 🧪 Testing

Actualmente el proyecto no incluye tests automatizados, pero podés probarlo manualmente:

1. Crear tareas desde la interfaz.
2. Editarlas, eliminarlas y asignar subtareas.
3. Verifica que los cambios persisten tras recargar.

> Se pueden agregar pruebas con Vitest y Supertest más adelante.

## ✅ Checklist de features

- [x] Crear tareas con subtareas
- [x] Evitar dependencias circulares
- [x] Validación con Valibot
- [x] Persistencia con LowDB
- [x] Notificaciones con toasts (efímeros)
- [x] Diseño simple con Tailwind (en frontend)

## 🧑‍💻 Desarrollado con

- [Astro](https://astro.build)
- [React](https://react.dev)
- [Express](https://expressjs.com/)
- [LowDB](https://github.com/typicode/lowdb)
- [Valibot](https://valibot.dev)
- [pnpm](https://pnpm.io)

---

¡Listo para usar o extender! 🚀
