import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <Navbar onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
