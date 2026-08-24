const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3"><div className="w-4 h-4 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-16 rounded-lg bg-[var(--code-bg)] shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          <div className="h-3.5 rounded bg-[var(--code-bg)] w-4/5" />
          <div className="h-3 rounded bg-[var(--code-bg)] w-2/5" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-14 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-8 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-16 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-3.5 w-12 rounded bg-[var(--code-bg)]" /></td>
    <td className="px-4 py-3"><div className="h-8 w-20 rounded-lg bg-[var(--code-bg)]" /></td>
  </tr>
);

export default SkeletonRow;