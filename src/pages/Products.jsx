import React from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { products } from '../data/products';
import SEO from '../components/SEO/SEO';
import { Facebook } from 'lucide-react';
import backgroundProduct from '../image/backgroundProduct.png';
import './Products.css';

const Products = () => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Đàn Tranh & Guzheng - Sản Phẩm",
        "description": "Danh sách đàn tranh Việt Nam, guzheng, cổ tranh chất lượng cao tại HCM",
        "itemListElement": products.map((product, index) => ({
            "@type": "Product",
            "position": index + 1,
            "name": product.name,
            "description": product.description,
            "offers": {
                "@type": "Offer",
                "price": (product.newPrice || product.price).replace(/[^\d]/g, ''),
                "priceCurrency": "VND",
                ...(product.oldPrice && product.newPrice && {
                    "priceSpecification": {
                        "@type": "UnitPriceSpecification",
                        "price": product.newPrice.replace(/[^\d]/g, ''),
                        "priceCurrency": "VND"
                    }
                })
            }
        }))
    };

    return (
        <>
            <SEO
                title="Đàn Tranh & Guzheng - Sản Phẩm | Học Đàn Tranh HCM"
                description="Mua đàn tranh Việt Nam, guzheng, cổ tranh chất lượng cao tại HCM. Đan Thanh Đàn Tranh cung cấp đàn tranh gỗ đỏ, cẩm lai, guzheng fullsize và mini với giá tốt nhất."
                keywords="dan tranh, guzheng, co tranh, mua dan tranh hcm, guzheng hcm, dan tranh viet nam, dan tranh go do, dan tranh cam lai"
                url="https://hocdantranh.vn/products"
                structuredData={structuredData}
            />
            <div className="products-page">
            <div className="page-header" style={{ backgroundImage: `url(${backgroundProduct})` }}>
            <p className="notice-text">
                    Sản phẩm cập nhật liên tục mẫu mã mới, để xem sản phẩm mới nhất, <br />
                    bạn hãy vào Shopee hoặc Fanpage nhé
                </p>
                <div className="header-social-links">
                    <a 
                        href="https://shopee.vn/danthanhdantranh" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="header-social-link"
                        aria-label="Shopee"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        <span>Shopee</span>
                    </a>
                    <a 
                        href="https://www.facebook.com/dantranhhcm" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="header-social-link"
                        aria-label="Facebook"
                    >
                        <Facebook size={32} />
                        <span>Fanpage</span>
                    </a>
                </div>
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
                            oldPrice={product.oldPrice}
                            newPrice={product.newPrice}
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
        </>
    );
};

export default Products;
