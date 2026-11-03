import AdminPanel from '../components/AdminPanel'

export default function AdminPage({ products, orders, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  return (
    <AdminPanel
      products={products}
      orders={orders}
      onAddProduct={onAddProduct}
      onUpdateProduct={onUpdateProduct}
      onDeleteProduct={onDeleteProduct}
    />
  )
}
