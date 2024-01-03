import React from 'react'
import ImageDisplay from '../../components/ImageDisplay'
import ImageUpload from '../../components/ImageUpload'


const GalleryScreen = () => {
  return (
    <>
    <h1 className='px-4 py-5'>Gallery</h1>
    <ImageUpload/>
    <div className='py-4'></div>

      <ImageDisplay/>
    </>
  )
}

export default GalleryScreen
