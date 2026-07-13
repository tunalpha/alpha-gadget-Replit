import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGetOrder, getGetOrderQueryKey } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Package, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Link } from 'wouter';

export default function OrderSuccess() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, isError, refetch } = useGetOrder(id, {
    query: {
      enabled: !!id,
      retry: 2,
      queryKey: getGetOrderQueryKey(id),
    }
  });

  const [showContent, setShowContent] = useState(false);

  // Confirm payment and send emails as soon as the page loads
  useEffect(() => {
    if (!id) return;
    fetch(`/api/payments/confirm/${id}`, { method: 'POST' })
      .then(() => refetch())
      .catch(() => {}); // non-blocking

    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Ordine non trovato</h2>
        <p className="mb-6 text-muted-foreground">Non riusciamo a recuperare le informazioni di questo ordine.</p>
        <Button asChild><Link href="/">Torna alla Home</Link></Button>
      </div>
    );
  }

  if (isLoading || !showContent || !order) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold font-display">Conferma in corso...</h2>
        <p className="text-muted-foreground mt-2">Stiamo verificando il tuo pagamento.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black mb-4">Grazie per il tuo ordine!</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Abbiamo ricevuto il tuo ordine e stiamo iniziando a prepararlo.
        </p>
        <p className="text-sm font-medium bg-muted px-4 py-2 rounded-full inline-block mt-2">
          Ordine #{order.id.split('-')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="border-border/50">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Indirizzo di Consegna
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_zip} {order.shipping_city}</p>
              <p className="pt-2 text-muted-foreground">{order.customer_phone}</p>
              <p className="text-muted-foreground">{order.customer_email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="bg-muted/10 border-b border-border/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Riepilogo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stato Ordine</span>
                <span className="font-medium bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stato Pagamento</span>
                <span className="font-medium capitalize text-green-600">
                  {order.payment_status}
                </span>
              </div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold">Totale Pagato</span>
                <span className="font-bold text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/prodotti">Continua lo shopping <ArrowRight className="ml-2 w-4 h-4" /></Link>
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/account">Vedi i miei ordini</Link>
        </Button>
      </div>
    </div>
  );
}
