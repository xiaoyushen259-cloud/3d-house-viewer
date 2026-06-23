import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { rooms } from "../data/mockData";
import type { RenovationStyle, RoomId } from "../types";

interface ThreeViewerProps {
  styleConfig: RenovationStyle;
  currentRoom: RoomId;
  imageSrc?: string;
  imageAlt?: string;
  panoramaSrc?: string;
}

export function ThreeViewer({
  styleConfig,
  currentRoom,
  imageSrc,
  imageAlt,
  panoramaSrc,
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    materials: Record<string, THREE.MeshStandardMaterial>;
    frameId: number;
  } | null>(null);
  const panoramaRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    texture: THREE.Texture;
    material: THREE.MeshBasicMaterial;
    geometry: THREE.SphereGeometry;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    if (imageSrc || panoramaSrc) return;

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#dfe8e6");
    scene.fog = new THREE.Fog("#dfe8e6", 18, 34);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 6;
    controls.maxDistance = 21;
    controls.target.set(0, 1.2, 0);

    const materials = {
      wall: new THREE.MeshStandardMaterial({ color: styleConfig.wall, roughness: 0.86 }),
      floor: new THREE.MeshStandardMaterial({ color: styleConfig.floor, roughness: 0.68 }),
      sofa: new THREE.MeshStandardMaterial({ color: styleConfig.sofa, roughness: 0.58 }),
      cabinet: new THREE.MeshStandardMaterial({ color: styleConfig.cabinet, roughness: 0.52 }),
      accent: new THREE.MeshStandardMaterial({ color: styleConfig.accent, roughness: 0.48 }),
      glass: new THREE.MeshStandardMaterial({
        color: "#d6ebe8",
        roughness: 0.22,
        metalness: 0.05,
        transparent: true,
        opacity: 0.54,
      }),
    };

    const ambientLight = new THREE.HemisphereLight("#ffffff", "#8aa19d", 2.5);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight("#fff3dd", 2.2);
    sun.position.set(-6, 12, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    addRoomShell(scene, materials);
    addFurniture(scene, materials);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      sceneRef.current!.frameId = requestAnimationFrame(animate);
    };

    sceneRef.current = {
      renderer,
      scene,
      camera,
      controls,
      materials,
      frameId: requestAnimationFrame(animate),
    };

    return () => {
      window.removeEventListener("resize", resize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
      }
      controls.dispose();
      renderer.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [imageSrc, panoramaSrc]);

  useEffect(() => {
    if (!panoramaSrc) return;

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(panoramaSrc);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = -0.35;
    controls.minDistance = 0.05;
    controls.maxDistance = 0.18;
    controls.target.set(0, 0, 0);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      panoramaRef.current!.frameId = requestAnimationFrame(animate);
    };

    panoramaRef.current = {
      renderer,
      scene,
      camera,
      controls,
      texture,
      material,
      geometry,
      frameId: requestAnimationFrame(animate),
    };
    applyPanoramaRoomView(camera, controls, currentRoom);

    return () => {
      window.removeEventListener("resize", resize);
      if (panoramaRef.current) {
        cancelAnimationFrame(panoramaRef.current.frameId);
      }
      controls.dispose();
      texture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      panoramaRef.current = null;
    };
  }, [panoramaSrc]);

  useEffect(() => {
    const current = panoramaRef.current;
    if (!current) return;

    applyPanoramaRoomView(current.camera, current.controls, currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    const current = sceneRef.current;
    if (!current) return;

    current.materials.wall.color.set(styleConfig.wall);
    current.materials.floor.color.set(styleConfig.floor);
    current.materials.sofa.color.set(styleConfig.sofa);
    current.materials.cabinet.color.set(styleConfig.cabinet);
    current.materials.accent.color.set(styleConfig.accent);
  }, [styleConfig]);

  useEffect(() => {
    const current = sceneRef.current;
    const room = rooms.find((item) => item.id === currentRoom);
    if (!current || !room) return;

    current.camera.position.set(...room.camera);
    current.controls.target.set(0, 1.15, 0);
    current.controls.update();
  }, [currentRoom]);

  return (
    <div className="three-viewer" ref={containerRef}>
      {panoramaSrc ? (
        <div className="viewer-hint">拖拽环顾全景，滚轮缩放</div>
      ) : imageSrc ? (
        <img className="vr-preview-image" src={imageSrc} alt={imageAlt} />
      ) : (
        <div className="viewer-hint">拖拽旋转视角，滚轮缩放</div>
      )}
    </div>
  );
}

