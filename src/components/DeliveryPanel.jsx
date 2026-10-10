import { useState } from 'react'
import { Alert, Badge, Button, Container, Form } from 'react-bootstrap'
import { formatCurrency } from '../utils/formatCurrency'

function formatOrderDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function DeliveryPanel({ orders, onStatusChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState(false)

  function login(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const password = String(formData.get('password') || '')
    const isValid = username === 'repartidor' && password === '1234'

    setLoginError(!isValid)
    if (isValid) setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <section className="employee-panel-shell" id="panel-repartidor">
        <Container className="employee-login-wrap">
          <div className="employee-login">
            <p className="eyebrow">ACCESO DE EQUIPO</p>
            <h1>Panel de repartidor</h1>
            <p>Ingresá para consultar tus entregas y actualizar su seguimiento.</p>
            {loginError && <Alert variant="danger">Usuario o contraseña incorrectos.</Alert>}
            <Form onSubmit={login}>
              <Form.Group className="mb-3" controlId="delivery-username">
                <Form.Label>Usuario</Form.Label>
                <Form.Control name="username" autoComplete="username" required />
              </Form.Group>
              <Form.Group className="mb-4" controlId="delivery-password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control name="password" type="password" autoComplete="current-password" required />
              </Form.Group>
              <Button type="submit" className="employee-login-button w-100">Ingresar</Button>
            </Form>
          </div>
        </Container>
      </section>
    )
  }

  const deliveryOrders = orders.filter((order) => order.deliveryType === 'domicilio')
  const readyOrders = deliveryOrders.filter((order) => order.status === 'LISTO')
  const onRouteOrders = deliveryOrders.filter((order) => order.status === 'EN CAMINO')
  const deliveredOrders = deliveryOrders.filter((order) => order.status === 'ENTREGADO')
  const activeOrders = [...readyOrders, ...onRouteOrders]
    .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt))

  return (
    <section className="employee-panel-shell" id="panel-repartidor">
      <Container>
        <div className="employee-panel-heading">
          <div>
            <p className="eyebrow">ÚLTIMA MILLA</p>
            <h1>Ruta de entregas</h1>
            <p>Tomá los pedidos listos y actualizá su entrega.</p>
          </div>
          <Button variant="outline-secondary" onClick={() => setIsAuthenticated(false)}>
            Cerrar sesión
          </Button>
        </div>

        <div className="employee-metrics" aria-label="Resumen de entregas">
          <div><span>Para retirar</span><strong>{readyOrders.length}</strong></div>
          <div><span>En camino</span><strong>{onRouteOrders.length}</strong></div>
          <div><span>Entregados</span><strong>{deliveredOrders.length}</strong></div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="employee-empty-state">No hay entregas pendientes por el momento.</div>
        ) : (
          <div className="delivery-order-list">
            {activeOrders.map((order) => {
              const isReady = order.status === 'LISTO'
              return (
                <article className="delivery-order" key={order.number}>
                  <div className="employee-order-heading">
                    <div>
                      <span className="employee-order-number">Pedido #{order.number}</span>
                      <span className="employee-order-date">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <Badge bg={isReady ? 'warning' : 'primary'} text={isReady ? 'dark' : undefined}>
                      {isReady ? 'Listo para retirar' : 'En camino'}
                    </Badge>
                  </div>

                  <div className="delivery-destination">
                    <span className="delivery-destination-label">ENTREGAR EN</span>
                    <strong>{order.address || 'Dirección no especificada'}</strong>
                    <span>{order.customerName} · {order.phone}</span>
                  </div>

                  <ul className="employee-order-items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span>{item.quantity} × {item.name}</span>
                        <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      </li>
                    ))}
                  </ul>

                  <div className="delivery-order-footer">
                    <div>
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                    {isReady ? (
                      <Button
                        type="button"
                        className="delivery-action-button"
                        onClick={() => onStatusChange(order.number, 'EN CAMINO')}
                      >
                        Iniciar entrega <span aria-hidden="true">→</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="delivery-action-button"
                        onClick={() => onStatusChange(order.number, 'ENTREGADO')}
                      >
                        Marcar entregado <span aria-hidden="true">✓</span>
                      </Button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {deliveredOrders.length > 0 && (
          <details className="delivered-orders">
            <summary>Entregas completadas ({deliveredOrders.length})</summary>
            <div className="delivered-order-list">
              {deliveredOrders.map((order) => (
                <div className="delivered-order-row" key={order.number}>
                  <span>Pedido #{order.number} · {order.customerName} · {order.address}</span>
                  <Badge bg="success">Entregado</Badge>
                </div>
              ))}
            </div>
          </details>
        )}
      </Container>
    </section>
  )
}
