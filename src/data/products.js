import { hover } from "framer-motion";

// Import all images from the image folder
const imageModules = import.meta.glob('../image/*.{jpg,jpeg,png,webp,gif}', { eager: true });
const images = {};

// Create a mapping of filename to imported image
Object.keys(imageModules).forEach((path) => {
    const filename = path.split('/').pop().replace(/\.[^/.]+$/, '');
    images[filename] = imageModules[path].default || imageModules[path];
});

export const products = [
    // Guzheng (Cổ Tranh) - Fullsize
    {
        id: 1,
        name: "Thanh Lâm Linh Cảnh",
        oldPrice: "32.000.000₫",
        newPrice: "16.500.000₫",
        image: images.guzhengHuyenDong1,
        hoverImage: images.guzhengHuyenDong2,
        description: "Gỗ Hắc Đàn – Họa Tiết Lâm Sơn được vẽ tay cực tinh tế, khung cảnh mây núi – hạc trắng như tranh cổ phong sống dậy. ✨ Nhìn vào là thấy vibe tiên hiệp, cầm lên thần thái tăng +100 luôn!",
        category: "Guzheng"
    },

    {
        id: 2,
        name: "Ngọc Vân Tiên Ảnh",
        oldPrice: "32.000.000₫",
        newPrice: "16.500.000₫",
        image: images.guzhengHuyenDong3,
        hoverImage: images.guzhengHuyenDong4,
        description: "Gỗ Huyết Đàn – Tiên Linh Hươu Ngọc Mặt đàn vẽ tay phong cách cổ phong: hươu ngọc – trăng tròn – dải ngân hà lấp lánh. ✨ Team mê thần tiên mỹ cảnh nhìn phát là “đổ”!",
        category: "Guzheng"
    },

    {
        id: 3,
        name: "Hoa Chi Vân Sắc ",
        oldPrice: "15.000.000₫",
        newPrice: "9.500.000₫",
        image: images.guzhengHuyenDong5,
        hoverImage: images.guzhengHuyenDong6,
        description: "Gỗ Hoàng Hoa Lê – Sơn Mài Khảm Hoa. Tông trắng vàng thanh nhã, hoa nổi phủ bóng siêu đẹp. ✨ Một trong những em dịu dàng – sang xịn",
        category: "Guzheng"
    },

    {
        id: 4,
        name: "Thanh Hà Cổ Cầm",
        oldPrice: "35.000.000₫",
        newPrice: "25.000.000₫",
        image: images.guzhengHuyenDong7,
        hoverImage: images.guzhengHuyenDong8,
        description: "Mang vẻ đẹp thanh nhã và thuần khiết như chính tên gọi — thân đàn được chế tác từ gỗ Bách Thảo quý, hòa cùng âm bảng từ gỗ ngô đồng 20 năm tuổi. 🌸 Họa tiết sen vàng được danh họa vẽ tay thủ công, phủ lớp sơn nổi 4D ánh lam ngọc, mỗi nét cọ đều là nghệ thuật. 🌺 Dây đàn làm từ lụa hoàng kim, mang đến âm sắc ấm áp, vang xa và mềm mại tựa nước chảy qua tim người nghe. Đây là dòng 135 cm siêu cao cấp của Huyền Đồng, kết hợp hoàn hảo giữa mỹ thuật và âm thanh, dành cho những ai yêu vẻ đẹp cổ điển và thủ công. ✨ Một tác phẩm nghệ thuật hơn là một nhạc cụ — Thanh Hà, đoá sen giữa lòng âm nhạc.",
        category: "Guzheng"
    },

    {
        id: 5,
        name: "Nhật Nguyệt Cầm",
        oldPrice: "15.000.000₫",
        newPrice: "7.500.000₫",
        image: images.guzhengHuyenDong9,
        hoverImage: images.guzhengHuyenDong10,
        description: "Hai em Guzheng dòng 1m25 Huyền Đồng – âm thanh ấm, ngân vang cực hay ✨",
        category: "Guzheng"
    },

    {
        id: 6,
        name: "Viêm Sơn Hành Cầm",
        oldPrice: "15.000.000₫",
        newPrice: "7.500.000₫",
        image: images.guzhengHuyenDong11,
        hoverImage: images.guzhengHuyenDong12,
        description: "“Đàn hành giữa núi lửa”, thể hiện sức sống và tinh thần mạnh mẽ",
        category: "Guzheng"
    },

    {
        id: 7,
        name: "Minh Hạc Dương Cầm",
        oldPrice: "15.000.000₫",
        newPrice: "7.500.000₫",
        image: images.guzhengHuyenDong13,
        hoverImage: images.guzhengHuyenDong14,
        description: "“Đàn hạc sáng dưới dương nhật”, nghe nhẹ và thanh tao",
        category: "Guzheng"
    },

    // Đàn Tranh Việt Nam
    {
        id: 10,
        name: "Đàn tranh Koto Gõ Đỏ",
        price: "5.000.000₫",
        image: "https://static.wixstatic.com/media/d86b8e_9957680edf604c08a90fbf072f345df4~mv2.webp/v1/fill/w_1024,h_827,al_c,q_85,enc_avif,quality_auto/d86b8e_9957680edf604c08a90fbf072f345df4~mv2.webp",
        hoverImage: "https://static.wixstatic.com/media/d86b8e_0b573594509a48a4bbcce679afdbb553~mv2.webp/v1/fill/w_1024,h_827,al_c,q_85,enc_avif,quality_auto/d86b8e_0b573594509a48a4bbcce679afdbb553~mv2.webp",
        description: "Đàn tranh lai koto gỗ Gõ Đỏ bên xưởng mình vừa mới ra thêm loại này âm thanh rất hay ❤️ chỉ sau cẩm lai xíu thui😄, loại gỗ này cũng có vân gỗ luôn nha cả nhà lên màu tự nhiên khá đẹp 😍 Quà Tặng: Móng sắt và bao đàn xịn",
        category: "Dan Tranh"
    },
    {
        id: 11,
        name: "Đàn tranh Cẩm Lai",
        price: "6.500.000₫",
        image: "https://static.wixstatic.com/media/d86b8e_8d4cd1bcce1549109c2ebf1b15006b64~mv2.webp/v1/fill/w_1024,h_827,al_c,q_85,enc_avif,quality_auto/d86b8e_8d4cd1bcce1549109c2ebf1b15006b64~mv2.webp",
        hoverImage: "https://static.wixstatic.com/media/d86b8e_7e0c32b2f2654e1dbbb552f491a898de~mv2.webp/v1/fill/w_1024,h_827,al_c,q_85,enc_avif,quality_auto/d86b8e_7e0c32b2f2654e1dbbb552f491a898de~mv2.webp",
        description: "Đàn tranh được làm bằng chất liệu gỗ Cẩm Lai, rất quí và bền. Âm thanh rất hay đánh càng lâu âm lại càng hay hơn. Hôm nào mình sẽ test âm cho người nghe thử nha 😉😉😉 Quà Tặng: Móng sắt và bao đàn xịn.",
        category: "Dan Tranh"
    },
    
    // Phụ kiện - Khác
    {
        id: 14,
        name: "Khoá lên dây đàn cổ tranh (guzheng) loại chuyên dụng",
        price: "70.000₫",
        image: "https://static.wixstatic.com/media/d86b8e_363a415fe7ed4fa79627d358c6ffe508~mv2.webp/v1/fill/w_800,h_800,al_c,q_85,enc_avif,quality_auto/d86b8e_363a415fe7ed4fa79627d358c6ffe508~mv2.webp",
        description: "Khoá lên dây đàn cổ tranh loại chuyên dụng, chất lượng cao.",
        category: "Accessories"
    },
    {
        id: 15,
        name: "Ghế đôn guzheng (cổ tranh) chuyên dụng ngồi đàn phù hợp chiều cao",
        price: "659.000₫",
        image: "https://static.wixstatic.com/media/d86b8e_174dec85c80a4e8cb351c57a4fd29b13~mv2.webp/v1/fill/w_800,h_800,al_c,q_85,enc_avif,quality_auto/d86b8e_174dec85c80a4e8cb351c57a4fd29b13~mv2.webp",
        hoverImage: "https://static.wixstatic.com/media/d86b8e_ae0605a7e2794b6894677d78ec9532a0~mv2.webp/v1/fill/w_800,h_800,al_c,q_85,enc_avif,quality_auto/d86b8e_ae0605a7e2794b6894677d78ec9532a0~mv2.webp",
        description: "Ghế đôn guzheng chuyên dụng, phù hợp chiều cao khi ngồi đàn.",
        category: "Accessories"
    },
    {
        id: 16,
        name: "Thẻ dán móng băng quấn ( keo ) guzheng tiện dụng giúp thao tác tháo móng đeo vào",
        price: "69.000₫",
        image: "https://static.wixstatic.com/media/d86b8e_4fb51fce198144d48e6a8096ec68a8f1~mv2.webp/v1/fill/w_799,h_645,al_c,q_85,enc_avif,quality_auto/d86b8e_4fb51fce198144d48e6a8096ec68a8f1~mv2.webp",
        hoverImage: "https://static.wixstatic.com/media/d86b8e_3c8f69aa14e34230bbe755521b71d8fd~mv2.webp/v1/fill/w_800,h_646,al_c,q_85,enc_avif,quality_auto/d86b8e_3c8f69aa14e34230bbe755521b71d8fd~mv2.webp",
        description: "Thẻ dán móng băng quấn (keo) guzheng tiện dụng, giúp thao tác tháo móng đeo vào dễ dàng.",
        category: "Accessories"
    }
];
