import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ image, hoverImage, title, subtitle, price, originalPrice, onSale, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {image && (
                <div className="card-image-container">
                    {onSale && <span className="card-sale-badge">SALE</span>}
                    <img src={image} alt={title} className="card-image card-image-main" />
                    {hoverImage && (
                        <img src={hoverImage} alt={title} className="card-image card-image-hover" />
                    )}
                </div>
            )}
            <div className="card-content">
                {title && <h3 className="card-title">{title}</h3>}
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
                {price && (
                    <div className="card-price-container">
                        <p className={`card-price ${onSale ? 'card-price-sale' : ''}`}>{price}</p>
                        {onSale && originalPrice && (
                            <p className="card-price-original">{originalPrice}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

Card.propTypes = {
    image: PropTypes.string,
    hoverImage: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    price: PropTypes.string,
    originalPrice: PropTypes.string,
    onSale: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
