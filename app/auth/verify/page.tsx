'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Tết Countdown đang kiểm tra sổ sách...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Không tìm thấy mã xác thực. Vui lòng kiểm tra lại đường link trong email!');
            return;
        }

        const verifyEmailToken = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await axios.get(`${API_URL}/auth/verify?token=${token}`);

                setStatus('success');
                setMessage(response.data.message || 'Tài khoản của bạn đã được kích hoạt thành công!');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Link xác thực không hợp lệ hoặc đã hết hạn.');
            }
        };

        verifyEmailToken();
    }, [token]);

    return (
        <div className="relative z-20 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-yellow-500/30 rounded-2xl shadow-2xl text-center">

            {status === 'loading' && (
                <>
                    <div className="text-7xl mb-6 animate-spin">🏮</div>
                    <h2 className="text-3xl font-bold text-yellow-400 mb-4 font-serif">Đang xác thực...</h2>
                    <p className="text-red-100 text-lg">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="text-7xl mb-6 animate-bounce">🧧</div>
                    <h2 className="text-3xl font-bold text-yellow-400 mb-4 font-serif">Kích Hoạt Thành Công!</h2>
                    <p className="text-green-300 text-lg mb-8">{message}</p>
                    <Link
                        href="/login"
                        className="bg-linear-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-red-900 font-bold px-8 py-3.5 text-lg rounded-full shadow-lg transform transition-transform hover:scale-105 inline-block"
                    >
                        Đăng Nhập Ngay
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="text-7xl mb-6 opacity-80">🥀</div>
                    <h2 className="text-3xl font-bold text-red-400 mb-4 font-serif">Xác Thực Thất Bại</h2>
                    <p className="text-red-200 text-lg mb-8">{message}</p>
                    <Link
                        href="/login"
                        className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-red-900 font-bold px-8 py-3.5 text-lg rounded-full transition-colors inline-block"
                    >
                        Về Trang Đăng Nhập
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden py-10">
            <div className="inset-0 z-[-2] fixed">
                <Image src="/images/bg-tet.png" alt="Tet Background" fill className="object-cover" priority />
            </div>
            <div className="inset-0 z-10 bg-linear-to-b from-red-900/80 via-black/50 to-red-900/90 fixed"></div>

            <Suspense fallback={
                <div className="relative z-20 text-yellow-400 text-xl font-bold">Đang tải...</div>
            }>
                <VerifyContent />
            </Suspense>
        </main>
    );
}