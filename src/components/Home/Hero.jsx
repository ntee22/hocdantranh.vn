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
                    HỌC ĐÀN TRANH - <br />
                    <span className="highlight">CỔ TRANH ĐAN THANH</span>
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
            <div className="hero-image">
                <motion.img
                    src="https://images.unsplash.com/photo-1680792563719-288027b2a090?q=80&w=2787&auto=format&fit=crop"
                    alt="Đàn Tranh"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                />
            </div>
        </section>
    );
};

export default Hero;
