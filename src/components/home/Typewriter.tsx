"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  texts: string[];
  className?: string;
  delay?: number;
}

export function Typewriter({ texts, className = "", delay = 2000 }: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const text = texts[currentTextIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(text.slice(0, currentText.length + 1));
        if (currentText.length + 1 === text.length) {
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, delay);
        }
      } else {
        // Deleting
        setCurrentText(text.slice(0, currentText.length - 1));
        if (currentText.length === 1) {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, isWaiting, texts, delay]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}
