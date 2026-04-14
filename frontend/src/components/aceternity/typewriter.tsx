import React, { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterText = ({
  words,
  className = "",
  cursorClassName = "",
}: TypewriterProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const word = words[currentWordIndex];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.slice(0, currentText.length + 1));
        if (currentText.length + 1 === word.length) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 1800);
        }
      } else {
        setCurrentText(word.slice(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words]);

  return (
    <span className={className}>
      {currentText}
      <span
        className={cursorClassName}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "currentColor",
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          animation: "blink 1s step-end infinite",
        }}
      />
    </span>
  );
};
