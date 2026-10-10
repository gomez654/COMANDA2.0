import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'

export default function SiteHeader({ cartCount, activeView, onViewChange }) {
  return (
    <Navbar expand="lg" className="site-nav sticky-top">
      <Container>
        <Navbar.Brand href="#inicio" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>COMANDA</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="comanda-navigation" aria-label="Abrir navegación" />
        <Navbar.Collapse id="comanda-navigation">
          <Nav className="mx-auto nav-links">
            {activeView === 'cliente' ? (
              <>
                <Nav.Link href="#inicio">Inicio</Nav.Link>
                <Nav.Link href="#menu">Menú</Nav.Link>
                <Nav.Link href="#como-funciona">Cómo funciona</Nav.Link>
                <Nav.Link as="button" type="button" onClick={() => onViewChange('empleado')}>
                  Panel de empleado
                </Nav.Link>
                <Nav.Link as="button" type="button" onClick={() => onViewChange('repartidor')}>
                  Panel de repartidor
                </Nav.Link>
                  <Nav.Link as="button" type="button" onClick={() => onViewChange('administrador')}>
                    Panel de administrador
                  </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as="button" type="button" onClick={() => onViewChange('cliente')}>
                  Volver al menú
                </Nav.Link>
                {activeView === 'empleado' ? (
                  <Nav.Link as="button" type="button" onClick={() => onViewChange('repartidor')}>
                    Panel de repartidor
                  </Nav.Link>
                  ) : activeView === 'repartidor' ? (
                  <Nav.Link as="button" type="button" onClick={() => onViewChange('empleado')}>
                    Panel de empleado
                  </Nav.Link>
                  ) : (
                    <Nav.Link as="button" type="button" onClick={() => onViewChange('empleado')}>
                      Panel de empleado
                    </Nav.Link>
                )}
              </>
            )}
          </Nav>
          {activeView === 'cliente' && (
            <Button
              variant="dark"
              className="cart-nav-button"
              href="#carrito"
              aria-label={`Ver carrito, ${cartCount} productos`}
            >
              Mi pedido <Badge bg="warning" text="dark">{cartCount}</Badge>
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
