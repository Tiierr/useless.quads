import React, {useCallback, useEffect, useRef, useState} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import '../style/crop.scss';
import submitIcon from "../assets/svg/done.svg";

interface uploadProps {
    uploadedImageFile: Blob,
    onClose: () => void,
    onSubmit: (blob: Blob) => void
}

export default function Crop({ uploadedImageFile, onClose, onSubmit }: uploadProps) {
    const [src, setSrc] = useState(null)
    const cropperRef = useRef(null)

    useEffect(() => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            // @ts-ignore
            const dataURL = e.target.result
            // @ts-ignore
            setSrc(dataURL)
        }

        fileReader.readAsDataURL(uploadedImageFile)
    }, [uploadedImageFile])

    const handleSubmit = useCallback(() => {
        // @ts-ignore
        cropperRef.current.getCroppedCanvas().toBlob(async blob => {
            onSubmit(blob)
            onClose()
        })
    }, [onClose, onSubmit])

    return (
        <>
            <div className="react-cropper-modal">
                <div className="modal-panel">
                    <div className="cropper-container-container">

                        <div className="cropper-container">
                            <Cropper
                                // @ts-ignore
                                src={src}
                                className="cropper"
                                ref={cropperRef}
                                viewMode={1}
                                zoomable={false}
                                aspectRatio={1} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
                                guides={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="button-row">
                    <img src={submitIcon} alt="Upload" height="50px" onClick={handleSubmit}/>
                </div>
            </div>

        </>
    )
}
