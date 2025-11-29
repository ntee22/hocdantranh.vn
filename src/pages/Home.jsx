import React from 'react';
import Hero from '../components/Home/Hero';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="home-page">
      <Hero />

      <section className="featured-section">
        <div className="section-header">
          <h2>Sản Phẩm Nổi Bật</h2>
          <p>Những nhạc cụ được yêu thích nhất</p>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              image={product.image}
              title={product.name}
              price={product.price}
            >
              <Link to="/products" style={{ width: '100%' }}>
                <Button variant="outline" style={{ width: '100%' }}>
                  Chi Tiết
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="section-footer">
          <Link to="/products">
            <Button variant="secondary">Xem Tất Cả Sản Phẩm</Button>
          </Link>
        </div>
      </section>

      <section className="services-section">
        <div className="services-container">
          <div className="service-card">
            <h2>CHẤT LƯỢNG GIẢNG DẠY</h2>
            <h3>Đánh được bài cơ bản chỉ sau 3 tháng (1 tuần/buổi)</h3>
            <p>😘 Lớp do Đan Thanh Đàn Tranh trực tiếp giảng dạy, mỗi buổi chỉ tối đa 3-4 học viên.</p>
            <p>😘 Chương trình học cơ bản nhất dành cho các bạn chưa biết gì về nhạc lý.</p>
            <p>😘 Đã giảng dạy hàng trăm học viên theo học và sau 3 tháng đều đã đánh được bài hát.</p>
          </div>

          <div className="service-card">
            <h2>NHẬP KHẨU ĐÀN CỔ TRANH - GUZHENG TRỰC TIẾP</h2>
            <p>😘 Đối với Đàn Cổ Tranh (Guzheng), mình đặt trực tiếp từ xưởng Trung Quốc về, nên có rất nhiều mẫu liên tục cập nhật và giá rẻ hơn thị trường.</p>
            <p>😘 Đàn khi đặt về sẽ được tặng kèm full phụ kiện kèm theo gồm có: Chân đàn, móng đàn, bao đàn, máy lên dây, khăn trùm đàn, thùng đàn... Đặc biệt hỗ trợ ship toàn quốc và trả góp.</p>
            <p>😘 Mời các bạn ghé qua fanpage Facebook để cập nhật những mẫu đàn mới nhất nhé.</p>
          </div>

          <div className="service-card">
            <h2>XƯỞNG LÀM ĐÀN TRANH VIỆT NAM</h2>
            <p>😘 Đối với Đàn Tranh Việt Nam, mình có nhận đặt làm với yêu cầu về chất liệu gỗ và họa tiết cho các bạn.</p>
            <p>😘 Bao gồm Chạm, Cẩn, khắc đồng tiền, màu sắc...</p>
            <p>😘 Đàn khi mua sẽ được tặng kèm bao đàn và móng đàn.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-card">
            <h2>GIỜ HOẠT ĐỘNG</h2>
            <p><strong>Tất cả các ngày trong tuần</strong></p>
            <p>Từ thứ 2 đến Chủ Nhật</p>
            <p>9h sáng đến 20h tối</p>
          </div>

          <div className="info-card">
            <h2>ĐỊA CHỈ LỚP HỌC</h2>
            <p>383/3/15A Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh, Vietnam</p>
            <p>Cách mặt tiền 50m, xe hơi vào được</p>
            <p><strong>SĐT: 094 436 40 16 (Đan Thanh)</strong></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
