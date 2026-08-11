import { Link } from 'react-router-dom';

const RegisterSuccessPanel = ({ onBack }) => (
  <>
    <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--secondary-bg)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--bw-secondary)' }}>
        mark_email_read
      </span>
    </div>

    <div className="space-y-2">
      <h2 className="font-headline font-medium text-2xl" style={{ color: 'var(--bw-on-surface)' }}>
        ¡Cuenta creada!
      </h2>
      <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--bw-on-surface-variant)' }}>
        Revisá tu email para verificar tu cuenta.
        <br />
        El link expira en 24 horas.
      </p>
    </div>

    <div className="w-full flex flex-col gap-3 mt-4">
      <Link to="/login" className="bw-btn-primary">
        Ir al inicio de sesión
        <span className="material-symbols-outlined ml-2" style={{ fontSize: '18px' }}>
          arrow_forward
        </span>
      </Link>
      <button
        onClick={onBack}
        className="font-label text-sm transition-colors"
        style={{ color: 'var(--bw-on-surface-variant)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--bw-on-surface)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bw-on-surface-variant)'; }}
      >
        Volver al registro
      </button>
    </div>
  </>
);

export default RegisterSuccessPanel;