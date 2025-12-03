import React from 'react';
import { Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Học Đàn Tranh</h3>
                    <p>Nơi lưu giữ và phát triển âm nhạc truyền thống.</p>
                </div>

                <div className="footer-section">
                    <h3>Liên Hệ</h3>
                    <p><Phone size={16} /> 094 436 40 16 (Đan Thanh)</p>
                    <p><MapPin size={16} /> <strong>383/3/15A Quang Trung, phường 10, quận Gò Vấp</strong></p>
                    <p style={{ marginTop: '0.5rem' }}><MapPin size={16} /> <strong>254/21/1 Âu Cơ, phường 9, quận Tân Bình</strong></p>
                </div>

                <div className="footer-section">
                    <h3>Kết Nối</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com/hocdantranh" target="_blank" rel="noopener noreferrer">
                            <Facebook size={24} />
                        </a>
                        <a href="https://www.tiktok.com/@danthanhdantranh" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@danthanhdantranh" target="_blank" rel="noopener noreferrer">
                            <Youtube size={24} />
                        </a>
                    </div>
                </div>

                <div className="footer-section footer-map">
                    <h3>Bản Đồ</h3>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5!2d106.6697262!3d10.829317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529e471450347%3A0x11b363b6f87e8420!2zSMO5YyDEkOG7mW4gdHJhbmggLSBHdXpoZW5nIC0gxJDhuqEgVGhhbmg!5e0!3m2!1svi!2s!4v1705123456789!5m2!1svi!2s"
                            width="100%"
                            height="250"
                            style={{ border: 0, borderRadius: '10px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Học đàn tranh - Guzheng - Đan Thanh Location"
                        ></iframe>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} by Học Đàn Tranh - Cổ Tranh - Guzheng - Đan Thanh</p>
            </div>
        </footer>
    );
};

export default Footer;
