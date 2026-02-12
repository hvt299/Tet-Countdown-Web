import { Solar, Lunar } from 'lunar-javascript';

export type TetState = {
    isTet: boolean; // Đang trong Tết
    targetDate: number; // Timestamp đích
    currentLunarYear: number; // Năm dương lịch (để tính toán)
    lunarYearName: string; // Tên năm (Ví dụ: Bính Ngọ)
};

// Hàm tính Can Chi (Ví dụ: 2026 -> Bính Ngọ)
const getCanChi = (year: number): string => {
    const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
    const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

    const can = CAN[year % 10];
    const chi = CHI[year % 12];

    return `${can} ${chi}`;
};

export const checkTetState = (): TetState => {
    const now = new Date();
    const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const lunar = solar.getLunar();

    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();
    const lunarYear = lunar.getYear();

    // 1. Đang trong Tết (Mùng 1 -> Mùng 10)
    if (lunarMonth === 1 && lunarDay >= 1 && lunarDay <= 10) {
        return {
            isTet: true,
            targetDate: 0,
            currentLunarYear: lunarYear,
            lunarYearName: getCanChi(lunarYear) // Trả về tên năm hiện tại
        };
    }

    // 2. Tính Tết sắp tới
    let targetLunarYear = lunarYear;
    if (lunarMonth > 1 || (lunarMonth === 1 && lunarDay > 10)) {
        targetLunarYear = lunarYear + 1;
    }

    const nextTetLunar = Lunar.fromYmd(targetLunarYear, 1, 1);
    const nextTetSolar = nextTetLunar.getSolar();

    const targetDate = new Date(
        nextTetSolar.getYear(),
        nextTetSolar.getMonth() - 1,
        nextTetSolar.getDay(),
        0, 0, 0
    ).getTime();

    return {
        isTet: false,
        targetDate: targetDate,
        currentLunarYear: targetLunarYear,
        lunarYearName: getCanChi(targetLunarYear) // Trả về tên năm sắp tới
    };
};