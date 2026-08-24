import { StatCard, StatCardSkeleton } from './StatCard';

const DashboardStats = ({ loading, statCards }) => (
  loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <StatCardSkeleton key={i} delay={`${i * 60}ms`} />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
);

export default DashboardStats;