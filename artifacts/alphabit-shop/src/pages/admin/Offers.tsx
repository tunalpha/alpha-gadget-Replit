import React from 'react';
import { useListAdminOffers } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminOffers() {
  const { data, isLoading } = useListAdminOffers();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Codici Sconto</h1>
          <p className="text-muted-foreground mt-1">Gestisci coupon e offerte promozionali.</p>
        </div>
        
        <Button className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Nuovo Coupon
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Caricamento offerte...</div>
        ) : data && data.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Codice</TableHead>
                <TableHead>Sconto</TableHead>
                <TableHead>Min. Ordine</TableHead>
                <TableHead>Utilizzi</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="font-mono font-bold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> {offer.code}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{offer.description}</div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `€${offer.discount_value}`}
                  </TableCell>
                  <TableCell className="text-sm">
                    {offer.min_order ? `€${offer.min_order}` : 'Nessuno'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {offer.uses_count || 0} / {offer.max_uses || '∞'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {offer.expires_at ? new Date(offer.expires_at).toLocaleDateString() : 'Mai'}
                  </TableCell>
                  <TableCell>
                    {offer.active ? (
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Attivo</Badge>
                    ) : (
                      <Badge variant="secondary">Inattivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Tag className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p>Nessun coupon presente nel sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
}
