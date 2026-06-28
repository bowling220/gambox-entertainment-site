import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { games } from "../data/siteData";

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = `${title} | Gambox Entertainment`;
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

function getPageTitle(pathname: string) {
  const gameSlug = pathname.match(/^\/games\/([^/]+)/)?.[1];
  if (gameSlug) return games.find((game) => game.slug === gameSlug)?.title ?? "Game Details";

  const pageTitles: Record<string, string> = {
    "/": "Home",
    "/play-now": "Play Now",
    "/suggestions": "Suggestions",
    "/games": "Games",
    "/announcements": "Announcements",
    "/about": "About",
    "/members": "Members",
    "/careers": "Careers",
    "/admin/applications": "Applications Admin",
  };

  return pageTitles[pathname] ?? "Gambox Entertainment";
}
