import React, { useState } from 'react';
import { useListAdminOffers, useCreateAdminOffer, useDeleteAdminOffer } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Tag, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CouponForm {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_order: string;
  max_uses: string;
  expires_at: string;
  active: boolean;
}

const empty: CouponForm = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order: '',
  max_uses: '',
  expires_at: '',
  active: true,
};

export default function AdminOffers() {
  const { data, isLoading, refetch } = useListAdminOffers();
  const createOffer = useCreateAdminOffer();
  const deleteOffer = useDeleteAdminOffer();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<CouponForm>(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof CouponForm, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.code.trim()) { toast.error('Inserisci un codice coupon'); return; }
    if (!form.discount_value || Number(form.discount_value) <= 0) { toast.error('Inserisci uno sconto valido'); return; }
    setSaving(true);
    try {
      await createOffer.mutateAsync({
        data: {
          code: form.code.trim().toUpperCase(),
          description: form.description.trim() || undefined,
          discount_type: form.discount_type,
          discount_value: Number(form.discount_value),
          min_order: form.min_order ? Number(form.min_order) : 0,
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
          active: form.active,
        } as Parameters<typeof createOffer.mutateAsync>[0]['data'],
      });
      toast.success('Coupon creato!');
      setShowDialog(false);
      setForm(empty);
      refetch();
    } catch {
      toast.error('Errore nella creazione del coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Eliminare il coupon "${code}"?`)) return;
    try {
      await deleteOffer.mutateAsync({ offerId: id });
      toast.success('Coupon eliminato');
      refetch();
    } catch {
      toast.error('Errore nell\'eliminazione');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Codici Sconto</h1>
          <p className="text-muted-foreground mt-1">Gestisci coupon e offerte promozionali.</p>
        </div>
        <Button className="shrink-0" onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nuovo Coupon
        </Button>
      </div>

      {/* List */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Caricamento offerte...</div>
        ) : data && data.length > 0 ? (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border/50">
              {data.map((offer) => (
                <div key={offer.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono font-bold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary shrink-0" />
                      {offer.code}
                    </div>
                    <div className="flex items-center gap-2">
                      {offer.active ? (
                        <Badge className="bg-green-500/20 text-green-700">Attivo</Badge>
                      ) : (
                        <Badge variant="secondary">Inattivo</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(offer.id!, offer.code!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {offer.description && (
                    <p className="text-xs text-muted-foreground">{offer.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="font-semibold text-primary">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `€${offer.discount_value}`}
                    </span>
                    {offer.min_order ? <span className="text-muted-foreground">Min. €{offer.min_order}</span> : null}
                    <span className="text-muted-foreground">
                      {offer.uses_count || 0} / {offer.max_uses || '∞'} utilizzi
                    </span>
                    {offer.expires_at && (
                      <span className="text-muted-foreground">Scade: {new Date(offer.expires_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
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
                        {offer.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{offer.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `€${offer.discount_value}`}
                      </TableCell>
                      <TableCell className="text-sm">{offer.min_order ? `€${offer.min_order}` : 'Nessuno'}</TableCell>
                      <TableCell className="text-sm">{offer.uses_count || 0} / {offer.max_uses || '∞'}</TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(offer.id!, offer.code!)}
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
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <Tag className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p>Nessun coupon presente nel sistema.</p>
          </div>
        )}
      </div>

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDialog(false)} />
          <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Nuovo Coupon</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDialog(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {/* Code */}
              <div className="space-y-1.5">
                <Label>Codice coupon *</Label>
                <Input
                  placeholder="es. ESTATE20"
                  value={form.code}
                  onChange={(e) => set('code', e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label>Descrizione</Label>
                <Input
                  placeholder="es. Sconto estate 20%"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>

              {/* Discount type + value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tipo sconto *</Label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={form.discount_type}
                    onChange={(e) => set('discount_type', e.target.value)}
                  >
                    <option value="percentage">Percentuale (%)</option>
                    <option value="fixed">Fisso (€)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Valore *</Label>
                  <Input
                    type="number"
                    placeholder={form.discount_type === 'percentage' ? '20' : '5.00'}
                    value={form.discount_value}
                    onChange={(e) => set('discount_value', e.target.value)}
                    min={0}
                    max={form.discount_type === 'percentage' ? 100 : undefined}
                  />
                </div>
              </div>

              {/* Min order + max uses */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Ordine minimo (€)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.min_order}
                    onChange={(e) => set('min_order', e.target.value)}
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Max utilizzi</Label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={form.max_uses}
                    onChange={(e) => set('max_uses', e.target.value)}
                    min={1}
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="space-y-1.5">
                <Label>Data scadenza</Label>
                <Input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => set('expires_at', e.target.value)}
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <input
                  id="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set('active', e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <Label htmlFor="active" className="cursor-pointer">Attivo subito</Label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowDialog(false)}>
                Annulla
              </Button>
              <Button className="flex-1" onClick={handleCreate} disabled={saving}>
                {saving ? 'Salvataggio...' : 'Crea Coupon'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
