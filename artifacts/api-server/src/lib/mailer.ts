import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = `"${process.env.SMTP_FROM_NAME || "Alpha Bit Gadget"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

const statusLabels: Record<string, { it: string; emoji: string }> = {
  pending:    { it: "In attesa",      emoji: "🕐" },
  processing: { it: "In lavorazione", emoji: "⚙️" },
  shipped:    { it: "Spedito",        emoji: "🚚" },
  delivered:  { it: "Consegnato",     emoji: "✅" },
  cancelled:  { it: "Annullato",      emoji: "❌" },
};

function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;}
  .wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);}
  .header{background:linear-gradient(135deg,#7c3aed,#a855f7);padding:32px 40px;text-align:center;}
  .header h1{color:#fff;margin:0;font-size:24px;letter-spacing:-0.5px;}
  .header p{color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px;}
  .body{padding:32px 40px;}
  .body h2{color:#1f2937;font-size:20px;margin:0 0 16px;}
  .body p{color:#4b5563;line-height:1.6;margin:0 0 12px;}
  .status-box{background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px 20px;margin:20px 0;text-align:center;}
  .status-box .label{font-size:18px;font-weight:700;color:#7c3aed;}
  .footer{background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;}
  .footer p{color:#9ca3af;font-size:12px;margin:0;}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>⚡ Alpha Bit Gadget</h1>
    <p>Il tuo negozio di tecnologia</p>
  </div>
  <div class="body">
    <h2>${title}</h2>
    ${body}
  </div>
  <div class="footer">
    <p>Alpha Bit Gadget · alphabit.sbs · Supporto: ${process.env.SMTP_FROM_EMAIL || ""}</p>
  </div>
</div>
</body>
</html>`;
}

export async function sendOrderStatusEmail(opts: {
  to: string;
  customerName: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
  notes?: string;
}): Promise<void> {
  const info = statusLabels[opts.status] ?? { it: opts.status, emoji: "📦" };
  const shortId = opts.orderId.slice(0, 8).toUpperCase();

  const extraLines: string[] = [];
  if (opts.trackingNumber) {
    extraLines.push(`<p><strong>Numero di tracciamento:</strong> ${opts.trackingNumber}</p>`);
  }
  if (opts.notes) {
    extraLines.push(`<p><strong>Note:</strong> ${opts.notes}</p>`);
  }

  const body = `
    <p>Ciao <strong>${opts.customerName}</strong>,</p>
    <p>il tuo ordine <strong>#${shortId}</strong> è stato aggiornato.</p>
    <div class="status-box">
      <div style="font-size:28px;margin-bottom:6px">${info.emoji}</div>
      <div class="label">${info.it}</div>
    </div>
    ${extraLines.join("\n")}
    <p>Puoi seguire i tuoi ordini accedendo al tuo account su <a href="https://alphabit.sbs" style="color:#7c3aed">alphabit.sbs</a>.</p>
    <p>Grazie per aver scelto Alpha Bit Gadget!</p>
  `;

  const subject = `${info.emoji} Ordine #${shortId} — ${info.it}`;

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject,
    html: baseTemplate(`Aggiornamento ordine #${shortId}`, body),
  });
}

export async function sendOrderConfirmationEmail(opts: {
  to: string;
  customerName: string;
  orderId: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}): Promise<void> {
  const shortId = opts.orderId.slice(0, 8).toUpperCase();
  const itemRows = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:#374151">${i.name}</td><td style="text-align:center;color:#6b7280">x${i.quantity}</td><td style="text-align:right;color:#374151">€${i.price.toFixed(2)}</td></tr>`
    )
    .join("");

  const body = `
    <p>Ciao <strong>${opts.customerName}</strong>,</p>
    <p>abbiamo ricevuto il tuo ordine! Lo stiamo elaborando.</p>
    <div class="status-box">
      <div style="font-size:28px;margin-bottom:6px">🎉</div>
      <div class="label">Ordine confermato #${shortId}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead><tr style="border-bottom:2px solid #e5e7eb">
        <th style="text-align:left;padding:6px 0;color:#6b7280;font-size:12px">PRODOTTO</th>
        <th style="text-align:center;color:#6b7280;font-size:12px">QTÀ</th>
        <th style="text-align:right;color:#6b7280;font-size:12px">PREZZO</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
      <tfoot><tr style="border-top:2px solid #e5e7eb">
        <td colspan="2" style="padding:8px 0;font-weight:700;color:#1f2937">Totale</td>
        <td style="text-align:right;font-weight:700;color:#7c3aed">€${opts.total.toFixed(2)}</td>
      </tr></tfoot>
    </table>
    <p>Ti invieremo un'email quando il tuo ordine verrà spedito.</p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `🎉 Ordine #${shortId} confermato — Alpha Bit Gadget`,
    html: baseTemplate(`Ordine confermato #${shortId}`, body),
  });
}
