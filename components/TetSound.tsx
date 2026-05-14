'use client';

import { useEffect, useRef } from 'react';
import { checkTetState } from '@/utils/tetHelper';
import { useMusicStore } from '@/store/useMusicStore';

const FIREWORK_SOUND_URL = "/audio/phao-no.mp3";

export default function TetSound() {
    const { isPlaying, currentSongUrl, togglePlay } = useMusicStore();
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const fireworkRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (bgMusicRef.current) bgMusicRef.current.volume = 0.4;
        if (fireworkRef.current) fireworkRef.current.volume = 0.8;
    }, []);

    useEffect(() => {
        const handleAudioPlay = async () => {
            const { isTet } = checkTetState();

            if (!bgMusicRef.current || !fireworkRef.current) return;

            if (!isPlaying) {
                bgMusicRef.current.pause();
                fireworkRef.current.pause();
            } else {
                try {
                    await bgMusicRef.current.play();

                    if (isTet) {
                        await fireworkRef.current.play();
                    } else {
                        fireworkRef.current.pause();
                    }
                } catch (error) {
                    console.error("Trình duyệt chặn autoplay, cần tương tác người dùng:", error);
                }
            }
        };

        handleAudioPlay();

        const interval = setInterval(handleAudioPlay, 1000);
        return () => clearInterval(interval);

    }, [isPlaying, currentSongUrl]);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Nhạc nền lấy từ Zustand Store */}
            <audio ref={bgMusicRef} src={currentSongUrl || ''} loop preload="auto" />

            {/* Âm thanh pháo nổ (Độc quyền ngày Tết) */}
            <audio ref={fireworkRef} src={FIREWORK_SOUND_URL} loop preload="auto" />

            <button
                onClick={togglePlay}
                className={`
                    flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 border-yellow-400 transition-all duration-300 hover:scale-110
                    ${!isPlaying ? 'bg-gray-800/80 text-gray-400' : 'bg-red-600 text-yellow-300 animate-pulse-slow'}
                `}
                title={!isPlaying ? "Bật nhạc Tết" : "Tắt nhạc"}
            >
                {!isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                )}
            </button>

            {!isPlaying && (
                <div className="absolute bottom-16 right-0 w-32 bg-white text-black text-xs p-2 rounded-lg shadow-xl animate-bounce text-center font-bold">
                    Bấm để nghe nhạc Tết ♫
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white rotate-45"></div>
                </div>
            )}
        </div>
    );
}