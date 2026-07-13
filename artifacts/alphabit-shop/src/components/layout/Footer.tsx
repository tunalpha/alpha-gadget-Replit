import React from 'react';
import { Link } from 'wouter';
import { Cpu, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-border/10 mt-auto">
      {/* Features strip */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/20 text-primary p-3 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-semibold">Spedizione Gratis</h4>
              <p className="text-sm text-sidebar-foreground/70">Per ordini superiori a 49€</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="bg-primary/20 text-primary p-3 rounded-full">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-semibold">Reso Facile</h4>
              <p className="text-sm text-sidebar-foreground/70">Fino a 30 giorni per il reso</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 sm:col-span-2 lg:col-span-1">
              <div className="bg-primary/20 text-primary p-3 rounded-full">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-semibold">Pagamenti Sicuri</h4>
              <p className="text-sm text-sidebar-foreground/70">Crittografia SSL a 256-bit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-md">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="font-display font-black text-2xl tracking-tight">Alpha Bit</span>
            </Link>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Il tuo negozio di gadget tech di fiducia. Offriamo la migliore selezione di cavi, accessori, smart home e periferiche per farti vivere al meglio la tua passione tech.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Servizio Clienti</h4>
            <ul className="flex flex-col gap-3 text-sm text-sidebar-foreground/80">
              <li><Link href="/contatti" className="hover:text-primary transition-colors">Contattaci</Link></li>
              <li><Link href="/spedizioni" className="hover:text-primary transition-colors">Spedizioni e Consegne</Link></li>
              <li><Link href="/resi-rimborsi" className="hover:text-primary transition-colors">Resi e Rimborsi</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">Traccia Ordine</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Domande Frequenti</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Alpha Bit</h4>
            <ul className="flex flex-col gap-3 text-sm text-sidebar-foreground/80">
              <li><Link href="/chi-siamo" className="hover:text-primary transition-colors">Chi Siamo</Link></li>
              <li><Link href="/offerte" className="hover:text-primary transition-colors">Promozioni</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/termini" className="hover:text-primary transition-colors">Termini e Condizioni</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-white">Rimani Aggiornato</h4>
            <p className="text-sm text-sidebar-foreground/70 mb-4">
              Iscriviti alla newsletter per ricevere offerte esclusive e novità tech in anteprima.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="La tua email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
              />
              <Button type="submit" variant="default">Iscriviti</Button>
            </form>
            
            <div className="mt-6 flex flex-col gap-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Via Roma 123, 20100 Milano (MI)</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +39 02 1234567</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@alphabit.it</div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="border-t border-white/10 bg-black/30">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sidebar-foreground/60">
          <p>&copy; {new Date().getFullYear()} Alpha Bit Shop. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4">
            <span>P.IVA 12345678901</span>
            <span>Made with ❤️ in Italy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
