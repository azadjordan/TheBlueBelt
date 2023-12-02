
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchAllOrders } from '../../slices/orderSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom'





const OrderListScreen = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchAllOrders())
    }
  }, [dispatch, userInfo])

  const { allOrders, orderStatus, orderError } = useSelector((state) => state.order)

  return (
    <>
      <h1 className='my-4'>Orders</h1>
      {orderStatus === 'loading' ? (<Loader />) : orderError ? (<Message>{orderError}</Message>) : (
        <Table striped hover bordered responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allOrders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>AED {order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Button variant='light' className='btn-sm' as={Link} to={`/order/${order._id}`}>
                    Details
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>

  )
}

export default OrderListScreen