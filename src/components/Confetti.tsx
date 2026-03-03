import { useEffect, useState } from 'react';

const COLORS = ['#DFFF00', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
const PARTICLE_COUNT = 60;

interface Particle {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    drift: number;
}

function generateParticles(): Particle[] {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 2,
        size: 4 + Math.random() * 6,
        drift: -50 + Math.random() * 100,
    }));
}

export default function Confetti({ onComplete }: { onComplete?: () => void }) {
    const [particles] = useState(generateParticles);

    useEffect(() => {
        const timer = setTimeout(() => onComplete?.(), 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: '-10px',
                        width: `${p.size}px`,
                        height: `${p.size * (Math.random() > 0.5 ? 1 : 1.5)}px`,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
                        transform: `translateX(${p.drift}px)`,
                        opacity: 0,
                    }}
                />
            ))}
            <style>{`
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.5); }
        }
      `}</style>
        </div>
    );
}
