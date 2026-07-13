import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Rocket, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-sidebar text-sidebar-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-display font-black mb-6">La nostra storia</h1>
          <p className="text-xl text-sidebar-foreground/80 leading-relaxed">
            Siamo nati con una missione semplice: rendere la tecnologia accessibile, affidabile e di qualità per tutti gli appassionati.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Da un piccolo garage al tuo ecosistema tech</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Alpha Bit è nata nel 2018 a Milano dalla passione di tre amici per l'hardware e i gadget tecnologici. Stanchi di dover scegliere tra componenti costosi di brand blasonati e prodotti economici di dubbia qualità, abbiamo deciso di creare la nostra selezione.
                </p>
                <p>
                  Abbiamo iniziato testando personalmente ogni singolo cavo, caricatore e powerbank nel nostro piccolo laboratorio, selezionando solo quelli che superavano i nostri rigidi standard di qualità e durabilità.
                </p>
                <p>
                  Oggi, Alpha Bit è un punto di riferimento per migliaia di utenti in tutta Italia che cercano accessori tech dal design curato e dalle prestazioni impeccabili.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-3xl overflow-hidden relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop" 
                  alt="Tech workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <p className="font-display font-bold text-lg leading-tight">"La tecnologia deve essere un'estensione naturale delle nostre capacità."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">I nostri valori</h2>
            <p className="text-muted-foreground">Ciò che guida ogni nostra decisione e selezione prodotto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">Qualità Senza Compromessi</h3>
                <p className="text-muted-foreground text-sm">Se non lo useremmo noi stessi tutti i giorni, non lo vendiamo. Semplice.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">Innovazione Utile</h3>
                <p className="text-muted-foreground text-sm">Cerchiamo soluzioni che risolvano problemi reali, non gadget che finiscono in un cassetto.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">Assistenza Umana</h3>
                <p className="text-muted-foreground text-sm">Nessun bot o risposte pre-confezionate. Parlerai sempre con appassionati come te.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">Responsabilità</h3>
                <p className="text-muted-foreground text-sm">Packaging ridotto all'essenziale ed ecosostenibile per minimizzare l'impatto.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
