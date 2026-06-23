import { Building2, Heart, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useFavoriteContext } from "./FavoritesProvider";

export function Header() {
  const { favoriteIds } = useFavoriteContext();

  return (
    <header className="app-header">
      <NavLink className="brand" to="/" aria-label="返回地图找房">
        <span className="brand-mark">
          <Building2 size={22} />
        </span>
        <span>
          <strong>看房岛</strong>
          <small>南岸新城 3D 导览</small>
        </span>
      </NavLink>
      <nav className="top-nav" aria-label="主导航">
        <NavLink to="/">
          <MapPinned size={18} />
          地图找房
        </NavLink>
        <NavLink to="/favorites">
          <Heart size={18} />
          收藏清单
          {favoriteIds.length > 0 && <span className="nav-count">{favoriteIds.length}</span>}
        </NavLink>
      </nav>
    </header>
  );
}
