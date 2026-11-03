# COMANDA

Aplicación web para gestionar pedidos de un local gastronómico. El proyecto implementa el recorrido completo de una compra: el cliente arma y confirma su pedido, el equipo del local lo prepara y el repartidor registra la entrega.

**Demo en línea:** [comanda-frontend-gamma.vercel.app](https://comanda-frontend-gamma.vercel.app/)

> **Alcance actual:** prototipo frontend. El carrito, el catálogo y los pedidos se guardan en el navegador mediante `localStorage`; todavía no hay backend ni sincronización entre dispositivos.

## Contenido

- [Funciones](#funciones)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración de la API](#configuración-de-la-api)
- [Accesos de demostración](#accesos-de-demostración)
- [Validación](#validación)
- [Estructura](#estructura)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Notas técnicas](#notas-técnicas)
- [Equipo](#equipo)

## Funciones

### Cliente

- Explorar el catálogo por categorías.
- Agregar productos al carrito y ajustar cantidades según el stock disponible.
- Elegir retiro en el local o envío a domicilio.
- Confirmar el pedido y obtener un número de seguimiento.
- Consultar el estado y el detalle del pedido.

### Empleado

- Consultar los pedidos registrados.
- Avanzar su preparación por los estados recibido, confirmado, en preparación y listo.

### Repartidor

- Consultar los pedidos a domicilio listos para retirar o que están en camino.
- Iniciar una entrega y marcarla como entregada.

### Administrador

- Consultar métricas de ventas, pedidos, productos activos y stock bajo.
- Crear, editar y eliminar productos.
- Actualizar precios, categorías, descripciones, stock y disponibilidad.

### Ideas de recetas

Consulta recetas de TheMealDB mediante Axios. La interfaz informa los errores y permite volver a intentar la consulta.

## Tecnologías

- React y JavaScript
- Vite
- React Router
- React Bootstrap y Bootstrap 5
- Axios y TheMealDB
- SweetAlert2
- CSS responsive
- Oxlint
- `localStorage` para persistencia local de demostración

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior
- npm

## Instalación

Desde la carpeta `comanda-frontend`:

```bash
npm install
```

Copiá `.env.example` como `.env` y luego iniciá el servidor:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

## Configuración de la API

La URL de TheMealDB se define en `VITE_API_URL`. El archivo `.env.example` incluye un valor de ejemplo; `.env` está excluido de Git.

```env
VITE_API_URL=https://www.themealdb.com/api/json/v1/1/search.php?s=chicken
```

Vite expone las variables con prefijo `VITE_` al código del navegador. Configurá aquí solo valores públicos; nunca guardes claves privadas en estas variables. En Vercel, agregá `VITE_API_URL` en los entornos Preview y Production.

## Accesos de demostración

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Empleado | `empleado` | `1234` |
| Repartidor | `repartidor` | `1234` |
| Administrador | `admin` | `1234` |

Estas credenciales están implementadas en el frontend únicamente para recorrer la demostración. No representan autenticación segura y no deben utilizarse en producción.

## Validación

```bash
npm run lint
npm run build
npm run preview
```

`npm run preview` sirve localmente la versión generada en `dist`.

## Estructura

```text
comanda-frontend/
├── public/img/       Imágenes del catálogo
├── src/components/   Vistas y componentes reutilizables
├── src/data/         Productos y estados de pedidos
├── src/utils/        Funciones auxiliares
├── src/App.jsx       Estado compartido y navegación
├── src/main.jsx      Entrada de React y estilos de Bootstrap
├── src/styles.css    Estilos y diseño responsive
├── index.html        Idioma y metadatos iniciales
└── vercel.json       Reescritura de rutas de la SPA
```

## Despliegue en Vercel

Desde `comanda-frontend`, iniciá sesión en Vercel y creá primero un deploy de vista previa:

```bash
npm exec --yes --package=vercel -- vercel
```

Para publicar en producción:

```bash
npm exec --yes --package=vercel -- vercel --prod
```

Antes del despliegue, configurá `VITE_API_URL` para Preview y Production. Para desplegar automáticamente con cada push, vinculá el repositorio `gomez654/COMANDA2.0` con Vercel.

## Notas técnicas

### Estado y efectos (TP7)

`useState` administra el filtro, carrito, pedidos, catálogo, tipo de entrega y estados de los formularios. `useEffect` sincroniza carrito, pedidos y catálogo con `localStorage`; también actualiza los metadatos de página al cambiar la ruta. Las funciones inicializadoras de `useState` leen los datos guardados al iniciar el estado.

### Navegación y metadatos

React Router organiza las páginas. `PageMetadata` actualiza el título y las descripciones al navegar. `index.html` define idioma, viewport y metadatos iniciales; `vercel.json` permite abrir directamente las rutas de la aplicación. Como se trata de una SPA, los metadatos por ruta se actualizan en el navegador; para indexación avanzada puede evaluarse prerenderizado o renderizado del lado del servidor.

### Persistencia y seguridad

Los datos persisten en el almacenamiento local del navegador y no se comparten entre usuarios ni dispositivos. Para un uso real se necesita un backend con persistencia compartida y autenticación segura.

## Equipo

- Lazarte Gastón
- Lazarte Karina Daniela
- Gómez Gonzalo Benjamín

## Flujo de ramas

- `main` contiene la versión estable.
- `dev` integra los avances aprobados.
- Las tareas se trabajan en ramas `feature/...` o `docs/...` y se proponen mediante Pull Requests hacia `dev`.
- Cuando `dev` está listo, se integra a `main` mediante un Pull Request final.
