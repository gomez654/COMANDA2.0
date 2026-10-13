import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import SiteHeader from './components/SiteHeader'
import PageMetadata from './components/PageMetadata'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import TrackingPage from './pages/TrackingPage'
import EmployeePage from './pages/EmployeePage'
import DeliveryPage from './pages/DeliveryPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import { products as initialProducts } from './data/products'

const CART_STORAGE_KEY = 'comanda-react-cart-v1'
const ORDER_STORAGE_KEY = 'comanda-react-orders-v1'
const PRODUCT_STORAGE_KEY = 'comanda-react-products-v1'

function readSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(savedCart)
      ? savedCart.filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
      : []
  } catch {
    return []
  }
}

function readSavedOrders() {
  try {
    const savedOrders = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || '[]')
    return Array.isArray(savedOrders) ? savedOrders : []
  } catch {
    return []
  }
}

function readSavedProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY) || 'null')
    return Array.isArray(savedProducts) ? savedProducts : initialProducts
  } catch {
    return initialProducts
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [cartItems, setCartItems] = useState(readSavedCart)
  const [orders, setOrders] = useState(readSavedOrders)
  const [productCatalog, setProductCatalog] = useState(readSavedProducts)
  const [deliveryType, setDeliveryType] = useState('retiro')
  const [cartMessage, setCartMessage] = useState('')
  const [confirmation, setConfirmation] = useState('')

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(productCatalog))
  }, [productCatalog])

  const visibleProducts = productCatalog.filter((product) => (
    product.available !== false && product.stock > 0 &&
    (activeCategory === 'todos' || product.category === activeCategory)
  ))
  const cartLines = cartItems
    .map((item) => {
      const product = productCatalog.find((entry) => entry.id === item.id)
      return product ? { ...product, quantity: Math.min(item.quantity, product.stock) } : null
    })
    .filter((item) => item && item.quantity > 0 && item.available !== false)
  const cartCount = cartLines.reduce((total, item) => total + item.quantity, 0)

  function addToCart(product) {
    setConfirmation('')
    setCartMessage('')
    setCartItems((currentItems) => {
      const currentQuantity = currentItems.find((item) => item.id === product.id)?.quantity || 0
      if (product.available === false || product.stock <= 0 || currentQuantity >= product.stock) {
        setCartMessage(`No hay más stock disponible de ${product.name}.`)
        return currentItems
      }
      const alreadyAdded = currentItems.some((item) => item.id === product.id)
      return alreadyAdded
        ? currentItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...currentItems, { id: product.id, quantity: 1 }]
    })
  }

  function changeQuantity(productId, amount) {
    setCartMessage('')
    setCartItems((currentItems) => currentItems
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  function updateOrderStatus(orderNumber, status) {
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.number === orderNumber ? { ...order, status } : order
    )))
  }

  function addProduct(product) {
    setProductCatalog((currentProducts) => {
      const nextId = currentProducts.reduce((highest, entry) => Math.max(highest, Number(entry.id) || 0), 0) + 1
      return [{ ...product, id: nextId }, ...currentProducts]
    })
  }

  function updateProduct(updatedProduct) {
    const normalizedProduct = {
      ...updatedProduct,
      stock: Number(updatedProduct.stock),
      price: Number(updatedProduct.price),
      available: Number(updatedProduct.stock) > 0 && updatedProduct.available !== false,
    }
    setProductCatalog((currentProducts) => currentProducts.map((product) => (
      product.id === normalizedProduct.id ? normalizedProduct : product
    )))
    setCartItems((currentItems) => currentItems
      .map((item) => item.id === normalizedProduct.id
        ? { ...item, quantity: Math.min(item.quantity, normalizedProduct.stock) }
        : item)
      .filter((item) => item.quantity > 0))
  }

  function deleteProduct(productId) {
    setProductCatalog((currentProducts) => currentProducts.filter((product) => product.id !== productId))
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  function checkout(event) {
    event.preventDefault()
    if (cartLines.length === 0) return
    const formData = new FormData(event.currentTarget)
    const customerName = String(formData.get('customer') || '').trim()
    const customerPhone = String(formData.get('phone') || '').trim()
    const lastOrderNumber = orders.reduce((highest, order) => Math.max(highest, Number(order.number) || 1000), 1000)
    const orderNumber = String(lastOrderNumber + 1)
    const deliveryLabel = deliveryType === 'retiro' ? 'retiro por el local' : 'entrega a domicilio'
    const order = {
      number: orderNumber,
      customerName,
      phone: customerPhone,
      deliveryType,
      address: deliveryType === 'domicilio' ? String(formData.get('address') || '').trim() : '',
      status: 'NUEVO',
      createdAt: new Date().toISOString(),
      items: cartLines.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      total: cartLines.reduce((total, item) => total + item.price * item.quantity, 0),
    }
    setOrders((currentOrders) => [order, ...currentOrders])
    setConfirmation(`Pedido #${orderNumber} generado para ${customerName}, con ${deliveryLabel}. Consultá su estado en Seguimiento.`)
    setCartItems([])
    setCartMessage('')
    event.currentTarget.reset()
    setDeliveryType('retiro')
  }

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <PageMetadata />
      <main>
        <Routes>
          <Route path="/" element={<HomePage productCount={visibleProducts.length} />} />
          <Route
            path="/menu"
            element={
              <MenuPage
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                visibleProducts={visibleProducts}
                onAdd={addToCart}
                cartItems={cartLines}
                onQuantityChange={changeQuantity}
                onCheckout={checkout}
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
                message={cartMessage}
                confirmation={confirmation}
                orders={orders}
              />
            }
          />
          <Route path="/seguimiento" element={<TrackingPage orders={orders} />} />
          <Route
            path="/empleado"
            element={<EmployeePage orders={orders} onStatusChange={updateOrderStatus} />}
          />
          <Route
            path="/repartidor"
            element={<DeliveryPage orders={orders} onStatusChange={updateOrderStatus} />}
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                products={productCatalog}
                orders={orders}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <Container>
          <span>© 2026 COMANDA</span>
          <span>Pedidos y ventas para locales de comida</span>
        </Container>
      </footer>
    </>
  )
}

export default App
