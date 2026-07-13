import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/prodotti?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/prodotti', label: 'Prodotti' },
    { href: '/offerte', label: 'Offerte' },
    { href: '/chi-siamo', label: 'Chi Siamo' },
    { href: '/contatti', label: 'Contatti' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Announcement bar */}
      <div
        className="text-white text-center py-2 text-xs sm:text-sm font-medium"
        style={{ background: 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 40%, #ec4899 80%, #f43f5e 100%)' }}
      >
        🚚 Spedizione GRATIS sopra €49 &nbsp;|&nbsp; 🔄 Reso facile 30 giorni
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Alpha Bit Gadget" className="h-9 w-9 object-contain" />
          <span className="font-black text-xl text-gray-900 leading-none">
            Alpha Bit <span style={{ color: '#7c3aed' }}>Gadget</span>
          </span>
        </Link>

        {/* Search - desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className="flex w-full rounded-full border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca tra 500+ gadget..."
                className="pl-9 border-0 rounded-none focus-visible:ring-0 h-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-5 text-sm font-semibold text-white rounded-r-full"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}
            >
              Cerca
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* User */}
          <div className="relative hidden md:block">
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>{user.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors">
                <User className="w-5 h-5" />
                <span>Accedi</span>
              </Link>
            )}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-700" onClick={() => setShowUserMenu(false)}>
                  <User className="w-4 h-4" /> Il mio account
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-700" onClick={() => setShowUserMenu(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                  <LogOut className="w-4 h-4" /> Esci
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-gray-700 hover:text-purple-700 transition-colors"
            aria-label="Carrello"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Nav links - desktop */}
      <nav className="hidden md:flex border-t border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
                isActive(link.href)
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-600 hover:text-purple-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <form onSubmit={handleSearch} className="flex mt-3 rounded-full border border-gray-200 overflow-hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca prodotti..."
                className="pl-9 border-0 focus-visible:ring-0 h-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="px-4 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
              Cerca
            </button>
          </form>
          <nav className="flex flex-col mt-4 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-2.5 px-2 text-sm font-semibold rounded-lg ${isActive(link.href) ? 'text-purple-700 bg-purple-50' : 'text-gray-700'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-2 text-sm font-semibold text-gray-700">Il mio account</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); setLocation('/'); }} className="py-2.5 px-2 text-sm font-semibold text-red-600 text-left">Esci</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-2 text-sm font-semibold text-purple-700">Accedi</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
