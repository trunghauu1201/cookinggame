// --- NGUYÊN LIỆU (SHOP THƯỜNG & CHỢ ĐEN) ---
const INGREDIENTS = [
    { id: 1, name: "Trứng", icon: "🥚", rarity: "Common", price: 5, color: "#cbd5e1", isBM: false },
    { id: 2, name: "Gà", icon: "🍗", rarity: "Common", price: 15, color: "#cbd5e1", isBM: false },
    { id: 3, name: "Gạo", icon: "🍚", rarity: "Common", price: 8, color: "#cbd5e1", isBM: false },
    { id: 4, name: "Bột mì", icon: "🌾", rarity: "Common", price: 10, color: "#cbd5e1", isBM: false },
    { id: 5, name: "Gia vị", icon: "🧂", rarity: "Common", price: 5, color: "#cbd5e1", isBM: false },
    { id: 6, name: "Rau củ", icon: "🥦", rarity: "Common", price: 7, color: "#cbd5e1", isBM: false },
    { id: 7, name: "Sữa tươi", icon: "🥛", rarity: "Common", price: 12, color: "#cbd5e1", isBM: false },
    { id: 8, name: "Socola", icon: "🍫", rarity: "Rare", price: 20, color: "#a855f7", isBM: false },
    { id: 9, name: "Lá trà", icon: "🍃", rarity: "Common", price: 8, color: "#cbd5e1", isBM: false },
    { id: 10, name: "Thịt bò", icon: "🥩", rarity: "Rare", price: 35, color: "#a855f7", isBM: false },
    { id: 11, name: "Cá hồi", icon: "🍣", rarity: "Rare", price: 40, color: "#a855f7", isBM: false },
    
    // Black Market (Chợ Đen)
    { id: 101, name: "Lông Phượng hoàng", icon: "🪶", rarity: "SSR", price: 500, color: "#f59e0b", isBM: true },
    { id: 102, name: "Máu Rồng", icon: "🩸", rarity: "SSR", price: 600, color: "#ef4444", isBM: true },
    { id: 103, name: "Cỏ Ánh trăng", icon: "🌿", rarity: "SSR", price: 450, color: "#fef08a", isBM: true },
    { id: 104, name: "Nước mắt nhân ngư", icon: "💧", rarity: "SSR", price: 700, color: "#38bdf8", isBM: true },
    { id: 105, name: "Mảnh vỡ ký ức", icon: "🔮", rarity: "SSR", price: 800, color: "#c084fc", isBM: true },
    { id: 106, name: "Gia vị địa ngục", icon: "🌶️", rarity: "SSR", price: 550, color: "#dc2626", isBM: true },
    { id: 107, name: "Nước suối nguồn", icon: "⛲", rarity: "SSR", price: 650, color: "#60a5fa", isBM: true },
    { id: 108, name: "Băng vĩnh cửu", icon: "🧊", rarity: "SSR", price: 400, color: "#93c5fd", isBM: true },
    { id: 109, name: "Bụi sao", icon: "✨", rarity: "SSR", price: 900, color: "#fde047", isBM: true },
    { id: 110, name: "Lá vàng ròng", icon: "🥇", rarity: "SSR", price: 1000, color: "#fbbf24", isBM: true }
];

