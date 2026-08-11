import { Link } from 'react-router-dom';

const AuthBrandHeader = ({ title, subtitle }) => (
  <div className="text-center md:text-left space-y-[clamp(0.35rem,1.2dvh,0.75rem)]">
    <Link to="/" className="inline-block">
      <span
        className="text-2xl font-headline font-bold italic tracking-tighter"
        style={{ color: 'var(--bw-primary)' }}
      >
        BookWise
      </span>
    </Link>

    <h1
      className="font-headline font-medium tracking-tight leading-tight"
      style={{
        fontSize: 'clamp(1.15rem, 2.4vw, 1.5rem)',
        color: 'var(--bw-on-surface)',
        fontFamily: "'Newsreader', Georgia, serif",
      }}
    >
      {title}
    </h1>

    <p className="auth-subtitle font-body text-sm leading-relaxed" style={{ color: 'var(--bw-on-surface-variant)' }}>
      {subtitle}
    </p>
  </div>
);

export default AuthBrandHeader;