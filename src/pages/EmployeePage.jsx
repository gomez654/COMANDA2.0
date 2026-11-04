import EmployeePanel from '../components/EmployeePanel'

export default function EmployeePage({ orders, onStatusChange }) {
  return <EmployeePanel orders={orders} onStatusChange={onStatusChange} />
}
