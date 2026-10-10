import { Badge, Button, Card } from 'react-bootstrap'
import { formatCurrency } from '../utils/formatCurrency'

const categoryNames = {
  hamburguesas: 'Platos',
  pizzas: 'Pizzas',
  frescos: 'Frescos',
  bebidas: 'Bebidas',
}

export default function ProductCard({ product, onAdd }) {
  const lowStock = product.stock <= 5

  return (
    <Card className="product-card h-100">
      <div className="product-image-wrap">
        <Card.Img src={product.image} alt={product.name} loading="lazy" />
        <Badge bg={lowStock ? 'warning' : 'success'} text={lowStock ? 'dark' : undefined} className="stock-badge">
          {lowStock ? 'Quedan pocos' : 'Disponible'}
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column">
        <span className="product-category">{categoryNames[product.category]}</span>
        <Card.Title as="h3">{product.name}</Card.Title>
        <Card.Text className="product-description">{product.description}</Card.Text>
        <div className="product-footer mt-auto">
          <strong>{formatCurrency(product.price)}</strong>
          <Button
            type="button"
            className="add-button"
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            <span aria-hidden="true">+</span> Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
