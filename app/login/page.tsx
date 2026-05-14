'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';

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

    // Hàm xử lý đăng nhập bằng Google
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError('');
            setSuccessMsg('');

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            try {
                const response = await axios.post(`${API_URL}/auth/google`, {
                    token: tokenResponse.access_token
                });

                const { access_token } = response.data;
                document.cookie = `access_token=${access_token}; path=/; max-age=86400; secure; samesite=strict`;

                router.push('/');
                router.refresh();
            } catch (err: any) {
                const errorMsg = err.response?.data?.message;
                setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Xác thực Google thất bại!');
                setLoading(false);
            }
        },
        onError: () => {
            setError('Đăng nhập Google bị hủy hoặc gặp lỗi!');
        }
    });

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMsg('');
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
            <div className="inset-0 z-[-2] fixed">
                <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            <div className="relative z-20 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl transition-all duration-300">

                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none"
                    title="Trở về Trang Chủ"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                    <span>Trở về</span>
                </button>

                <div className="text-center mt-6 mb-6">
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

                {/* --- KHU VỰC NÚT GOOGLE (Hiển thị ở CẢ 2 chế độ Đăng nhập và Đăng ký) --- */}
                <div className="mt-4">
                    <div className="relative flex items-center py-2 mb-2">
                        <div className="grow border-t border-red-800/50"></div>
                        <span className="shrink-0 px-4 text-xs text-yellow-500/80 uppercase tracking-widest">hoặc</span>
                        <div className="grow border-t border-red-800/50"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 text-base bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg shadow-md disabled:opacity-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black/50"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.369 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        Đăng nhập bằng Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-red-200">
                    {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-yellow-400 hover:text-yellow-300 font-bold focus:outline-none text-base transition-colors"
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                    </button>
                </p>
            </div>
        </main>
    );
}