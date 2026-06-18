import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
