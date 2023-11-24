import { Image, Carousel } from "react-bootstrap"
import { Link } from "react-router-dom"
import Loader from './Loader'
import Message from './Message'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchTopRatedProducts } from "../slices/productsSlice";

const ProductCarousel = () => {
    const dispatch = useDispatch()
    const { topRatedProducts, topRatedProductsStatus, topRatedError } = useSelector((state) => state.products);

    useEffect(()=>{
        dispatch(fetchTopRatedProducts())
    },[dispatch ])


    return topRatedProductsStatus === 'loading' ? <Loader /> : topRatedError ? <Message variant='danger'>{topRatedError} </Message> : (
        <Carousel pause='hover' className="bg-dark mb-4 mt-0 pt-0" >
        
            {topRatedProducts.map(product => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image style={{ maxHeight: '500px' }} src={product.images[0]} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <h2>{product.name} (AED {product.price})</h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel