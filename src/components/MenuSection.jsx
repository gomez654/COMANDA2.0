import { Button, Col, Container, Row } from 'react-bootstrap'
import { categories } from '../data/products'
import ProductCard from './ProductCard'

export default function MenuSection({ activeCategory, onCategoryChange, visibleProducts, onAdd }) {
  return (
    <section className="menu-section" id="menu">
      <Container>
        <div className="section-heading">
          <div>
            <p className="eyebrow">LA CARTA</p>
            <h2>Algo rico te espera.</h2>
          </div>
          <p>Recetas simples, porciones generosas y ganas de volver.</p>
        </div>
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
      </Container>
    </section>
  )
}
