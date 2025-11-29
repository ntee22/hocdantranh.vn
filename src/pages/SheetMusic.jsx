import React, { useState } from 'react';
import { sheets } from '../data/sheets';
import { FileText, Eye, X } from 'lucide-react';
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
        // Try to get image from Wix site
        // If you have images stored locally, update this path
        // For now, using a placeholder that you can replace with actual image URLs
        // Option 1: Direct Wix URL (may need adjustment based on actual Wix structure)
        return `https://ntee22.wixsite.com/hocdantranh/${imageName}`;
        
        // Option 2: If images are in public folder, use:
        // return `/images/sheets/${imageName}`;
        
        // Option 3: If using external hosting, replace with your CDN URL:
        // return `https://your-cdn.com/sheets/${imageName}`;
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
                                    <Eye size={20} /> Xem
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSheet && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            <X size={24} />
                        </button>
                        <div className="modal-header">
                            <h2>{selectedSheet.title}</h2>
                            <p>Sáng tác: {selectedSheet.composer}</p>
                        </div>
                        <div className="modal-image-container">
                            <img 
                                src={getImageUrl(selectedSheet.image)} 
                                alt={selectedSheet.title}
                                className="modal-image"
                                onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    e.target.src = `https://via.placeholder.com/800x1000/ffffff/666666?text=${encodeURIComponent(selectedSheet.title)}`;
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SheetMusic;
