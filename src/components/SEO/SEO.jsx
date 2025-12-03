import { useEffect } from 'react';

const SEO = ({ 
    title, 
    description, 
    keywords, 
    image = '/favicon.png',
    url = 'https://hocdantranh.vn',
    type = 'website',
    structuredData
}) => {
    useEffect(() => {
        // Add structured data if provided
        if (structuredData) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(structuredData);
        }
        // Update title
        document.title = title || 'Học Đàn Tranh - Guzheng - Đan Thanh | HCM';
        
        // Update or create meta tags
        const updateMetaTag = (name, content, attribute = 'name') => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Primary meta tags
        if (title) {
            updateMetaTag('title', title);
        }
        if (description) {
            updateMetaTag('description', description);
        }
        if (keywords) {
            updateMetaTag('keywords', keywords);
        }

        // Open Graph tags
        updateMetaTag('og:type', type, 'property');
        updateMetaTag('og:url', url, 'property');
        if (title) {
            updateMetaTag('og:title', title, 'property');
        }
        if (description) {
            updateMetaTag('og:description', description, 'property');
        }
        updateMetaTag('og:image', image, 'property');

        // Twitter tags
        updateMetaTag('twitter:card', 'summary_large_image', 'property');
        updateMetaTag('twitter:url', url, 'property');
        if (title) {
            updateMetaTag('twitter:title', title, 'property');
        }
        if (description) {
            updateMetaTag('twitter:description', description, 'property');
        }
        updateMetaTag('twitter:image', image, 'property');

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);
    }, [title, description, keywords, image, url, type, structuredData]);

    return null;
};

export default SEO;

