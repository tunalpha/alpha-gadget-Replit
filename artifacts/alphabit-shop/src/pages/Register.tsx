import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useRegisterUser } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { Cpu, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const registerMutation = useRegisterUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || null
      };
      
      const response = await registerMutation.mutateAsync({ data: payload });
      login(response.token);
      toast.success("Account creato con successo! Benvenuto in Alpha Bit.");
      setLocation('/account');
    } catch (error: any) {
      // Mock error handling since the API might return specific message
      toast.error("Errore durante la registrazione. L'email potrebbe essere già in uso.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md border-border/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <Cpu className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold">Crea un Account</CardTitle>
          <CardDescription>
            Unisciti alla nostra community per uno shopping più veloce e offerte esclusive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome e Cognome</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono (Opzionale)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+39" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
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
                {isLoading ? "Creazione in corso..." : "Registrati"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 p-6 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Hai già un account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
