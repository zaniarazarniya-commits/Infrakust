/**
 * api/contact.js — Vercel serverless-funktion som tar emot kontaktformuläret
 * och skickar ett mail till hello@infrakust.se via Resend.
 *
 * SETUP (engångs):
 *   1. Skapa konto på https://resend.com och verifiera domänen infrakust.se.
 *   2. Lägg till miljövariabeln RESEND_API_KEY i Vercel
 *      (Project → Settings → Environment Variables).
 *   3. Klart — formuläret skickar då mail från hello@infrakust.se.
 *
 * Utan nyckeln svarar funktionen med ett tydligt fel istället för att krascha.
 */
const TO = 'hello@infrakust.se';
const FROM = 'Infrakust webb <hello@infrakust.se>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { name, email, message, company } = body;

  // Honeypot: riktiga användare fyller aldrig i "company".
  if (company) return res.status(200).json({ ok: true });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Fyll i namn, e-post och meddelande.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ogiltig e-postadress.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'E-posttjänsten är inte konfigurerad (saknar RESEND_API_KEY).' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Nytt meddelande från ${name} – infrakust.se`,
        text: `Namn: ${name}\nE-post: ${email}\n\n${message}`,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error:', detail);
      return res.status(502).json({ error: 'Kunde inte skicka meddelandet just nu.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Något gick fel. Försök igen.' });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
