import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify'


const ImageUpload = () => {
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState('');


    const handleImageChange = (e) => {
        // Create an array of image objects
        const selectedImages = Array.from(e.target.files).map(file => ({
            id: Date.now() + Math.random(),
            file: file
        }));
        setImages([...images, ...selectedImages]);
    };

    const handleTagsChange = (e) => {
        setTags(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if there are no images selected
        if (images.length === 0) {
            toast.error('Please select images to upload');
            return; // Prevent further execution of the function
        }
    
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image.file);
        });
        formData.append('tags', tags);
    
        try {
            const response = await axios.post('/api/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            toast.success('Uploaded To Cloud');
    
            // Clear the images state and reset the file input
            setImages([]);
            e.target.fileUpload.value = ''; // Reset the file input by targeting its controlId
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Error uploading images');
        }
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
                {images.map((imageObj, index) => (
                    <Col xs={2} sm={2} md={2} lg={1} key={imageObj.id} className="mb-2">
                        <div className="image-preview">
                            <img src={URL.createObjectURL(imageObj.file)} alt="Upload Preview" className="img-fluid" />
                            <Button variant="secondary" size="sm" onClick={() => removeImageHandler(imageObj.id)}>X</Button>
                        </div>
                    </Col>
                ))}
            </Row>

            <Button type="submit" variant="primary" >Upload To Cloud</Button>
        </Form>
    );
};

export default ImageUpload;
