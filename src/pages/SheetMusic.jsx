import React, { useState } from 'react';
import { sheets } from '../data/sheets';
import { FileText, Eye, ArrowLeft } from 'lucide-react';
import './SheetMusic.css';

const SheetMusic = () => {
    const [selectedSheet, setSelectedSheet] = useState(null);

    const openModal = (sheet) => {
        setSelectedSheet(sheet);
    };

    const closeModal = () => {
        setSelectedSheet(null);
    };

    const getImageUrl = (imageName) => {
        // If imageName is already a full URL, return it directly
        if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
            return imageName;
        }
        // Otherwise, construct the URL (for local images or relative paths)
        return `https://ntee22.wixsite.com/hocdantranh/${imageName}`;
    };

    return (
        <div className="sheet-music-page">
            <div className="page-header">
                <h1>Sheet nhạc Guzheng</h1>
                <p>Sheet nhạc Guzheng được Đan Thanh Đàn Tranh biên soạn và chia sẽ miễn phí cho mọi người</p>
            </div>

            <div className="sheets-container">
                <div className="sheets-list">
                    {sheets.map((sheet) => (
                        <div key={sheet.id} className="sheet-item">
                            <div className="sheet-icon">
                                <FileText size={32} />
                            </div>
                            <div className="sheet-info">
                                <h3>{sheet.title}</h3>
                                <p>Sáng tác: {sheet.composer} • Trình độ: {sheet.level}</p>
                                {sheet.description && (
                                    <p className="sheet-description">{sheet.description}</p>
                                )}
                            </div>
                            <div className="sheet-action">
                                <button 
                                    onClick={() => openModal(sheet)} 
                                    className="view-btn"
                                >
                                    <Eye size={20} /> Xem sheet nhạc
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSheet && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-back" onClick={closeModal}>
                            <ArrowLeft size={20} />
                            <span>Back</span>
                        </button>
                        <div className="modal-header">
                            <h2>{selectedSheet.title}</h2>
                            <p>Sáng tác: {selectedSheet.composer}</p>
                        </div>
                        <div className="modal-image-container">
                            {(() => {
                                // Collect all images (image, image2, image3, etc.)
                                const images = [];
                                if (selectedSheet.image) images.push(selectedSheet.image);
                                if (selectedSheet.image2) images.push(selectedSheet.image2);
                                if (selectedSheet.image3) images.push(selectedSheet.image3);
                                if (selectedSheet.image4) images.push(selectedSheet.image4);
                                
                                return (
                                    <div className="modal-images-scroll">
                                        {images.map((img, index) => (
                                            <img 
                                                key={index}
                                                src={getImageUrl(img)} 
                                                alt={`${selectedSheet.title} - Page ${index + 1}`}
                                                className="modal-image"
                                                onError={(e) => {
                                                    // Fallback to placeholder if image fails to load
                                                    e.target.src = `https://via.placeholder.com/800x1000/ffffff/666666?text=${encodeURIComponent(selectedSheet.title + ' - Page ' + (index + 1))}`;
                                                }}
                                            />
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SheetMusic;
