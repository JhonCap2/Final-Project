import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* El contenido de tus páginas (Dashboard, Profile, etc.) se renderizará aquí */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}