import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      {/* Main content — offset by sidebar width on desktop */}
      <main className="lg:pl-64 min-h-screen transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
