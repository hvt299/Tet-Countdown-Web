'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import FallingFlowers from '@/components/FallingFlowers';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setSuccessMsg(response.data.message || 'Link khôi phục đã được gửi. Vui lòng kiểm tra email của bạn (bao gồm cả thư mục Spam).');
            setEmail('');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message;
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
            <div className="absolute inset-0 z-0">
                <Image src="/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90"></div>

            <FallingFlowers />

            <div className="relative z-20 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl transition-all duration-300">

                <button
                    onClick={() => router.push('/login')}
                    className="absolute top-6 left-6 text-yellow-500 hover:text-yellow-300 flex items-center gap-1 transition-colors text-sm font-medium focus:outline-none"
                    title="Trở về Đăng Nhập"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                    <span>Trở về</span>
                </button>

                <div className="text-center mt-6 mb-6">
                    <div className="text-5xl mb-4 animate-bounce">🗝️</div>
                    <h1 className="text-3xl font-bold text-yellow-400 font-serif mb-2">
                        Quên Mật Khẩu
                    </h1>
                    <p className="text-red-200 text-sm">
                        Đừng lo! Hãy nhập email của bạn, Tết Countdown sẽ gửi chìa khóa mới.
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
                    <div>
                        <label className="block text-yellow-500 text-sm font-bold mb-1">Email đã đăng ký</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2.5 text-base rounded-lg bg-red-950/50 border border-red-800 text-white focus:outline-none focus:border-yellow-500"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-4 text-lg bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Link Khôi Phục'}
                    </button>
                </form>
            </div>
        </main>
    );
}