import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ image, hoverImage, title, subtitle, price, oldPrice, newPrice, originalPrice, onSale, children, className = '' }) => {
    // Determine if product is on sale based on oldPrice and newPrice
    const isOnSale = !!(oldPrice && newPrice);
    const displayPrice = newPrice || price;
    const displayOldPrice = oldPrice;

    return (
        <div className={`card ${className}`}>
            {image && (
                <div className="card-image-container">
                    {isOnSale && <span className="card-sale-badge">Sale off</span>}
                    <img src={image} alt={title} className="card-image card-image-main" />
                    {hoverImage && (
                        <img src={hoverImage} alt={title} className="card-image card-image-hover" />
                    )}
                </div>
            )}
            <div className="card-content">
                {title && <h3 className="card-title">{title}</h3>}
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
                {displayPrice && (
                    <div className="card-price-container">
                        {isOnSale && displayOldPrice && (
                            <p className="card-price-original">{displayOldPrice}</p>
                        )}
                        <p className={`card-price ${isOnSale ? 'card-price-sale' : ''}`}>{displayPrice}</p>
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
    oldPrice: PropTypes.string,
    newPrice: PropTypes.string,
    originalPrice: PropTypes.string,
    onSale: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
