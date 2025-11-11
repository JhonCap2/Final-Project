# AllergySafety API Server

## 📋 Descripción

Servidor backend para la aplicación AllergySafety, desarrollado con Node.js, Express y MongoDB. Proporciona autenticación, gestión de alergias, contactos de emergencia y perfiles de usuario.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Gestión de perfiles de usuario
- ✅ Registro de alergias con detalles
- ✅ Gestión de contactos de emergencia
- ✅ Historial de reacciones alérgicas
- ✅ Validación de datos
- ✅ Manejo de errores robusto

## 📦 Instalación

### Requisitos previos
- Node.js (v14 o superior)
- MongoDB (local o atlas)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd AllergySafety-Server
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env
```

4. **Editar archivo .env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/allergysafety
JWT_SECRET=your_secret_key_here_change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Usando MongoDB Atlas (alternativa)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/allergysafety?retryWrites=true&w=majority
```

5. **Iniciar servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor debe ejecutarse en: `http://localhost:5000`

## 📚 Endpoints API

### Autenticación

#### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "password": "password123",
  "confirmPassword": "password123",
  "bloodType": "O+"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Obtener usuario actual
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Verificar token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

### Usuario

#### Obtener perfil
```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Actualizar perfil
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+1 (555) 123-4567",
  "bloodType": "O+"
}
```

#### Cambiar contraseña
```
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

#### Obtener estadísticas
```
GET /api/users/stats
Authorization: Bearer <token>
```

#### Eliminar cuenta
```
DELETE /api/users/account
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "password123"
}
```

### Alergias

#### Obtener todas las alergias
```
GET /api/allergies
Authorization: Bearer <token>
```

#### Obtener una alergia
```
GET /api/allergies/:id
Authorization: Bearer <token>
```

#### Crear alergia
```
POST /api/allergies
Authorization: Bearer <token>
Content-Type: application/json

{
  "allergen": "Peanuts",
  "severity": "Severe",
  "symptoms": ["Throat swelling", "Difficulty breathing"],
  "reactions": "Anaphylaxis risk",
  "treatment": "EpiPen",
  "triggers": ["Tree nuts", "Legumes"],
  "medications": [
    {
      "name": "Epinephrine",
      "dosage": "0.3mg",
      "frequency": "As needed"
    }
  ]
}
```

#### Actualizar alergia
```
PUT /api/allergies/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "severity": "Moderate",
  "notes": "Reaction improved with new medication"
}
```

#### Eliminar alergia
```
DELETE /api/allergies/:id
Authorization: Bearer <token>
```

#### Registrar reacción
```
POST /api/allergies/:id/reaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "severity": "Moderate",
  "description": "Minor itching and hives"
}
```

### Contactos de Emergencia

#### Obtener contactos
```
GET /api/contacts
Authorization: Bearer <token>
```

#### Obtener contacto
```
GET /api/contacts/:id
Authorization: Bearer <token>
```

#### Crear contacto
```
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+1 (555) 987-6543",
  "relationship": "Mother",
  "email": "jane@example.com",
  "isPrimary": true
}
```

#### Actualizar contacto
```
PUT /api/contacts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+1 (555) 987-6543"
}
```

#### Eliminar contacto
```
DELETE /api/contacts/:id
Authorization: Bearer <token>
```

#### Establecer contacto primario
```
PUT /api/contacts/:id/set-primary
Authorization: Bearer <token>
```

## 🏗️ Estructura del Proyecto

```
AllergySafety-Server/
├── config/
│   └── database.js              # Configuración de MongoDB
├── controllers/
│   ├── auth.controller.js       # Lógica de autenticación
│   ├── user.controller.js       # Gestión de usuarios
│   ├── allergy.controller.js    # Gestión de alergias
│   └── contact.controller.js    # Gestión de contactos
├── models/
│   ├── User.js                  # Esquema de usuario
│   ├── Allergy.js              # Esquema de alergia
│   └── EmergencyContact.js      # Esquema de contacto
├── routes/
│   ├── auth.routes.js           # Rutas de autenticación
│   ├── user.routes.js           # Rutas de usuario
│   ├── allergy.routes.js        # Rutas de alergias
│   └── contact.routes.js        # Rutas de contactos
├── middleware/
│   ├── auth.js                  # Middleware JWT
│   └── validation.js            # Middleware de validación
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos ignorados
├── package.json                 # Dependencias
├── server.js                    # Punto de entrada
└── README.md                    # Este archivo
```

## 🔐 Seguridad

- **Contraseñas**: Hasheadas con bcrypt
- **JWT**: Tokens con expiración de 30 días
- **CORS**: Configurado para el cliente en localhost:5173
- **Validación**: Todas las entradas son validadas

## 🧪 Pruebas API

### Con Postman
1. Importar endpoints a Postman
2. Usar variables de entorno para el token
3. Ejecutar peticiones HTTP

### Con cURL
```bash
# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"John Doe",
    "email":"john@example.com",
    "phone":"+15551234567",
    "password":"password123",
    "confirmPassword":"password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"password123"
  }'
```

## 🚨 Manejo de Errores

El servidor devuelve códigos HTTP estándar:
- `200`: OK - Solicitud exitosa
- `201`: Created - Recurso creado
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No autorizado
- `404`: Not Found - Recurso no encontrado
- `500`: Server Error - Error del servidor

## 📝 Variables de Entorno

| Variable | Descripción | Por defecto |
|----------|-------------|------------|
| PORT | Puerto del servidor | 5000 |
| MONGODB_URI | URI de MongoDB | mongodb://localhost:27017/allergysafety |
| JWT_SECRET | Clave secreta JWT | (requerido) |
| NODE_ENV | Ambiente | development |
| CORS_ORIGIN | Origen CORS permitido | http://localhost:5173 |

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Asegúrate que MongoDB esté corriendo
- Verifica la URI en .env
- Si usas Atlas, comprueba la contraseña y whitelist de IP

### "Token is not valid"
- Regenera el token
- Verifica que JWT_SECRET sea correcto
- Comprueba el formato del header (Bearer token)

### "CORS error"
- Verifica CORS_ORIGIN en .env
- Asegúrate que el cliente use la URL correcta

## 📦 Dependencias principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcrypt**: Hashing de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👨‍💻 Autor

Jhon Capellan

## 📞 Soporte

Para soporte, abre un issue en el repositorio.

---

**Nota**: Este es un proyecto en desarrollo. Siempre usa variables de entorno seguras en producción.