function addRoomShell(scene: THREE.Scene, materials: Record<string, THREE.MeshStandardMaterial>) {
  const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.18, 11), materials.floor);
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  scene.add(floor);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 4.2, 0.22), materials.wall);
  backWall.position.set(0, 2, -5.55);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 11), materials.wall);
  leftWall.position.set(-8, 2, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 6), materials.wall);
  rightWall.position.set(8, 2, -2.5);
  scene.add(rightWall);

  const kitchenWall = new THREE.Mesh(new THREE.BoxGeometry(5, 3.4, 0.18), materials.wall);
  kitchenWall.position.set(5.5, 1.7, 1.15);
  scene.add(kitchenWall);

  const window = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2, 0.12), materials.glass);
  window.position.set(-1.2, 2.4, -5.68);
  scene.add(window);
}

function addFurniture(scene: THREE.Scene, materials: Record<string, THREE.MeshStandardMaterial>) {
  const sofa = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.75, 1.35), materials.sofa);
  sofa.position.set(-3, 0.45, 2.1);
  sofa.castShadow = true;
  scene.add(sofa);

  const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.55, 2.2), materials.sofa);
  chaise.position.set(-5.05, 0.38, 0.95);
  chaise.castShadow = true;
  scene.add(chaise);

  const table = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.35, 1.1), materials.cabinet);
  table.position.set(-1.2, 0.32, 0.25);
  table.castShadow = true;
  scene.add(table);

  const tvWall = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 0.16), materials.accent);
  tvWall.position.set(3.2, 1.45, 2.45);
  tvWall.castShadow = true;
  scene.add(tvWall);

  const island = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.25), materials.cabinet);
  island.position.set(4.8, 0.5, -1.2);
  island.castShadow = true;
  scene.add(island);

  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.72, 2.4), materials.sofa);
  bed.position.set(-4.5, 0.42, -2.7);
  bed.castShadow = true;
  scene.add(bed);

  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 2.4), materials.cabinet);
  wardrobe.position.set(-7.15, 1.05, -2.6);
  wardrobe.castShadow = true;
  scene.add(wardrobe);

  const rug = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.05, 2.2), materials.accent);
  rug.position.set(-1.4, 0.04, 0.2);
  rug.receiveShadow = true;
  scene.add(rug);
}

const panoramaRoomViews: Record<RoomId, { yaw: number; pitch: number; fov: number }> = {
  living: { yaw: 0, pitch: -4, fov: 70 },
  kitchen: { yaw: -42, pitch: -3, fov: 66 },
  primary: { yaw: 118, pitch: -4, fov: 68 },
  second: { yaw: 155, pitch: -4, fov: 68 },
  bath: { yaw: 138, pitch: -8, fov: 62 },
};

function applyPanoramaRoomView(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  roomId: RoomId,
) {
  const view = panoramaRoomViews[roomId] ?? panoramaRoomViews.living;
  const yaw = THREE.MathUtils.degToRad(view.yaw);
  const pitch = THREE.MathUtils.degToRad(view.pitch);
  const direction = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch),
  );

  camera.fov = view.fov;
  camera.position.copy(direction.multiplyScalar(-0.1));
  camera.updateProjectionMatrix();
  controls.target.set(0, 0, 0);
  controls.update();
}
