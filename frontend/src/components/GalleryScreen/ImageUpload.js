import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Message from "../Message";
import { toast } from 'react-toastify';
import { uploadImages } from '../../slices/imageSlice';
import { useDispatch, useSelector } from 'react-redux';

const ImageUpload = () => {
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState('');

    const dispatch = useDispatch();
    const { uploadImagesStatus, error } = useSelector(state => state.images);

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
            setImages(prevState => [...prevState, ...newImages]);
        } else {
            e.target.value = '';  // Clear the file input if any of the files are not accepted images.
            toast.error('Only images allowed.');
        }
    };


    const handleTagsChange = (e) => {
        setTags(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please select images to upload');
            return;
        }

        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image.file);
        });
        formData.append('tags', tags);

        dispatch(uploadImages({ formData }))
            .then(() => {
                toast.success('Uploaded To Cloud');
                setImages([]); // Clear the local state
            })
            .catch((error) => {
                console.error('Error uploading images:', error);
                toast.error('Error uploading images');
            });
    };




    const removeImageHandler = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    return (
        <Form className='px-4' onSubmit={handleSubmit} encType="multipart/form-data">
            <Row className='pb-2'>
                <Col md={8} lg={6}> {/* Adjust md={6} as needed for desired width */}
                    <Form.Group controlId='fileUpload'>
                        <Form.Label>Upload Images</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={8} lg={6}> {/* Adjust md={6} as needed for desired width */}
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags (optional)</Form.Label>
                        <Form.Control
                            type='text'
                            value={tags}
                            onChange={handleTagsChange}
                            placeholder="Enter tags (comma-separated)"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className='p-3'>
                {images?.map((imageObj, index) => (
                    <Col xs={2} sm={2} md={2} lg={1} key={imageObj.id} className="mb-2">
                        <div className="image-preview">
                            <img src={URL.createObjectURL(imageObj.file)} alt="Upload Preview" className="img-fluid" />
                            <Button variant="secondary" size="sm" onClick={() => removeImageHandler(imageObj.id)}>X</Button>
                        </div>
                    </Col>
                ))}
            </Row>

            {error && <Message variant='danger'>{error}</Message>}
            {uploadImagesStatus === 'loading' ? (
                <h6 style={{ color: 'orange' }}>Uploading...</h6>
            ) : (
                <Button type="submit" variant="primary" disabled={images.length === 0}>Upload To Cloud</Button>
            )}

        </Form>
    );
};

export default ImageUpload;
