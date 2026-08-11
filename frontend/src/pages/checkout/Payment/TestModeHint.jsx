const TestModeHint = () => (
  <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-3 text-sm text-[var(--text)]">
    <p className="font-medium text-[var(--text-h)] mb-1">💳 Pasarela de pago en modo test</p>
    <p>
      Este checkout usa Stripe en modo test — no se realiza ningún cobro real. Usá la tarjeta{' '}
      <span className="font-mono font-medium text-[var(--text-h)]">4242 4242 4242 4242</span>, cualquier
      fecha de vencimiento futura, cualquier CVC de 3 dígitos y cualquier código postal.
    </p>
  </div>
);

export default TestModeHint;