import type { Community, House, RenovationStyle, Room } from "../types";
import houseH101Plan from "../assets/house-h101-plan.png";
import houseH101Panorama from "../assets/house-h101-panorama.png";
import houseH101Vr from "../assets/house-h101-vr.png";
import houseH101Solid from "../assets/house-h101-3d.png";
import houseH101Cover from "../assets/house-h101-cover.png";
import houseH102Cover from "../assets/house-h102-cover.png";
import communityChenghuYunjing from "../assets/community-chenghu-yunjing.png";
import panoramaChinese from "../assets/panorama-chinese.png";
import panoramaLuxury from "../assets/panorama-luxury.png";
import panoramaModern from "../assets/panorama-modern.png";

export const communities: Community[] = [
  {
    id: "c-01",
    name: "澄湖云境",
    district: "南岸新城",
    address: "云栖路与望江街交汇处",
    averagePrice: 68200,
    position: { x: 34, y: 36 },
    lnglat: [120.18466, 30.18182],
    cover:
      `linear-gradient(180deg, rgba(37, 53, 47, 0.02), rgba(37, 53, 47, 0.24)), url(${communityChenghuYunjing})`,
    summary: "近公园和地铁的改善型社区，楼间距宽，适合三口之家和换房用户。",
    tags: ["近地铁", "公园旁", "改善盘"],
    transit: "步行约 8 分钟到 6 号线",
    schools: "周边 2 所幼儿园、1 所九年制学校",
  },
  {
    id: "c-02",
    name: "栖岸里",
    district: "南岸新城",
    address: "溪湾路 88 号",
    averagePrice: 59600,
    position: { x: 58, y: 48 },
    lnglat: [120.19798, 30.18835],
    cover:
      "linear-gradient(135deg, rgba(55,69,81,.86), rgba(11,169,159,.72)), url('')",
    summary: "总价更友好的刚改社区，户型方正，生活配套集中。",
    tags: ["总价友好", "商业近", "户型方正"],
    transit: "步行约 12 分钟到规划站点",
    schools: "邻近社区幼儿园和区重点小学",
  },
  {
    id: "c-03",
    name: "望江序",
    district: "南岸新城",
    address: "滨江东路 19 号",
    averagePrice: 73500,
    position: { x: 44, y: 62 },
    lnglat: [120.2057, 30.17652],
    cover:
      "linear-gradient(135deg, rgba(21,39,55,.88), rgba(234,172,84,.78)), url('')",
    summary: "临江视野较好，公共空间品质高，适合重视居住感的家庭。",
    tags: ["江景", "品质社区", "大平层"],
    transit: "开车约 15 分钟到核心商圈",
    schools: "周边教育资源成熟",
  },
];

