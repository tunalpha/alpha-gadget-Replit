import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOnSale = product.on_sale && product.sale_price !== null && product.sale_price !== undefined;
  const currentPrice = isOnSale ? product.sale_price! : product.price;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full bg-card border-card-border/50">
      <Link href={`/prodotto/${product.id}`} className="relative block aspect-square overflow-hidden bg-white/5 p-4 flex-shrink-0">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted/50 rounded flex items-center justify-center">
            <span className="text-muted-foreground">Nessuna immagine</span>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isOnSale && (
            <Badge variant="destructive" className="font-bold text-xs uppercase px-2 py-0.5 shadow-sm">
              Offerta
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-2 py-0.5 shadow-sm border-none">
              In Vetrina
            </Badge>
          )}
        </div>
        
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge variant="secondary" className="font-bold text-sm px-3 py-1 shadow-md">Esaurito</Badge>
          </div>
        )}
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow gap-3 justify-between">
        <div>
          <Link href={`/prodotti?category=${product.category}`} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider mb-1 block">
            {product.category}
          </Link>
          <Link href={`/prodotto/${product.id}`} className="font-display font-semibold text-base leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </Link>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {isOnSale ? (
              <>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="font-display font-bold text-lg text-primary">{formatPrice(currentPrice)}</span>
              </>
            ) : (
              <span className="font-display font-bold text-lg">{formatPrice(product.price)}</span>
            )}
          </div>
          
          <Button 
            size="icon" 
            variant="secondary"
            className="rounded-full h-10 w-10 shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors group-hover:shadow-md"
            disabled={product.stock <= 0}
            onClick={(e) => {
              e.preventDefault();
              addItem({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: currentPrice,
                image: product.image,
                stock: product.stock
              });
            }}
            aria-label="Aggiungi al carrello"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
