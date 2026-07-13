import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Battery, Headphones, Mouse } from 'lucide-react';
import { useGetFeaturedProducts, useGetOfferProducts } from '@workspace/api-client-react';
import { ProductCard } from '@/components/shared/ProductCard';

export default function Home() {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useGetFeaturedProducts({ limit: 8 });
  const { data: offerProducts, isLoading: isOffersLoading } = useGetOfferProducts({ limit: 4 });

  const categories = [
    { id: 'cavi', name: 'Cavi & Adattatori', icon: <Zap className="w-8 h-8 mb-2 text-primary" />, desc: "Ricarica super veloce" },
    { id: 'audio', name: 'Audio', icon: <Headphones className="w-8 h-8 mb-2 text-primary" />, desc: "Qualità del suono premium" },
    { id: 'periferiche', name: 'Periferiche PC', icon: <Mouse className="w-8 h-8 mb-2 text-primary" />, desc: "Mouse e tastiere pro" },
    { id: 'powerbank', name: 'Powerbank', icon: <Battery className="w-8 h-8 mb-2 text-primary" />, desc: "Energia sempre con te" }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550009158-9efff6c9706e?q=80&w=2070&auto=format&fit=crop")' }}
        />
        
        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary font-bold text-sm mb-6 border border-primary/30 uppercase tracking-wider">
              Nuovi Arrivi 2024
            </span>
            <h1 className="text-5xl lg:text-7xl font-display font-black leading-tight text-white mb-6">
              Il tuo setup.<br/>
              <span className="text-primary">Evoluto.</span>
            </h1>
            <p className="text-lg lg:text-xl text-sidebar-foreground/80 mb-10 leading-relaxed max-w-xl">
              Esplora la nostra selezione premium di accessori tech. Qualità eccellente, spedizione rapida in tutta Italia e assistenza dedicata.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-14 px-8 text-base font-bold" asChild>
                <Link href="/prodotti">
                  Esplora il catalogo <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/5 border-white/20 hover:bg-white/10 text-white" asChild>
                <Link href="/offerte">Vedi le offerte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Categorie Popolari</h2>
              <p className="text-muted-foreground">Tutto quello che serve per il tuo ecosistema digitale.</p>
            </div>
            <Button variant="link" className="text-primary font-semibold hidden md:flex" asChild>
              <Link href="/prodotti">Vedi tutte <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/prodotti?category=${cat.id}`} className="group">
                <div className="bg-card border border-border/50 rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
                  <div className="bg-muted p-4 rounded-full mb-4 group-hover:bg-primary/10 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-6 md:hidden" asChild>
            <Link href="/prodotti">Vedi tutte le categorie</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">In Evidenza</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">I prodotti più scelti dalla nostra community di appassionati tech.</p>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : featuredProducts?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Nessun prodotto in evidenza al momento.</div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-20" />
            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-primary-foreground">
              <div className="max-w-xl text-center md:text-left">
                <Shield className="w-12 h-12 mb-6 mx-auto md:mx-0 opacity-80" />
                <h2 className="text-3xl md:text-5xl font-display font-black mb-4">Garanzia Alpha Bit</h2>
                <p className="text-primary-foreground/80 text-lg mb-8">
                  Tutti i nostri prodotti sono testati e garantiti. Se non sei soddisfatto, hai 30 giorni per restituire il tuo ordine senza fare domande.
                </p>
                <Button size="lg" variant="secondary" className="font-bold rounded-full text-primary" asChild>
                  <Link href="/chi-siamo">Scopri di più su di noi</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {(!isOffersLoading && offerProducts?.length! > 0) && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 text-destructive p-2 rounded-md">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Offerte Flash</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href="/offerte">Vedi tutte</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerProducts!.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
