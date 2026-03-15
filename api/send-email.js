import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, project, 'project-size': projectSize, budget, message } = req.body;

    // Map raw values to human-readable German strings
    const projectMap = {
      'new': 'Neue Website',
      'redesign': 'Website Redesign',
      'landing': 'Landing Page',
      'other': 'Sonstiges'
    };
    
    const sizeMap = {
      'landing': 'Landing Page — 699€',
      'business': 'Business — 999€',
      'premium': 'Premium — Custom'
    };

    const displayProject = projectMap[project] || project;
    const displaySize = sizeMap[projectSize] || projectSize;

    // 1. Send notification to Ryqen
    const notification = await resend.emails.send({
      from: 'Ryqen Website <info@ryqen.de>',
      to: ['info@ryqen.de'],
      subject: `[Ryqen Lead] Neue Anfrage von ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050508; color: #e2e8f0; }
          .main { background-color: #0d0f14; margin: 40px auto 0 auto; width: 100%; max-width: 600px; border-radius: 8px; border: 1px solid #1a1d24; border-top: 4px solid #3b82f6; padding-bottom: 20px; }
          .logo-container { text-align: center; padding: 30px 20px 20px 20px; border-bottom: 1px solid #1a1d24; }
          .content { padding: 30px 40px 40px 40px; }
          h1 { font-size: 22px; color: #ffffff; margin-top: 0; margin-bottom: 25px; font-weight: 700; display:flex; align-items:center; gap:10px; }
          .tag { background: #1a1d24; color: #3b82f6; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .data-grid { display: grid; grid-template-columns: 100px 1fr; border: 1px solid #1a1d24; border-radius: 6px; overflow: hidden; margin-bottom: 25px;}
          .data-row { display: flex; border-bottom: 1px solid #1a1d24; font-size: 15px; }
          .data-row:last-child { border-bottom: none; }
          .data-label { width: 130px; background: #11131a; padding: 12px 15px; color: #94a3b8; font-weight: 600; font-size: 14px; border-right: 1px solid #1a1d24; }
          .data-value { padding: 12px 15px; color: #ffffff; flex: 1; word-break: break-all; }
          .highlight { color: #00ff88; font-weight: 600; }
          .message-box { background: #11131a; border: 1px solid #1a1d24; border-radius: 6px; padding: 20px; font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 25px; white-space: pre-wrap; }
          .message-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; margin-bottom: 10px; display: block; }
        </style>
        </head>
        <body>
          <div style="background-color: #050508; width: 100%; padding-bottom: 40px;">
            <div class="main">
              <div class="logo-container">
                <img src="https://ryqen.de/Ryqen_logo.png" alt="RYQEN" style="height: 30px; width: auto; display: block; margin: 0 auto; opacity: 0.8;">
              </div>
              <div class="content">
                <h1><span class="tag">New Lead</span> Neue Kontaktanfrage</h1>
                
                <div class="data-grid">
                  <div class="data-row">
                    <div class="data-label">Name</div>
                    <div class="data-value highlight">${name}</div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">E-Mail</div>
                    <div class="data-value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Projektart</div>
                    <div class="data-value">${displayProject}</div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Paket</div>
                    <div class="data-value">${displaySize}</div>
                  </div>
                  <div class="data-row">
                    <div class="data-label">Budget</div>
                    <div class="data-value">${budget || '<span style="color:#64748b;font-style:italic;">Nicht angegeben</span>'}</div>
                  </div>
                </div>

                <div class="message-box">
                  <span class="message-label">Nachricht</span>
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // 2. Send styled Auto-Responder to user
    const autoResponder = await resend.emails.send({
      from: 'Ryqen <info@ryqen.de>',
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
                <img src="https://ryqen.de/Ryqen_logo.png" alt="RYQEN" style="height: 35px; width: auto; display: block; margin: 0 auto;">
              </div>
              <div class="content">
                <h1>Hey ${name.split(' ')[0]}, let's talk!</h1>
                <p>Vielen Dank für Ihre spannende Projektanfrage. Sie ist sicher bei mir eingegangen!</p>
                
                <div class="info-box">
                  <p class="info-text">
                    <strong>Ihr Projekt:</strong> ${displayProject}
                  </p>
                </div>

                <p>Ich sichte gerade Ihre Daten und werde mich innerhalb der nächsten <span class="highlight">24 Stunden</span> persönlich bei Ihnen unter dieser E-Mail-Adresse melden, um die nächsten Schritte zu besprechen.</p>
                <p>Sollten Sie in der Zwischenzeit noch Details ergänzen wollen, antworten Sie einfach direkt auf diese E-Mail.</p>
                <p>Bis bald und viele Grüße aus Passau,<br>
                <span class="highlight">Maximilian Endl</span></p>
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
