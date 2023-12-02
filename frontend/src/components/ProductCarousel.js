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

    useEffect(()=>{
        dispatch(fetchTopRatedProducts())
    },[dispatch ])


    return topRatedError ? <Message variant='danger'>{topRatedError} </Message> : (
        <Carousel pause='hover' className="bg-white mb-5" >
        
            {topRatedProducts.map(product => (
                <Carousel.Item key={product._id} interval={carouselInterval}>
                    <Link to={`/product/${product._id}`}>
                        <Image style={{ maxHeight: '400px', minHeight: "400px", maxWidth: "400px", minWidth: "400px" }} src={product.images[0]} alt={product.name} fluid />
                        <Carousel.Caption className='carousel-caption'>
                          <h2><span>{product.name}</span></h2>  
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default ProductCarousel