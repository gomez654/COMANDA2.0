import { Alert, Badge, Button, Form } from 'react-bootstrap'
import { formatCurrency } from '../utils/formatCurrency'

export default function CartPanel({
  items,
  onQuantityChange,
  onCheckout,
  deliveryType,
  onDeliveryTypeChange,
  message,
  confirmation,
}) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <aside className="cart-panel" id="carrito" aria-labelledby="cart-title">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">TU PEDIDO</span>
          <h2 id="cart-title">Carrito</h2>
        </div>
        <Badge bg="dark">{itemCount} {itemCount === 1 ? 'item' : 'items'}</Badge>
      </div>

      {message && <Alert variant="warning" className="cart-alert">{message}</Alert>}
      {confirmation && <Alert variant="success" className="cart-alert">{confirmation}</Alert>}

      {items.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-mark" aria-hidden="true">+</span>
          <p>Tu carrito está esperando algo rico.</p>
        </div>
      ) : (
        <ul className="cart-lines">
          {items.map((item) => (
            <li key={item.id} className="cart-line">
              <div className="cart-line-info">
                <strong>{item.name}</strong>
                <span>{formatCurrency(item.price)} c/u</span>
                <div className="quantity-control" aria-label={`Cantidad de ${item.name}`}>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    aria-label={`Quitar una unidad de ${item.name}`}
                    onClick={() => onQuantityChange(item.id, -1)}
                  >
                    −
                  </Button>
                  <span aria-live="polite">{item.quantity}</span>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    aria-label={`Agregar una unidad de ${item.name}`}
                    disabled={item.quantity >= item.stock}
                    onClick={() => onQuantityChange(item.id, 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <strong className="cart-line-total">{formatCurrency(item.price * item.quantity)}</strong>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-subtotal">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>

      <Form onSubmit={onCheckout} className="checkout-form">
        <Form.Group className="mb-3" controlId="customer-name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="customer" autoComplete="name" placeholder="Tu nombre" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="customer-phone">
          <Form.Label>Celular</Form.Label>
          <Form.Control name="phone" type="tel" autoComplete="tel" placeholder="11 5555 5555" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="delivery-type">
          <Form.Label>Cómo lo recibís</Form.Label>
          <Form.Select value={deliveryType} onChange={(event) => onDeliveryTypeChange(event.target.value)}>
            <option value="retiro">Retiro por el local</option>
            <option value="domicilio">Envio a domicilio</option>
          </Form.Select>
        </Form.Group>
        {deliveryType === 'domicilio' && (
          <Form.Group className="mb-3" controlId="delivery-address">
            <Form.Label>Dirección de entrega</Form.Label>
            <Form.Control name="address" autoComplete="street-address" placeholder="Calle y altura" required />
          </Form.Group>
        )}
        <Button type="submit" className="checkout-button w-100" disabled={items.length === 0}>
          Confirmar pedido <span aria-hidden="true">→</span>
        </Button>
      </Form>
      <p className="cart-footnote">El costo de envío se confirma al coordinar la entrega.</p>
    </aside>
  )
}
