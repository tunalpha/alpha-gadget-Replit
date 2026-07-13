import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Link, useLocation } from 'wouter';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartSubtotal } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setLocation('/carrello');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-border/10">
        <SheetHeader className="p-6 pb-4 border-b border-border/5 text-left bg-muted/20">
          <SheetTitle className="font-display flex items-center gap-2 text-2xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Il tuo carrello
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 
              ? "Non ci sono articoli nel tuo carrello." 
              : `Hai ${items.length} articol${items.length === 1 ? 'o' : 'i'} nel carrello.`}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-white/5 rounded-md overflow-hidden flex-shrink-0 p-2 border border-border/50">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center" />
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{item.name}</h4>
                        <span className="font-display font-bold text-sm shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border/50 rounded-md">
                          <button 
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.product_id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1.5"
                          aria-label="Rimuovi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-6 bg-muted/10 border-t border-border/5">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-muted-foreground">Subtotale</span>
                <span className="font-display font-bold text-xl">{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Spedizione e sconti calcolati al checkout.</p>
              
              <div className="flex flex-col gap-3">
                <Button className="w-full font-bold h-12" size="lg" onClick={handleCheckout}>
                  Vai alla cassa <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                  Continua lo shopping
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="mb-6">Il tuo carrello è vuoto. Scopri le nostre offerte!</p>
            <Button onClick={() => {
              setIsCartOpen(false);
              setLocation('/prodotti');
            }}>
              Esplora il catalogo
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
