import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, ShoppingBag, Package, Tag, Users, LogOut, ArrowLeft, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') {
    setLocation('/login');
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/ordini', label: 'Ordini', icon: ShoppingBag },
    { href: '/admin/prodotti', label: 'Prodotti', icon: Package },
    { href: '/admin/offerte', label: 'Coupon & Offerte', icon: Tag },
    { href: '/admin/clienti', label: 'Clienti', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 flex flex-col h-auto md:min-h-screen sticky top-0">
        <div className="p-6 border-b border-sidebar-border/50 flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Admin</span>
          </div>
          <Button variant="ghost" size="sm" className="md:hidden text-sidebar-foreground" asChild>
            <Link href="/">Esci</Link>
          </Button>
        </div>

        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border/50 hidden md:flex flex-col gap-2">
          <Button variant="outline" className="w-full justify-start bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Torna al Negozio</Link>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              logout();
              setLocation('/');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Disconnetti
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 bg-background flex items-center px-8 sticky top-0 z-10 md:hidden">
           <Button variant="ghost" size="sm" asChild>
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Torna al Negozio</Link>
          </Button>
        </header>
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
