import type { Room, RoomId } from "../types";

interface MiniMapProps {
  rooms: Room[];
  currentRoom: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
}

export function MiniMap({ rooms, currentRoom, onSelectRoom }: MiniMapProps) {
  return (
    <div className="mini-map" aria-label="户型小地图">
      <div className="mini-map-title">户型小地图</div>
      <div className="floor-plan">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`room-block ${room.id === currentRoom ? "is-current" : ""}`}
            style={{
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.w}%`,
              height: `${room.h}%`,
            }}
            type="button"
            onClick={() => onSelectRoom(room.id)}
          >
            <span>{room.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