export const houses: House[] = [
  {
    id: "h-101",
    communityId: "c-01",
    name: "云境 108 方三房",
    layout: "3 室 2 厅 2 卫",
    roomCount: "三房",
    area: 108,
    totalPrice: 735,
    orientation: "南向",
    floor: "中楼层",
    building: "3 号楼",
    cover: `linear-gradient(180deg, rgba(37, 53, 47, 0.02), rgba(37, 53, 47, 0.22)), url(${houseH101Cover})`,
    planImage: houseH101Plan,
    vrImage: houseH101Vr,
    solidImage: houseH101Solid,
    panoramaImage: houseH101Panorama,
    tags: ["主卧套房", "双阳台", "动静分区"],
    highlight: "客餐厅一体，南向双开间，适合三口之家长期居住。",
  },
  {
    id: "h-102",
    communityId: "c-01",
    name: "云境 128 方四房",
    layout: "4 室 2 厅 2 卫",
    roomCount: "四房",
    area: 128,
    totalPrice: 876,
    orientation: "南北通透",
    floor: "高楼层",
    building: "5 号楼",
    cover: `linear-gradient(180deg, rgba(37, 53, 47, 0.02), rgba(37, 53, 47, 0.22)), url(${houseH102Cover})`,
    tags: ["四开间朝南", "独立家政区", "可改书房"],
    highlight: "四房尺度更从容，适合二孩家庭或需要独立书房的用户。",
  },
  {
    id: "h-201",
    communityId: "c-02",
    name: "栖岸 89 方小三房",
    layout: "3 室 2 厅 1 卫",
    roomCount: "三房",
    area: 89,
    totalPrice: 532,
    orientation: "东南向",
    floor: "低楼层",
    building: "8 号楼",
    cover: "linear-gradient(145deg, #f4f7f7, #cfe2dd 55%, #b7c5bf)",
    tags: ["低总价", "紧凑三房", "明厨明卫"],
    highlight: "总价压力较低，空间利用率高，适合作为第一套改善房。",
  },
  {
    id: "h-202",
    communityId: "c-02",
    name: "栖岸 115 方舒居",
    layout: "3 室 2 厅 2 卫",
    roomCount: "三房",
    area: 115,
    totalPrice: 684,
    orientation: "南向",
    floor: "中楼层",
    building: "2 号楼",
    cover: "linear-gradient(145deg, #eff8f5, #d5e9e4 50%, #f1c36b)",
    tags: ["宽厅", "双卫", "收纳多"],
    highlight: "客厅尺度舒展，两个卫生间能明显提升早晚高峰的生活效率。",
  },
  {
    id: "h-301",
    communityId: "c-03",
    name: "望江 143 方四房",
    layout: "4 室 2 厅 2 卫",
    roomCount: "四房",
    area: 143,
    totalPrice: 1050,
    orientation: "南北通透",
    floor: "高楼层",
    building: "1 号楼",
    cover: "linear-gradient(145deg, #edf2f6, #cad9df 48%, #e7bd75)",
    tags: ["江景阳台", "横厅", "主卧套房"],
    highlight: "横厅连接大阳台，视野开阔，适合重视家庭公共空间的用户。",
  },
];

export const renovationStyles: RenovationStyle[] = [
  {
    id: "modern",
    name: "现代简约",
    note: "浅墙面、木地板、低饱和家具，适合想要明亮耐看的家庭。",
    wall: "#eef4f2",
    floor: "#c9a875",
    sofa: "#71827e",
    cabinet: "#f8faf9",
    accent: "#0f8f87",
    panoramaImage: panoramaModern,
  },
  {
    id: "luxury",
    name: "轻奢",
    note: "灰白石材感搭配金属点缀，整体更精致，但不显得夸张。",
    wall: "#e7e8e5",
    floor: "#a9977f",
    sofa: "#48515a",
    cabinet: "#f4efe7",
    accent: "#c8913f",
    panoramaImage: panoramaLuxury,
  },
  {
    id: "chinese",
    name: "新中式",
    note: "温润木色和留白墙面，适合喜欢安静、稳重居住感的用户。",
    wall: "#f3efe6",
    floor: "#8f6240",
    sofa: "#6c766b",
    cabinet: "#eadcc9",
    accent: "#9c4f38",
    panoramaImage: panoramaChinese,
  },
];

export const rooms: Room[] = [
  { id: "living", name: "客餐厅", x: 16, y: 14, w: 44, h: 36, camera: [0, 6, 12] },
  { id: "kitchen", name: "厨房", x: 60, y: 14, w: 24, h: 22, camera: [7, 5, 6] },
  { id: "primary", name: "主卧", x: 16, y: 52, w: 30, h: 32, camera: [-7, 5, 4] },
  { id: "second", name: "次卧", x: 48, y: 52, w: 22, h: 32, camera: [4, 5, 3] },
  { id: "bath", name: "卫生间", x: 72, y: 52, w: 14, h: 32, camera: [8, 5, -2] },
];

export const priceOptions = [
  { value: "all", label: "不限总价" },
  { value: "lt600", label: "600 万内" },
  { value: "600-800", label: "600-800 万" },
  { value: "gt800", label: "800 万以上" },
];

export const areaOptions = [
  { value: "all", label: "不限面积" },
  { value: "lt100", label: "100㎡ 内" },
  { value: "100-120", label: "100-120㎡" },
  { value: "gt120", label: "120㎡ 以上" },
];

export const layoutOptions = [
  { value: "all", label: "不限户型" },
  { value: "三房", label: "三房" },
  { value: "四房", label: "四房" },
];
