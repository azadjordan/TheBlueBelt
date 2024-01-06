import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchProduct, removeProductImages, updateProduct } from '../../slices/productsSlice.js'
import { useDispatch, useSelector } from "react-redux";
import FormContainer from '../../components/FormContainer'
import { clearSelectedImages, fetchImages } from '../../slices/imageSlice.js'
import { selectImage, deselectImage } from '../../slices/imageSlice.js';

const ProductEditScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: productId } = useParams()
    const { product, productStatus, updatedProductStatus, error, updateError, removeImagesStatus, removeImagesError } = useSelector((state) => state.products)
    const { urls, selectedImages } = useSelector(state => state.images);

    console.log(selectedImages);

    useEffect(() => {
        // Fetch product and images on mount
        dispatch(fetchProduct(productId));
        dispatch(fetchImages());

        // Clear selected images on unmount
        return () => {
            dispatch(clearSelectedImages()); // Action to clear selected images
        };
    }, [dispatch, productId]);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [manuCost, setManuCost] = useState(0);
    const [dimensions, setDimensions] = useState('');
    const [source, setSource] = useState('');

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
        const updatedProduct = {
            name,
            price,
            brand,
            category,
            countInStock,
            description,
            manuCost,
            dimensions,
            source,
            images: selectedImages // Assuming this is how you handle image selection
        };

        // Dispatch the update product action
        dispatch(updateProduct({ id: productId, updatedProduct }))
            .unwrap()
            .then(() => {
                toast.success('Product updated successfully');
                navigate('/admin/productlist');
            })
            .catch(error => {
                toast.error(error.message || 'Error updating product');
            });
    };


    const handleImageClick = (imageUrl) => {
        if (selectedImages.includes(imageUrl)) {
            dispatch(deselectImage(imageUrl));
        } else {
            dispatch(selectImage(imageUrl));
        }
    };

    const handleRemoveImages = async () => {
        if (window.confirm('Are you sure?')) {
            try {
                await dispatch(removeProductImages(productId)).unwrap();
                toast.success('Images removed successfully');
            } catch (err) {
                toast.error(err.message || 'An error occurred');
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
                    <Form onSubmit={submitHandler} className='mb-4'>
                        <Form.Group controlId='name' className='my-4'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='imageSelection' className='my-4'>
                            <Form.Label> <strong>Select/Add Images To Product</strong> </Form.Label>
                            <div className="images-gallery">
                                {urls.length > 0 ? (
                                    <Row className="g-0"> {/* Render images if they exist */}
                                        {urls.map((imageUrl, index) => (
                                            <Col xs={3} sm={3} md={3} lg={3} key={index} className="p-0">
                                                <div
                                                    className={`image-thumbnail ${selectedImages.includes(imageUrl) ? 'selected' : ''}`}
                                                    onClick={() => handleImageClick(imageUrl)}
                                                >
                                                    <img src={imageUrl} alt={`Thumbnail ${index + 1}`} className="m-0" />
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <p className='text-muted'>No images available</p>
                                )}
                            </div>
                        </Form.Group>


                        <Form.Group controlId='currentImages' className='my-4'>
                            <Form.Label> <strong>Remove Images From Product</strong> </Form.Label>
                            <div className="images-gallery">
                                <Row className="g-0">
                                    {product?.images && product.images.length > 0 ? (
                                        product.images.map((imageUrl, index) => (
                                            <Col xs={3} sm={3} md={3} lg={3} key={index} className="p-0">
                                                <div className="image-thumbnail">
                                                    <img src={imageUrl} alt={`Thumbnail ${index + 1}`} className="m-0" />
                                                </div>
                                            </Col>
                                        ))
                                    ) : (
                                        <p className='text-muted'>This product has no images to be removed.</p>
                                    )}
                                </Row>
                            </div>
                            {removeImagesError && <Message variant='danger'>{error.data.message || error}</Message>}
                            {removeImagesStatus === 'loading' ? (
                                <div className="mt-2 w-100 d-flex justify-content-center">
                                    <h4 className='text-danger'>Removing...</h4>
                                </div>
                            ) : (
                                <Button
                                    className='w-100 mt-3'
                                    variant='danger'
                                    onClick={handleRemoveImages}
                                    disabled={!product?.images || product.images.length === 0}
                                >
                                    Remove All Images
                                </Button>
                            )}
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

                        <Button type='submit' variant='primary' className='w-100 my-2'>
                            Update Product
                        </Button>

                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen