import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { HouseCard } from "../components/HouseCard";
import { useFavoriteContext } from "../components/FavoritesProvider";
import { houses } from "../data/mockData";

export function FavoritesPage() {
  const { favoriteIds } = useFavoriteContext();
  const favoriteHouses = favoriteIds
    .map((id) => houses.find((house) => house.id === id))
    .filter((house): house is (typeof houses)[number] => Boolean(house));

  return (
    <section className="detail-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">收藏清单</span>
          <h1>你感兴趣的户型</h1>
        </div>
        <Link className="secondary-button" to="/">
          继续看房
        </Link>
      </div>

      {favoriteHouses.length > 0 ? (
        <div className="house-grid">
          {favoriteHouses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      ) : (
        <div className="empty-state large">
          <Heart size={38} />
          <h2>还没有收藏户型</h2>
          <p>看到合适的户型时，点“收藏户型”，它会保存在这里，刷新页面也不会丢。</p>
          <Link className="primary-button" to="/">
            去地图找房
          </Link>
        </div>
      )}
    </section>
  );
}
