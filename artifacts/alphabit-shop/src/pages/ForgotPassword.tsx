import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForgotPassword } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { Cpu, Loader2, ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email("Email non valida"),
});

export default function ForgotPassword() {
  const mutation = useForgotPassword();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync({ data: values });
      setIsSuccess(true);
      toast.success("Email inviata! Controlla la tua casella di posta.");
    } catch (error) {
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle className="text-2xl font-display font-bold">Recupera Password</CardTitle>
          <CardDescription>
            Inserisci l'email associata al tuo account per ricevere un link di recupero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="bg-green-500/10 text-green-600 p-4 rounded-xl mb-6">
                Ti abbiamo inviato un'email con le istruzioni per reimpostare la password.
              </div>
              <Button asChild className="w-full">
                <Link href="/login">Torna al Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-6 h-12 text-md font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? "Invio in corso..." : "Invia Link di Recupero"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="flex justify-center border-t border-border/50 p-6 bg-muted/10">
            <Link href="/login" className="flex items-center text-sm text-primary font-bold hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Torna al Login
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
