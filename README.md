# Justicia Verde - Plataforma de Denuncias Ambientales

Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia.

## Características

- **Denuncias Públicas**: Los ciudadanos pueden reportar delitos ambientales con evidencias fotográficas y ubicación geográfica
- **Mapa Interactivo**: Visualización de todas las denuncias en un mapa con Leaflet
- **Sistema de Roles**: Ciudadanos, Revisores (ONGs) y Administradores
- **Gestión de Casos**: Los revisores pueden tomar casos y darles seguimiento
- **Denuncias Anónimas**: Opción de reportar sin revelar identidad personal
- **Notificaciones**: Sistema de alertas cuando un revisor toma un caso

## Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MySQL
- **Mapas**: Leaflet
- **UI Components**: shadcn/ui

## Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <tu-repositorio>
cd justicia-verde
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar base de datos

Ejecuta el script SQL proporcionado en MySQL Workbench:

\`\`\`bash
mysql -u root -p < justicia_verde_schema_funcional.sql
\`\`\`

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo `.env` con tus datos de MySQL:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=justicia_verde
\`\`\`

### 5. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

\`\`\`
justicia-verde/
├── app/                          # Páginas y rutas de Next.js
│   ├── api/                      # APIs REST
│   │   ├── auth/                 # Autenticación
│   │   ├── denuncias/            # CRUD de denuncias
│   │   ├── estadisticas/         # Métricas y estadísticas
│   │   ├── tipos-demanda/        # Tipos de denuncias
│   │   └── usuarios/             # Gestión de usuarios
│   ├── admin/panel/              # Panel de administrador
│   ├── auth/login/               # Página de login
│   ├── ciudadano/panel/          # Panel de ciudadano
│   ├── denuncias/                # Páginas de denuncias
│   │   └── crear/                # Formulario de crear denuncia
│   ├── mapa/                     # Mapa general
│   ├── revisor/panel/            # Panel de revisor
│   └── page.tsx                  # Página principal
├── componentes/                  # Componentes React reutilizables
│   ├── encabezado.tsx            # Header de la aplicación
│   ├── formulario-denuncia.tsx   # Formulario de denuncia
│   ├── lista-denuncias.tsx       # Lista de denuncias
│   ├── mapa-contenido.tsx        # Contenido del mapa con Leaflet
│   ├── mapa-interactivo.tsx      # Wrapper del mapa
│   ├── panel-admin.tsx           # Panel administrativo
│   ├── panel-ciudadano.tsx       # Panel de ciudadano
│   ├── panel-revisor.tsx         # Panel de revisor
│   ├── selector-ubicacion-mapa.tsx # Selector de ubicación
│   ├── tarjeta-denuncia.tsx      # Tarjeta de denuncia
│   └── ui/                       # Componentes UI de shadcn
├── lib/                          # Utilidades y configuración
│   ├── db.ts                     # Conexión a MySQL
│   ├── tipos.ts                  # Tipos TypeScript
│   └── utilidades.ts             # Funciones auxiliares
└── public/                       # Archivos estáticos
\`\`\`

## Usuarios de Prueba

La base de datos incluye usuarios de prueba para cada rol:

### Administrador
- **Email**: admin@justicaverde.com
- **Contraseña**: admin123
- **Acceso**: Panel completo de administración

### Revisor (ONG)
- **Email**: carlos.mendoza@verdelex.org
- **Contraseña**: revisor123
- **Acceso**: Panel de revisor para tomar casos

### Ciudadano
- **Email**: carlos.perez@email.com
- **Contraseña**: ciudadano123
- **Acceso**: Panel de ciudadano para crear denuncias

## Funcionalidades por Rol

### Ciudadano
- Crear denuncias ambientales con evidencias
- Ver mapa general de denuncias
- Acceder a su panel personal
- Ver estado de sus denuncias
- Recibir notificaciones cuando un revisor toma su caso
- Opción de denunciar de forma anónima

### Revisor (ONG)
- Ver denuncias disponibles
- Tomar casos para darles seguimiento
- Ver casos en proceso y resueltos
- Acceder a estadísticas personales
- Gestionar múltiples casos simultáneamente

### Administrador
- Vista completa de todas las denuncias
- Gestión de usuarios (revisores y ciudadanos)
- Estadísticas globales de la plataforma
- Filtros y búsqueda avanzada
- Exportar datos
- Eliminar denuncias

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar nuevo usuario

### Denuncias
- `GET /api/denuncias` - Listar todas las denuncias
- `POST /api/denuncias` - Crear nueva denuncia
- `GET /api/denuncias/[id]` - Obtener denuncia específica
- `PUT /api/denuncias/[id]` - Actualizar denuncia
- `DELETE /api/denuncias/[id]` - Eliminar denuncia
- `GET /api/denuncias/destacadas` - Denuncias destacadas
- `GET /api/denuncias/mapa` - Denuncias para mapa
- `POST /api/denuncias/[id]/asignar-revisor` - Asignar revisor

### Usuarios
- `GET /api/usuarios/[id]` - Obtener usuario
- `GET /api/usuarios/revisores` - Listar revisores
- `GET /api/usuarios/ciudadanos` - Listar ciudadanos

### Estadísticas
- `GET /api/estadisticas/admin` - Estadísticas globales
- `GET /api/estadisticas/revisor/[id]` - Estadísticas de revisor
- `GET /api/estadisticas/ciudadano/[id]` - Estadísticas de ciudadano

### Tipos de Demanda
- `GET /api/tipos-demanda` - Listar tipos de denuncias

## Tipos de Denuncias

1. **Deforestación** - Tala ilegal de bosques
2. **Minería ilegal** - Extracción no autorizada de minerales
3. **Contaminación de agua** - Vertimientos y contaminación hídrica
4. **Tráfico de fauna** - Comercio ilegal de animales silvestres
5. **Incendios forestales** - Quemas intencionales o provocadas

## Niveles de Prioridad

- **Media** - Situación que requiere atención
- **Alta** - Situación grave que requiere acción pronta
- **Crítica** - Emergencia ambiental que requiere acción inmediata

## Estados de Denuncias

- **En revisión** - Denuncia recién creada, esperando ser tomada
- **Tomaron el caso** - Un revisor está trabajando en la denuncia

## Desarrollo

### Comandos disponibles

\`\`\`bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run lint         # Verificar código con ESLint
\`\`\`

### Agregar nuevos tipos de denuncia

Para agregar nuevos tipos de denuncias, ejecuta en MySQL:

\`\`\`sql
INSERT INTO tipo_demanda (nombre, descripcion) 
VALUES ('Nuevo Tipo', 'Descripción del nuevo tipo');
\`\`\`

## Notas Importantes

- Las contraseñas en la base de datos están en texto plano para desarrollo. En producción, implementa bcrypt o similar.
- El sistema de likes, comentarios y compartidos está preparado visualmente pero no tiene backend (no está en la base de datos actual).
- Las fotos se almacenan como rutas en la base de datos. Implementa un sistema de almacenamiento (AWS S3, Cloudinary, etc.) para producción.
- El mapa usa OpenStreetMap por defecto. Puedes cambiar el proveedor de tiles en los componentes de mapa.

## Próximas Mejoras

- Implementar sistema de comentarios en denuncias
- Agregar sistema de likes y reacciones
- Sistema de compartir en redes sociales
- Notificaciones en tiempo real con WebSockets
- Sistema de mensajería entre ciudadanos y revisores
- Exportación de reportes en PDF
- Dashboard con gráficas y análisis de datos
- Sistema de verificación de evidencias
- Integración con autoridades ambientales

## Licencia

Este proyecto es de código abierto para fines educativos y de impacto social.

## Contacto

Para más información sobre el proyecto Justicia Verde, contacta a través de la plataforma.
#   j u s t i c i a v e r d e - d e n u n c i a s  
 