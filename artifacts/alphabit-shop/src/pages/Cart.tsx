import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { useCalculateCart } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, cartSubtotal } = useCart();
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const calculateMutation = useCalculateCart();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const result = await calculateMutation.mutateAsync({
        data: {
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
          coupon_code: couponCode
        }
      });
      
      if (result.discount && result.discount > 0) {
        setAppliedCoupon(couponCode);
        toast.success(`Coupon ${couponCode} applicato con successo!`);
      } else {
        toast.error("Coupon non valido o non applicabile.");
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error("Errore durante la verifica del coupon.");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
  };

  const getCalculatedTotals = () => {
    if (calculateMutation.data) {
      return {
        subtotal: calculateMutation.data.subtotal,
        shipping: calculateMutation.data.shipping,
        discount: calculateMutation.data.discount || 0,
        total: calculateMutation.data.total,
        freeShippingThreshold: calculateMutation.data.free_shipping_threshold
      };
    }
    
    // Fallback calculation
    const subtotal = cartSubtotal;
    const allOfferItems = items.length > 0 && items.every((i) => i.price <= 0.99);
    const shipping = subtotal >= 49 || allOfferItems ? 0 : 5.90;
    const total = subtotal + shipping;
    return { subtotal, shipping, discount: 0, total, freeShippingThreshold: 49 };
  };

  const totals = getCalculatedTotals();
  const missingForFreeShipping = totals.freeShippingThreshold - totals.subtotal;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Il tuo carrello è vuoto</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Non hai ancora aggiunto prodotti al carrello. Scopri il nostro catalogo e trova il gadget perfetto per te.
        </p>
        <Button size="lg" asChild>
          <Link href="/prodotti">Vai allo shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-primary" /> Carrello
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border/50 text-sm font-medium text-muted-foreground bg-muted/20">
              <div className="col-span-6">Prodotto</div>
              <div className="col-span-2 text-center">Prezzo</div>
              <div className="col-span-2 text-center">Quantità</div>
              <div className="col-span-2 text-right">Totale</div>
            </div>

            <div className="divide-y divide-border/50">
              {items.map((item) => (
                <div key={item.product_id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/5 rounded-xl border border-border/50 p-2 flex-shrink-0 relative overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-muted rounded flex items-center justify-center" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/prodotto/${item.product_id}`} className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <span className="text-primary font-bold md:hidden mt-1">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:block col-span-2 text-center font-medium">
                    {formatPrice(item.price)}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                    <div className="flex items-center border border-border rounded-md bg-background">
                      <button 
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="font-display font-bold text-lg md:text-base">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button 
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-4 md:ml-0 bg-muted/50 hover:bg-destructive/10 rounded-md"
                      aria-label="Rimuovi prodotto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
              Svuota carrello
            </Button>
            <Button variant="outline" asChild>
              <Link href="/prodotti">Continua lo shopping</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border/50 shadow-lg">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="font-display">Riepilogo Ordine</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotale ({items.length} articoli)</span>
                <span className="font-medium">{formatPrice(totals.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Spedizione</span>
                {totals.shipping === 0 ? (
                  <span className="font-medium text-green-600">Gratuita</span>
                ) : (
                  <span className="font-medium">{formatPrice(totals.shipping)}</span>
                )}
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between items-center text-sm text-primary font-medium">
                  <span>Sconto Coupon ({appliedCoupon})</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}

              {missingForFreeShipping > 0 && missingForFreeShipping < 30 && (
                <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-sm flex items-start gap-2">
                  <Tag className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Aggiungi solo <strong>{formatPrice(missingForFreeShipping)}</strong> per avere la spedizione gratuita!</p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-lg">Totale</span>
                <span className="font-display font-black text-2xl text-primary">{formatPrice(totals.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-right">IVA inclusa</p>

              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Codice sconto" 
                    className="pl-9"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedCoupon !== null}
                  />
                </div>
                {appliedCoupon ? (
                  <Button type="button" variant="outline" onClick={removeCoupon} className="text-destructive hover:bg-destructive hover:text-white">
                    Rimuovi
                  </Button>
                ) : (
                  <Button type="submit" variant="secondary" disabled={!couponCode || calculateMutation.isPending}>
                    Applica
                  </Button>
                )}
              </form>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex-col gap-4">
              <Button size="lg" className="w-full h-14 font-bold text-lg" onClick={() => setLocation('/checkout')}>
                Procedi al Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" /> Pagamenti sicuri e crittografati
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
