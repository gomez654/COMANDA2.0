import { Alert, Badge, Button, ButtonGroup, Card, Form, ListGroup, Stack } from 'react-bootstrap'
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
    <Card
      as="aside"
      className="cart-panel shadow-sm border-0 sticky-lg-top"
      style={{ top: '5.5rem' }}
      id="carrito"
      aria-labelledby="cart-title"
    >
      <Card.Header className="bg-white border-0 d-flex align-items-start justify-content-between gap-3 px-3 px-xl-4 pt-3 pt-xl-4 pb-0">
        <div>
          <span className="eyebrow">TU PEDIDO</span>
          <Card.Title as="h2" id="cart-title" className="h4 mb-0">Carrito</Card.Title>
        </div>
        <Badge bg="dark" pill className="mt-1">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Badge>
      </Card.Header>

      <Card.Body className="px-3 px-xl-4 pt-3 pb-4">
        {message && <Alert variant="warning" className="py-2 small">{message}</Alert>}
        {confirmation && <Alert variant="success" className="py-2 small">{confirmation}</Alert>}

        {items.length === 0 ? (
          <Alert variant="light" className="text-center text-body-secondary py-4 my-3">
            <span className="d-block fs-4 text-success" aria-hidden="true">+</span>
            <span>Tu carrito está esperando algo rico.</span>
          </Alert>
        ) : (
          <ListGroup variant="flush" className="mb-3">
            {items.map((item) => (
              <ListGroup.Item key={item.id} className="px-0 py-3">
                <Stack direction="horizontal" gap={3} className="align-items-start">
                  <div className="flex-grow-1">
                    <strong className="d-block text-break">{item.name}</strong>
                    <small className="text-body-secondary">{formatCurrency(item.price)} c/u</small>
                    <div className="mt-2">
                      <ButtonGroup size="sm" aria-label={`Cantidad de ${item.name}`}>
                        <Button
                          type="button"
                          variant="outline-secondary"
                          aria-label={`Quitar una unidad de ${item.name}`}
                          onClick={() => onQuantityChange(item.id, -1)}
                        >
                          −
                        </Button>
                        <span className="px-3 d-inline-flex align-items-center fw-semibold" aria-live="polite">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline-secondary"
                          aria-label={`Agregar una unidad de ${item.name}`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => onQuantityChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <strong className="text-nowrap">{formatCurrency(item.price * item.quantity)}</strong>
                </Stack>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Stack direction="horizontal" className="justify-content-between border-top py-3">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </Stack>

        <Form onSubmit={onCheckout} className="border-top pt-3">
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
              <option value="domicilio">Envío a domicilio</option>
            </Form.Select>
          </Form.Group>
          {deliveryType === 'domicilio' && (
            <Form.Group className="mb-3" controlId="delivery-address">
              <Form.Label>Dirección de entrega</Form.Label>
              <Form.Control name="address" autoComplete="street-address" placeholder="Calle y altura" required />
            </Form.Group>
          )}
          <Button type="submit" variant="success" className="w-100" disabled={items.length === 0}>
            Confirmar pedido <span aria-hidden="true">→</span>
          </Button>
        </Form>
        <small className="d-block text-body-secondary text-center mt-3">
          El costo de envío se confirma al coordinar la entrega.
        </small>
      </Card.Body>
    </Card>
  )
}
