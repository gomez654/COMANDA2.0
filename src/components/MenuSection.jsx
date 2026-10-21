import { Button, Col, Container, Row } from 'react-bootstrap'
import { categories } from '../data/products'
import ProductCard from './ProductCard'
import CartPanel from './CartPanel'
import RecipeSuggestion from './RecipeSuggestion'

export default function MenuSection({
  activeCategory,
  onCategoryChange,
  visibleProducts,
  onAdd,
  cartItems,
  onQuantityChange,
  onCheckout,
  deliveryType,
  onDeliveryTypeChange,
  message,
  confirmation,
}) {
  return (
    <section className="menu-section" id="menu">
      <Container>
        <div className="section-heading">
          <div>
            <p className="eyebrow">CLIENTE</p>
            <h2>Tu pedido, en pocos pasos.</h2>
          </div>
          <p>Explorá el menú, armá tu carrito y elegí cómo recibirlo.</p>
        </div>
        <Row className="g-4 align-items-start">
          <Col lg={8}>
            <div className="category-filters" role="group" aria-label="Filtrar productos por categoría">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={activeCategory === category.id ? 'dark' : 'outline-secondary'}
                  aria-pressed={activeCategory === category.id}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <Row className="g-3 g-xl-4">
              {visibleProducts.map((product) => (
                <Col key={product.id} xs={12} sm={6} xl={4}>
                  <ProductCard product={product} onAdd={onAdd} />
                </Col>
              ))}
            </Row>
            {visibleProducts.length === 0 && (
              <p className="empty-menu">No hay productos disponibles en esta categoría.</p>
            )}
          </Col>
          <Col lg={4}>
            <CartPanel
              items={cartItems}
              onQuantityChange={onQuantityChange}
              onCheckout={onCheckout}
              deliveryType={deliveryType}
              onDeliveryTypeChange={onDeliveryTypeChange}
              message={message}
              confirmation={confirmation}
            />
          </Col>
        </Row>
      </Container>
      <RecipeSuggestion />
    </section>
  )
}
