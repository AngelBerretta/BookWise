import { WishlistIcon } from '../../ui/icons/NavIcons';

const WishlistMenuEmpty = () => (
  <div className="px-4 py-10 flex flex-col items-center text-center gap-2">
    <WishlistIcon />
    <p className="text-sm text-[var(--text)]">Todavía no guardaste nada</p>
  </div>
);

export default WishlistMenuEmpty;