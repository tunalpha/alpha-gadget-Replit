import React from 'react';

export default function Returns() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-black mb-12 text-center">Resi e Rimborsi</h1>
      
      <div className="prose dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display">
        <p className="lead text-xl text-foreground font-medium mb-8">
          La tua soddisfazione è la nostra priorità. Se non sei completamente convinto del tuo acquisto tech, Alpha Bit ti offre un processo di reso semplice e trasparente.
        </p>

        <h2>Diritto di Recesso (Reso 30 Giorni)</h2>
        <p>In conformità con il D.Lgs 206/2005 (Codice del Consumo), hai il diritto di recedere dal contratto di acquisto, senza alcuna penalità e senza specificarne il motivo, entro <strong>30 giorni</strong> dalla data di ricezione dei prodotti (ben oltre i 14 giorni previsti dalla legge).</p>
        
        <h3>Condizioni per il reso:</h3>
        <ul>
          <li>Il prodotto deve essere integro, non usato e non danneggiato.</li>
          <li>Deve essere restituito nella sua confezione originale, inclusi eventuali manuali, cavi o accessori aggiuntivi.</li>
          <li>I sigilli di garanzia, se presenti, non devono essere alterati.</li>
        </ul>

        <div className="bg-muted p-6 rounded-2xl my-8 border border-border/50">
          <h3 className="mt-0">Come effettuare un reso</h3>
          <ol className="mb-0">
            <li>Accedi alla sezione <a href="/account" className="text-primary hover:underline">Il mio Account</a> e seleziona l'ordine.</li>
            <li>Clicca su "Richiedi Reso" indicando gli articoli da restituire.</li>
            <li>Riceverai via email l'etichetta prepagata da applicare sul pacco.</li>
            <li>Consegna il pacco al punto di ritiro del corriere più vicino a te.</li>
          </ol>
        </div>

        <h2>Costi del Reso</h2>
        <p>Se il prodotto è difettoso o abbiamo commesso un errore noi (es. articolo sbagliato), <strong>il reso è completamente gratuito</strong>.</p>
        <p>Se restituisci l'articolo per un cambio d'idea (diritto di recesso), verrà trattenuta una quota di <strong>5,90 €</strong> dal rimborso per le spese di spedizione del rientro, salvo promozioni in corso che offrano il reso gratuito.</p>

        <h2>Garanzia Legale (Difetti di Fabbrica)</h2>
        <p>Tutti i prodotti venduti da Alpha Bit sono coperti dalla Garanzia Legale di 24 mesi per i difetti di conformità (12 mesi per acquisti con P.IVA), ai sensi del D.Lgs. 206/05. Per usufruire dell'assistenza in garanzia, è necessario conservare la prova d'acquisto (ricevuta o fattura).</p>
        <p>Se un prodotto smette di funzionare correttamente entro il periodo di garanzia a causa di un difetto di fabbrica, contattaci inviando un'email a support@alphabit.it. Provvederemo alla riparazione, alla sostituzione o al rimborso senza alcun costo a tuo carico.</p>

        <h2>Rimborsi</h2>
        <p>Una volta ricevuto il pacco presso il nostro magazzino e verificato lo stato dei prodotti, procederemo al rimborso entro 5 giorni lavorativi.</p>
        <p>Il rimborso verrà effettuato utilizzando lo stesso metodo di pagamento scelto in fase di acquisto (Carta di Credito, PayPal, ecc.). I tempi di accredito effettivo sul tuo conto dipendono dal tuo istituto bancario.</p>
      </div>
    </div>
  );
}
