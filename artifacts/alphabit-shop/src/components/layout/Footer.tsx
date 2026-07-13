import React from 'react';
import { Link } from 'wouter';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black" style={{ color: '#a78bfa' }}>▲</span>
              <span className="font-black text-xl text-white">
                Alpha Bit <span style={{ color: '#a78bfa' }}>Gadget</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Il tuo negozio di gadget tech di fiducia. Qualità eccellente, spedizione rapida in tutta Italia.
            </p>
          </div>

          {/* Servizio Clienti */}
          <div>
            <h4 className="font-bold text-white mb-4">Servizio Clienti</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/contatti" className="hover:text-purple-400 transition-colors">Contattaci</Link></li>
              <li><Link href="/spedizioni" className="hover:text-purple-400 transition-colors">Spedizioni e Consegne</Link></li>
              <li><Link href="/resi-rimborsi" className="hover:text-purple-400 transition-colors">Resi e Rimborsi</Link></li>
              <li><Link href="/account" className="hover:text-purple-400 transition-colors">Traccia Ordine</Link></li>
            </ul>
          </div>

          {/* Navigazione */}
          <div>
            <h4 className="font-bold text-white mb-4">Navigazione</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/prodotti" className="hover:text-purple-400 transition-colors">Tutti i Prodotti</Link></li>
              <li><Link href="/offerte" className="hover:text-purple-400 transition-colors">Offerte Speciali</Link></li>
              <li><Link href="/chi-siamo" className="hover:text-purple-400 transition-colors">Chi Siamo</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-bold text-white mb-4">Contatti</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                <span>095 8998538</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                <span>info@alphabitgadget.it</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                <span>Catania, Sicilia, Italia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Alpha Bit Gadget. Tutti i diritti riservati.</p>
          <p>P.IVA: IT12345678901</p>
        </div>
      </div>
    </footer>
  );
}
