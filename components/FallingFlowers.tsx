'use client';
import { useEffect, useState } from 'react';

const MAI_BLOSSOM = "/mai-blossom.png";
const DAO_BLOSSOM = "/dao-blossom.png";

const FallingFlowers = () => {
    const [flowers, setFlowers] = useState<any[]>([]);

    useEffect(() => {
        const newFlowers = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 5,
            type: Math.random() > 0.5 ? MAI_BLOSSOM : DAO_BLOSSOM,
            size: 20 + Math.random() * 20,
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