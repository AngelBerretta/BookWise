import useDashboard from './useDashboard';
import { buildStatCards } from './dashboardConfig';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import RecentProducts from './RecentProducts';
import QuickLinksSection from './QuickLinksSection';

/**
 * Panel principal de administración: stats del catálogo/blog,
 * últimos productos agregados y accesos rápidos.
 */
const Dashboard = () => {
  const { user, stats, recentProducts, loading, loadingRecent, greeting } = useDashboard();
  const statCards = buildStatCards(stats);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.45s ease both;
        }
        .stat-card {
          animation: fadeUp 0.45s ease both;
        }
        .quick-link {
          animation: fadeUp 0.45s ease both;
        }
      `}</style>

      <div className="bg-[var(--bg)]">
        <div className="max-w-4xl">
          <DashboardHeader user={user} greeting={greeting} />
          <DashboardStats loading={loading} statCards={statCards} />
          <RecentProducts loading={loadingRecent} products={recentProducts} />
          <QuickLinksSection />
        </div>
      </div>
    </>
  );
};

export default Dashboard;