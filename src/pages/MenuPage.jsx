import MenuSection from '../components/MenuSection'
import OrderLookup from '../components/OrderLookup'

export default function MenuPage(props) {
  return (
    <>
      <MenuSection {...props} />
      <OrderLookup orders={props.orders} />
    </>
  )
}
