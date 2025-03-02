import Navbar from '../Navigation/Navbar';
import Breadcrumb from '../Navigation/Breadcrumb';

interface PageLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export default function PageLayout({ children, showBreadcrumb = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <Navbar />
      {showBreadcrumb && <Breadcrumb />}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}