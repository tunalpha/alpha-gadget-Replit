import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLoginUser } from '@workspace/api-client-react';
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

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const loginMutation = useLoginUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await loginMutation.mutateAsync({ data: values });
      login(response.token);
      toast.success("Accesso effettuato con successo!");
      
      if (response.user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/account');
      }
    } catch (error) {
      toast.error("Credenziali non valide. Riprova.");
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
          <CardTitle className="text-2xl font-display font-bold">Bentornato</CardTitle>
          <CardDescription>
            Accedi al tuo account per gestire i tuoi ordini.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/password-dimenticata" className="text-xs text-primary hover:underline font-medium">
                        Password dimenticata?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6 h-12 text-md font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 p-6 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Non hai ancora un account?{" "}
            <Link href="/registrati" className="text-primary font-bold hover:underline">
              Registrati
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
