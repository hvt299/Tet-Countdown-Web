import Link from 'next/link'
import { Sparkles, Home, MapPinOff, Gift } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-red-950 flex items-center justify-center p-4 relative overflow-hidden text-white">

            {/* 1. Hiệu ứng nền */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Sparkles className="absolute top-10 left-10 w-20 h-20 animate-pulse text-yellow-400" />
                <Gift className="absolute bottom-20 right-20 w-32 h-32 animate-bounce text-red-500" />
                <Sparkles className="absolute top-1/2 left-1/2 w-40 h-40 opacity-10 text-yellow-200" />
            </div>

            <div className="relative z-10 text-center max-w-lg mx-auto">

                {/* Icon chính */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 p-6 rounded-full border-2 border-yellow-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                        <MapPinOff className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
                    </div>
                </div>

                {/* Số 404 lớn */}
                <h1 className="text-8xl md:text-9xl font-bold font-serif text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-yellow-600 drop-shadow-lg mb-2">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">Lạc đường rồi! 🧨</h2>

                <p className="text-red-200 text-base md:text-lg mb-8 leading-relaxed px-4">
                    Có vẻ như trang bạn đang tìm đã bị cuốn theo vòng quay Lô Tô hoặc Ông Đồ đã cất đi mất rồi.
                </p>

                {/* Nút về trang chủ */}
                <Link
                    href="/"
                    className="group inline-flex items-center gap-3 bg-linear-to-r from-yellow-600 to-yellow-500 text-red-950 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] hover:scale-105"
                >
                    <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    <span>Về sảnh trẩy hội</span>
                </Link>
            </div>

            {/* Footer nhỏ */}
            <div className="absolute bottom-4 text-red-500/50 text-xs font-medium uppercase tracking-widest">
                Lost in the festival?
            </div>
        </div>
    )
}