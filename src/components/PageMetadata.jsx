import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageMetadata = {
  '/': {
    title: 'COMANDA | Pedidos y ventas para locales de comida',
    description: 'Conocé COMANDA, explorá opciones del menú y realizá tu pedido online de forma simple.',
  },
  '/menu': {
    title: 'Menú y pedidos | COMANDA',
    description: 'Explorá el menú de COMANDA, agregá platos al carrito y elegí retiro o entrega a domicilio.',
  },
  '/seguimiento': {
    title: 'Seguimiento de pedidos | COMANDA',
    description: 'Consultá el estado y el detalle de tu pedido realizado en COMANDA.',
  },
  '/empleado': {
    title: 'Panel de empleado | COMANDA',
    description: 'Gestioná y actualizá el estado de los pedidos desde el panel de empleado de COMANDA.',
  },
  '/repartidor': {
    title: 'Panel de repartidor | COMANDA',
    description: 'Revisá las entregas pendientes y actualizá el estado de los pedidos a domicilio.',
  },
  '/admin': {
    title: 'Administración | COMANDA',
    description: 'Administrá el catálogo, el stock, los precios y las ventas de COMANDA.',
  },
}

export default function PageMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const metadata = pageMetadata[pathname] || {
      title: 'Página no encontrada | COMANDA',
      description: 'La página que buscás no está disponible en COMANDA.',
    }

    document.title = metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description)
  }, [pathname])

  return null
}
