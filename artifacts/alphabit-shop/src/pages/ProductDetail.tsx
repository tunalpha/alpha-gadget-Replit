import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGetProduct, useListProducts, getGetProductQueryKey, getListProductsQueryKey } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useGetProduct(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProductQueryKey(id),
    }
  });

  const relatedParams = { category: product?.category, limit: 4 };
  const { data: relatedData } = useListProducts(relatedParams, {
    query: {
      enabled: !!product?.category,
      queryKey: getListProductsQueryKey(relatedParams),
    }
  });

  const relatedProducts = relatedData?.products?.filter(p => p.id !== id).slice(0, 4) || [];

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Prodotto non trovato</h2>
        <Button onClick={() => setLocation('/prodotti')}>Torna al catalogo</Button>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isOnSale = product.on_sale && product.sale_price !== null && product.sale_price !== undefined;
  const currentPrice = isOnSale ? product.sale_price! : product.price;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: product.image,
      stock: product.stock
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => window.history.back()}
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Torna indietro
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="bg-white/5 border border-border/50 rounded-3xl p-8 flex items-center justify-center relative group">
          {isOnSale && (
            <Badge variant="destructive" className="absolute top-6 left-6 text-sm px-3 py-1 font-bold z-10 uppercase tracking-wider">
              Offerta Speciale
            </Badge>
          )}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full max-w-md aspect-square object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              Nessuna immagine
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50 border-none">
            {product.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-display font-black leading-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col">
              {isOnSale ? (
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-black text-4xl text-primary">{formatPrice(currentPrice)}</span>
                  <span className="text-lg text-muted-foreground line-through font-medium">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="font-display font-black text-4xl">{formatPrice(product.price)}</span>
              )}
            </div>
            
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-medium">
                Disponibile ({product.stock})
              </Badge>
            ) : (
              <Badge variant="destructive">Esaurito</Badge>
            )}
          </div>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.short_description || product.description.substring(0, 150) + "..."}
          </p>

          <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 mb-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantità:</span>
              <div className="flex items-center border border-border bg-background rounded-md h-12">
                <button 
                  className="px-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  className="px-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              {product.stock > 0 ? 'Aggiungi al carrello' : 'Prodotto Esaurito'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
              <Truck className="w-8 h-8 text-primary opacity-80" />
              <div>
                <div className="font-semibold">Spedizione Rapida</div>
                <div className="text-muted-foreground">Consegna in 24/48h</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
              <Shield className="w-8 h-8 text-primary opacity-80" />
              <div>
                <div className="font-semibold">Reso Garantito</div>
                <div className="text-muted-foreground">Entro 30 giorni</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Description Section */}
      <div className="mb-20 max-w-4xl">
        <h2 className="text-2xl font-display font-bold mb-6">Descrizione Prodotto</h2>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {product.description}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-8">Potrebbe interessarti anche</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