const RECIPES = [
    { id: 1, name: "Trứng chiên", ings: [1], tier: 1, minLv: 1, price: 15, exp: 5 },
    { id: 2, name: "Gà chiên", ings: [2], tier: 1, minLv: 1, price: 30, exp: 10 },
    { id: 3, name: "Cơm trắng", ings: [3], tier: 1, minLv: 1, price: 12, exp: 5 },
    { id: 4, name: "Bánh mì tỏi", ings: [4, 5], tier: 1, minLv: 2, price: 25, exp: 15 },
    { id: 5, name: "Salad gà", ings: [2, 6], tier: 1, minLv: 2, price: 35, exp: 15 },
    { id: 6, name: "Pasta phô mai", ings: [4, 7], tier: 1, minLv: 3, price: 40, exp: 20 },
    { id: 7, name: "Thịt bò xào rau củ", ings: [10, 6], tier: 1, minLv: 3, price: 70, exp: 25 },
    { id: 8, name: "Súp rau củ", ings: [6, 5], tier: 1, minLv: 3, price: 20, exp: 10 },
    { id: 9, name: "Bánh Socola", ings: [4, 8, 7], tier: 1, minLv: 4, price: 80, exp: 30 },
    { id: 10, name: "Trà sữa", ings: [7, 9], tier: 1, minLv: 2, price: 35, exp: 15 },
    { id: 11, name: "Bít tết Wagyu", ings: [10, 5, 6], tier: 2, minLv: 5, price: 150, exp: 50 },
    { id: 12, name: "Cá hồi áp chảo", ings: [11, 5], tier: 2, minLv: 5, price: 120, exp: 45 },
    { id: 13, name: "Bánh Macaron", ings: [4, 1, 8], tier: 2, minLv: 6, price: 100, exp: 40 },
    { id: 14, name: "Burger bò phô mai", ings: [10, 4, 7], tier: 2, minLv: 6, price: 130, exp: 45 },
    { id: 15, name: "Súp nấm truffle", ings: [6, 7, 5], tier: 2, minLv: 7, price: 140, exp: 50 },
    { id: 16, name: "Sushi cá hồi", ings: [11, 3], tier: 2, minLv: 7, price: 110, exp: 40 },
    { id: 17, name: "Pizza đặc biệt", ings: [4, 10, 6], tier: 2, minLv: 8, price: 160, exp: 55 },
    { id: 18, name: "Rượu vang nho", ings: [6, 5], tier: 2, minLv: 8, price: 180, exp: 60 },
    { id: 19, name: "Bánh Lava chảy", ings: [8, 1, 4], tier: 2, minLv: 9, price: 150, exp: 50 },
    { id: 20, name: "Sườn bò nướng", ings: [10, 5], tier: 2, minLv: 9, price: 140, exp: 50 },
    { id: 21, name: "Cánh Phượng Hoàng", ings: [2, 101], tier: 3, minLv: 10, price: 800, exp: 200 },
    { id: 22, name: "Cocktail Máu Rồng", ings: [5, 102], tier: 3, minLv: 10, price: 900, exp: 220 },
    { id: 23, name: "Súp Núi Tản", ings: [6, 103], tier: 3, minLv: 11, price: 750, exp: 180 },
    { id: 24, name: "Gỏi Thủy Cung", ings: [11, 104], tier: 3, minLv: 11, price: 1100, exp: 250 },
    { id: 25, name: "Bánh Mì Chinh Phạt", ings: [4, 105], tier: 3, minLv: 12, price: 1200, exp: 300 },
    { id: 26, name: "Thịt Nướng Sa Mạc", ings: [10, 106], tier: 3, minLv: 12, price: 950, exp: 230 },
    { id: 27, name: "Trà Suối Nguồn", ings: [7, 107], tier: 3, minLv: 13, price: 1000, exp: 240 },
    { id: 28, name: "Kem Tuyết Vĩnh Cửu", ings: [7, 108], tier: 3, minLv: 13, price: 850, exp: 210 },
    { id: 29, name: "Bánh Quy Tinh Tú", ings: [4, 109], tier: 3, minLv: 14, price: 1300, exp: 350 },
    { id: 30, name: "Bò Dát Vàng", ings: [10, 110], tier: 3, minLv: 14, price: 1500, exp: 400 },
    { id: 31, name: "Súp Tương Đối", ings: [105, 109], tier: 4, minLv: 15, price: 5000, exp: 1000 },
    { id: 32, name: "Đại Tiệc Hoàng Kim", ings: [110, 101], tier: 4, minLv: 15, price: 6000, exp: 1200 },
    { id: 33, name: "Sốt Cừu Huyền Thoại", ings: [106, 104], tier: 4, minLv: 15, price: 5500, exp: 1100 },
    { id: 34, name: "Linh Hồn Đọa Lạc", ings: [102, 106], tier: 4, minLv: 15, price: 5800, exp: 1150 },
    { id: 35, name: "Đào Tiên Bất Tử", ings: [103, 107], tier: 4, minLv: 15, price: 7000, exp: 1500 }
];

