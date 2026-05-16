# 🔖 Bookmark Manager — Entrega 1

Sistema de autenticación completo con JWT, bcrypt, Zod, Vue 3 + Pinia.
jucazago18
12345

Ejecuta lo siguiente en la línea de comandos
npm install mongodb

mongodb+srv://jucazago18:12345@cluster0.fwlcaar.mongodb.net/?appName=Cluster0

Backend (cd bookmark-manager/backend):
bashnpm install
cp .env.example .env   
npm run dev            
Frontend (cd bookmark-manager/frontend):
bashnpm install
npm run dev            
---

## 📁 Estructura del Proyecto

```
bookmark-manager/
├── backend/                 # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── app.js           # Entrada principal, configuración Express
│   │   ├── config/
│   │   │   └── database.js  # Conexión MongoDB con Mongoose
│   │   ├── controllers/
│   │   │   └── authController.js  # register, login, getMe
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js  # JWT protect + authorize + generateToken
│   │   │   └── errorMiddleware.js # Controlador global de errores
│   │   ├── models/
│   │   │   └── User.js      # Modelo User (hash bcrypt automático)
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── validators/
│   │       └── authValidators.js  # Schemas Zod para register y login
│   ├── .env.example
│   └── package.json
│
└── frontend/                # SPA (Vue 3 + Pinia + Vue Router)
    ├── src/
    │   ├── main.js
    │   ├── App.vue
    │   ├── assets/
    │   │   └── styles.css
    │   ├── router/
    │   │   └── index.js     # Navigation Guards
    │   ├── services/
    │   │   ├── api.js        # Axios + interceptores JWT
    │   │   └── authService.js
    │   ├── stores/
    │   │   └── authStore.js  # Pinia store (sesión persistente)
    │   └── views/
    │       ├── LoginView.vue
    │       ├── RegisterView.vue
    │       ├── DashboardView.vue
    │       └── AdminView.vue
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js 18+
- MongoDB (local o MongoDB Atlas)

### 1. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu MONGODB_URI y JWT_SECRET

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

---

## 🔌 Endpoints de la API

| Método | Ruta              | Acceso   | Descripción                  |
|--------|-------------------|----------|------------------------------|
| GET    | /api/health       | Público  | Estado del servidor          |
| POST   | /api/auth/register| Público  | Registrar usuario            |
| POST   | /api/auth/login   | Público  | Iniciar sesión               |
| GET    | /api/auth/me      | Privado  | Perfil del usuario autenticado|

### Ejemplo — Registro
```json
POST /api/auth/register
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "mipass123",
  "confirmPassword": "mipass123"
}
```

### Respuesta exitosa
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "data": {
    "user": { "_id": "...", "name": "Juan Pérez", "email": "juan@email.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## ✅ Estándares implementados

| Requisito                          | Implementación                                  |
|------------------------------------|------------------------------------------------|
| JWT (registro + login)             | `jsonwebtoken` en `authMiddleware.js`           |
| Roles (admin / user)               | Campo `role` en User + middleware `authorize()` |
| Hash de contraseñas                | `bcryptjs` salt=12 en `User.js` (pre-save hook) |
| Validación de entrada              | Zod en `authValidators.js`                      |
| Estado global (Pinia)              | `authStore.js` con sesión persistente           |
| Navigation Guards                  | `router/index.js` — requiresAuth, requiresGuest |
| Axios con interceptores            | `services/api.js` — adjunta Bearer token        |
| Base de datos                      | MongoDB con Mongoose                            |
| Manejo de errores global           | `errorMiddleware.js` — cubre todos los casos    |
