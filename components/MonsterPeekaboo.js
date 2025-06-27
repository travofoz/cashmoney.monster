"use client";
import { useState, useEffect } from 'react';

export default function MonsterPeekaboo() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(null);

  const showMonster = () => {
    const edges = ['top', 'right', 'bottom', 'left'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const offset = Math.random() * 60 + 20; // 20-80% along the edge
    
    setPosition({ edge, offset });
    setIsVisible(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    // Initial show after 5 seconds
    const initialTimer = setTimeout(showMonster, 5000);
    
    // Show every 30 seconds
    const interval = setInterval(() => {
      if (!isVisible) {
        showMonster();
      }
    }, 30000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isVisible]);

  const handleClick = () => {
    setIsVisible(false);
  };

  if (!position) return null;

  const getStyles = () => {
    const base = {
      position: 'fixed',
      width: '256px',
      height: '256px',
      cursor: 'pointer',
      zIndex: 50,
      transition: isVisible ? 'top 2s ease-out, bottom 2s ease-out, left 2s ease-out, right 2s ease-out' : 'top 0.3s ease-in, bottom 0.3s ease-in, left 0.3s ease-in, right 0.3s ease-in',
    };

    // How much of the monster to show when peeking (170px = about 2/3)
    const peekAmount = 170;
    const hidePosition = -256; // Fully off screen
    const peekPosition = hidePosition + peekAmount; // Partially on screen

    switch (position.edge) {
      case 'bottom':
        return {
          ...base,
          bottom: isVisible ? `${peekPosition}px` : `${hidePosition}px`,
          left: `${position.offset}%`,
          transform: 'translateX(-50%)',
        };
      case 'top':
        return {
          ...base,
          top: isVisible ? `${peekPosition}px` : `${hidePosition}px`,
          left: `${position.offset}%`,
          transform: 'translateX(-50%) rotate(180deg)',
        };
      case 'left':
        return {
          ...base,
          left: isVisible ? `${peekPosition}px` : `${hidePosition}px`,
          top: `${position.offset}%`,
          transform: 'translateY(-50%) rotate(90deg)',
        };
      case 'right':
        return {
          ...base,
          right: isVisible ? `${peekPosition}px` : `${hidePosition}px`,
          top: `${position.offset}%`,
          transform: 'translateY(-50%) rotate(-90deg)',
        };
      default:
        return base;
    }
  };

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/mascot.png"
      alt="Cash Money Monster"
      style={getStyles()}
      onClick={handleClick}
      onTouchStart={handleClick}
    />
  );
}