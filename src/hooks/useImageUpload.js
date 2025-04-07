import { useState, useRef } from 'react';
import imageTypes from '../constants/ImageTypes';

export const useImageUpload = () => {
    const [file, setFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
    const [imgFileName, setImgFileName] = useState('Project 1');
    const [imgFileType, setImgFileType] = useState('');

    const imgDropZoonRef = useRef(null);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const fileType = file.type;
        const fileSize = file.size;
        const isImage = imageTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

        if (isImage.length === 0) {
            alert('Please make sure to upload an image file type');
            return false;
        }

        if (fileSize > 2000000) {
            alert('Please your file should be 2 Megabytes or less');
            return false;
        }

        setImgFileType(isImage[0] === 'jpeg' ? 'jpg' : isImage[0]);
        return true;
    };

    const uploadFile = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        setImgLoading(true);
        setImgPreview(null);
        setUploadProgressPercent(0);

        fileReader.onload = () => {
            setTimeout(() => {
                setImgLoading(false);
                setImgPreview(fileReader.result);
                progressMove();
            }, 600);
        };

        setImgFileName(file.name);
    };

    const progressMove = () => {
        let counter = 0;
        const intervalId = setInterval(() => {
            if (counter === 100) {
                clearInterval(intervalId);
            } else {
                counter += 10;
                setUploadProgressPercent(counter);
            }
        }, 100);
    };

    const handleDragOverImg = (e) => {
        e.preventDefault();
        imgDropZoonRef.current?.classList.add('drop-zoon--over');
    };

    const handleDragLeaveImg = () => {
        imgDropZoonRef.current?.classList.remove('drop-zoon--over');
    };

    const handleDropImg = (e) => {
        e.preventDefault();
        imgDropZoonRef.current?.classList.remove('drop-zoon--over');
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            uploadFile(droppedFile);
        }
    };

    const handleChangeImg = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    return {
        file,
        imgPreview,
        imgLoading,
        uploadProgressPercent,
        imgFileName,
        imgFileType,
        imgDropZoonRef,
        fileInputRef,
        handleDragOverImg,
        handleDragLeaveImg,
        handleDropImg,
        handleChangeImg
    };
}; 