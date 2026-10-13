import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function SiteHeader({ cartCount }) {
  return (
    <Navbar expand="lg" className="site-nav sticky-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>COMANDA</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="comanda-navigation" aria-label="Abrir navegación" />
        <Navbar.Collapse id="comanda-navigation">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/menu">Menú</Nav.Link>
            <Nav.Link as={NavLink} to="/seguimiento">Seguimiento</Nav.Link>
            <Nav.Link as={NavLink} to="/empleado">Panel de empleado</Nav.Link>
            <Nav.Link as={NavLink} to="/repartidor">Panel de repartidor</Nav.Link>
            <Nav.Link as={NavLink} to="/admin">Panel de administrador</Nav.Link>
          </Nav>
          <Button
            as={NavLink}
            to="/menu"
            variant="dark"
            className="cart-nav-button"
            aria-label={`Ver carrito, ${cartCount} productos`}
          >
            Mi pedido <Badge bg="warning" text="dark">{cartCount}</Badge>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
