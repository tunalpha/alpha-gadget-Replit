import React from 'react';

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-black mb-12 text-center">Spedizioni e Consegne</h1>
      
      <div className="prose dark:prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-display prose-a:text-primary">
        <h2>Tempi e Costi di Spedizione</h2>
        <p>In Alpha Bit ci impegniamo a consegnare i tuoi acquisti tech nel minor tempo possibile. Affidiamo le nostre spedizioni ai migliori corrieri espressi nazionali (GLS, BRT, DHL).</p>
        
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-4 rounded-tl-lg">Tipo di Spedizione</th>
                <th className="p-4">Tempi stimati</th>
                <th className="p-4 rounded-tr-lg">Costo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Standard (Ordini &lt; 49€)</td>
                <td className="p-4">24/48 ore lavorative</td>
                <td className="p-4 font-bold text-foreground">5,90 €</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Gratuita (Ordini &ge; 49€)</td>
                <td className="p-4">24/48 ore lavorative</td>
                <td className="p-4 font-bold text-green-600">GRATIS</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Isole e Zone Disagiate</td>
                <td className="p-4">48/72 ore lavorative</td>
                <td className="p-4 font-bold text-foreground">+ 2,00 € supplemento</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Elaborazione degli Ordini</h2>
        <p>Tutti gli ordini completati entro le <strong>14:00</strong> dei giorni lavorativi vengono elaborati e affidati al corriere il giorno stesso. Gli ordini ricevuti dopo le 14:00, nei weekend o durante i giorni festivi, vengono elaborati il primo giorno lavorativo successivo.</p>
        
        <h2>Tracciamento dell'Ordine</h2>
        <p>Non appena il tuo pacco lascia il nostro magazzino, riceverai un'email con il codice di tracciamento (Tracking Number). Potrai seguire lo stato della tua spedizione direttamente dal sito del corriere o accedendo alla sezione <a href="/account">Il mio Account</a> sul nostro sito.</p>
        
        <h2>Cosa fare alla ricezione</h2>
        <p>Al momento della consegna da parte del corriere, ti invitiamo a controllare che:</p>
        <ul>
          <li>Il numero dei colli corrisponda a quanto indicato nel documento di trasporto.</li>
          <li>L'imballo risulti integro, non danneggiato, né bagnato o comunque alterato, anche nei materiali di chiusura (nastro adesivo o reggette metalliche).</li>
        </ul>
        <p>In caso di danni evidenti all'imballo, ti consigliamo di accettare il pacco firmando con "Riserva di Controllo" e specificando il motivo (es. "Scatola schiacciata", "Pacco bagnato"). Se il prodotto all'interno dovesse risultare danneggiato, contattaci entro 48 ore allegando foto dell'imballo e del prodotto.</p>
      </div>
    </div>
  );
}
