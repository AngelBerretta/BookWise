const ToastProgressBar = ({ bar, duration }) => (
  <div
    className={`absolute bottom-0 left-0 h-0.5 ${bar}`}
    style={{ animation: `toastProgress ${duration}ms linear forwards`, width: '100%' }}
  />
);

export default ToastProgressBar;