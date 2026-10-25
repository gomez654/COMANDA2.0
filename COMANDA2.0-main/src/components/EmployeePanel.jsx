import { useState } from 'react'
import { Alert, Badge, Button, Container, Form } from 'react-bootstrap'
import { orderStatuses } from '../data/orderStatuses'
import { formatCurrency } from '../utils/formatCurrency'

const employeeStatuses = orderStatuses.slice(0, 4)
const deliveryStatuses = orderStatuses.slice(4)

function formatOrderDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function EmployeePanel({ orders, onStatusChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState(false)

  function login(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const password = String(formData.get('password') || '')
    const isValid = username === 'empleado' && password === '1234'

    setLoginError(!isValid)
    if (isValid) setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <section className="employee-panel-shell" id="panel-empleado">
        <Container className="employee-login-wrap">
          <div className="employee-login">
            <p className="eyebrow">ACCESO DE EQUIPO</p>
            <h1>Panel de empleado</h1>
            <p>Ingresá para revisar los pedidos y actualizar su preparación.</p>
            {loginError && <Alert variant="danger">Usuario o contraseña incorrectos.</Alert>}
            <Form onSubmit={login}>
              <Form.Group className="mb-3" controlId="employee-username">
                <Form.Label>Usuario</Form.Label>
                <Form.Control name="username" autoComplete="username" required />
              </Form.Group>
              <Form.Group className="mb-4" controlId="employee-password">
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

  const newOrders = orders.filter((order) => order.status === 'NUEVO').length
  const preparingOrders = orders.filter((order) => ['CONFIRMADO', 'EN PREPARACIÓN'].includes(order.status)).length
  const readyOrders = orders.filter((order) => order.status === 'LISTO').length

  return (
    <section className="employee-panel-shell" id="panel-empleado">
      <Container>
        <div className="employee-panel-heading">
          <div>
            <p className="eyebrow">OPERACIÓN DEL LOCAL</p>
            <h1>Pedidos del día</h1>
            <p>Actualizá el estado de preparación de cada pedido.</p>
          </div>
          <Button variant="outline-secondary" onClick={() => setIsAuthenticated(false)}>
            Cerrar sesión
          </Button>
        </div>

        <div className="employee-metrics" aria-label="Resumen de pedidos">
          <div><span>Nuevos</span><strong>{newOrders}</strong></div>
          <div><span>En preparación</span><strong>{preparingOrders}</strong></div>
          <div><span>Listos</span><strong>{readyOrders}</strong></div>
        </div>

        {orders.length === 0 ? (
          <div className="employee-empty-state">Todavía no hay pedidos registrados.</div>
        ) : (
          <div className="employee-order-list">
            {orders.map((order) => {
              const isWithDelivery = order.status === 'EN CAMINO' || order.status === 'ENTREGADO'
              const currentStatus = orderStatuses.find((status) => status.id === order.status)
              const statusOptions = isWithDelivery
                ? [...employeeStatuses, ...deliveryStatuses.filter((status) => status.id === order.status)]
                : employeeStatuses

              return (
                <article className="employee-order" key={order.number}>
                  <div className="employee-order-heading">
                    <div>
                      <span className="employee-order-number">Pedido #{order.number}</span>
                      <span className="employee-order-date">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <Badge bg={order.status === 'NUEVO' ? 'warning' : 'success'} text={order.status === 'NUEVO' ? 'dark' : undefined}>
                      {currentStatus?.label || order.status}
                    </Badge>
                  </div>

                  <div className="employee-customer-details">
                    <strong>{order.customerName}</strong>
                    <span>{order.phone}</span>
                    <span>
                      {order.deliveryType === 'domicilio'
                        ? `Envío a domicilio${order.address ? ` · ${order.address}` : ''}`
                        : 'Retiro por el local'}
                    </span>
                  </div>

                  <ul className="employee-order-items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span>{item.quantity} × {item.name}</span>
                        <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      </li>
                    ))}
                  </ul>

                  <div className="employee-order-footer">
                    <div>
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                    <Form.Group controlId={`order-status-${order.number}`} className="employee-status-control">
                      <Form.Label>Estado del pedido</Form.Label>
                      <Form.Select
                        value={order.status}
                        disabled={isWithDelivery}
                        onChange={(event) => onStatusChange(order.number, event.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  {isWithDelivery && (
                    <p className="employee-handoff-note mb-0">Este pedido continúa en el panel de repartidor.</p>
                  )}
                  {order.status === 'LISTO' && order.deliveryType === 'domicilio' && (
                    <p className="employee-handoff-note mb-0">Pedido listo para que lo tome un repartidor.</p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
