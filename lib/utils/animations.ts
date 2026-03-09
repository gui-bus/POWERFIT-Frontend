import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const springUp: Variants = {
  initial: { opacity: 0, y: 100, scale: 0.8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", damping: 12, stiffness: 100 }
  }
};

export const containerStagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const floatingBadge: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(var(--primary-rgb), 0)",
      "0 0 25px rgba(var(--primary-rgb), 0.4)",
      "0 0 0px rgba(var(--primary-rgb), 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
