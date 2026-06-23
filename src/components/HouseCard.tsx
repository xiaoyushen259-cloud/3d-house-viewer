import { ArrowRight, Home, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { House } from "../types";
import { FavoriteButton } from "./FavoriteButton";

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  return (
    <article className="house-card">
      <div className="house-cover" style={{ background: house.cover }}>
        <span>{house.roomCount}</span>
      </div>
      <div className="house-card-body">
        <div className="house-card-title">
          <div>
            <h3>{house.name}</h3>
            <p>{house.highlight}</p>
          </div>
          <FavoriteButton houseId={house.id} compact />
        </div>
        <div className="metric-row">
          <span>
            <Home size={16} />
            {house.layout}
          </span>
          <span>
            <Ruler size={16} />
            {house.area}㎡
          </span>
          <strong>{house.totalPrice} 万</strong>
        </div>
        <div className="tag-row">
          {house.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link className="text-link" to={`/house/${house.id}`}>
          查看户型 <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
