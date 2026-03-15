import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, project, 'project-size': projectSize, budget, message } = req.body;

    // 1. Send notification to Ryqen
    const notification = await resend.emails.send({
      from: 'Ryqen Website <onboarding@resend.dev>', // Update this to your verified domain e.g. 'no-reply@ryqen.de' once verified
      to: ['info@ryqen.de'],
      subject: `Neue Projektanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Projektart:</strong> ${project}</p>
        <p><strong>Paket:</strong> ${projectSize}</p>
        <p><strong>Budget:</strong> ${budget || 'Nicht angegeben'}</p>
        <p><strong>Nachricht:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    // 2. Send styled Auto-Responder to user
    const autoResponder = await resend.emails.send({
      from: 'Ryqen <onboarding@resend.dev>', // Update to 'info@ryqen.de' once verified
      to: [email],
      subject: `Vielen Dank für Ihre Anfrage, ${name.split(' ')[0]}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050508; color: #e2e8f0; }
          .main { background-color: #0d0f14; margin: 40px auto 0 auto; width: 100%; max-width: 600px; border-radius: 8px; border: 1px solid #1a1d24; border-top: 4px solid #00ff88; padding-bottom: 20px; }
          .logo-container { text-align: center; padding: 30px 20px 20px 20px; }
          .content { padding: 20px 40px 40px 40px; }
          h1 { font-size: 24px; color: #ffffff; margin-top: 0; margin-bottom: 20px; font-weight: 700; }
          p { font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 20px; color: #94a3b8; }
          .highlight { color: #ffffff; font-weight: 600; }
          .info-box { background-color: #1a1d24; border-left: 3px solid #00ff88; padding: 15px 20px; margin-bottom: 25px; border-radius: 0 4px 4px 0; }
          .info-text { margin: 0; font-size: 15px; color: #cbd5e1; }
          .footer { text-align: center; padding: 20px; font-size: 13px; color: #64748b; }
          .footer a { color: #00ff88; text-decoration: none; }
        </style>
        </head>
        <body>
          <div style="background-color: #050508; width: 100%; padding-bottom: 40px;">
            <div class="main">
              <div class="logo-container">
                <h2 style="color:#00ff88; margin:0; font-family: monospace; letter-spacing: 2px;">RYQEN.</h2>
              </div>
              <div class="content">
                <h1>Hey ${name.split(' ')[0]}, let's talk!</h1>
                <p>Vielen Dank für Ihre spannende Projektanfrage. Sie ist sicher bei mir eingegangen!</p>
                
                <div class="info-box">
                  <p class="info-text">
                    <strong>Ihr Projekt:</strong> ${project}
                  </p>
                </div>

                <p>Ich sichte gerade Ihre Daten und werde mich innerhalb der nächsten <span class="highlight">24 Stunden</span> persönlich bei Ihnen unter dieser E-Mail-Adresse melden, um die nächsten Schritte zu besprechen.</p>
                <p>Sollten Sie in der Zwischenzeit noch Details ergänzen wollen, antworten Sie einfach direkt auf diese E-Mail.</p>
                <p>Bis bald und viele Grüße aus Passau,<br>
                <span class="highlight">Ihr Ryqen Team</span></p>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Ryqen – Webdesign Passau.<br>
              <a href="https://ryqen.de">ryqen.de</a> | info@ryqen.de</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (notification.error || autoResponder.error) {
      console.error(notification.error || autoResponder.error);
      return res.status(400).json({ error: notification.error || autoResponder.error });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
