import React from 'react';
import '../style/error.scss';

interface errorProps {
    title: string;
    detail: string;
    onClose: () => void
}

export default function Error({title, detail, onClose}: errorProps) {
    return (
        <div className="error-container">
            <div className="error-box">
                <div className="dot" onClick={() => onClose()}/>
                <div className="face">
                    <div className="eye"/>
                    <div className="eye right"/>
                    <div className="mouth sad"/>
                </div>
                <div className="shadow move"/>
                <div className="message">
                    <h1 className="alert">{title}</h1>
                    <p>{detail}</p>
                </div>
            </div>
        </div>
    )
}
