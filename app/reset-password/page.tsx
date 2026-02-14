'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!token) {
            setError('Không tìm thấy mã xác thực. Vui lòng bấm đúng đường link trong email.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                newPassword,
            });
            setSuccessMsg(response.data.message || 'Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Link không hợp lệ hoặc đã hết hạn!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-20 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl transition-all duration-300">

            {/* NÚT BACK */}
            <button
                onClick={() => router.push('/login')}
                className="absolute top-6 left-6 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none"
                title="Trở về Đăng Nhập"
            >
                <ArrowLeft size={18} strokeWidth={2.5} />
                <span>Trở về</span>
            </button>

            <div className="text-center mt-6 mb-6">
                {/* ICON SINH ĐỘNG */}
                <div className="text-5xl mb-4 animate-bounce">🔐</div>
                <h1 className="text-3xl font-bold text-yellow-400 font-serif mb-2">Tạo Mật Khẩu Mới</h1>
                <p className="text-red-200 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-100 text-sm text-center">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-100 text-sm text-center">
                    {successMsg}
                    <div className="mt-2 text-xs">Đang chuyển hướng về trang Đăng nhập...</div>
                </div>
            )}

            {!successMsg && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-yellow-500 text-sm font-bold mb-1">Mật khẩu mới</label>
                        <input
                            type="password" required
                            className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Min 8 ký tự, 1 hoa, 1 số, 1 đặc biệt"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-yellow-500 text-sm font-bold mb-1">Nhập lại mật khẩu mới</label>
                        <input
                            type="password" required
                            className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3.5 mt-4 text-lg bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
                    </button>
                </form>
            )}

            {!successMsg && (
                <p className="mt-6 text-center text-sm text-red-200">
                    <Link
                        href="/login"
                        /* ĐÃ BỎ UNDERLINE, CHUẨN STYLE VỚI TRANG LOGIN */
                        className="text-yellow-400 hover:text-yellow-300 font-bold focus:outline-none text-base transition-colors"
                    >
                        Quay lại Đăng nhập
                    </Link>
                </p>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
            <div className="absolute inset-0 z-0">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90"></div>

            <Suspense fallback={<div className="relative z-20 text-yellow-400 font-bold">Đang tải...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </main>
    );
}