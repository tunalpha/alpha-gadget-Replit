import React from 'react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Alpha Bit Gadget" className="h-10 w-10 object-contain rounded-full bg-white p-0.5" />
              <span className="font-black text-xl text-white leading-none">
                Alpha Bit <span style={{ color: '#a78bfa' }}>Gadget</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Il tuo shop di fiducia per gadget e accessori tech.
            </p>
            <p className="text-sm text-gray-400 flex items-start gap-1.5">
              <span>📍</span>
              <span>Via Ferrante Aporti, 8<br />95123 Catania (CT)</span>
            </p>
          </div>

          {/* Link Utili */}
          <div>
            <h4 className="font-bold text-white mb-4">Link Utili</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/chi-siamo" className="hover:text-purple-400 transition-colors">Chi Siamo</Link></li>
              <li><Link href="/contatti" className="hover:text-purple-400 transition-colors">Contatti</Link></li>
              <li><Link href="/spedizioni" className="hover:text-purple-400 transition-colors">Spedizioni</Link></li>
              <li><Link href="/resi-rimborsi" className="hover:text-purple-400 transition-colors">Resi e Rimborsi</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categorie */}
          <div>
            <h4 className="font-bold text-white mb-4">Categorie</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/prodotti?category=Audio+e+Cuffie" className="hover:text-purple-400 transition-colors">Audio e Cuffie</Link></li>
              <li><Link href="/prodotti?category=Caricatori+e+Powerbank" className="hover:text-purple-400 transition-colors">Caricatori</Link></li>
              <li><Link href="/prodotti?category=Smart+Home" className="hover:text-purple-400 transition-colors">Smart Home</Link></li>
              <li><Link href="/prodotti?category=Accessori+Gaming" className="hover:text-purple-400 transition-colors">Gaming</Link></li>
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="font-bold text-white mb-4">Contatti</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2.5">
                <span>📞</span>
                <a href="tel:0958998538" className="hover:text-purple-400 transition-colors">095 8998538</a>
              </li>
              <li className="flex items-center gap-2.5">
                <span>📧</span>
                <a href="mailto:alphabit.sbs@gmail.com" className="hover:text-purple-400 transition-colors">alphabit.sbs@gmail.com</a>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p><span className="font-semibold text-gray-400">P.IVA:</span> 05632770870</p>
              <p><span className="font-semibold text-gray-400">REA:</span> CT-418000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>© 2024 Alpha Bit Gadget - Il Dattero di Giaquinta Enrico Maria - P.IVA 05632770870</p>
        </div>
      </div>
    </footer>
  );
}
