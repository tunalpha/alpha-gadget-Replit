import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useCreateOrder, useCreatePayment, useCalculateCart } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CreditCard, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Il nome è obbligatorio"),
  customer_email: z.string().email("Email non valida"),
  customer_phone: z.string().min(5, "Numero di telefono obbligatorio"),
  shipping_address: z.string().min(5, "L'indirizzo è obbligatorio"),
  shipping_city: z.string().min(2, "La città è obbligatoria"),
  shipping_zip: z.string().min(5, "CAP obbligatorio"),
  notes: z.string().optional(),
});

export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateMutation = useCalculateCart();
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      setLocation('/carrello');
    }
  }, [items.length, setLocation, isProcessing]);

  // Try to calculate totals on load
  useEffect(() => {
    if (items.length > 0) {
      calculateMutation.mutate({
        data: {
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
        }
      });
    }
  }, []);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: user?.name || "",
      customer_email: user?.email || "",
      customer_phone: user?.phone || "",
      shipping_address: "",
      shipping_city: "",
      shipping_zip: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    if (items.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Create order
      const orderResult = await createOrderMutation.mutateAsync({
        data: {
          cart_items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
          ...values
        }
      });

      // 2. Create payment session
      const paymentResult = await createPaymentMutation.mutateAsync({
        data: {
          order_id: orderResult.order_id
        }
      });

      // 3. Clear cart locally
      clearCart();

      // 4. Redirect to payment gateway (simulated by going to success page for now if url is internal)
      if (paymentResult.checkout_url.startsWith('/')) {
         setLocation(paymentResult.checkout_url);
      } else {
         window.location.href = paymentResult.checkout_url;
      }
      
    } catch (error) {
      toast.error("Si è verificato un errore durante la creazione dell'ordine. Riprova.");
      setIsProcessing(false);
    }
  };

  const getCalculatedTotals = () => {
    if (calculateMutation.data) {
      return {
        subtotal: calculateMutation.data.subtotal,
        shipping: calculateMutation.data.shipping,
        discount: calculateMutation.data.discount || 0,
        total: calculateMutation.data.total
      };
    }
    const subtotal = cartSubtotal;
    const shipping = subtotal >= 49 ? 0 : 5.90;
    return { subtotal, shipping, discount: 0, total: subtotal + shipping };
  };

  const totals = getCalculatedTotals();

  if (items.length === 0 && !isProcessing) return null;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold">Checkout Sicuro</h1>
        <p className="text-muted-foreground mt-2">Completa il tuo ordine in pochi passaggi.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="xl:col-span-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="checkout-form">
              
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/10 border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Dati Personali
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nome e Cognome</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono</FormLabel>
                        <FormControl><Input type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/10 border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Spedizione
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Indirizzo di Consegna (Via e civico)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Città</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping_zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CAP</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Note per il corriere (Opzionale)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Citofono, orari di preferenza, ecc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
            </form>
          </Form>
        </div>

        {/* Summary Section */}
        <div className="xl:col-span-5">
          <div className="sticky top-24 space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="bg-muted/10 border-b border-border/50">
                <CardTitle>Riepilogo Ordine</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-y-auto p-6 space-y-4 border-b border-border/20">
                  {items.map(item => (
                    <div key={item.product_id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-muted rounded-md p-1 flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <div className="text-sm text-muted-foreground">Qtà: {item.quantity}</div>
                      </div>
                      <div className="font-bold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 space-y-3 bg-card">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotale</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spedizione</span>
                    <span>{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm text-primary font-medium">
                      <span>Sconto</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="font-display font-bold text-lg">Totale</span>
                    <span className="font-display font-black text-2xl text-primary">{formatPrice(totals.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              form="checkout-form"
              size="lg" 
              className="w-full h-14 font-bold text-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Elaborazione... <Lock className="ml-2 w-4 h-4 animate-pulse" /></>
              ) : (
                <>Paga e Completa Ordine <ChevronRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" /> Transazione sicura SSL 256-bit
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <div className="bg-white px-3 py-1 rounded border shadow-sm flex items-center justify-center"><CreditCard className="w-6 h-6 text-blue-600" /></div>
              <div className="bg-white px-3 py-1 rounded border shadow-sm flex items-center justify-center font-bold text-[#FF9900]">Bitcoin</div>
              <div className="bg-white px-3 py-1 rounded border shadow-sm flex items-center justify-center text-indigo-800 font-bold italic">Pay<span className="text-blue-400">Pal</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
