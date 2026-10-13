# COMANDA Frontend

COMANDA es un sistema web para centralizar los pedidos y las ventas de un local de comida. Esta versión frontend fue migrada a React + Vite y permite recorrer el flujo desde que un cliente arma un pedido hasta que el repartidor lo entrega.

## Equipo

- Lazarte Gastón
- Lazarte Karina Daniela
- Gómez Gonzalo Benjamín

## Tecnologías

- React y JavaScript
- React Router para navegación entre páginas
- Vite
- React Bootstrap y Bootstrap 5
- CSS responsive
- Oxlint
- `localStorage` para guardar los datos de demostración en el navegador

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalación y desarrollo

Desde la carpeta `comanda-frontend`, instalar las dependencias y levantar el servidor local:

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir COMANDA.

## SEO y navegación

- `index.html` define el idioma español, el viewport, una descripción inicial y metadatos Open Graph y Twitter para compartir el sitio.
- `PageMetadata` actualiza el título, la descripción y los metadatos Open Graph al navegar entre rutas.
- Las páginas están separadas y enlazadas con React Router. `vercel.json` redirige las rutas de la aplicación a su entrada para que se puedan abrir directamente.

Los metadatos por página se actualizan en el navegador porque COMANDA es una aplicación React de una sola página. Para indexación avanzada en buscadores se puede evaluar renderizado del lado del servidor o prerenderizado.

## Funcionalidades

### Cliente

- Explorar el catálogo por categorías.
- Agregar productos al carrito y ajustar cantidades respetando el stock.
- Elegir retiro por el local o envío a domicilio.
- Confirmar un pedido y recibir su número.
- Consultar el estado y el detalle del pedido.

### Empleado

- Consultar los pedidos registrados.
- Actualizar la preparación: recibido, confirmado, en preparación y listo.

### Repartidor

- Consultar los pedidos a domicilio listos para retirar o en camino.
- Iniciar una entrega y marcarla como entregada.

### Administrador

- Consultar métricas de ventas, pedidos, productos activos y stock bajo.
- Crear, editar y eliminar productos.
- Actualizar precios, categorías, descripciones, stock y disponibilidad.

## Accesos de demostración

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Empleado | `empleado` | `1234` |
| Repartidor | `repartidor` | `1234` |
| Administrador | `admin` | `1234` |

Son credenciales de demostración implementadas en el frontend; no proporcionan autenticación segura y no deben usarse en producción.

## Persistencia y alcance

Los pedidos, el carrito y el catálogo se guardan en `localStorage`. Los datos solo se comparten dentro del mismo navegador y dispositivo. No hay backend ni sincronización entre usuarios; por eso esta versión sirve como prototipo frontend y no como sistema multiusuario en producción.

## Comandos de validación

```bash
npm run lint
npm run build
npm run preview
```

## Estructura principal

```text
comanda-frontend/
├── public/img/          Imágenes del catálogo
├── src/components/      Vistas y componentes reutilizables
├── src/data/            Productos y estados de pedidos
├── src/utils/           Funciones auxiliares
├── src/App.jsx           Estado compartido y selección de vistas
├── src/main.jsx          Entrada de React y estilos de Bootstrap
├── src/styles.css        Identidad visual y responsive
├── index.html             Título, idioma y metadatos SEO
└── README.md
```

## Git y Pull Requests

- `main` contiene la versión estable.
- `dev` integra los avances aprobados.
- Cada tarea se trabaja en una rama `feature/...` o `docs/...` y se propone mediante un PR hacia `dev`.
- Cuando `dev` esté listo, se integra a `main` mediante un PR final.

## Deploy en Vercel

Vite genera la versión de producción en `dist`. Desde esta carpeta, iniciar sesión en Vercel y usar:

```bash
npm exec --yes --package=vercel -- vercel
npm exec --yes --package=vercel -- vercel --prod
```

El primer comando crea un deploy Preview; el segundo publica en producción. Para que Vercel despliegue automáticamente cada push, hay que autorizar la integración de GitHub con el repositorio `gomez654/COMANDA2.0`.
