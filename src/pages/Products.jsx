import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { products } from '../data/products';
import './Products.css';

const Products = () => {
    return (
        <div className="products-page">
            <div className="page-header">
                <h1>Đàn Tranh & Guzheng</h1>
                <p>Tuyển tập những nhạc cụ chất lượng cao</p>
            </div>

            <div className="products-container">
                <div className="products-grid">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            image={product.image}
                            hoverImage={product.hoverImage}
                            title={product.name}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            onSale={product.onSale}
                            subtitle={product.description}
                        >
                            <Button 
                                variant="primary" 
                                style={{ width: '100%' }}
                                onClick={() => window.open('https://www.facebook.com/messages/t/494579524037541', '_blank', 'noopener,noreferrer')}
                            >
                                Liên Hệ Mua
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
