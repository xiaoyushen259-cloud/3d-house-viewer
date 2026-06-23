import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { HouseCard } from "../components/HouseCard";
import { communities, houses } from "../data/mockData";

export function CommunityPage() {
  const { id } = useParams();
  const community = communities.find((item) => item.id === id) ?? communities[0];
  const communityHouses = houses.filter((house) => house.communityId === community.id);

  return (
    <section className="detail-shell">
      <Link className="back-link" to="/">
        <ArrowLeft size={18} />
        返回地图
      </Link>

      <div className="community-detail">
        <div className="detail-cover" style={{ background: community.cover }}>
          <span>{community.district}</span>
        </div>
        <div className="detail-info">
          <span className="eyebrow">小区详情</span>
          <h1>{community.name}</h1>
          <p>{community.summary}</p>
          <div className="detail-facts">
            <span>
              <MapPin size={18} />
              {community.address}
            </span>
            <span>
              <Building2 size={18} />
              均价 {community.averagePrice.toLocaleString()} 元/㎡
            </span>
          </div>
          <div className="tag-row">
            {community.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">可看户型</span>
          <h2>{communityHouses.length} 套户型支持 3D 看房</h2>
        </div>
      </div>
      <div className="house-grid">
        {communityHouses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
    </section>
  );
}
