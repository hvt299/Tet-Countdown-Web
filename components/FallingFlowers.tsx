'use client';
import { useEffect, useState } from 'react';

// Link ảnh cánh hoa (Bạn có thể thay bằng ảnh trong folder public của bạn)
const MAI_BLOSSOM = "/mai-blossom.png"; // Tượng trưng hoa mai
const DAO_BLOSSOM = "/dao-blossom.png"; // Tượng trưng hoa đào

const FallingFlowers = () => {
    const [flowers, setFlowers] = useState<any[]>([]);

    useEffect(() => {
        // Tạo 20 cánh hoa ngẫu nhiên
        const newFlowers = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Vị trí ngang ngẫu nhiên (0-100vw)
            delay: Math.random() * 5, // Độ trễ rơi
            duration: 5 + Math.random() * 5, // Tốc độ rơi
            type: Math.random() > 0.5 ? MAI_BLOSSOM : DAO_BLOSSOM, // Trộn lẫn mai và đào
            size: 20 + Math.random() * 20, // Kích thước ngẫu nhiên
        }));
        setFlowers(newFlowers);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {flowers.map((flower) => (
                <img
                    key={flower.id}
                    src={flower.type}
                    alt="flower"
                    className="absolute animate-fall opacity-80"
                    style={{
                        left: `${flower.x}%`,
                        top: '-50px',
                        width: `${flower.size}px`,
                        animationDuration: `${flower.duration}s`,
                        animationDelay: `${flower.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default FallingFlowers;