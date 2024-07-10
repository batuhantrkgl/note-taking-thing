import React, { useEffect, useState } from 'react';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
  const [visitCount, setVisitCount] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState('');

  useEffect(() => {
    // Increment visit count and store in localStorage
    const currentVisitCount = parseInt(localStorage.getItem('visitCount'), 10) || 0;
    const newVisitCount = currentVisitCount + 1;
    localStorage.setItem('visitCount', newVisitCount);
    setVisitCount(newVisitCount);

    // Get last login date from localStorage
    const storedLastLoginDate = localStorage.getItem('lastLoginDate');
    if (storedLastLoginDate) {
      setLastLoginDate(new Date(storedLastLoginDate).toLocaleString());
    }

    // Update last login date to now
    const now = new Date();
    localStorage.setItem('lastLoginDate', now.toISOString());
  }, []);

  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.left}>{currentDate}</div>
        <div className={styles.center}>Visit Count: {visitCount}</div>
        <div className={styles.right}>Last Login: {lastLoginDate}</div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
