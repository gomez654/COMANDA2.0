import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import CartPanel from './components/CartPanel'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import SiteHeader from './components/SiteHeader'
import OrderLookup from './components/OrderLookup'
import EmployeePanel from './components/EmployeePanel'
import { products } from './data/products'

const CART_STORAGE_KEY = 'comanda-react-cart-v1'
const ORDER_STORAGE_KEY = 'comanda-react-orders-v1'

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

function App() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [activeView, setActiveView] = useState('cliente')
  const [cartItems, setCartItems] = useState(readSavedCart)
  const [orders, setOrders] = useState(readSavedOrders)
  const [deliveryType, setDeliveryType] = useState('retiro')
  const [cartMessage, setCartMessage] = useState('')
  const [confirmation, setConfirmation] = useState('')

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const visibleProducts = products.filter((product) => (
    activeCategory === 'todos' || product.category === activeCategory
  ))
  const cartLines = cartItems
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id)
      return product ? { ...product, quantity: Math.min(item.quantity, product.stock) } : null
    })
    .filter(Boolean)
  const cartCount = cartLines.reduce((total, item) => total + item.quantity, 0)

  function addToCart(product) {
    setConfirmation('')
    setCartMessage('')
    setCartItems((currentItems) => {
      const currentQuantity = currentItems.find((item) => item.id === product.id)?.quantity || 0
      if (currentQuantity >= product.stock) {
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
      <SiteHeader cartCount={cartCount} activeView={activeView} onViewChange={setActiveView} />
      <main>
        {activeView === 'cliente' ? (
          <>
        <HeroSection productCount={products.length} />
        <MenuSection
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          visibleProducts={visibleProducts}
          onAdd={addToCart}
        />
        <section className="order-section" aria-labelledby="order-section-title">
          <Container>
            <div className="order-layout">
              <div className="order-intro">
                <p className="eyebrow">UN BUEN PLAN EMPIEZA ACA</p>
                <h2 id="order-section-title">Tu pedido, a tu manera.</h2>
                <p>Revisá las cantidades, elegí cómo recibirlo y completá tus datos para generar el pedido.</p>
              </div>
              <CartPanel
                items={cartLines}
                onQuantityChange={changeQuantity}
                onCheckout={checkout}
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
                message={cartMessage}
                confirmation={confirmation}
              />
            </div>
          </Container>
        </section>
        <OrderLookup orders={orders} />
          </>
        ) : (
          <EmployeePanel orders={orders} onStatusChange={updateOrderStatus} />
        )}
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
