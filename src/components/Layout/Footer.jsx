import React from 'react';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
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
                    <p><MapPin size={16} /> 383/3/15A Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam</p>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>Cách mặt tiền 50m, xe hơi vào được</p>
                </div>

                <div className="footer-section">
                    <h3>Kết Nối</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com/hocdantranh" target="_blank" rel="noopener noreferrer">
                            <Facebook size={24} />
                        </a>
                        {/* Add other social links here */}
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
