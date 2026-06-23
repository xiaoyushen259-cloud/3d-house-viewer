import { Filter, LocateFixed, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AMapView } from "../components/AMapView";
import { HouseCard } from "../components/HouseCard";
import { areaOptions, communities, houses, layoutOptions, priceOptions } from "../data/mockData";
import type { Community, House } from "../types";

type FilterState = {
  price: string;
  area: string;
  layout: string;
};

export function HomePage() {
  const [selectedCommunityId, setSelectedCommunityId] = useState(communities[0].id);
  const [filters, setFilters] = useState<FilterState>({
    price: "all",
    area: "all",
    layout: "all",
  });

  const selectedCommunity = communities.find((community) => community.id === selectedCommunityId)!;
  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const matchesCommunity = house.communityId === selectedCommunityId;
      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "lt600" && house.totalPrice < 600) ||
        (filters.price === "600-800" && house.totalPrice >= 600 && house.totalPrice <= 800) ||
        (filters.price === "gt800" && house.totalPrice > 800);
      const matchesArea =
        filters.area === "all" ||
        (filters.area === "lt100" && house.area < 100) ||
        (filters.area === "100-120" && house.area >= 100 && house.area <= 120) ||
        (filters.area === "gt120" && house.area > 120);
      const matchesLayout = filters.layout === "all" || house.roomCount === filters.layout;

      return matchesCommunity && matchesPrice && matchesArea && matchesLayout;
    });
  }, [filters, selectedCommunityId]);

  return (
    <section className="home-shell">
      <aside className="search-panel">
        <div className="panel-heading">
          <span className="eyebrow">地图找房</span>
          <h1>先看位置，再看户型</h1>
          <p>示例区域为南岸新城，点选小区后可以查看楼盘和可 3D 漫游的户型。</p>
        </div>

        <div className="search-box">
          <Search size={18} />
          <span>南岸新城</span>
          <button type="button">切换区域</button>
        </div>

        <div className="filter-group" aria-label="筛选条件">
          <div className="filter-title">
            <Filter size={17} />
            筛选
          </div>
          <FilterSelect
            label="总价"
            value={filters.price}
            options={priceOptions}
            onChange={(price) => setFilters((current) => ({ ...current, price }))}
          />
          <FilterSelect
            label="面积"
            value={filters.area}
            options={areaOptions}
            onChange={(area) => setFilters((current) => ({ ...current, area }))}
          />
          <FilterSelect
            label="户型"
            value={filters.layout}
            options={layoutOptions}
            onChange={(layout) => setFilters((current) => ({ ...current, layout }))}
          />
        </div>

        <CommunitySummary community={selectedCommunity} />
      </aside>

      <div className="map-stage" aria-label="南岸新城地图">
        <div className="map-toolbar">
          <span>
            <LocateFixed size={17} />
            高德地图
          </span>
          <strong>{communities.length} 个小区</strong>
        </div>
        <AMapView
          communities={communities}
          selectedCommunityId={selectedCommunityId}
          onSelectCommunity={setSelectedCommunityId}
        />
      </div>

      <aside className="result-panel">
        <div className="result-heading">
          <div>
            <span className="eyebrow">当前小区</span>
            <h2>{selectedCommunity.name}</h2>
          </div>
          <Link className="secondary-button" to={`/community/${selectedCommunity.id}`}>
            查看小区
          </Link>
        </div>

        <div className="community-hero" style={{ background: selectedCommunity.cover }}>
          <span>{selectedCommunity.district}</span>
        </div>

        <p className="muted">{selectedCommunity.summary}</p>

        <div className="result-list">
          {filteredHouses.length > 0 ? (
            filteredHouses.map((house) => <HouseCard key={house.id} house={house} />)
          ) : (
            <div className="empty-state">
              <h3>没有符合条件的户型</h3>
              <p>可以放宽总价、面积或户型条件，再看看这个小区的其他选择。</p>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CommunitySummary({ community }: { community: Community }) {
  const communityHouses = houses.filter((house: House) => house.communityId === community.id);

  return (
    <div className="summary-card">
      <div>
        <span className="eyebrow">小区概览</span>
        <h2>{community.name}</h2>
      </div>
      <dl>
        <div>
          <dt>均价</dt>
          <dd>{community.averagePrice.toLocaleString()} 元/㎡</dd>
        </div>
        <div>
          <dt>在看户型</dt>
          <dd>{communityHouses.length} 套</dd>
        </div>
        <div>
          <dt>交通</dt>
          <dd>{community.transit}</dd>
        </div>
      </dl>
      <div className="tag-row">
        {community.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
