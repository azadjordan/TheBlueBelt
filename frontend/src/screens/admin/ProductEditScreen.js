import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchProduct, updateProduct } from '../../slices/productsSlice.js'
import { useDispatch, useSelector } from "react-redux";
import FormContainer from '../../components/FormContainer'



const ProductEditScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: productId } = useParams()
    const { product, productStatus, updatedProductStatus, error, updateError } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchProduct(productId));
    }, [dispatch, productId])

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploadingImages, setUploadingImages] = useState([]);




    useEffect(() => {

        if (product) {
            setName(product.name);
            setPrice(product.price);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product, dispatch, productStatus, productId])

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('countInStock', countInStock);
        formData.append('description', description);

        uploadingImages.forEach(image => {
            formData.append('images', image);
        });

        try {
            // Dispatch the updateProduct action with formData
            await dispatch(updateProduct({ productId: productId, updatedFields: formData })).unwrap()
            toast.success('Product updated');
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.message || err);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        let newImages = [];
        let isAllFilesImages = true;

        // Checking if all files are images
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                e.target.value = ''
                isAllFilesImages = false;
                toast.error('All files must be images.');
            } else {
                newImages.push(file);
            }
        });

        if (isAllFilesImages) {
            setUploadingImages(prevState => [...prevState, ...newImages]);
        }
    };



    return (
        <>
            <Link to="/admin/productlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {updateError && <Message variant='danger'> {updateError} </Message>}
                {updatedProductStatus === 'loading' && <Loader />}
                {productStatus === 'loading' ? <Loader /> : error ? <Message variant='danger'>
                    {error.data.message || error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price' className='my-2'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='images' className='my-2'>
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type='file'
                                multiple
                                onChange={handleImageChange}
                            ></Form.Control>
                            {product?.images?.map((image, index) => (
                                <img key={index} src={image} alt="Product" width="100" className="m-2" />
                            ))}
                            {uploadingImages.map((image, index) => (
                                <img key={`new-${index}`} src={URL.createObjectURL(image)} alt="New Upload" width="100" className="m-2" />
                            ))}
                        </Form.Group>

                        <Form.Group controlId='brand' className='my-2'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter count in stock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>

                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen