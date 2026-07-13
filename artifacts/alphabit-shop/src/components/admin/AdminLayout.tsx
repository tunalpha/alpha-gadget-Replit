import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, ShoppingBag, Package, Tag, Users, LogOut, ArrowLeft, Cpu, Menu, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Aspetta che il profilo sia caricato prima di reindirizzare
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    setLocation('/login');
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/ordini', label: 'Ordini', icon: ShoppingBag },
    { href: '/admin/prodotti', label: 'Prodotti', icon: Package },
    { href: '/admin/offerte', label: 'Coupon', icon: Tag },
    { href: '/admin/clienti', label: 'Clienti', icon: Users },
  ];

  const isActive = (href: string) =>
    href === '/admin' ? location === '/admin' : location.startsWith(href);

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNav}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? 'bg-primary text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── MOBILE TOPBAR ─────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-md">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── MOBILE DRAWER ─────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 flex">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          {/* panel */}
          <nav className="relative w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-md">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">Admin</span>
            </div>
            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
              <NavLinks onNav={() => setMobileOpen(false)} />
            </div>
            <div className="p-3 border-t border-gray-100 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" /> Torna al Negozio
              </Link>
              <button
                onClick={() => { logout(); setLocation('/'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="w-5 h-5" /> Disconnetti
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col min-h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-md">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Torna al Negozio
          </Link>
          <button
            onClick={() => { logout(); setLocation('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left text-sm"
          >
            <LogOut className="w-4 h-4" /> Disconnetti
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
