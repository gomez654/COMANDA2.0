import DeliveryPanel from '../components/DeliveryPanel'

export default function DeliveryPage({ orders, onStatusChange }) {
  return <DeliveryPanel orders={orders} onStatusChange={onStatusChange} />
}
