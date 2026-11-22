import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

type CameraPreset = 'isometric' | 'client' | 'api' | 'database';

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  isometric: { pos: [5.4, 4.4, 5.8], target: [0, 1.8, 0] },
  client: { pos: [2.8, 4.2, 3.4], target: [0, 3.2, 0] },
  api: { pos: [3.2, 2.2, 3.4], target: [0, 1.6, 0] },
  database: { pos: [3.2, 1.1, 3.4], target: [0, 0.45, 0] },
};

// Pre-allocated scratch math helpers (zero GC in render loop)
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);

function createBeveledPlate(width: number, depth: number, thickness: number, radius = 0.08) {
  const hw = width / 2;
  const hd = depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + radius, -hd);
  shape.lineTo(hw - radius, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + radius);
  shape.lineTo(hw, hd - radius);
  shape.quadraticCurveTo(hw, hd, hw - radius, hd);
  shape.lineTo(-hw + radius, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - radius);
  shape.lineTo(-hw, -hd + radius);
  shape.quadraticCurveTo(-hw, -hd, -hw + radius, -hd);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function createScreenTexture(maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 512, 320);

    // Top bar
    ctx.fillStyle = '#1d1d1d';
    ctx.fillRect(0, 0, 512, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('CodePath  //  Browser Client', 16, 23);

    // Code lines
    const lines = [
      'GET /api/curriculum  200 OK',
      'const app = createClient();',
      'function renderView(state) {',
      '  return <Roadmap data={state} />;',
      '}',
      '// Connected to API & Database',
    ];
    ctx.font = '13px monospace';
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? '#ffffff' : '#a3a3a3';
      ctx.fillText(line, 24, 78 + i * 32);
    });

    // Subtle border
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 48, 488, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0,0,0,0.42)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.14)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Stack3DView() {
  const { t, theme } = useApp();
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [explode, setExplode] = useState(0.35);
  const [preset, setPreset] = useState<CameraPreset>('isometric');
  const [flowActive, setFlowActive] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({
    explode: 0.35,
    preset: 'isometric' as CameraPreset,
    transitioning: false,
    flowActive: true,
    theme,
  });

  useEffect(() => {
    stateRef.current.explode = explode;
  }, [explode]);

  useEffect(() => {
    stateRef.current.flowActive = flowActive;
  }, [flowActive]);

  useEffect(() => {
    stateRef.current.theme = theme;
  }, [theme]);

  const selectPreset = (next: CameraPreset) => {
    setPreset(next);
    stateRef.current.preset = next;
    stateRef.current.transitioning = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight - 64;

    const scene = new THREE.Scene();
    const bgHex = stateRef.current.theme === 'dark' ? 0x111111 : 0xf5f5f5;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.Fog(bgHex, 10, 26);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...CAMERA_PRESETS.isometric.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.isometric.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.8;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.addEventListener('start', () => {
      stateRef.current.transitioning = false;
    });

    // Studio 3-Point Lighting (Warm Key + Cool Hemisphere Fill + Rim)
    const keyLight = new THREE.DirectionalLight(0xfff6e5, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x262626, 0.85);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 0.7);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Materials (Varied roughness & metalness across adjacent parts)
    const matDarkAnodized = new THREE.MeshStandardMaterial({
      color: 0x1c1c1c,
      metalness: 0.72,
      roughness: 0.34,
    });
    const matBrushedSteel = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.88,
      roughness: 0.22,
    });
    const matMatteChassis = new THREE.MeshStandardMaterial({
      color: 0x2b2b2b,
      metalness: 0.15,
      roughness: 0.78,
    });
    const matRubber = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.05,
      roughness: 0.92,
    });
    const matAccentWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.1,
    });
    const matConduit = new THREE.MeshStandardMaterial({
      color: 0x777777,
      metalness: 0.6,
      roughness: 0.35,
    });

    // Ground Contact Shadow Plane
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 5.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    scene.add(shadowPlane);

    // Subtle Floor Grid
    const gridHelper = new THREE.GridHelper(16, 24, 0x888888, 0xd4d4d4);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    // ========================================================
    // LAYER 1 (Bottom): DATABASE SERVER RACK (Composite Group)
    // ========================================================
    const dbGroup = new THREE.Group();
    const footGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.08, 16);
    const footPositions: [number, number][] = [
      [-1.05, -0.75],
      [1.05, -0.75],
      [-1.05, 0.75],
      [1.05, 0.75],
    ];
    footPositions.forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, matRubber);
      foot.position.set(fx, 0.04, fz);
      dbGroup.add(foot);
    });

    const dbBasePlate = new THREE.Mesh(createBeveledPlate(2.5, 1.9, 0.56, 0.1), matMatteChassis);
    dbBasePlate.position.y = 0.08;
    dbBasePlate.castShadow = true;
    dbBasePlate.receiveShadow = true;
    dbGroup.add(dbBasePlate);

    // 4 Brushed Steel Drive Bays
    const bayGeo = new THREE.BoxGeometry(0.48, 0.34, 0.08);
    for (let i = 0; i < 4; i++) {
      const bay = new THREE.Mesh(bayGeo, matBrushedSteel);
      bay.position.set(-0.82 + i * 0.55, 0.36, 0.96);
      dbGroup.add(bay);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.03), matAccentWhite);
      led.position.set(-0.82 + i * 0.55, 0.48, 1.0);
      dbGroup.add(led);
    }
    scene.add(dbGroup);

    // ========================================================
    // LAYER 2 (Middle): API APPLICATION SERVER (Composite Group)
    // ========================================================
    const apiGroup = new THREE.Group();
    const apiBody = new THREE.Mesh(createBeveledPlate(2.1, 1.6, 0.48, 0.08), matDarkAnodized);
    apiBody.castShadow = true;
    apiBody.receiveShadow = true;
    apiGroup.add(apiBody);

    // 6 Heat-Sink Fins along top
    const finGeo = new THREE.BoxGeometry(1.75, 0.1, 0.06);
    for (let i = 0; i < 6; i++) {
      const fin = new THREE.Mesh(finGeo, matBrushedSteel);
      fin.position.set(0, 0.54, -0.5 + i * 0.2);
      fin.castShadow = true;
      apiGroup.add(fin);
    }

    // 3 Front Routing Port Collars
    const portGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
    portGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 3; i++) {
      const port = new THREE.Mesh(portGeo, matBrushedSteel);
      port.position.set(-0.45 + i * 0.45, 0.25, 0.84);
      apiGroup.add(port);
    }
    apiGroup.position.y = 1.25;
    scene.add(apiGroup);

    // ========================================================
    // LAYER 3 (Top): CLIENT BROWSER WORKSTATION (Composite Group)
    // ========================================================
    const clientGroup = new THREE.Group();

    // Weighted Base Plate
    const standBase = new THREE.Mesh(createBeveledPlate(1.2, 0.85, 0.07, 0.06), matBrushedSteel);
    standBase.castShadow = true;
    clientGroup.add(standBase);

    // Angled Stand Neck
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.08), matDarkAnodized);
    neck.position.set(0, 0.28, -0.14);
    neck.rotation.x = -0.18;
    clientGroup.add(neck);

    // Display Frame Housing
    const frameGeo = new THREE.BoxGeometry(2.1, 1.32, 0.1);
    const displayFrame = new THREE.Mesh(frameGeo, matDarkAnodized);
    displayFrame.position.set(0, 0.96, 0.02);
    displayFrame.castShadow = true;
    clientGroup.add(displayFrame);

    // Procedural CanvasTexture Screen
    const screenTex = createScreenTexture(renderer.capabilities.getMaxAnisotropy());
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      roughness: 0.18,
      metalness: 0.05,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.16), screenMat);
    screenMesh.position.set(0, 0.96, 0.075);
    clientGroup.add(screenMesh);

    const tagLayerInteractable = (group: THREE.Object3D, layerId: 'database' | 'api' | 'client') => {
      group.traverse((child) => {
        child.layers.enable(1);
        child.userData.layerId = layerId;
      });
    };

    tagLayerInteractable(dbGroup, 'database');
    tagLayerInteractable(apiGroup, 'api');
    tagLayerInteractable(clientGroup, 'client');

    clientGroup.position.y = 2.45;
    scene.add(clientGroup);

    // ========================================================
    // FIBER CONDUITS & INSTANCED DATA PACKETS (24 Packets)
    // ========================================================
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.7, 0.4, 0),
      new THREE.Vector3(-1.55, 1.5, 0.35),
      new THREE.Vector3(-0.7, 2.9, 0.1),
    ]);
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.7, 2.9, 0.1),
      new THREE.Vector3(1.55, 1.5, -0.35),
      new THREE.Vector3(0.7, 0.4, 0),
    ]);

    const leftTube = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve, 32, 0.022, 8, false),
      matConduit
    );
    const rightTube = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve, 32, 0.022, 8, false),
      matConduit
    );
    scene.add(leftTube, rightTube);

    const PACKET_COUNT = 24;
    const packetGeo = new THREE.OctahedronGeometry(0.055, 0);
    const packetMesh = new THREE.InstancedMesh(packetGeo, matAccentWhite, PACKET_COUNT);
    packetMesh.frustumCulled = false;
    scene.add(packetMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycaster for direct 3D layer click & hover inspection
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;
    let hoveredLayer: 'database' | 'api' | 'client' | null = null;

    const getLayerAtPointer = (e: PointerEvent): 'database' | 'api' | 'client' | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([dbGroup, apiGroup, clientGroup], true);
      if (hits.length === 0) return null;
      const lid = hits[0].object.userData.layerId;
      return lid === 'database' || lid === 'api' || lid === 'client' ? lid : null;
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const hit = getLayerAtPointer(e);
      if (hit !== hoveredLayer) {
        hoveredLayer = hit;
        renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const hit = getLayerAtPointer(e);
      if (hit) {
        selectPreset(hit);
      }
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight - 64;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Software WebGL afterDraw Pacing
    const clock = new THREE.Clock();
    let frameId = 0;
    let flowTime = 0;
    let currentExplode = stateRef.current.explode;
    let lastTheme = stateRef.current.theme;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.05);

      // Sync background/fog with light/dark theme dynamically
      if (stateRef.current.theme !== lastTheme) {
        lastTheme = stateRef.current.theme;
        const nextBg = lastTheme === 'dark' ? 0x111111 : 0xf5f5f5;
        scene.background = new THREE.Color(nextBg);
        scene.fog = new THREE.Fog(nextBg, 10, 26);
      }

      // Smooth exponential damping for layer separation
      currentExplode = THREE.MathUtils.damp(currentExplode, stateRef.current.explode, 6, delta);
      apiGroup.position.y = 1.0 + currentExplode * 0.85;
      clientGroup.position.y = 2.0 + currentExplode * 1.65;

      // Highlight active/hovered layer cleanly via subtle scale spring
      (
        [
          { id: 'database', group: dbGroup },
          { id: 'api', group: apiGroup },
          { id: 'client', group: clientGroup },
        ] as const
      ).forEach(({ id, group }) => {
        const focused = stateRef.current.preset === id || hoveredLayer === id;
        const nextScale = THREE.MathUtils.damp(group.scale.x, focused ? 1.035 : 1.0, 8, delta);
        group.scale.set(nextScale, nextScale, nextScale);
      });

      // Smooth camera preset transition
      if (stateRef.current.transitioning) {
        const target = CAMERA_PRESETS[stateRef.current.preset];
        _targetPos.set(...target.pos);
        _targetLook.set(...target.target);
        const alpha = 1 - Math.exp(-5 * delta);
        camera.position.lerp(_targetPos, alpha);
        controls.target.lerp(_targetLook, alpha);
        if (camera.position.distanceTo(_targetPos) < 0.04) {
          stateRef.current.transitioning = false;
        }
      }

      // Update InstancedMesh data packets along fiber conduits
      if (stateRef.current.flowActive) {
        flowTime += delta * 0.28;
      }
      for (let i = 0; i < PACKET_COUNT; i++) {
        const isLeft = i < PACKET_COUNT / 2;
        const idx = isLeft ? i : i - PACKET_COUNT / 2;
        const u = (flowTime + idx / (PACKET_COUNT / 2)) % 1;
        const curve = isLeft ? leftCurve : rightCurve;
        curve.getPointAt(u, _vec3);
        _mat4.compose(_vec3, _quat, _scale);
        packetMesh.setMatrixAt(i, _mat4);
      }
      packetMesh.instanceMatrix.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      envTex.dispose();
      screenTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeLayerInfo =
    preset === 'client'
      ? t.stack3d.layers.client
      : preset === 'api'
        ? t.stack3d.layers.api
        : preset === 'database'
          ? t.stack3d.layers.database
          : null;

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#F5F5F5] dark:bg-[#111111]">
      {/* Dedicated WebGL Mount Container */}
      {contextLost ? (
        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#777777] dark:text-[#A3A3A3]">
          {t.stack3d.subtitle}
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full" />
      )}

      {/* Minimal Top-Start Title Overlay (Solid/RGBA, no backdrop-filter) */}
      <div className="pointer-events-none absolute start-4 top-4 max-w-sm rounded border border-[#E7E7E7] bg-white/95 px-4 py-3 dark:border-[#262626] dark:bg-[#191919]/95">
        <h1 className="text-sm font-semibold text-[#111111] dark:text-white">{t.stack3d.title}</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={preset}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE_SETTLE }}
            className="mt-1 text-xs text-[#777777] dark:text-[#A3A3A3]"
          >
            {activeLayerInfo ? activeLayerInfo.detail : t.stack3d.subtitle}
          </motion.p>
        </AnimatePresence>
        <p className="mt-1.5 text-[11px] font-medium text-[#777777] dark:text-[#A3A3A3]">
          {t.stack3d.inspectHint}
        </p>
      </div>

      {/* Collapsible Bottom Control Dock */}
      <div className="absolute bottom-5 left-1/2 z-20 flex w-[min(860px,94vw)] -translate-x-1/2 flex-col items-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setDockOpen((o) => !o)}
          className="mb-1.5 inline-flex items-center gap-1.5 rounded border border-[#E7E7E7] bg-white/95 px-3 py-1 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#262626] dark:bg-[#191919]/95 dark:text-white"
        >
          {dockOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.stack3d.hideControls}</span>
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.stack3d.showControls}</span>
            </>
          )}
        </motion.button>

        <AnimatePresence initial={false}>
          {dockOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={SPRING_SNAPPY}
              className="flex w-full flex-wrap items-center justify-between gap-4 rounded border border-[#E7E7E7] bg-white/95 px-4 py-3 dark:border-[#262626] dark:bg-[#191919]/95"
            >
              {/* Exploded View Slider */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="explode-slider"
                  className="whitespace-nowrap text-xs font-medium text-[#777777] dark:text-[#A3A3A3]"
                >
                  {t.stack3d.explodeLabel}
                </label>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explode}
                  onChange={(e) => setExplode(parseFloat(e.target.value))}
                  className="w-28 accent-[#111111] dark:accent-white"
                />
                <span className="w-9 font-mono text-xs text-[#111111] tabular-nums dark:text-white">
                  {Math.round(explode * 100)}%
                </span>
              </div>

              {/* Camera Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'isometric', label: t.stack3d.viewIsometric },
                    { id: 'client', label: t.stack3d.viewClient },
                    { id: 'api', label: t.stack3d.viewApi },
                    { id: 'database', label: t.stack3d.viewDatabase },
                  ] as const
                ).map((cam) => (
                  <motion.button
                    key={cam.id}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => selectPreset(cam.id)}
                    className={`h-8 whitespace-nowrap rounded border px-2.5 text-xs font-medium transition-colors ${
                      preset === cam.id
                        ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                        : 'border-[#E7E7E7] bg-white text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </motion.button>
                ))}
              </div>

              {/* Data Flow Toggle */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setFlowActive((f) => !f)}
                className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded border border-[#E7E7E7] px-3 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] dark:border-[#333333] dark:text-white dark:hover:bg-[#262626]"
              >
                {flowActive ? (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>
                  {t.stack3d.flowToggle}: {flowActive ? t.stack3d.flowActive : t.stack3d.flowPaused}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
