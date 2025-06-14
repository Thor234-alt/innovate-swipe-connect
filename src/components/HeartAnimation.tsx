
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface HeartAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export default function HeartAnimation({ show, onComplete }: HeartAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <Heart 
        className={`w-20 h-20 text-red-500 fill-current animate-pulse ${
          isVisible ? 'animate-[scale-in_0.3s_ease-out,fade-out_0.7s_ease-out_0.3s]' : ''
        }`}
        style={{
          animation: isVisible ? 'heartBounce 1s ease-out' : 'none'
        }}
      />
      <style jsx>{`
        @keyframes heartBounce {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: scale(1.2) rotate(-5deg);
            opacity: 1;
          }
          30% {
            transform: scale(0.95) rotate(3deg);
            opacity: 1;
          }
          45% {
            transform: scale(1.1) rotate(-2deg);
            opacity: 1;
          }
          60% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
