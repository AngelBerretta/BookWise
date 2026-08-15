const SkeletonCover = () => (
  <div className="lg:col-span-5 relative">
    <div className="lg:sticky lg:top-32">
      <div
        className="rounded-xl p-5 sm:p-8 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-container)' }}
      >
        <div
          className="w-full max-w-xs rounded-lg"
          style={{ aspectRatio: '3/4', backgroundColor: 'var(--bg-subtle)' }}
        />
      </div>
    </div>
  </div>
);

export default SkeletonCover;