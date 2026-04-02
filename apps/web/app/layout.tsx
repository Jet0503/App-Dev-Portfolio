'use client';

import "./globals.css";
import { AppGenProvider } from "@/components/appgen-provider";
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Listen for dark mode changes
    const handleStorageChange = () => {
      const newDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(newDarkMode);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-page updates
    window.addEventListener('darkModeChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('darkModeChange', handleStorageChange);
    };
  }, []);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <title>Konza</title>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className={`antialiased ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <AppGenProvider>{children}</AppGenProvider>
      </body>
    </html>
  );
}
