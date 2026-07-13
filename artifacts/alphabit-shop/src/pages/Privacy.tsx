import React from 'react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-black mb-12 text-center">Informativa sulla Privacy</h1>
      
      <div className="prose dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display">
        <p className="text-sm uppercase tracking-wider mb-8">Ultimo aggiornamento: 1 Ottobre 2024</p>
        
        <p>La presente Informativa sulla Privacy descrive come Alpha Bit ("noi", "nostro" o "ci") raccoglie, utilizza e condivide le informazioni personali quando utilizzi il nostro sito web alphabit.it (il "Sito") o effettui acquisti presso di noi.</p>

        <h2>1. Informazioni che raccogliamo</h2>
        <p>Quando visiti il Sito o effettui un acquisto, raccogliamo diverse tipologie di informazioni:</p>
        <ul>
          <li><strong>Informazioni fornite da te:</strong> nome, indirizzo email, numero di telefono, indirizzo di spedizione e fatturazione, dettagli di pagamento (elaborati tramite provider sicuri esterni) quando crei un account o effettui un ordine.</li>
          <li><strong>Informazioni raccolte automaticamente:</strong> indirizzo IP, tipo di browser, fuso orario, e informazioni su come interagisci con il nostro sito (pagine visitate, prodotti visualizzati) tramite l'uso di cookie e tecnologie simili.</li>
        </ul>

        <h2>2. Come utilizziamo le tue informazioni</h2>
        <p>Utilizziamo le informazioni raccolte per i seguenti scopi:</p>
        <ul>
          <li><strong>Evasione degli ordini:</strong> elaborare i pagamenti, organizzare le spedizioni, fornirti fatture e/o conferme d'ordine.</li>
          <li><strong>Comunicazione:</strong> inviarti aggiornamenti sullo stato dell'ordine, rispondere a richieste di assistenza clienti.</li>
          <li><strong>Miglioramento del servizio:</strong> analizzare come i nostri clienti utilizzano il Sito per migliorare l'esperienza utente e l'offerta di prodotti.</li>
          <li><strong>Marketing (previo consenso):</strong> inviarti email con promozioni e nuovi prodotti tech. Puoi revocare il consenso in qualsiasi momento.</li>
        </ul>

        <h2>3. Condivisione delle informazioni</h2>
        <p>Condividiamo i tuoi Dati Personali con terze parti per aiutarci a utilizzarli come descritto sopra. Ad esempio:</p>
        <ul>
          <li>Utilizziamo Stripe/PayPal per l'elaborazione sicura dei pagamenti.</li>
          <li>Condividiamo nome e indirizzo con i corrieri (GLS, BRT, DHL) esclusivamente per la consegna dei prodotti.</li>
          <li>Possiamo condividere informazioni per conformarci alle leggi e ai regolamenti applicabili o per rispondere a una richiesta legale di informazioni (es. ordini del tribunale).</li>
        </ul>

        <h2>4. I tuoi diritti (GDPR)</h2>
        <p>Se sei residente in Europa, hai il diritto di accedere alle informazioni personali che conserviamo su di te e di chiedere che vengano corrette, aggiornate o eliminate. Hai anche il diritto alla portabilità dei dati e il diritto di opporti a determinati trattamenti.</p>
        <p>Per esercitare questi diritti, contattaci all'indirizzo email: privacy@alphabit.it.</p>

        <h2>5. Conservazione dei dati</h2>
        <p>Quando effettui un ordine tramite il Sito, conserveremo le informazioni dell'ordine per i nostri archivi a meno che e fino a quando non ci chiedi di eliminare tali informazioni, fatto salvo l'obbligo di conservazione per fini fiscali e contabili previsto dalla legge italiana.</p>

        <h2>6. Contatti</h2>
        <p>Per maggiori informazioni sulle nostre pratiche in materia di privacy, se hai domande, o se desideri presentare un reclamo, ti preghiamo di contattarci via e-mail a privacy@alphabit.it o via posta a:</p>
        <address className="not-italic mt-4 p-4 bg-muted rounded-lg border border-border/50 text-foreground">
          Alpha Bit Shop<br />
          Via Roma 123<br />
          20100 Milano (MI)<br />
          Italia
        </address>
      </div>
    </div>
  );
}
