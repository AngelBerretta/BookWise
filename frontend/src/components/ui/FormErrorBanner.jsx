/** Banner de error compartido por ProductForm y PostForm. */
const FormErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
      {message}
    </div>
  );
};

export default FormErrorBanner;