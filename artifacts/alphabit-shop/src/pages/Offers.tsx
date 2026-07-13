import React from 'react';
import { useGetOfferProducts } from '@workspace/api-client-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Offers() {
  const { data: products, isLoading } = useGetOfferProducts({ limit: 50 });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
          <Flame className="w-8 h-8 text-destructive animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
          Offerte Flash
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Sconti imperdibili su una selezione di prodotti tech. Le quantità sono limitate, affrettati prima che esauriscano!
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
          <h3 className="text-2xl font-display font-bold mb-2">Nessuna offerta attiva</h3>
          <p className="text-muted-foreground">Torna a trovarci presto per nuove promozioni.</p>
        </div>
      )}
    </div>
  );
}
