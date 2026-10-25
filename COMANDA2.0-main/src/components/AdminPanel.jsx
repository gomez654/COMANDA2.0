import { useState } from 'react'
import { Alert, Badge, Button, Container, Form, Table } from 'react-bootstrap'
import { categories } from '../data/products'
import { formatCurrency } from '../utils/formatCurrency'

const productCategories = categories.filter((category) => category.id !== 'todos')
const pendingStatuses = ['NUEVO', 'CONFIRMADO', 'EN PREPARACIÓN', 'LISTO', 'EN CAMINO']

export default function AdminPanel({ products, orders, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [drafts, setDrafts] = useState({})
  const [feedback, setFeedback] = useState('')

  function login(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '').trim()
    const password = String(formData.get('password') || '')
    const isValid = username === 'admin' && password === '1234'

    setLoginError(!isValid)
    if (isValid) setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <section className="employee-panel-shell" id="panel-administrador">
        <Container className="employee-login-wrap">
          <div className="employee-login">
            <p className="eyebrow">ADMINISTRACIÓN</p>
            <h1>Centro de control</h1>
            <p>Ingresá para administrar el catálogo y revisar la actividad del local.</p>
            {loginError && <Alert variant="danger">Usuario o contraseña incorrectos.</Alert>}
            <Form onSubmit={login}>
              <Form.Group className="mb-3" controlId="admin-username">
                <Form.Label>Usuario</Form.Label>
                <Form.Control name="username" autoComplete="username" required />
              </Form.Group>
              <Form.Group className="mb-4" controlId="admin-password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control name="password" type="password" autoComplete="current-password" required />
              </Form.Group>
              <Button type="submit" className="employee-login-button w-100">Ingresar</Button>
            </Form>
          </div>
        </Container>
      </section>
    )
  }

  const totalSales = orders.reduce((total, order) => total + Number(order.total || 0), 0)
  const pendingOrders = orders.filter((order) => pendingStatuses.includes(order.status)).length
  const lowStockProducts = products.filter((product) => product.available !== false && product.stock <= 5).length
  const activeProducts = products.filter((product) => product.available !== false && product.stock > 0).length
  const topProduct = orders.reduce((counts, order) => {
    order.items.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + item.quantity
    })
    return counts
  }, {})
  const bestSeller = Object.entries(topProduct).sort((first, second) => second[1] - first[1])[0]?.[0] || 'Sin ventas'

  function getDraft(product) {
    return drafts[product.id] || { ...product, available: product.available !== false }
  }

  function updateDraft(product, field, value) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [product.id]: { ...getDraft(product), [field]: value },
    }))
  }

  function saveProduct(product) {
    const draft = getDraft(product)
    const name = String(draft.name || '').trim()
    const price = Number(draft.price)
    const stock = Number(draft.stock)
    if (!name || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setFeedback('Revisá el nombre, el precio y el stock del producto.')
      return
    }

    onUpdateProduct({
      ...draft,
      name,
      price,
      stock,
      available: stock > 0 && draft.available !== false,
    })
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts }
      delete nextDrafts[product.id]
      return nextDrafts
    })
    setFeedback(`${name} fue actualizado.`)
  }

  function createProduct(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const category = String(formData.get('category') || '')
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const description = String(formData.get('description') || '').trim()

    if (!name || !category || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setFeedback('Completá los campos con un precio mayor a cero y stock válido.')
      return
    }

    onAddProduct({
      name,
      category,
      price,
      description: description || 'Producto agregado por administración.',
      image: '/img/producto-nuevo.jpg',
      stock,
      available: stock > 0,
    })
    setFeedback(`${name} fue agregado al catálogo.`)
    event.currentTarget.reset()
  }

  return (
    <section className="employee-panel-shell admin-panel-shell" id="panel-administrador">
      <Container>
        <div className="employee-panel-heading">
          <div>
            <p className="eyebrow">ADMINISTRACIÓN</p>
            <h1>Resumen del negocio</h1>
            <p>Revisá la actividad y mantené actualizado el menú.</p>
          </div>
          <Button variant="outline-secondary" onClick={() => setIsAuthenticated(false)}>
            Cerrar sesión
          </Button>
        </div>

        <div className="admin-metrics" aria-label="Resumen del negocio">
          <div><span>Ventas registradas</span><strong>{formatCurrency(totalSales)}</strong></div>
          <div><span>Pedidos pendientes</span><strong>{pendingOrders}</strong></div>
          <div><span>Productos activos</span><strong>{activeProducts}/{products.length}</strong></div>
          <div><span>Stock bajo</span><strong>{lowStockProducts}</strong></div>
          <div><span>Más vendido</span><strong>{bestSeller}</strong></div>
        </div>

        {feedback && <Alert variant="info" className="admin-feedback" role="status">{feedback}</Alert>}

        <section className="admin-surface" aria-labelledby="catalog-title">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">CATÁLOGO</p>
              <h2 id="catalog-title">Productos</h2>
            </div>
            <Badge bg="dark">{products.length} productos</Badge>
          </div>

          <Form onSubmit={createProduct} className="admin-create-form">
            <Form.Group controlId="new-product-name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="name" placeholder="Ej: Empanadas caseras" required />
            </Form.Group>
            <Form.Group controlId="new-product-category">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="category" defaultValue={productCategories[0]?.id} required>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="new-product-price">
              <Form.Label>Precio</Form.Label>
              <Form.Control name="price" type="number" min="1" step="1" placeholder="0" required />
            </Form.Group>
            <Form.Group controlId="new-product-stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control name="stock" type="number" min="0" step="1" placeholder="0" required />
            </Form.Group>
            <Form.Group controlId="new-product-description" className="admin-description-field">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="description" placeholder="Descripción breve del producto" />
            </Form.Group>
            <Button type="submit" className="admin-add-button">Agregar producto</Button>
          </Form>

          <div className="table-responsive admin-table-wrap">
            <Table hover className="admin-products-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Disponible</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const draft = getDraft(product)
                  return (
                    <tr key={product.id}>
                      <td>
                        <Form.Control
                          aria-label={`Nombre de ${product.name}`}
                          value={draft.name}
                          onChange={(event) => updateDraft(product, 'name', event.target.value)}
                        />
                        <Form.Control
                          className="admin-description-input"
                          aria-label={`Descripción de ${product.name}`}
                          value={draft.description || ''}
                          onChange={(event) => updateDraft(product, 'description', event.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Select
                          aria-label={`Categoría de ${product.name}`}
                          value={draft.category}
                          onChange={(event) => updateDraft(product, 'category', event.target.value)}
                        >
                          {productCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.label}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          aria-label={`Precio de ${product.name}`}
                          type="number"
                          min="1"
                          step="1"
                          value={draft.price}
                          onChange={(event) => updateDraft(product, 'price', event.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          aria-label={`Stock de ${product.name}`}
                          type="number"
                          min="0"
                          step="1"
                          value={draft.stock}
                          onChange={(event) => updateDraft(product, 'stock', event.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          aria-label={`Disponibilidad de ${product.name}`}
                          checked={draft.available !== false}
                          disabled={Number(draft.stock) === 0}
                          onChange={(event) => updateDraft(product, 'available', event.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Button type="button" className="admin-save-button" onClick={() => saveProduct(product)}>
                            Guardar
                          </Button>
                          <Button
                            type="button"
                            variant="outline-danger"
                            aria-label={`Eliminar ${product.name}`}
                            onClick={() => onDeleteProduct(product.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </section>
      </Container>
    </section>
  )
}
