import { Heart } from "lucide-react";
import { useFavoriteContext } from "./FavoritesProvider";

interface FavoriteButtonProps {
  houseId: string;
  compact?: boolean;
}

export function FavoriteButton({ houseId, compact = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteContext();
  const active = isFavorite(houseId);

  return (
    <button
      className={`favorite-button ${active ? "is-active" : ""} ${compact ? "is-compact" : ""}`}
      type="button"
      onClick={() => toggleFavorite(houseId)}
      aria-pressed={active}
      title={active ? "取消收藏" : "收藏户型"}
    >
      <Heart size={compact ? 17 : 19} fill={active ? "currentColor" : "none"} />
      {!compact && <span>{active ? "已收藏" : "收藏户型"}</span>}
    </button>
  );
}
