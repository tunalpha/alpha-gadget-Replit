import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useResetPassword } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Cpu, Loader2 } from 'lucide-react';

const schema = z.object({
  new_password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Le password non coincidono",
  path: ["confirm_password"],
});

export default function ResetPassword() {
  const [location, setLocation] = useLocation();
  const mutation = useResetPassword();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    } else {
      toast.error("Link non valido o scaduto.");
      setLocation('/login');
    }
  }, [location, setLocation]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      await mutation.mutateAsync({ 
        data: {
          token,
          new_password: values.new_password
        } 
      });
      toast.success("Password modificata con successo. Ora puoi accedere.");
      setLocation('/login');
    } catch (error) {
      toast.error("Errore durante il reset. Il link potrebbe essere scaduto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md border-border/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Cpu className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">Imposta Nuova Password</CardTitle>
          <CardDescription>
            Scegli una nuova password per il tuo account Alpha Bit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuova Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conferma Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6 h-12 text-md font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Salvataggio..." : "Salva Nuova Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
