import React from 'react';
import { useGetAdminStats } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Ricavi Totali",
      value: formatPrice(stats.total_revenue),
      subtext: `+${formatPrice(stats.revenue_this_month || 0)} questo mese`,
      icon: DollarSign,
      color: "text-green-600 bg-green-500/10"
    },
    {
      title: "Ordini Ricevuti",
      value: stats.total_orders.toString(),
      subtext: `+${stats.orders_this_month || 0} questo mese`,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-500/10"
    },
    {
      title: "Clienti Registrati",
      value: stats.total_customers.toString(),
      subtext: "Totale nel database",
      icon: Users,
      color: "text-purple-600 bg-purple-500/10"
    },
    {
      title: "Prodotti in Catalogo",
      value: stats.total_products.toString(),
      subtext: "Articoli attivi",
      icon: Package,
      color: "text-orange-600 bg-orange-500/10"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Panoramica</h1>
        <p className="text-muted-foreground mt-1">Riepilogo delle performance del negozio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.subtext}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ordini Recenti</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/ordini">Vedi tutti <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recent_orders && stats.recent_orders.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        #{order.id.split('-')[0]}
                        <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-700' :
                          'bg-green-500/20 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{order.customer_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatPrice(order.total)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Nessun ordine recente.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Stato Ordini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">In attesa (Pending)</span>
                  <span className="font-bold">{stats.pending_orders || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((stats.pending_orders || 0) / Math.max(1, stats.total_orders)) * 100)}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Pagati (Da spedire)</span>
                  <span className="font-bold">{stats.paid_orders || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((stats.paid_orders || 0) / Math.max(1, stats.total_orders)) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Spediti/Consegnati</span>
                  <span className="font-bold">{stats.shipped_orders || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((stats.shipped_orders || 0) / Math.max(1, stats.total_orders)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