const GUESTS = [
    { name: "Sinh viên", icon: "🎒", tier: 1 }, { name: "Dân văn phòng", icon: "💼", tier: 1 }, { name: "Shipper", icon: "🛵", tier: 1 },
    { name: "Donald Trump", icon: "👱", tier: 2, fav: 14 }, { name: "Putin", icon: "🐻", tier: 2, fav: 11 }, { name: "Taylor Swift", icon: "🎤", tier: 2, fav: 13 }, { name: "Bill Gates", icon: "💻", tier: 2, fav: 15 }, { name: "Nữ hoàng Elizabeth II", icon: "👑", tier: 2, fav: 12 },
    { name: "Napoleon", icon: "🐎", tier: 3, fav: 21 }, { name: "Thành Cát Tư Hãn", icon: "🦅", tier: 3, fav: 22 }, { name: "Alexander Đại Đế", icon: "⚔️", tier: 3, fav: 25 }, { name: "Thủy Tinh", icon: "🌊", tier: 3, fav: 24 }, { name: "Sơn Tinh", icon: "⛰️", tier: 3, fav: 23 },
    { name: "Albert Einstein", icon: "🧠", tier: 4, sign: 31 }, { name: "Vua Midas", icon: "🪙", tier: 4, sign: 32 }, { name: "Gordon Ramsay", icon: "🔥", tier: 4, sign: 33 }, { name: "Quỷ Satan", icon: "👿", tier: 4, sign: 34 }, { name: "Tôn Ngộ Không", icon: "🐒", tier: 4, sign: 35 }
];

const JOBS = {
    security: [
        { id: 'sec1', name: "Bảo vệ dân phố", icon: "👮‍♂️", price: 1500, block: 0.3, desc: "Chặn 30% trộm" },
        { id: 'sec2', name: "Vệ sĩ chuyên nghiệp", icon: "🕴️", price: 4000, block: 0.7, desc: "Chặn 70% trộm" },
        { id: 'sec3', name: "Đặc vụ ngầm", icon: "🕵️‍♂️", price: 10000, block: 1.0, desc: "Bắt 100% trộm" }
    ],
    waiter: [
        { id: 'w1', name: "Phục vụ nhanh nhẹn", icon: "💁‍♂️", price: 600, patBonus: 5, desc: "+5s kiên nhẫn" }
    ],
    chef: [
        { id: 'c1', name: "Đầu bếp phụ", icon: "👨‍🍳", price: 2500, mult: 1.1, desc: "Bán đắt hơn 10%" },
        { id: 'c2', name: "Bếp phó", icon: "🍳", price: 6000, mult: 1.25, desc: "Bán đắt hơn 25%" },
        { id: 'c3', name: "Bếp trưởng Michelin", icon: "👨‍🍳⭐", price: 15000, mult: 1.5, desc: "Bán đắt hơn 50%" }
    ],
    valet: [
        { id: 'v1', name: "Người trông xe", icon: "🎟️", price: 1200, extraSlot: 1, desc: "+1 Chỗ ngồi" },
        { id: 'v2', name: "Quản lý bãi xe", icon: "🅿️", price: 3500, extraSlot: 2, desc: "+2 Chỗ ngồi" },
        { id: 'v3', name: "Valet VIP", icon: "🏎️", price: 9000, extraSlot: 3, desc: "+3 Chỗ ngồi" }
    ]
};