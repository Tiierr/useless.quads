import React, {useEffect, useState} from 'react';
import Crop from "./crop";
import './upload.scss';
import uploadIcon from '../static/svg/upload.svg';

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 文件最大限制为10M

interface uploadProps {
    setImage: (src: string) => void,
    setError: (value: boolean) => void
}

export default function Upload({setImage, setError}: uploadProps) {
    const [modalVisible, setVisible] = useState(false);
    const [uploadImage, setUploadImage] = useState<File | null>(null);

    useEffect(() => {
        if (uploadImage) {
            setVisible(true)
        }
    }, [uploadImage])


    useEffect(() => {
        if (modalVisible) {
            setImage('')
        }
    }, [modalVisible, setImage])

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files) {
            const image = files[0]
            if (image.size <= MAX_FILE_SIZE) {
                setUploadImage(files[0])
            } else {
                setError(true);
            }
        }
    }

    const printBlob = (blob: Blob) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            // @ts-ignore
            const dataURL = e.target.result;
            // @ts-ignore
            setImage(dataURL);
        }
        fileReader.readAsDataURL(blob)
    }

    return (
        <div className="upload">
            <label className="upload-input-label">
                <img src={uploadIcon} alt="Upload" height="50px"/>
                <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="base-upload-input"
                    onChange={handleFileChange}
                />
            </label>
            {modalVisible && (
                <Crop
                    // @ts-ignore
                    uploadedImageFile={uploadImage}
                    onClose={() => {
                        setVisible(false)
                    }}
                    onSubmit={printBlob}
                />
            )}
        </div>
    )
}
