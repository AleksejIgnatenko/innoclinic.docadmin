import React, { useEffect } from 'react';
import './../styles/ImageUploader.css';
import imageTypes from '../constants/ImageTypes';

const ImageUploader = ({ 
    imgPreview,
    imgLoading,
    uploadProgressPercent,
    imgFileName,
    imgFileType,

    fileInputRef,

    imgDropZoonRef, 
    handleDragOverImg = () => {}, 
    handleDragLeaveImgImg = () => {}, 
    handleDropImg = () => {}, 
    handleButtonClickImg = () => {}, 
    handleChangeImg = () => {} 
    }) => {

    return (
        <>
            <div className="upload-area__header">
                <h1 className="upload-area__title">Upload your image</h1>
                <div className="upload-area__paragraph">
                    File should be an image
                    <strong className="upload-area__tooltip">
                        Like
                        <span className="upload-area__tooltip-data">{imageTypes.join(', .')}</span>
                    </strong>
                    <div className="drop-zoon__paragraph">or drop your file here or Click to browse</div>
                </div>
            </div>
            <div
                id="uploadArea"
                className="upload-area"
                style={{ backgroundImage: imgPreview ? `url(${imgPreview})` : 'none' }}
                ref={imgDropZoonRef}
                onDragOver={handleDragOverImg}
                onDragLeave={handleDragLeaveImgImg}
                onDrop={handleDropImg}
                onClick={handleButtonClickImg}>
                <span className="drop-zoon__icon">
                    <i className="bx bxs-file-image"></i>
                </span>
                <span id="loadingText" className={`drop-zoon__loading-text ${imgLoading ? 'show' : ''}`}>Please Wait</span>
                <input
                    ref={fileInputRef}
                    type="file"
                    id="fileInput"
                    className="drop-zoon__file-input"
                    accept="image/*"
                    onChange={handleChangeImg}
                />
                <div id="fileDetails" className="upload-area__file-details file-details">
                    <h3 className="file-details__title">Uploaded File</h3>
                    <div id="uploadedFile" className="uploaded-file">
                        <div className="uploaded-file__icon-container">
                            <i className="bx bxs-file-blank uploaded-file__icon"></i>
                            <span className="uploaded-file__icon-text">{imgFileType}</span>
                        </div>
                        <div id="uploadedFileInfo" className="uploaded-file__info">
                            <span className="uploaded-file__name">{imgFileName}</span>
                            <span className="uploaded-file__counter">{uploadProgressPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageUploader;