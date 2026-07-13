import { Router, Request, Response } from "express";

const router = Router();

// POST /api/contact
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body as {
      name: string; email: string; subject: string; message: string;
    };
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "Tutti i campi sono obbligatori" });
      return;
    }
    // Log the contact message - email sending would go here with SMTP config
    req.log?.info({ name, email, subject }, "Contact form submitted");
    res.json({ message: "Messaggio inviato! Ti risponderemo entro 24 ore." });
  } catch (err) {
    req.log?.error({ err }, "submitContact error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
