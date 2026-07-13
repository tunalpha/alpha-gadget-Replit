import React, { useState } from 'react';
import { useListAdminCustomers, useGetCrmStats } from '@workspace/api-client-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, UserCheck, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const { data: stats } = useGetCrmStats();
  const { data: customersData, isLoading } = useListAdminCustomers({ search: search || undefined, limit: 50 });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Gestione Clienti</h1>
        <p className="text-muted-foreground mt-1">CRM e panoramica dei clienti registrati.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50 bg-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-primary/20 text-primary rounded-full">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Totale Clienti</p>
              <p className="text-3xl font-bold font-display">{stats?.total_customers || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-green-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-green-500/20 text-green-600 rounded-full">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nuovi Questo Mese</p>
              <p className="text-3xl font-bold font-display">{stats?.new_this_month || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cerca per nome o email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Caricamento clienti...</div>
        ) : customersData?.customers && customersData.customers.length > 0 ? (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-border/50">
              {customersData.customers.map((customer) => (
                <div key={customer.id} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{customer.name}</div>
                    {customer.tags && customer.tags.includes('vip') && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 shrink-0">VIP</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{customer.email}</div>
                  {customer.phone && <div className="text-xs text-muted-foreground">{customer.phone}</div>}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-muted-foreground">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}</span>
                    <span className="font-bold text-primary">{formatPrice(customer.total_spent)}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contatti</TableHead>
                    <TableHead>Data Registrazione</TableHead>
                    <TableHead className="text-right">Ordini</TableHead>
                    <TableHead className="text-right">Totale Speso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersData.customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-semibold">{customer.name}</div>
                        {customer.tags && customer.tags.includes('vip') && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 mt-1">VIP</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-xs text-muted-foreground">{customer.phone || '-'}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {customer.order_count}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatPrice(customer.total_spent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            Nessun cliente trovato.
          </div>
        )}
      </div>
    </div>
  );
}
