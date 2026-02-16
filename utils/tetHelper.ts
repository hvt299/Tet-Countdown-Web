import { Solar, Lunar } from 'lunar-javascript';

export type TetState = {
    isTet: boolean;
    targetDate: number;
    currentLunarYear: number;
    lunarYearName: string;
};

const getCanChi = (year: number): string => {
    const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
    const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];

    const can = CAN[year % 10];
    const chi = CHI[year % 12];

    return `${can} ${chi}`;
};

export const checkTetState = (): TetState => {
    const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    const now = new Date(vnTimeStr);

    const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const lunar = solar.getLunar();

    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();
    const lunarYear = lunar.getYear();

    const currentTetLunar = Lunar.fromYmd(lunarYear, 1, 1);
    const currentTetSolar = currentTetLunar.getSolar();
    const currentTetTimestamp = new Date(
        currentTetSolar.getYear(),
        currentTetSolar.getMonth() - 1,
        currentTetSolar.getDay(),
        0, 0, 0
    ).getTime();

    if (lunarMonth === 1 && lunarDay >= 1 && lunarDay <= 10) {
        return {
            isTet: true,
            targetDate: currentTetTimestamp,
            currentLunarYear: lunarYear,
            lunarYearName: getCanChi(lunarYear)
        };
    }

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
        lunarYearName: getCanChi(targetLunarYear)
    };
};

export const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const jsonPayload = new TextDecoder('utf-8').decode(bytes);
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Lỗi giải mã JWT:', e);
        return null;
    }
};

export const formatCoins = (coins: number) => {
    if (coins >= 1000000) {
        const tr = Math.floor(coins / 1000000);
        const remainder = Math.floor((coins % 1000000) / 100000);
        return remainder > 0 ? `${tr}Tr${remainder}` : `${tr}Tr`;
    }
    if (coins >= 1000) {
        const k = Math.floor(coins / 1000);
        const remainder = Math.floor((coins % 1000) / 100);
        return remainder > 0 ? `${k}K${remainder}` : `${k}K`;
    }
    return coins.toString();
};