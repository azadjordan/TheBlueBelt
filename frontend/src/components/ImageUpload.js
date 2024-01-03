import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState('');

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    formData.append('tags', tags);

    try {
      const response = await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      // Handle the response, e.g., show a success message, clear the form, etc.
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle the error, e.g., show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" multiple onChange={handleImageChange} />
      <input type="text" value={tags} onChange={handleTagsChange} placeholder="Enter tags (comma-separated)" />
      <button type="submit">Upload Images</button>
    </form>
  );
};

export default ImageUpload;
