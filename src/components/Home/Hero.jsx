import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Học Đàn Tranh - <br />
                    <span className="highlight">Guzheng Đan Thanh</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    🎶 Âm nhạc giúp cuộc sống nhẹ nhàng hơn 🎶
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ marginTop: '1rem' }}
                >
                    😘 HọcĐànTranh.vn là nơi để các bạn có thể học được kiến thức nhạc lý để có thể tự mình đánh được những bài hát yêu thích bằng sheet nhạc Quốc tế chỉ sau 3 tháng.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ marginTop: '1rem' }}
                >
                    😘 Ngoài ra HọcĐànTranh.vn còn hỗ trợ đặt Đàn Tranh Việt và Cổ Tranh trực tiếp không qua trung gian với giá cả hấp dẫn và chất lượng tuyệt vời.
                </motion.p>
                
                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <Link to="/products">
                        <Button variant="primary">Xem Sản Phẩm</Button>
                    </Link>
                    <Link to="/sheet-music">
                        <Button variant="outline">Thư Viện Nhạc</Button>
                    </Link>
                </motion.div>
            </div>
            <div className="hero-video">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <iframe
                        src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fdantranhhcm%2Fvideos%2F398278379115269%2F&autoplay=true&mute=true&width=400&show_text=false&height=700"
                        width="400"
                        height="700"
                        style={{ border: 'none', overflow: 'hidden', borderRadius: '20px' }}
                        scrolling="no"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen={true}
                        title="Đàn Tranh Video"
                    ></iframe>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
