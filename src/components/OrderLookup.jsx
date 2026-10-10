import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { orderStatuses } from '../data/orderStatuses'
import { formatCurrency } from '../utils/formatCurrency'

export default function OrderLookup({ orders }) {
  const [orderNumber, setOrderNumber] = useState('')
  const [searchedOrder, setSearchedOrder] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  function searchOrder(event) {
    event.preventDefault()
    const normalizedNumber = orderNumber.trim().replace(/^#/, '')
    const result = orders.find((order) => String(order.number) === normalizedNumber)
    setSearchedOrder(result || null)
    setHasSearched(true)
  }

  const currentStatusIndex = searchedOrder
    ? orderStatuses.findIndex((status) => status.id === searchedOrder.status)
    : -1

  return (
    <section className="order-lookup-section" id="seguimiento" aria-labelledby="order-lookup-title">
      <div className="container">
        <div className="order-lookup-layout">
          <div className="order-lookup-intro">
            <p className="eyebrow">SEGUIMIENTO</p>
            <h2 id="order-lookup-title">¿Cómo va tu pedido?</h2>
            <p>Ingresá el número que recibiste al confirmar la compra para ver su estado.</p>
          </div>
          <div className="order-lookup-card">
            <Form onSubmit={searchOrder} className="order-lookup-form">
              <Form.Group controlId="order-number">
                <Form.Label>Número de pedido</Form.Label>
                <Form.Control
                  inputMode="numeric"
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  placeholder="Ej: 1001"
                  aria-describedby="order-number-hint"
                  required
                />
                <Form.Text id="order-number-hint">También podés ingresarlo con # adelante.</Form.Text>
              </Form.Group>
              <Button type="submit" className="order-lookup-button">Consultar pedido</Button>
            </Form>

            {hasSearched && !searchedOrder && (
              <Alert variant="warning" className="order-lookup-alert" role="status">
                No encontramos ese pedido. Revisá el número e intentá de nuevo.
              </Alert>
            )}

            {searchedOrder && (
              <div className="order-lookup-result" aria-live="polite">
                <div className="order-result-heading">
                  <div>
                    <span>Pedido #{searchedOrder.number}</span>
                    <strong>{orderStatuses[currentStatusIndex]?.label || 'Estado actualizado'}</strong>
                  </div>
                  <span className="order-type-label">
                    {searchedOrder.deliveryType === 'domicilio' ? 'A domicilio' : 'Retiro'}
                  </span>
                </div>
                <ol className="order-status-steps" aria-label="Progreso del pedido">
                  {orderStatuses.map((status, index) => {
                    const isComplete = currentStatusIndex >= 0 && index < currentStatusIndex
                    const isCurrent = index === currentStatusIndex
                    return (
                      <li
                        key={status.id}
                        className={[
                          'order-status-step',
                          isComplete ? 'is-complete' : '',
                          isCurrent ? 'is-current' : '',
                        ].filter(Boolean).join(' ')}
                        aria-current={isCurrent ? 'step' : undefined}
                      >
                        <span className="status-step-marker">{isComplete ? '✓' : index + 1}</span>
                        <span>{status.label}</span>
                      </li>
                    )
                  })}
                </ol>
                <div className="order-result-items">
                  {searchedOrder.items.map((item) => (
                    <div key={item.id}>
                      <span>{item.quantity} × {item.name}</span>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-result-total">
                  <span>Total</span>
                  <strong>{formatCurrency(searchedOrder.total)}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
