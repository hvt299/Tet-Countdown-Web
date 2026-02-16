'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, User, BadgeCheck, AlertCircle, Coins } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();

    const [profileData, setProfileData] = useState({
        fullName: '',
        username: '',
        email: '',
        avatar: '',
        coins: 0,
        isVerified: false,
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

    const getToken = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; access_token=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchProfile = async () => {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.data;
                setProfileData({
                    fullName: user.fullName || '',
                    username: user.username || '',
                    email: user.email || '',
                    avatar: user.avatar || '',
                    coins: user.coins || 0,
                    isVerified: user.isVerified || false,
                });
            } catch (error) {
                console.error('Lỗi khi lấy profile:', error);
                router.push('/login');
            }
        };

        fetchProfile();
    }, [router, API_URL]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileMsg({ type: '', text: '' });

        const token = getToken();
        try {
            const response = await axios.patch(`${API_URL}/users/profile`, {
                fullName: profileData.fullName,
                avatar: profileData.avatar,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.access_token) {
                document.cookie = `access_token=${response.data.access_token}; path=/; max-age=86400`;
            }

            setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setProfileMsg({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Có lỗi xảy ra!' });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPassword(true);
        setPasswordMsg({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'Mật khẩu nhập lại không khớp!' });
            setLoadingPassword(false);
            return;
        }

        const token = getToken();
        try {
            const response = await axios.patch(`${API_URL}/users/change-password`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPasswordMsg({ type: 'success', text: response.data.message || 'Đổi mật khẩu thành công! Đang chuyển hướng đăng nhập...' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setTimeout(() => router.push('/login'), 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setPasswordMsg({ type: 'error', text: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Mật khẩu cũ không chính xác!' });
        } finally {
            setLoadingPassword(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500 transition-colors";
    const disabledInputClass = "w-full px-4 py-2.5 text-base rounded-lg bg-black/40 border border-red-900/50 text-white/50 cursor-not-allowed";
    const btnClass = "w-full py-3.5 mt-4 text-lg bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] disabled:opacity-50";

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-x-hidden py-10 px-4">
            <div className="inset-0 z-[-2] fixed">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            <div className="relative z-20 w-full max-w-5xl bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-3xl shadow-2xl p-6 md:p-8">

                {/* Header Container */}
                <div className="flex items-center justify-between mb-8 border-b border-red-800/50 pb-6 relative">
                    <button
                        onClick={() => router.push('/')}
                        className="text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Trở về</span>
                    </button>

                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 font-serif flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                        <User className="text-yellow-500 hidden sm:block" size={28} />
                        Hồ Sơ Của Bạn
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* CỘT 1: THÔNG TIN CÁ NHÂN */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl">🏮</span>
                            <h2 className="text-xl font-bold text-yellow-400 font-serif">Thông Tin Cá Nhân</h2>
                        </div>

                        {profileMsg.text && (
                            <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${profileMsg.type === 'error' ? 'bg-red-500/20 border border-red-500 text-red-100' : 'bg-green-500/20 border border-green-500 text-green-100'}`}>
                                {profileMsg.text}
                            </div>
                        )}

                        {/* THẺ THÀNH VIÊN (User Card) */}
                        <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-inner">
                            {/* Avatar */}
                            <div className="w-20 h-20 shrink-0 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-900 flex items-center justify-center shadow-lg">
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl text-yellow-500 font-bold uppercase font-serif">
                                        {profileData.fullName?.charAt(0) || profileData.username?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-center sm:items-start grow text-center sm:text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-white truncate max-w-50">
                                        {profileData.fullName || profileData.username}
                                    </h3>
                                    {profileData.isVerified && (
                                        <span title="Tài khoản đã xác thực">
                                            <BadgeCheck className="text-blue-400 w-5 h-5 shrink-0" />
                                        </span>
                                    )}
                                </div>
                                <p className="text-red-200 text-sm mb-3">@{profileData.username}</p>

                                <div className="items-center gap-2 bg-yellow-900/40 border border-yellow-500/30 px-3 py-1.5 rounded-full inline-flex" title={`${profileData.coins.toLocaleString('vi-VN')} Xu`}>
                                    <Coins className="text-yellow-400 w-4 h-4" />
                                    <span className="text-yellow-400 font-bold text-sm">
                                        {profileData.coins} Xu
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Họ và Tên</label>
                                <input
                                    type="text" required
                                    className={inputClass}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Link Ảnh Đại Diện (Tùy chọn)</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="https://example.com/avatar.jpg"
                                    value={profileData.avatar}
                                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-yellow-500/70 text-sm font-bold mb-1">Tên đăng nhập</label>
                                    <input type="text" disabled className={disabledInputClass} value={profileData.username} />
                                </div>
                                <div>
                                    <label className="flex items-center justify-between text-yellow-500/70 text-sm font-bold mb-1">
                                        <span>Email</span>
                                        {!profileData.isVerified && (
                                            <span className="flex items-center gap-1 text-red-400 text-[10px] uppercase font-bold bg-red-950/50 px-1.5 py-0.5 rounded">
                                                <AlertCircle size={10} /> Chưa xác minh
                                            </span>
                                        )}
                                    </label>
                                    <input type="email" disabled className={disabledInputClass} value={profileData.email} />
                                </div>
                            </div>

                            <button type="submit" disabled={loadingProfile} className={btnClass}>
                                {loadingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </button>
                        </form>
                    </div>

                    {/* CỘT 2: ĐỔI MẬT KHẨU */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 mt-8 lg:mt-0">
                            <span className="text-2xl">🔐</span>
                            <h2 className="text-xl font-bold text-yellow-400 font-serif">Đổi Mật Khẩu</h2>
                        </div>

                        {passwordMsg.text && (
                            <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${passwordMsg.type === 'error' ? 'bg-red-500/20 border border-red-500 text-red-100' : 'bg-green-500/20 border border-green-500 text-green-100'}`}>
                                {passwordMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Mật khẩu hiện tại</label>
                                <input
                                    type="password" required
                                    className={inputClass}
                                    placeholder="••••••••"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Mật khẩu mới</label>
                                <input
                                    type="password" required minLength={8}
                                    className={inputClass}
                                    placeholder="Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password" required
                                    className={inputClass}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={loadingPassword} className={btnClass}>
                                {loadingPassword ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}