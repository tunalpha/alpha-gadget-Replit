import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, User, Search, Menu, X, Cpu, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/prodotti?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/prodotti', label: 'Catalogo' },
    { href: '/offerte', label: 'Offerte' },
    { href: '/chi-siamo', label: 'Chi Siamo' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xl font-display font-bold text-primary">
                <Cpu className="w-6 h-6" /> Alpha Bit
              </Link>
              
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca prodotti..." 
                  className="pl-9 w-full bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-lg font-medium px-4 py-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:rotate-12 transition-transform">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="font-display font-black text-xl tracking-tight hidden sm:inline-block">
            Alpha Bit
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-sm ml-auto mr-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cerca tastiere, mouse..." 
              className="pl-9 bg-muted/40 border-muted focus-visible:ring-primary focus-visible:bg-background transition-colors rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Carrello"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-background text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 w-9 h-9 border border-border/50">
                  <span className="text-sm font-medium uppercase">
                    {user.name.substring(0, 2)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="w-full cursor-pointer flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Il mio account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => {
                  logout();
                  setLocation('/');
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Esci
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden lg:flex">
                <Link href="/login">Accedi</Link>
              </Button>
              <Button asChild>
                <Link href="/registrati">Registrati</Link>
              </Button>
            </div>
          )}
          
          {!user && (
            <Button variant="ghost" size="icon" asChild className="sm:hidden">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
