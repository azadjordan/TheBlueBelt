import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage, fetchImages } from '../../slices/imageSlice';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from 'react-toastify';
import '../../assets/styles/Gallery.css';


const ImageDisplay = () => {
    const dispatch = useDispatch();
    const [deletingImageId, setDeletingImageId] = useState(null); // New state for tracking deletion

    // Deconstructing the required states from the Redux store
    const { images, fetchImagesStatus, error } = useSelector(state => state.images);

    useEffect(() => {
        dispatch(fetchImages());
    }, [dispatch]);

    const handleDeleteImage = (id) => {
        setDeletingImageId(id); // Set the ID of the image being deleted
        dispatch(deleteImage(id))
            .then(() => {
                toast.success('Image deleted successfully');
                setDeletingImageId(null); // Reset the state after deletion
            })
            .catch((err) => {
                toast.error('Error deleting image');
                console.error('Error deleting image:', err);
                setDeletingImageId(null); // Reset the state in case of error
            });
    };

    // Handling loading and error states
    if (fetchImagesStatus === 'loading') return <Loader />;
    if (error) return <Message variant='danger'>{error}</Message>;

    return (
        <Container>
            <Row className='mb-5'>
            {images?.map((image, index) => (
    <Col xs={4} sm={4} md={3} lg={2} key={index} className="mb-3">
        <div className="image-card">
            <div className="image-card-inner">
                {deletingImageId === image._id ? (
                    <Loader />
                ) : (
                    <>
                        <div className="image-card-front">
                            <img src={image.imageUrl} alt={`Tags: ${image.tags.join(', ')}`} className="img-fluid" />
                        </div>
                        <div className="image-card-back">
                            <h5>{image.name}</h5> {/* Image name at the top */}
                            <p>{image.tags.join(', ')}</p> {/* Tags below the name */}
                        </div>
                    </>
                )}
            </div>
            {deletingImageId !== image._id && (
                <button
                    className="delete-icon"
                    onClick={() => handleDeleteImage(image._id)}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <FaTrash />
                </button>
            )}
        </div>
    </Col>
))}

            </Row>
        </Container>
    );
    
};

export default ImageDisplay;
