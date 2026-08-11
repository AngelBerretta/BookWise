/** Botón de submit con spinner — compartido por LoginForm y RegisterForm. */
const AuthSubmitButton = ({ loading, loadingLabel, label }) => (
  <button type="submit" disabled={loading} className="bw-btn-primary mt-1">
    {loading ? (
      <>
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        {loadingLabel}
      </>
    ) : (
      <>
        {label}
        <span aria-hidden="true" className="material-symbols-outlined ml-2" style={{ fontSize: '18px' }}>
          arrow_forward
        </span>
      </>
    )}
  </button>
);

export default AuthSubmitButton;