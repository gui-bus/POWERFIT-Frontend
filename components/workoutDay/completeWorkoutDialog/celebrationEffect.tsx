import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface CelebrationEffectProps {
  show: boolean;
}

export function CelebrationEffect({ show }: CelebrationEffectProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      // eslint-disable-next-line react-hooks/purity
      scale: Math.random() * 1.5 + 0.5,
      // eslint-disable-next-line react-hooks/purity
      x: `${Math.random() * 200 - 50}%`,
      // eslint-disable-next-line react-hooks/purity
      y: `${Math.random() * -200 - 50}%`,
      // eslint-disable-next-line react-hooks/purity
      rotate: Math.random() * 360,
      isPrimary: i % 2 === 0
    }));
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                opacity: 1, 
                scale: 0, 
                x: "50%", 
                y: "50%",
                rotate: 0 
              }}
              animate={{ 
                opacity: 0, 
                scale: p.scale, 
                x: p.x, 
                y: p.y,
                rotate: p.rotate 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute size-3 rounded-sm"
              style={{ 
                backgroundColor: p.isPrimary ? "var(--primary)" : "var(--foreground)",
                left: "45%",
                top: "45%"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
