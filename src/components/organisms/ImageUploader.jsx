import React, { useRef, useState } from 'react';
import '../../styles/organisms/ImageUploader.css';
import { IconBase } from '../atoms/IconBase';

const ImageUploader = ({ photo, setPhoto }) => {
    const [imgPreview, setImgPreview] = useState(photo ? photo : null);
    const imageInputRef = useRef(null);

    const openFileExplorer = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const uploadFile = (image) => {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
            setImgPreview(fileReader.result);
        };
    
        fileReader.readAsDataURL(image);
    };

    const handleChangeImg = (e) => {
        const selectedFile = e.target.files[0];
        setPhoto(selectedFile);
        uploadFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setPhoto(file);
        uploadFile(file);
    };

    return (
        <div
            id="uploadArea"
            className="upload-area"
            style={{ backgroundImage: imgPreview ? `url(${imgPreview})` : 'none' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileExplorer}
        >
            {imgPreview && <img src={imgPreview} alt="" />}
            <IconBase className='bx-file' />
            <input
                ref={imageInputRef}
                type="file"
                id="fileInput"
                className="img-area"
                accept="image/*"
                onChange={handleChangeImg}
            />
        </div>
    );
};

export default ImageUploader;