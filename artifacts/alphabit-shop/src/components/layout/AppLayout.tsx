import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartSidebar } from '../cart/CartSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
