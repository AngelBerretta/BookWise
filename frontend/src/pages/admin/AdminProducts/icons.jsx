export const SortArrow = ({ direction }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`w-3 h-3 transition-transform duration-150 ${direction === 'desc' ? 'rotate-180' : ''}`}
    style={{ opacity: direction ? 1 : 0.35 }}
  >
    <path fillRule="evenodd" d="M8 3.25a.75.75 0 0 1 .75.75v6.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L7.25 10.19V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);