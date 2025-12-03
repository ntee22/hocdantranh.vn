# Học Đàn Tranh - Cổ Tranh Đan Thanh

Website chính thức của Học Đàn Tranh - Cổ Tranh Đan Thanh, nơi cung cấp các khóa học đàn tranh, guzheng và các nhạc cụ truyền thống chất lượng cao.

🎶 **Âm nhạc giúp cuộc sống nhẹ nhàng hơn** 🎶

## 🌟 Tính năng

### Trang chủ
- Thông tin về trung tâm và các dịch vụ
- Giới thiệu về chất lượng giảng dạy
- Thông tin nhập khẩu đàn cổ tranh (Guzheng) trực tiếp
- Xưởng làm đàn tranh Việt Nam
- Giờ hoạt động và địa chỉ liên hệ

### Sản phẩm (Đàn Tranh & Guzheng)
- Hiển thị đầy đủ các sản phẩm đàn tranh và guzheng
- Hỗ trợ hiển thị giá sale với badge "SALE"
- Phân loại theo danh mục: Đàn Tranh, Guzheng, Phụ kiện
- 16 sản phẩm được cập nhật từ website Wix

### Sheet nhạc
- Thư viện sheet nhạc Guzheng miễn phí
- 16 bản nhạc được biên soạn bởi Đan Thanh Đàn Tranh
- Modal popup để xem sheet nhạc với hình ảnh chất lượng cao
- Thông tin chi tiết về từng bản nhạc (tác giả, trình độ)

## 🚀 Công nghệ sử dụng

- **React 19** - UI framework
- **Vite** - Build tool và dev server
- **React Router DOM** - Điều hướng trang
- **Framer Motion** - Animation và transitions
- **Lucide React** - Icon library
- **CSS3** - Styling với custom properties

## 📦 Cài đặt

### Yêu cầu
- Node.js 18+ 
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository hoặc tải source code về
```bash
cd hocdantranh.vn
```

2. Cài đặt dependencies
```bash
npm install
```

3. Chạy development server
```bash
npm run dev
```

4. Mở trình duyệt và truy cập
```
http://localhost:5173
```

## 📜 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint để kiểm tra code

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
│   ├── Home/           # Component cho trang chủ
│   ├── Layout/         # Navbar, Footer, FloatingChat
│   └── UI/             # Button, Card, PageTransition
├── data/               # Dữ liệu tĩnh
│   ├── products.js     # Danh sách sản phẩm
│   └── sheets.js       # Danh sách sheet nhạc
├── pages/              # Các trang chính
│   ├── Home.jsx        # Trang chủ
│   ├── Products.jsx    # Trang sản phẩm
│   └── SheetMusic.jsx  # Trang sheet nhạc
├── styles/             # Global styles
└── main.jsx            # Entry point
```

## 🎨 Tính năng nổi bật

- ✅ Responsive design - Tối ưu cho mọi thiết bị
- ✅ Smooth animations - Sử dụng Framer Motion
- ✅ Modal viewer - Xem sheet nhạc trong popup
- ✅ Sale badges - Hiển thị sản phẩm đang giảm giá
- ✅ Page transitions - Chuyển trang mượt mà
- ✅ SEO friendly - Cấu trúc HTML semantic

## 📞 Thông tin liên hệ

- **Địa chỉ**: 383/3/15A Quang Trung, phường 10, quận Gò Vấp
- **SĐT**: 094 436 40 16 (Đan Thanh)
- **Giờ hoạt động**: Tất cả các ngày trong tuần, từ 9h sáng đến 20h tối

## 🔄 Cập nhật dữ liệu

Dữ liệu sản phẩm và sheet nhạc được lấy từ website Wix gốc:
- Sản phẩm: `https://ntee22.wixsite.com/hocdantranh/dan-tranh`
- Sheet nhạc: `https://ntee22.wixsite.com/hocdantranh/sheetnhacguzheng`

Để cập nhật, chỉnh sửa các file trong thư mục `src/data/`:
- `products.js` - Cập nhật sản phẩm
- `sheets.js` - Cập nhật sheet nhạc

## 📝 Ghi chú

- Hình ảnh sheet nhạc cần được cấu hình đường dẫn trong `SheetMusic.jsx` (hàm `getImageUrl`)
- Có thể thay đổi đường dẫn hình ảnh tùy theo nơi lưu trữ (local, CDN, hoặc Wix)

## 📄 License

©2023 by Học Đàn Tranh - Guzheng - Đan Thanh
