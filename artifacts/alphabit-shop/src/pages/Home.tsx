import React from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useGetFeaturedProducts, useGetOfferProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/shared/ProductCard';

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useGetFeaturedProducts({ limit: 6 });
  const { data: offerProducts, isLoading: isOffersLoading } = useGetOfferProducts({ limit: 6 });
  const { data: categoriesData } = useListCategories();

  const categoryEmojis: Record<string, string> = {
    'accessori computer': '💻',
    'accessori gaming': '🎮',
    'accessori smartphone': '📱',
    'audio e cuffie': '🎧',
    'caricatori e powerbank': '🔋',
    'cavi e adattatori': '🔌',
    'fotografia e video': '📷',
    'organizzazione e viaggio': '🧳',
    'smart home': '🏠',
    'wearable e fitness': '⌚',
  };

  const getEmoji = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(categoryEmojis)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
    return '📦';
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="py-16 lg:py-24"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 50%, #fce7f3 100%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left */}
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 rounded-full border border-purple-200 text-sm font-semibold text-purple-700 bg-purple-50 mb-5">
                Oltre 500 Prodotti
              </span>
              <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-5 text-gray-900">
                Gadget Tech per{' '}
                <span className="text-gradient block lg:inline">Ogni Esigenza</span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
                Scopri la migliore selezione di accessori tech, smart home e gaming a prezzi imbattibili.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setLocation('/prodotti')}
                  className="btn-gradient px-8 py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-purple-300 transition-all"
                >
                  Scopri i Prodotti
                </button>
                <button
                  onClick={() => setLocation('/offerte')}
                  className="px-8 py-3.5 rounded-full text-base font-bold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all"
                >
                  Offerte Speciali
                </button>
              </div>
            </div>

            {/* Right image */}
            <div className="flex-1 flex justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#FFD700' }}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                  alt="Gadget Tech"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-b border-gray-100 py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚛', title: 'Spedizione Gratis', sub: 'Ordini sopra €49' },
              { icon: '🔄', title: 'Reso Facile', sub: '30 giorni' },
              { icon: '✅', title: 'Qualità Garantita', sub: 'Prodotti certificati' },
              { icon: '📞', title: 'Assistenza', sub: '095 8998538' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorie */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900">Categorie</h2>
            <Link href="/prodotti" className="font-semibold text-sm flex items-center gap-1" style={{ color: '#7c3aed' }}>
              Vedi tutte <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {categoriesData?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoriesData.map(cat => (
                <Link
                  key={cat.name}
                  href={`/prodotti?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
                >
                  <span className="text-4xl mb-2">{getEmoji(cat.name)}</span>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count} prodotti</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Accessori Computer', emoji: '💻' },
                { name: 'Accessori Gaming', emoji: '🎮' },
                { name: 'Accessori Smartphone', emoji: '📱' },
                { name: 'Audio e Cuffie', emoji: '🎧' },
                { name: 'Caricatori e Powerbank', emoji: '🔋' },
                { name: 'Cavi e Adattatori', emoji: '🔌' },
              ].map(cat => (
                <div
                  key={cat.name}
                  className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse"
                >
                  <span className="text-4xl mb-2">{cat.emoji}</span>
                  <p className="font-semibold text-gray-400 text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-300 mt-0.5">— prodotti</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Prodotti in Evidenza */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900">Prodotti in Evidenza</h2>
              <p className="text-gray-500 text-sm mt-1">I gadget più amati dai nostri clienti</p>
            </div>
            <Link href="/prodotti" className="font-semibold text-sm flex items-center gap-1 mt-1" style={{ color: '#7c3aed' }}>
              Vedi tutti <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : featuredProducts?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">Nessun prodotto in evidenza al momento.</p>
          )}
        </div>
      </section>

      {/* Offerte Flash */}
      {(!isOffersLoading && offerProducts && offerProducts.length > 0) && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900">🔥 Offerte Flash</h2>
                <p className="text-gray-500 text-sm mt-1">Prezzi speciali per un tempo limitato</p>
              </div>
              <Link href="/offerte" className="font-semibold text-sm flex items-center gap-1 mt-1" style={{ color: '#7c3aed' }}>
                Vedi tutte <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {offerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
