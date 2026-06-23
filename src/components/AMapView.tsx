import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import type { Community } from "../types";

type AMapViewProps = {
  communities: Community[];
  selectedCommunityId: string;
  onSelectCommunity: (communityId: string) => void;
};

type AMapInstance = {
  add: (items: unknown[]) => void;
  addControl: (control: unknown) => void;
  destroy: () => void;
  setCenter: (center: [number, number]) => void;
};

type AMapMarker = {
  on: (eventName: string, handler: () => void) => void;
  setContent: (content: string) => void;
};

export function AMapView({ communities, selectedCommunityId, onSelectCommunity }: AMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<AMapInstance | null>(null);
  const markerRef = useRef<Map<string, AMapMarker>>(new Map());
  const onSelectRef = useRef(onSelectCommunity);
  const amapKey = import.meta.env.VITE_AMAP_KEY;
  const amapSecurityCode = import.meta.env.VITE_AMAP_SECURITY_CODE;

  useEffect(() => {
    onSelectRef.current = onSelectCommunity;
  }, [onSelectCommunity]);

  useEffect(() => {
    const firstCommunity = communities[0];

    if (!firstCommunity || !containerRef.current || !amapKey || !amapSecurityCode) {
      return;
    }

    window._AMapSecurityConfig = {
      securityJsCode: amapSecurityCode,
    };

    let cancelled = false;

    AMapLoader.load({
      key: amapKey,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"],
    }).then((AMap) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const map = new AMap.Map(containerRef.current, {
        center: firstCommunity.lnglat,
        pitch: 38,
        resizeEnable: true,
        rotation: -8,
        viewMode: "3D",
        zoom: 14,
      }) as AMapInstance;

      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar({ position: "RB" }));

      const markers = communities.map((community) => {
        const marker = new AMap.Marker({
          anchor: "bottom-center",
          content: renderMarkerContent(community, community.id === selectedCommunityId),
          offset: new AMap.Pixel(0, 0),
          position: community.lnglat,
          title: community.name,
        }) as AMapMarker;

        marker.on("click", () => onSelectRef.current(community.id));
        markerRef.current.set(community.id, marker);
        return marker;
      });

      map.add(markers);
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      markerRef.current.clear();
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [amapKey, amapSecurityCode, communities]);

  useEffect(() => {
    const selectedCommunity = communities.find((community) => community.id === selectedCommunityId);

    if (!selectedCommunity) {
      return;
    }

    markerRef.current.forEach((marker, communityId) => {
      const community = communities.find((item) => item.id === communityId);

      if (community) {
        marker.setContent(renderMarkerContent(community, communityId === selectedCommunityId));
      }
    });

    mapRef.current?.setCenter(selectedCommunity.lnglat);
  }, [communities, selectedCommunityId]);

  if (!amapKey || !amapSecurityCode) {
    return (
      <div className="amap-view map-fallback" aria-label="小区位置示意图">
        {communities.map((community) => (
          <button
            key={community.id}
            className={`fallback-marker ${community.id === selectedCommunityId ? "is-selected" : ""}`}
            style={{ left: `${community.position.x}%`, top: `${community.position.y}%` }}
            type="button"
            onClick={() => onSelectCommunity(community.id)}
          >
            <span>{community.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return <div ref={containerRef} className="amap-view" />;
}

function renderMarkerContent(community: Community, selected: boolean) {
  const price = Math.round(community.averagePrice / 1000) / 10;

  return `
    <button class="amap-community-marker ${selected ? "is-selected" : ""}" type="button">
      <span>${community.name}</span>
      <strong>${price} 万/㎡</strong>
    </button>
  `;
}
