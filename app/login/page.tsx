'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import FallingFlowers from '@/components/FallingFlowers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        try {
            if (isLogin) {
                const response = await axios.post(`${API_URL}/auth/login`, {
                    username: formData.username,
                    password: formData.password,
                });

                const { access_token } = response.data;
                document.cookie = `access_token=${access_token}; path=/; max-age=86400; secure; samesite=strict`;

                router.push('/');
                router.refresh();
            } else {
                await axios.post(`${API_URL}/auth/register`, formData);
                setSuccessMsg('Đăng ký thành công! Vui lòng kiểm tra email (cả mục Spam) để kích hoạt tài khoản.');
                setIsLogin(true);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMsg('');
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
            <div className="absolute inset-0 z-0">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90"></div>

            {/* Thêm Component Hoa Rơi của bạn */}
            <FallingFlowers />

            {/* Container Form */}
            <div className="relative z-20 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl transition-all duration-300">

                {/* NÚT BACK */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none"
                    title="Trở về Trang Chủ"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                    <span>Trở về</span>
                </button>

                <div className="text-center mt-6 mb-6">
                    {/* ICON SINH ĐỘNG ĐƯỢC THÊM VÀO ĐÂY */}
                    <div className="text-5xl mb-4 animate-bounce">
                        {isLogin ? '🏮' : '🧧'}
                    </div>
                    <h1 className="text-3xl font-bold text-yellow-400 font-serif mb-2">
                        {isLogin ? 'Đăng Nhập' : 'Khai Bút Đầu Xuân'}
                    </h1>
                    <p className="text-red-200 text-base">
                        {isLogin ? 'Chào mừng bạn quay lại Tết Countdown' : 'Đăng ký tài khoản để nhận lộc'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-100 text-sm text-center">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-100 text-sm text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Họ và Tên</label>
                                <input
                                    type="text" name="fullName" required={!isLogin}
                                    className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="Ví dụ: Nguyễn Văn A" value={formData.fullName} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-500 text-sm font-bold mb-1">Email</label>
                                <input
                                    type="email" name="email" required={!isLogin}
                                    className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                                    placeholder="email@example.com" value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-yellow-500 text-sm font-bold mb-1">
                            {isLogin ? 'Tên đăng nhập hoặc Email' : 'Tên đăng nhập'}
                        </label>
                        <input
                            type="text" name="username" required
                            className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                            placeholder={isLogin ? 'Nhập username hoặc email của bạn' : 'Ví dụ: nguyenvana'}
                            value={formData.username} onChange={handleChange}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-yellow-500 text-sm font-bold">Mật khẩu</label>
                            {isLogin && (
                                <Link
                                    href="/forgot-password"
                                    /* ĐÃ XÓA CLASS UNDERLINE Ở ĐÂY */
                                    className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            )}
                        </div>

                        <input
                            type="password" name="password" required minLength={!isLogin ? 8 : undefined}
                            className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                            placeholder={isLogin ? '••••••••' : 'Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt'}
                            value={formData.password} onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3.5 mt-4 text-lg bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-red-200">
                    {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button
                        type="button"
                        onClick={toggleMode}
                        /* ĐÃ XÓA CLASS UNDERLINE Ở ĐÂY */
                        className="text-yellow-400 hover:text-yellow-300 font-bold focus:outline-none text-base transition-colors"
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </button>
                </p>
            </div>
        </main>
    );
}