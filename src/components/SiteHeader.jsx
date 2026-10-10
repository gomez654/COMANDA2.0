import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'

export default function SiteHeader({ cartCount }) {
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
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#menu">Menu</Nav.Link>
            <Nav.Link href="#como-funciona">Como funciona</Nav.Link>
          </Nav>
          <Button
            variant="dark"
            className="cart-nav-button"
            href="#carrito"
            aria-label={`Ver carrito, ${cartCount} productos`}
          >
            Mi pedido <Badge bg="warning" text="dark">{cartCount}</Badge>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
