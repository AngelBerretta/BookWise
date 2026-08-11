import DemoSpinner from './DemoSpinner';

const DemoAccountsPanel = ({ demoLoading, onDemoLogin }) => (
  <div
    className="demo-quick-access rounded-xl p-2.5 flex flex-col gap-2"
    style={{ backgroundColor: 'var(--bw-surface-container-low)', border: '1px solid rgba(196,198,205,0.3)' }}
  >
    <p className="font-label text-xs leading-snug flex items-center gap-1" style={{ color: 'var(--bw-on-surface-variant)' }}>
      <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--bw-primary)' }}>
        bolt
      </span>
      Acceso demo con un clic, sin registrarte:
    </p>

    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onDemoLogin('user')}
        disabled={!!demoLoading}
        aria-busy={demoLoading === 'user'}
        className="demo-role-btn demo-role-btn--outline flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--bw-outline-variant)', color: 'var(--bw-on-surface)' }}
      >
        {demoLoading === 'user' ? <DemoSpinner small /> : (
          <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--bw-primary)' }}>
            person
          </span>
        )}
        <span className="font-label text-xs font-medium">
          {demoLoading === 'user' ? 'Ingresando…' : 'Lector'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onDemoLogin('admin')}
        disabled={!!demoLoading}
        aria-busy={demoLoading === 'admin'}
        className="demo-role-btn demo-role-btn--filled flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, var(--bw-primary) 0%, var(--bw-primary-container) 100%)',
          boxShadow: '0 2px 8px rgba(4, 22, 39, 0.25)',
        }}
      >
        {demoLoading === 'admin' ? <DemoSpinner small light /> : (
          <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            admin_panel_settings
          </span>
        )}
        <span className="font-label text-xs font-medium">
          {demoLoading === 'admin' ? 'Ingresando…' : 'Administrador'}
        </span>
      </button>
    </div>
  </div>
);

export default DemoAccountsPanel;