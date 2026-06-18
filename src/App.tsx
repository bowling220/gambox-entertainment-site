import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ComingSoon } from "./components/ComingSoon";
import { SiteLayout } from "./layouts/SiteLayout";
import { AboutPage } from "./pages/AboutPage";
import { AdminApplicationsPage } from "./pages/AdminApplicationsPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { CareersPage } from "./pages/CareersPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { GamesPage } from "./pages/GamesPage";
import { IndexPage } from "./pages/IndexPage";
import { MembersPage } from "./pages/MembersPage";
import { SuggestionsPage } from "./pages/SuggestionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="play-now" element={<ComingSoon />} />
          <Route path="suggestions" element={<SuggestionsPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/:slug" element={<GameDetailPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="admin/applications" element={<AdminApplicationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
