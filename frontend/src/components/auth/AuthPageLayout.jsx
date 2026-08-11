import AuthMobileFooterQuote from './AuthMobileFooterQuote';

/**
 * Layout de dos columnas compartido por Login/Register: panel izquierdo
 * con scroll propio + panel decorativo derecho (AuthSidePanel).
 */
const AuthPageLayout = ({
  children,
  innerClassName = 'flex flex-col gap-[clamp(0.6rem,2dvh,1.25rem)]',
  sidePanel,
}) => (
  <div className="login-page-root">
    <div
      className="w-full md:w-1/2 lg:w-5/12 xl:w-[480px] auth-panel px-8 md:px-16 lg:px-24
                 shrink-0 max-h-full self-center md:self-auto md:h-full overflow-y-auto hide-scrollbar relative z-10"
      style={{
        backgroundColor: 'var(--bw-surface-container-lowest)',
        boxShadow: '0 12px 40px rgba(27,28,25,0.06)',
      }}
    >
      <div className={`max-w-sm w-full mx-auto ${innerClassName}`}>
        {children}
      </div>
      <AuthMobileFooterQuote />
    </div>
    {sidePanel}
  </div>
);

export default AuthPageLayout;