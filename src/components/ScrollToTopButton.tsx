'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label="ページトップへ戻る"
        >
          <ChevronUp size={24} />
          <span className={styles.text}>ページトップへ</span>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;