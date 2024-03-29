import { Image, Carousel } from "react-bootstrap"
import { Link } from "react-router-dom"
import Message from './Message'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchTopRatedProducts } from "../slices/productsSlice";

const ProductCarousel = () => {
    const dispatch = useDispatch()
    const { topRatedProducts, topRatedError } = useSelector((state) => state.products);

    const carouselInterval = 2500;

    useEffect(() => {
        dispatch(fetchTopRatedProducts())
    }, [dispatch])


    return topRatedError ? <Message variant='danger'>{topRatedError} </Message> : (
        <Carousel pause='hover' className="bg-white mb-4 no-transition " >

            {topRatedProducts.map(product => (
                <Carousel.Item className="carousel-item" key={product._id} interval={carouselInterval}>
                    <Link to={`/product/${product._id}`}>
                        <Image className="carousel-image" src={product.images[0]} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                            <div className="caption-text">{product.name}</div>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel