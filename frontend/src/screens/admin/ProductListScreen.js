import { Button, Col, Row, Table } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { fetchProducts, createProduct, deleteProduct } from "../../slices/productsSlice"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import Paginate from "../../components/Paginate"



const ProductListScreen = () => {
    const dispatch = useDispatch()
    const { pageNumber = '1' } = useParams();


    const { data, productsStatus, error } = useSelector((state) => state.products)


    useEffect(() => {
        if (pageNumber) {
            dispatch(fetchProducts({ pageNumber }));
        } else {
            dispatch(fetchProducts('1'))
        }
    }, [dispatch, pageNumber]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success('Product deleted successfully');
            } catch (err) {
                console.log(err);
                toast.error(err?.message || 'An error occurred');
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await dispatch(createProduct()).unwrap()
                toast.success('Product Created!')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <>
            <Row className="align-items-center">
                <h1 className="pt-4" >Products List</h1>

                {/* <Col>
                    <Row>
                        <Col className="py-2">
                            <h3 className="py-1">Total Products: {data?.products?.length}</h3>
                        </Col>
                    </Row>
                </Col> */}
                <Col className="text-end">
                    <Button className="btn-sm m-3" onClick={createProductHandler}>
                        <FaEdit /> Create Product
                    </Button>
                </Col>
            </Row>

            {data && data.pages > 1 && (
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            )}

            {productsStatus === 'loading' ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error?.message || error}</Message> : (
                <>



                    <Table striped hover bordered responsive className='table-sm py-3'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>SOURCE</th>
                                <th>IMAGE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsStatus === 'succeeded' && data?.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>AED {product.price}</td>
                                    <td>
                                        {product.source || '-'}
                                    </td>
                                    <td>
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0]} alt={product.name} style={{ width: '50px', height: '50px' }} /> // Image displayed here
                                        ) : (
                                            'No Image' // Display this text if there are no images
                                        )}
                                    </td>
                                    <td>
                                        <Button as={Link} to={`/admin/product/${product._id}/edit`} variant="light" className="btn-sm mx-2">
                                            <FaEdit />
                                        </Button>
                                        <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>



                </>
            )}


            {data && data.pages > 1 && (
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            )}
        </>
    )
}

export default ProductListScreen
