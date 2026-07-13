import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useGetCustomerOrders, useUpdateProfile, getGetCustomerOrdersQueryKey } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Package, User, LogOut, Loader2, FileText, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Link } from 'wouter';

const profileSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  phone: z.string().optional(),
  current_password: z.string().optional(),
  new_password: z.string().min(6, "La nuova password deve avere almeno 6 caratteri").optional().or(z.literal('')),
});

export default function Account() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: ordersData, isLoading: isOrdersLoading } = useGetCustomerOrders({
    query: {
      enabled: !!user,
      queryKey: getGetCustomerOrdersQueryKey(),
    }
  });

  const updateMutation = useUpdateProfile();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      current_password: "",
      new_password: "",
    },
  });

  // Redirect if not logged in
  if (!isAuthLoading && !user) {
    setLocation('/login');
    return null;
  }

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsUpdating(true);
    try {
      const payload: any = { name: values.name, phone: values.phone || null };
      
      if (values.current_password && values.new_password) {
        payload.current_password = values.current_password;
        payload.new_password = values.new_password;
      }
      
      await updateMutation.mutateAsync({ data: payload });
      toast.success("Profilo aggiornato con successo");
      form.reset({ ...values, current_password: "", new_password: "" });
    } catch (error) {
      toast.error("Errore durante l'aggiornamento. Verifica la password attuale.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: "In attesa",
      processing: "In lavorazione",
      shipped: "Spedito",
      delivered: "Consegnato",
      cancelled: "Annullato"
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Il mio Account</h1>
          <p className="text-muted-foreground mt-2">Bentornato, {user.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive hover:text-white">
          <LogOut className="w-4 h-4 mr-2" /> Esci
        </Button>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1">
          <TabsTrigger value="orders" className="flex items-center gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Package className="w-4 h-4" /> I miei Ordini
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="w-4 h-4" /> Dettagli Profilo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Storico Ordini</CardTitle>
              <CardDescription>Visualizza i dettagli e lo stato dei tuoi acquisti passati</CardDescription>
            </CardHeader>
            <CardContent>
              {isOrdersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : ordersData && (ordersData as any[]).length > 0 ? (
                <div className="space-y-4">
                  {(ordersData as any[]).map((order: any) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border border-border/50 rounded-xl hover:border-primary/30 transition-colors bg-card group">
                      <div className="space-y-2 mb-4 sm:mb-0 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">#{order.id.split('-')[0]}</span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                            {translateStatus(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span>{new Date(order.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-border"></span>
                          <span className="font-medium text-foreground">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" className="w-full sm:w-auto group-hover:bg-primary/10 group-hover:text-primary transition-colors" asChild>
                        <Link href={`/order-success/${order.id}`}>Dettagli <ChevronRight className="ml-1 w-4 h-4" /></Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nessun ordine trovato</h3>
                  <p className="text-muted-foreground mb-6">Non hai ancora effettuato acquisti nel nostro negozio.</p>
                  <Button asChild>
                    <Link href="/prodotti">Esplora il catalogo</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="border-border/50 max-w-2xl">
            <CardHeader>
              <CardTitle>Informazioni Personali</CardTitle>
              <CardDescription>Aggiorna i tuoi dati o cambia la password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input value={user.email} disabled className="bg-muted/50" />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">L'email non può essere modificata</p>
                    </FormItem>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="font-semibold mb-4 text-lg">Cambia Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="current_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Attuale</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nuova Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto mt-4">
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Salva Modifiche
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
