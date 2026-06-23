import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { FavoritesProvider } from "./components/FavoritesProvider";
import { CommunityPage } from "./pages/CommunityPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { HousePage } from "./pages/HousePage";
import { VRPage } from "./pages/VRPage";

export default function App() {
  return (
    <FavoritesProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/house/:id" element={<HousePage />} />
          <Route path="/vr/:id" element={<VRPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </FavoritesProvider>
  );
}
