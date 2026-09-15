const DemoSpinner = ({ light = false, small = false }) => (
  <svg
    className={small ? 'animate-spin h-[18px] w-[18px]' : 'animate-spin h-5 w-5'}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ color: light ? '#ffffff' : 'var(--bw-primary)' }}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

export default DemoSpinner;