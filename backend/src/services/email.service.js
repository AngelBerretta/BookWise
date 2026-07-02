import sgMail from "@sendgrid/mail";
import config from "../../config.js";

// ── Verificar si SendGrid está configurado ────────────────────────────────────
const isSendGridConfigured =
  config.sendgrid.apiKey &&
  config.sendgrid.apiKey.startsWith("SG.") &&
  config.sendgrid.apiKey !== "SG.xxxxxxxxxxxxxxxxxxxxxxxx";

if (isSendGridConfigured) {
  sgMail.setApiKey(config.sendgrid.apiKey);
  console.log("📧  SendGrid configurado correctamente");
} else {
  console.log("⚠️   SendGrid no configurado - los emails no se enviarán");
}

// ── sendVerificationEmail ─────────────────────────────────────────────────────
const sendVerificationEmail = async (to, username, token) => {
  
  // Si no está configurado, mostrar el token en consola y continuar
  if (!isSendGridConfigured) {
    console.log("─────────────────────────────────────────");
    console.log("📧  [DEV] Email de verificación omitido");
    console.log(`👤  Usuario: ${username}`);
    console.log(`📬  Para:    ${to}`);
    console.log(`🔑  Token:   ${token}`);
    console.log(`🔗  URL:     ${config.client.url}/verify?token=${token}`);
    console.log("─────────────────────────────────────────");
    return; // ← Sale sin error
  }

  // Si está configurado, enviar el email real
  const verificationUrl = `${config.client.url}/verify?token=${token}`;

  const msg = {
    to,
    from: config.sendgrid.from,
    subject: "BookWise – Verificá tu cuenta",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
        <h2>Hola, ${username} 👋</h2>
        <p>Gracias por registrarte en <strong>BookWise</strong>.</p>
        <p>Para activar tu cuenta hacé clic en el siguiente botón:</p>
        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            margin: 16px 0;
            padding: 12px 24px;
            background: #4f46e5;
            color: #fff;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
          "
        >
          Verificar cuenta
        </a>
        <p style="color: #666; font-size: 0.875rem;">
          Si no creaste esta cuenta podés ignorar este email.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
};

export { sendVerificationEmail };