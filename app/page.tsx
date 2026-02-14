'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TetCountdown from '@/components/TetCountdown';
import { X, Sparkles, LogOut, Settings } from 'lucide-react';
import { checkTetState } from '@/utils/tetHelper';

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export default function Home() {
  const [calligraphies, setCalligraphies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isFestivalTime, setIsFestivalTime] = useState(false);
  const [tetMessage, setTetMessage] = useState('');

  useEffect(() => {
    const currentState = checkTetState();
    const now = new Date().getTime();
    const tetTime = currentState.targetDate;
    const endOfMung10 = tetTime + (10 * 24 * 60 * 60 * 1000);

    const isFestival = now >= tetTime && now <= endOfMung10;
    setIsFestivalTime(isFestival);

    if (now < tetTime) {
      setTetMessage("Các trò chơi và hoạt động xin chữ, hái lộc sẽ chính thức mở vào lúc Giao Thừa và đóng lại vào cuối Mùng 10. Bạn hãy quay lại nhé!");
    } else if (now > endOfMung10) {
      setTetMessage("Cảm ơn bạn đã tham gia chơi các trò chơi, khai bút và hái lộc. Hẹn gặp lại bạn vào mùa Tết năm sau nhé!");
    }

    const fetchRecentCalligraphies = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${API_URL}/calligraphy/recent`);

        const filteredData = response.data.filter((item: any) => {
          const itemTime = new Date(item.createdAt).getTime();
          return itemTime >= tetTime && itemTime <= endOfMung10;
        });

        setCalligraphies(filteredData);
      } catch (error) {
        console.error('Lỗi lấy Bảng vàng:', error);
      }
    };

    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('access_token');

    if (token) {
      setIsLoggedIn(true);
      fetchRecentCalligraphies();

      const decoded = parseJwt(token);
      if (decoded) setUserInfo(decoded);
    } else {
      setIsLoggedIn(false);
      const timer = setTimeout(() => setShowPopup(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.reload();
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden font-sans">

      {/* BACKGROUND IMAGE & OVERLAY */}
      <div className="inset-0 z-0 fixed">
        <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover object-center" priority />
      </div>
      <div className="inset-0 z-10 bg-linear-to-b from-red-900/70 via-black/40 to-red-900/80 fixed"></div>

      {/* --- HEADER NAVBAR --- */}
      <header className="fixed top-0 left-0 w-full py-3 px-4 md:px-6 z-50 flex justify-between items-center bg-red-950/30 backdrop-blur-md border-b border-yellow-500/20 shadow-sm transition-all">

        {/* LOGO: Ẩn chữ trên Mobile, chỉ hiện icon */}
        <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-yellow-400 font-serif drop-shadow-md hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 text-yellow-400 shrink-0" />
          <span className="hidden sm:inline">Tết Countdown</span>
        </Link>

        {/* USER INFO */}
        {isLoggedIn ? (
          <div className="flex items-center gap-1 md:gap-2 bg-black/40 backdrop-blur-md pl-1 pr-2 py-1 rounded-full border border-yellow-500/30 shadow-lg">

            {/* Nhóm Avatar + Tên + Settings (Bấm vào để qua trang Cài đặt) */}
            <Link
              href="/profile"
              className="flex items-center gap-2 md:gap-3 px-2 py-1 rounded-full hover:bg-red-900/50 transition group"
              title="Cài đặt tài khoản"
            >
              {/* Avatar */}
              {userInfo?.avatar ? (
                <img src={userInfo.avatar} alt="Avatar" className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-yellow-500/50 object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 md:w-9 md:h-9 bg-linear-to-br from-yellow-400 to-yellow-600 text-red-900 flex items-center justify-center rounded-full font-bold shadow-inner shrink-0">
                  <span className="text-sm uppercase">{userInfo?.fullName?.charAt(0) || userInfo?.username?.charAt(0) || 'U'}</span>
                </div>
              )}

              {/* Tên */}
              <span className="text-white font-medium text-sm md:text-base max-w-25 truncate md:max-w-37.5 group-hover:text-yellow-400 transition">
                {userInfo?.fullName || userInfo?.username}
              </span>

              {/* Icon Settings */}
              <Settings className="w-4 h-4 text-white/50 group-hover:text-yellow-400 transition" />
            </Link>

            {/* Vách ngăn dọc */}
            <div className="h-6 w-px bg-white/20 mx-1"></div>

            {/* Nút Đăng xuất */}
            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-red-400 hover:bg-red-900/50 rounded-full transition focus:outline-none"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>

          </div>
        ) : (
          <Link href="/login" className="bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold px-5 py-1.5 md:px-6 md:py-2 rounded-full shadow-lg transform transition-transform hover:scale-105 text-sm md:text-base">
            Đăng Nhập
          </Link>
        )}
      </header>

      {/* --- POPUP KHAI XUÂN --- */}
      {!isLoggedIn && showPopup && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="relative bg-linear-to-b from-red-900 to-red-950 border-2 border-yellow-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(234,179,8,0.3)] transform transition-all scale-100">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-red-300 hover:text-yellow-400 transition-colors focus:outline-none"
            >
              <X size={24} />
            </button>

            <div className="text-6xl mb-4 animate-bounce">🧧</div>
            <h3 className="text-2xl text-yellow-400 font-bold font-serif mb-2">Khai Xuân Đón Lộc</h3>
            <p className="text-red-100 mb-6 text-sm">Đăng nhập ngay để xin chữ Ông Đồ AI và tham gia các trò chơi dân gian!</p>
            <Link
              href="/login"
              className="inline-block bg-linear-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-red-900 font-bold text-base py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105"
            >
              Đăng Nhập / Đăng Ký
            </Link>
          </div>
        </div>
      )}

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="relative z-20 w-full max-w-7xl px-4 grow flex flex-col justify-center pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">

          {/* CỘT GIỮA: COUNTDOWN */}
          <div className="lg:col-span-6 lg:col-start-4 order-1 lg:order-2 flex flex-col items-center justify-center w-full">
            <TetCountdown />
          </div>

          {/* CÁC TÍNH NĂNG & BẢNG VÀNG */}
          {isLoggedIn && (
            <>
              {isFestivalTime ? (
                <>
                  {/* CỘT TRÁI: BẢNG VÀNG */}
                  <div className="lg:col-span-3 lg:col-start-1 order-3 lg:order-1 w-full">
                    <div className="w-full bg-black/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 shadow-2xl">
                      <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2 font-serif">
                        <span>📜</span> Bảng Vàng Xin Chữ
                      </h2>
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                        {calligraphies.map((item: any) => (
                          <div key={item._id} className="bg-red-950/40 p-3 rounded-xl border border-red-800/50 flex items-center gap-3 hover:bg-red-900/60 transition-colors">
                            <div className="shrink-0 w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 text-red-900 flex items-center justify-center rounded-full text-2xl font-bold font-serif shadow-inner border border-yellow-300">
                              {item.givenWord}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-sm text-white truncate">
                                {item.user?.fullName || item.userName}
                              </p>
                              <p className="text-xs text-red-200 line-clamp-2 italic leading-tight">"{item.poem}"</p>
                            </div>
                          </div>
                        ))}
                        {calligraphies.length === 0 && (
                          <p className="text-center text-sm text-red-300/60 italic py-4">Chưa có ai xin chữ. Hãy là người đầu tiên!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: 3 TÍNH NĂNG */}
                  <div className="lg:col-span-3 lg:col-start-10 order-2 lg:order-3 w-full flex flex-col gap-4">
                    <Link href="/xin-chu" className="group block">
                      <div className="bg-red-900/60 backdrop-blur-sm border-2 border-yellow-500/50 hover:border-yellow-400 rounded-xl p-4 flex items-center gap-4 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:bg-red-800/80">
                        <div className="text-4xl group-hover:scale-110 transition-transform">🧧</div>
                        <div>
                          <h3 className="text-lg font-bold text-yellow-400">Xin Chữ Đầu Năm</h3>
                          <p className="text-xs text-red-200">Ông Đồ AI tặng chữ</p>
                        </div>
                      </div>
                    </Link>

                    <Link href="/hai-loc" className="group block">
                      <div className="bg-red-900/60 backdrop-blur-sm border-2 border-yellow-500/50 hover:border-yellow-400 rounded-xl p-4 flex items-center gap-4 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:bg-green-800/80">
                        <div className="text-4xl group-hover:scale-110 transition-transform">🌳</div>
                        <div>
                          <h3 className="text-lg font-bold text-yellow-400">Hái Lộc Đầu Xuân</h3>
                          <p className="text-xs text-red-200">Rút quẻ rước tài lộc</p>
                        </div>
                      </div>
                    </Link>

                    <Link href="/tro-choi" className="group block">
                      <div className="bg-red-900/60 backdrop-blur-sm border-2 border-yellow-500/50 hover:border-yellow-400 rounded-xl p-4 flex items-center gap-4 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:bg-orange-800/80">
                        <div className="text-4xl group-hover:scale-110 transition-transform">🎲</div>
                        <div>
                          <h3 className="text-lg font-bold text-yellow-400">Trò Chơi Dân Gian</h3>
                          <p className="text-xs text-red-200">Bầu cua, Lô tô</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* CỘT TRÁI: THÔNG BÁO ĐÓNG CỬA (Ở VỊ TRÍ BẢNG VÀNG) */}
                  <div className="lg:col-span-3 lg:col-start-1 order-3 lg:order-1 w-full flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-yellow-500/30 shadow-2xl min-h-75">
                    <div className="text-5xl mb-3 opacity-80 animate-pulse">🌸</div>
                    <h2 className="text-xl font-bold text-yellow-400 font-serif mb-3 leading-snug">
                      Hội Xuân Khép Lại
                    </h2>
                    <p className="text-red-200 text-sm leading-relaxed">
                      {tetMessage}
                    </p>
                  </div>

                  {/* CỘT PHẢI: 3 TÍNH NĂNG (TRẠNG THÁI DISABLED) */}
                  <div className="lg:col-span-3 lg:col-start-10 order-2 lg:order-3 w-full flex flex-col gap-4">
                    <div className="bg-red-950/40 backdrop-blur-sm border-2 border-yellow-500/20 rounded-xl p-4 flex items-center gap-4 shadow-inner opacity-50 grayscale cursor-not-allowed">
                      <div className="text-4xl">🧧</div>
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400/50">Xin Chữ Đầu Năm</h3>
                        <p className="text-xs text-red-200/50">Chưa mở hội</p>
                      </div>
                    </div>

                    <div className="bg-red-950/40 backdrop-blur-sm border-2 border-yellow-500/20 rounded-xl p-4 flex items-center gap-4 shadow-inner opacity-50 grayscale cursor-not-allowed">
                      <div className="text-4xl">🌳</div>
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400/50">Hái Lộc Đầu Xuân</h3>
                        <p className="text-xs text-red-200/50">Chưa mở hội</p>
                      </div>
                    </div>

                    <div className="bg-red-950/40 backdrop-blur-sm border-2 border-yellow-500/20 rounded-xl p-4 flex items-center gap-4 shadow-inner opacity-50 grayscale cursor-not-allowed">
                      <div className="text-4xl">🎲</div>
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400/50">Trò Chơi Dân Gian</h3>
                        <p className="text-xs text-red-200/50">Chưa mở hội</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>

      <footer className="relative z-20 text-white/50 text-xs md:text-sm w-full text-center pb-4 pt-4">
        <p>© {new Date().getFullYear()} Developed by Mr.T • Happy Lunar New Year</p>
      </footer>
    </main >
  );
}