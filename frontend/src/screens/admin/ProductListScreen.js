import { Button, Col, Row, Table } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { fetchLowStockProducts, createProduct, deleteProduct } from "../../slices/productsSlice"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import Paginate from "../../components/Paginate"



const ProductListScreen = () => {
    const dispatch = useDispatch()
    const { pageNumber = '1' } = useParams();


    const { data, productsStatus, error } = useSelector((state) => state.products)

    const [selectedFilters, setSelectedFilters] = useState([]);

    const filterOptions = [
        { label: '35-yd', keyword: '35-yd' },
        { label: '100-yd', keyword: '100-yd' },
        { label: '1-inch', keyword: '1-inch' },
        { label: '0.5-inch', keyword: '0.5-inch' },
        { label: 'Special', keyword: 'Special' },
        { label: 'Satin', keyword: 'Satin' },
    ];

    useEffect(() => {
        // Attempt to load saved filters from local storage
        const savedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || [];

        setSelectedFilters(savedFilters);

        if (savedFilters.length > 0) {
            dispatch(fetchLowStockProducts({ pageNumber, keywords: savedFilters.join(' ') }));
        } else if (pageNumber) {
            dispatch(fetchLowStockProducts({ pageNumber }));
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

    const filterProducts = (filterKeyword) => {
        const currentIndex = selectedFilters.indexOf(filterKeyword);
        const newFilters = [...selectedFilters];

        if (currentIndex === -1) {
            newFilters.push(filterKeyword);
        } else {
            newFilters.splice(currentIndex, 1);
        }

        // Save the updated filters array to local storage
        localStorage.setItem('selectedFilters', JSON.stringify(newFilters));

        setSelectedFilters(newFilters);
        dispatch(fetchLowStockProducts({ pageNumber, keywords: newFilters.join(' ') }));
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
                <h1 className="pt-2" >Products List</h1>

            </Row>

            <Row className="mb-3">

                <h5 className="mb-3"> Total Products: {data?.count}</h5>


                {filterOptions.map((option) => (
                    <Col xs="auto" key={option.keyword}>
                        <Button
                            onClick={() => filterProducts(option.keyword)}
                            variant={selectedFilters.includes(option.keyword) ? "primary" : "secondary"}
                            className="btn-sm mx-1"
                        >
                            {option.label}
                        </Button>
                    </Col>
                ))}


            </Row>





            {productsStatus === 'loading' ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error?.message || error}</Message> : (
                <>
                    <Row>
                        <Col>
                            {data && data.pages > 1 && (
                                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                            )}
                        </Col>
                        <Col className="text-end">
                        <Button className="btn-sm mb-3" onClick={createProductHandler}>
                            <FaEdit /> Create Product
                        </Button>
                    </Col>
                    </Row>






                    <Table striped hover bordered responsive className='table-sm py-3'>
                        <thead>
                            <tr>
                                <th className="id-column">ID</th>
                                <th className="tight-column">IMAGE</th>
                                <th className="name-column">NAME</th>
                                <th className="tight-column">PRICE</th>
                                <th className="tight-column">SOURCE</th>
                                <th className="tight-column">STOCK</th>
                                <th className="tight-column"></th> {/* If you have action buttons here */}
                            </tr>
                        </thead>
                        <tbody>
                            {productsStatus === 'succeeded' && data?.products.map((product) => (
                                <tr key={product._id}>
                                    <td className="id-column">{product._id}</td>
                                    <td className="tight-column">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0]} alt={product.name} style={{ width: '50px', height: '50px' }} /> // Image displayed here
                                        ) : (
                                            'No Image' // Display this text if there are no images
                                        )}
                                    </td>
                                    <td className="name-column">{product.name}</td>
                                    <td className="tight-column">AED {product.price}</td>
                                    <td className="tight-column">
                                        {product.source || '-'}
                                    </td>

                                    <td className="tight-column">{product.countInStock}</td> {/* Add this line to display the stock count */}

                                    <td className="tight-column">
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
