import { ArrowLeft, Compass, DoorOpen, Maximize2, Play, Ruler } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { FavoriteButton } from "../components/FavoriteButton";
import { communities, houses } from "../data/mockData";

export function HousePage() {
  const { id } = useParams();
  const house = houses.find((item) => item.id === id) ?? houses[0];
  const community = communities.find((item) => item.id === house.communityId)!;

  return (
    <section className="detail-shell house-detail-shell">
      <Link className="back-link" to={`/community/${community.id}`}>
        <ArrowLeft size={18} />
        返回小区
      </Link>

      <div className="house-detail-layout">
        <div
          className={`plan-preview ${house.planImage ? "has-image" : ""}`}
          style={house.planImage ? undefined : { background: house.cover }}
        >
          {house.planImage ? (
            <img className="plan-preview-image" src={house.planImage} alt={`${house.name}户型图`} />
          ) : (
            <div className="plan-lines">
              <span className="plan-room large">客餐厅</span>
              <span className="plan-room kitchen">厨房</span>
              <span className="plan-room bedroom">主卧</span>
              <span className="plan-room second">次卧</span>
              <span className="plan-room bath">卫</span>
            </div>
          )}
        </div>

        <div className="house-detail-panel">
          <span className="eyebrow">{community.name}</span>
          <h1>{house.name}</h1>
          <p>{house.highlight}</p>

          <div className="fact-grid">
            <div>
              <Ruler size={19} />
              <span>面积</span>
              <strong>{house.area}㎡</strong>
            </div>
            <div>
              <DoorOpen size={19} />
              <span>户型</span>
              <strong>{house.layout}</strong>
            </div>
            <div>
              <Compass size={19} />
              <span>朝向</span>
              <strong>{house.orientation}</strong>
            </div>
            <div>
              <Maximize2 size={19} />
              <span>总价</span>
              <strong>{house.totalPrice} 万</strong>
            </div>
          </div>

          <div className="tag-row">
            {house.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="action-row">
            <Link className="primary-button" to={`/vr/${house.id}`}>
              <Play size={18} />
              进入 3D 看房
            </Link>
            <FavoriteButton houseId={house.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
