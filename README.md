# Support Orders Web App - Frontend

Interfaz web construida con Angular para que los operadores visualicen, filtren y gestionen el ciclo de vida de las órdenes de soporte reportadas desde la aplicación móvil.

## 🛠️ Stack Tecnológico
- **Framework:** Angular 17+ (Standalone Components)
- **Lenguaje:** TypeScript (Tipado estricto)
- **UI Library:** Angular Material
- **Gestión de Estado:** Angular Signals y Reactive Forms
- **HTTP Client:** Angular HttpClient con Interceptores funcionales
- **Build Tool:** Angular CLI

## 🏗️ Arquitectura Frontend
Se utilizó una arquitectura modular basada en **Features** con componentes Standalone. Esta elección elimina el boilerplate de los `NgModules`, mejora el *tree-shaking* y permite un *lazy loading* más granular de las rutas.

- **`core/`**: Infraestructura de la aplicación. Contiene servicios singleton (`SupportOrderService`) e interceptores globales (`errorInterceptor`).
- **`shared/`**: Modelos TypeScript estrictamente tipados que reflejan los DTOs del backend, y componentes reutilizables.
- **`features/`**: Módulos autocontenidos por caso de uso (`order-list`, `order-create`, `order-detail`). Cada feature es independiente y conoce su propio estado.

## 🔌 Integración con el Backend
*(Nota: Los detalles de configuración de CORS y contratos de API se detallan en el correo de entrega y en el README del backend).*
- **Contrato de API:** El frontend consume la API REST basándose estrictamente en los DTOs acordados. 
- **Manejo de Errores:** Se implementó un **Interceptor de Errores Global** (`HttpInterceptorFn`) que captura las respuestas HTTP de error (ej. 400, 409) y muestra notificaciones (`MatSnackBar`) al usuario, manteniendo los componentes visuales libres de lógica de manejo de errores (SRP).
- **Sincronización de Reglas de Negocio:** La lógica de transiciones de estado del backend (Patrón State) se replica en el frontend mediante propiedades computadas (`computed`), mostrando al usuario únicamente las opciones de estado válidas en tiempo real, previniendo errores de UX antes de que ocurran.

## ✅ Funcionalidades Implementadas
1. **Listado:** Tabla responsive con filtro dinámico por estado.
2. **Creación:** Formulario reactivo con validaciones en tiempo real (ej. longitud de descripción, campos obligatorios).
3. **Detalle:** Vista completa de la orden con metadatos.
4. **Actualización de Estado:** Dropdown restrictivo que solo permite transiciones válidas.
5. **UX:** Manejo de estados de carga (`MatSpinner`), éxito y error.
6. **Responsive:** Diseño adaptable a ventanas estrechas mediante CSS Grid y Media Queries.

## 🚀 Instrucciones de Ejecución

### Prerrequisitos
- Node.js 18+
- npm

### Pasos
1. Instalar dependencias:
   ```bash
   npm install