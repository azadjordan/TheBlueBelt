import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchProduct, updateProduct } from '../../slices/productsSlice.js'
import { useDispatch, useSelector } from "react-redux";
import FormContainer from '../../components/FormContainer'
import { deleteProductImages } from '../../slices/productsSlice.js';


const ProductEditScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: productId } = useParams()
    const { product, productStatus, updatedProductStatus, error, updateError } = useSelector((state) => state.products)
    const { deleteImagesStatus, deleteImagesError } = useSelector((state) => state.products);


    useEffect(() => {
        dispatch(fetchProduct(productId));
    }, [dispatch, productId])

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [manuCost, setManuCost] = useState(0);
    const [dimensions, setDimensions] = useState('');
    const [source, setSource] = useState('');
    const [uploadingImages, setUploadingImages] = useState([]);




    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
            setManuCost(product.manuCost);
            setDimensions(product.dimensions);
            setSource(product.source);
        }
    }, [product]);


    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('countInStock', countInStock);
        formData.append('description', description);
        formData.append('manuCost', manuCost);
        formData.append('dimensions', dimensions);
        formData.append('source', source);

        uploadingImages.forEach(image => {
            formData.append('images', image.file, image.file.name); // Specify the filename too.
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
        const acceptedMimetypes = ['image/jpeg', 'image/png', 'image/webp'];

        // Checking if all files are images
        files.forEach(file => {
            if (!acceptedMimetypes.includes(file.type)) {
                isAllFilesImages = false;
            } else {
                newImages.push({
                    id: Date.now() + Math.random(),
                    file: file
                });
            }
        });

        if (isAllFilesImages) {
            setUploadingImages(prevState => [...prevState, ...newImages]);
        } else {
            e.target.value = '';  // Clear the file input if any of the files are not accepted images.
            toast.error('Only JPEG, PNG, and WEBP images are allowed.');
        }
    };



    const removeImageHandler = (id) => {
        setUploadingImages(prevImages => prevImages.filter(img => img.id !== id));
    };

    const deleteImagesHandler = async () => {
        // Display a confirmation message to the user
        const confirmDelete = window.confirm('Are you sure you want to delete all the images of this product from the database?');

        // If the user confirms the deletion, proceed
        if (confirmDelete) {
            try {
                await dispatch(deleteProductImages(productId)).unwrap();
                toast.success('Images deleted successfully');
            } catch (err) {
                toast.error(err?.message || err);
            }
        }
    };


    return (
        <>
            <Link to="/admin/productlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
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
                            <div className="images-container">
                                <Row>
                                    {product?.images?.map((image, index) => (
                                        <Col md={3} key={index} className="mb-2">
                                            <div className="image-wrapper">
                                                <img src={image} alt="Product" width="100%" className="m-2" />
                                                {/* Add a remove button if you want to enable removal of previously saved images */}
                                            </div>
                                        </Col>
                                    ))}
                                    {uploadingImages.map((imageObj, index) => (
                                        <Col md={3} key={imageObj.id} className="mb-2">
                                            <div className="image-wrapper">
                                                <img src={URL.createObjectURL(imageObj.file)} alt="New Upload" width="100%" className="m-2" />
                                                <button onClick={() => removeImageHandler(imageObj.id)}>Remove</button>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            {deleteImagesError && <Message variant='danger'>{deleteImagesError}</Message>}
                            {deleteImagesStatus === 'loading' && <Loader />}
                            <Button variant='danger' className='my-2' onClick={deleteImagesHandler}>
                                Delete Images
                            </Button>
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

                        <Form.Group controlId='manuCost' className='my-2'>
                            <Form.Label>Manufacturing Cost</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter manufacturing cost'
                                value={manuCost}
                                onChange={(e) => setManuCost(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='dimensions' className='my-2'>
                            <Form.Label>Dimensions</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter dimensions'
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='source' className='my-2'>
                            <Form.Label>Source</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter source'
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
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
                        {updateError && <Message variant='danger'> {updateError} </Message>}
                        {updatedProductStatus === 'loading' && <Loader />}

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