import React, { useState } from 'react';
import { useListAdminOrders, useUpdateOrderStatus } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading, refetch } = useListAdminOrders({ 
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 100
  });
  
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ 
        orderId,
        data: { status: newStatus }
      });
      toast.success("Stato aggiornato — email inviata al cliente");
      refetch();
    } catch (error) {
      toast.error("Errore durante l'aggiornamento");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Eliminare definitivamente questo ordine?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Ordine eliminato");
      refetch();
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20',
    delivered: 'bg-green-500/10 text-green-700 hover:bg-green-500/20',
    cancelled: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Gestione Ordini</h1>
          <p className="text-muted-foreground mt-1">Monitora e aggiorna lo stato degli ordini dei clienti.</p>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtra per stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli ordini</SelectItem>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="processing">In lavorazione</SelectItem>
            <SelectItem value="shipped">Spediti</SelectItem>
            <SelectItem value="delivered">Consegnati</SelectItem>
            <SelectItem value="cancelled">Annullati</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border/50 rounded-xl shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Caricamento ordini...</div>
        ) : data?.orders && data.orders.length > 0 ? (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-border/50">
              {data.orders.map((order) => (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold">#{order.id.slice(0, 8)}</span>
                    <Badge variant="outline" className={`capitalize text-xs shrink-0 ${order.payment_status === 'paid' ? 'border-green-500/30 text-green-600' : ''}`}>
                      {order.payment_status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{order.customer_email}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold">{formatPrice(order.total)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                      <SelectTrigger className={`h-8 text-xs font-semibold uppercase tracking-wider border-none flex-1 ${statusColors[order.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>ID Ordine</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Totale</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-xs font-mono">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${order.payment_status === 'paid' ? 'border-green-500/30 text-green-600' : ''}`}>
                          {order.payment_status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                          <SelectTrigger className={`h-8 text-xs font-semibold uppercase tracking-wider border-none ${statusColors[order.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            Nessun ordine trovato per i criteri selezionati.
          </div>
        )}
      </div>
    </div>
  );
}
