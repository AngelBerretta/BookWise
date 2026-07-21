import Spinner from './Spinner';

const Button = ({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  type     = 'button',
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-medium tracking-wide border',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'select-none whitespace-nowrap',
    'cursor-pointer',
  ].join(' ');

  const variants = {
    primary: [
      'bg-[var(--text-h)] text-[var(--bg)] border-transparent',
      'hover:opacity-80',
      'focus:ring-[var(--text-h)]',
      'shadow-[0_4px_20px_rgba(4,22,39,0.15)]',
    ].join(' '),
    secondary: [
      'bg-transparent text-[var(--text-h)] border-[var(--border)]',
      'hover:bg-[var(--bg-container)] hover:border-[var(--border)]',
      'focus:ring-[var(--text-h)]',
    ].join(' '),
    danger: [
      'bg-red-700 text-white border-transparent',
      'hover:bg-red-800',
      'focus:ring-red-600',
    ].join(' '),
    ghost: [
      'bg-transparent text-[var(--text)] border-transparent',
      'hover:bg-[var(--bg-container)] hover:text-[var(--text-h)]',
      'focus:ring-[var(--text-h)]',
    ].join(' '),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
    md: 'px-5 py-2.5 text-sm rounded-[var(--radius)]',
    lg: 'px-8 py-3.5 text-base rounded-[var(--radius)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[base, variants[variant], sizes[size], className].join(' ')}
      {...rest}
    >
      {loading && <Spinner size={size === 'lg' ? 'md' : 'sm'} />}
      {children}
    </button>
  );
};

export default Button;