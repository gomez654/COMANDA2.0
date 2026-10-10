import { Button, Container } from 'react-bootstrap'

export default function HeroSection({ productCount }) {
  return (
    <section className="hero-section" id="inicio">
      <Container>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> SABORES DEL BARRIO, A TU RITMO</p>
            <h1>Tu próximo favorito está a un pedido.</h1>
            <p className="hero-description">
              Elegí algo rico, armá tu pedido y dejá que COMANDA se ocupe del resto.
            </p>
            <div className="hero-actions">
              <Button href="#menu" className="button-primary">Explorar el menu <span aria-hidden="true">↓</span></Button>
              <span className="hero-note">{productCount} opciones hechas para disfrutar</span>
            </div>
            <div className="hero-promises" id="como-funciona">
              <div><strong>01</strong><span>Elegís tus platos</span></div>
              <div><strong>02</strong><span>Armás el carrito</span></div>
              <div><strong>03</strong><span>Confirmás tu pedido</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/img/hamburguesa-completa.jpg" alt="Hamburguesa completa del menu de COMANDA" />
            <div className="hero-image-label">
              <span>RECOMENDADO</span>
              <strong>Hamburguesa completa</strong>
              <span>Carne, queso y salsa casera</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
