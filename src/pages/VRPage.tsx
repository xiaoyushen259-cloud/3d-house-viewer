import { ArrowLeft, BadgeInfo, DoorOpen, Palette } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FavoriteButton } from "../components/FavoriteButton";
import { MiniMap } from "../components/MiniMap";
import { ThreeViewer } from "../components/ThreeViewer";
import { communities, houses, renovationStyles, rooms } from "../data/mockData";
import type { RenovationStyleId, RoomId } from "../types";

export function VRPage() {
  const { id } = useParams();
  const house = houses.find((item) => item.id === id) ?? houses[0];
  const community = communities.find((item) => item.id === house.communityId)!;
  const [styleId, setStyleId] = useState<RenovationStyleId>("modern");
  const [currentRoom, setCurrentRoom] = useState<RoomId>("living");

  const styleConfig = useMemo(
    () => renovationStyles.find((style) => style.id === styleId) ?? renovationStyles[0],
    [styleId],
  );

  return (
    <section className="vr-shell">
      <div className="vr-main">
        <ThreeViewer
          styleConfig={styleConfig}
          currentRoom={currentRoom}
          imageSrc={house.vrImage}
          imageAlt={`${house.name} 3D看房预览`}
          panoramaSrc={styleConfig.panoramaImage ?? house.panoramaImage}
        />
        <div className="vr-overlay top-left">
          <Link className="back-link vr-back" to={`/house/${house.id}`}>
            <ArrowLeft size={18} />
            返回户型
          </Link>
          <div>
            <span className="eyebrow">{community.name}</span>
            <h1>{house.name}</h1>
          </div>
        </div>
        <div className="vr-overlay bottom-left">
          <MiniMap rooms={rooms} currentRoom={currentRoom} onSelectRoom={setCurrentRoom} />
        </div>
      </div>

      <aside className="vr-side-panel">
        <div className="panel-heading compact">
          <span className="eyebrow">3D 看房</span>
          <h2>{house.layout}</h2>
          <p>{house.area}㎡ · {house.orientation} · {house.totalPrice} 万</p>
        </div>

        <section className="tool-section">
          <h3>
            <DoorOpen size={18} />
            切换房间
          </h3>
          <div className="room-list">
            {rooms.map((room) => (
              <button
                key={room.id}
                className={room.id === currentRoom ? "is-selected" : ""}
                type="button"
                onClick={() => setCurrentRoom(room.id)}
              >
                {room.name}
              </button>
            ))}
          </div>
        </section>

        <section className="tool-section">
          <h3>
            <Palette size={18} />
            装修风格
          </h3>
          <div className="style-list">
            {renovationStyles.map((style) => (
              <button
                key={style.id}
                className={style.id === styleId ? "is-selected" : ""}
                type="button"
                onClick={() => setStyleId(style.id)}
              >
                <span className="style-swatch" style={{ background: style.accent }} />
                <strong>{style.name}</strong>
                <small>{style.note}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="tool-section note">
          <h3>
            <BadgeInfo size={18} />
            当前方案
          </h3>
          <p>{styleConfig.note}</p>
        </section>

        <FavoriteButton houseId={house.id} />
      </aside>
    </section>
  );
}
