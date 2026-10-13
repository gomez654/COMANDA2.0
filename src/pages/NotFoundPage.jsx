import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="employee-panel-shell">
      <Container className="text-center py-5">
        <p className="eyebrow">ERROR 404</p>
        <h1>Página no encontrada</h1>
        <p className="mb-4">No encontramos la página que buscabas.</p>
        <Button as={Link} to="/" className="button-primary">Volver al inicio</Button>
      </Container>
    </section>
  )
}
