export type RoomId = "living" | "kitchen" | "primary" | "second" | "bath";

export type RenovationStyleId = "modern" | "luxury" | "chinese";

export interface Community {
  id: string;
  name: string;
  district: string;
  address: string;
  averagePrice: number;
  position: {
    x: number;
    y: number;
  };
  lnglat: [number, number];
  cover: string;
  summary: string;
  tags: string[];
  transit: string;
  schools: string;
}

export interface House {
  id: string;
  communityId: string;
  name: string;
  layout: string;
  area: number;
  totalPrice: number;
  orientation: string;
  floor: string;
  building: string;
  cover: string;
  planImage?: string;
  vrImage?: string;
  solidImage?: string;
  panoramaImage?: string;
  tags: string[];
  highlight: string;
  roomCount: string;
}

export interface RenovationStyle {
  id: RenovationStyleId;
  name: string;
  note: string;
  wall: string;
  floor: string;
  sofa: string;
  cabinet: string;
  accent: string;
  panoramaImage?: string;
}

export interface Room {
  id: RoomId;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  camera: [number, number, number];
}
