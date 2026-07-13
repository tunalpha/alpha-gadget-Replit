import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitContact } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, "Il nome è obbligatorio"),
  email: z.string().email("Email non valida"),
  subject: z.string().min(5, "L'oggetto è obbligatorio"),
  message: z.string().min(10, "Il messaggio è troppo corto"),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync({ data: values });
      toast.success("Messaggio inviato con successo! Ti risponderemo il prima possibile.");
      form.reset();
    } catch (error) {
      toast.error("Errore durante l'invio. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-black mb-4">Contattaci</h1>
        <p className="text-lg text-muted-foreground">
          Hai domande su un prodotto o su un ordine? Il nostro team di esperti è qui per aiutarti.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Sede Principale</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Via Roma 123<br />
                  20100 Milano (MI)<br />
                  Italia
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-1">Assistenza Clienti:</p>
                <a href="mailto:support@alphabit.it" className="text-sm text-primary font-medium hover:underline">support@alphabit.it</a>
                <p className="text-sm text-muted-foreground mt-2 mb-1">Info Commerciali:</p>
                <a href="mailto:info@alphabit.it" className="text-sm text-primary font-medium hover:underline">info@alphabit.it</a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Telefono</h3>
                <p className="text-sm text-muted-foreground mb-1">Numero Verde:</p>
                <p className="text-sm font-medium">800 123 456</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-xl shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Orari</h3>
                <p className="text-sm text-muted-foreground">
                  Lunedì - Venerdì:<br />
                  09:00 - 18:00
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-xl h-full">
            <CardHeader className="bg-muted/10 border-b border-border/50 p-6 md:p-8">
              <CardTitle className="text-2xl font-display">Inviaci un messaggio</CardTitle>
              <CardDescription>Compila il form sottostante, risponderemo entro 24 ore lavorative.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
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
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oggetto</FormLabel>
                        <FormControl>
                          <Input placeholder="Es: Info su ordine #12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Messaggio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Scrivi qui il tuo messaggio..." 
                            className="min-h-[150px] resize-y" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8 font-bold" disabled={isSubmitting}>
                    <Send className="mr-2 w-4 h-4" />
                    {isSubmitting ? "Invio in corso..." : "Invia Messaggio"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
