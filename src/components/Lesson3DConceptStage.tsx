import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLesson3DSpec, Lesson3DFocusId } from '../data/lesson3dModels';
import { Lesson } from '../data/types';

// Pre-allocated scratch math helpers (zero GC inside tick loop)
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);

function createBeveledPlate(width: number, depth: number, thickness: number, radius = 0.08) {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(radius, hw * 0.45, hd * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function createHollowFrameGeo(
  outerW: number,
  outerD: number,
  ringThickness: number,
  height: number
) {
  const hw = outerW / 2;
  const hd = outerD / 2;
  const iw = Math.max(0.15, hw - ringThickness);
  const id = Math.max(0.15, hd - ringThickness);

  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-iw, -id);
  hole.lineTo(-iw, id);
  hole.lineTo(iw, id);
  hole.lineTo(iw, -id);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function createLabelPlateTexture(title: string, subtitle: string, maxAnisotropy: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 512, 160);
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 144);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const trimmedTitle = title.length > 22 ? `${title.slice(0, 21)}…` : title;
    ctx.fillText(trimmedTitle, 256, 66);

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '20px sans-serif';
    ctx.fillText(subtitle, 256, 114);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 122);
    grad.addColorStop(0, 'rgba(0,0,0,0.38)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Lesson3DConceptStageProps {
  lesson: Lesson;
}

export function Lesson3DConceptStage({ lesson }: Lesson3DConceptStageProps) {
  const { t, lang, theme } = useApp();
  const spec = useMemo(() => getLesson3DSpec(lesson), [lesson]);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [explode, setExplode] = useState(0.28);
  const [focusId, setFocusId] = useState<Lesson3DFocusId>('overview');
  const [flowActive, setFlowActive] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  const stateRef = useRef({
    explode: 0.28,
    focusId: 'overview' as Lesson3DFocusId,
    transitioning: false,
    flowActive: true,
    theme,
  });

  useEffect(() => {
    setFocusId('overview');
    setExplode(0.28);
    setFlowActive(true);
    stateRef.current.focusId = 'overview';
    stateRef.current.explode = 0.28;
    stateRef.current.flowActive = true;
    stateRef.current.transitioning = false;
  }, [lesson.id]);

  useEffect(() => {
    stateRef.current.explode = explode;
  }, [explode]);

  useEffect(() => {
    stateRef.current.flowActive = flowActive;
  }, [flowActive]);

  useEffect(() => {
    stateRef.current.theme = theme;
  }, [theme]);

  const selectFocus = (next: Lesson3DFocusId) => {
    setFocusId(next);
    stateRef.current.focusId = next;
    stateRef.current.transitioning = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setContextLost(false);
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const bgHex = stateRef.current.theme === 'dark' ? 0x111111 : 0xf5f5f5;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.Fog(bgHex, 8, 22);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(...spec.overviewCamera.pos);

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

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = track(pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture);
    scene.environment = envTex;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...spec.overviewCamera.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 9.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.addEventListener('start', () => {
      stateRef.current.transitioning = false;
    });

    // Studio 3-point PBR lighting (Warm Key + Cool Hemisphere Fill + Rim)
    const keyLight = new THREE.DirectionalLight(0xfff6e5, 2.2);
    keyLight.position.set(4.5, 7, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x262626, 0.85);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 0.75);
    rimLight.position.set(-4.5, 4, -4);
    scene.add(rimLight);

    // Varied roughness/metalness PBR materials
    const matDarkAnodized = track(
      new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0.74, roughness: 0.32 })
    );
    const matMatteClay = track(
      new THREE.MeshStandardMaterial({ color: 0xe5e5e5, metalness: 0.08, roughness: 0.72 })
    );
    const matBrushedSteel = track(
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.88, roughness: 0.2 })
    );
    const matGraphite = track(
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.25, roughness: 0.68 })
    );
    const matRubber = track(
      new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.04, roughness: 0.92 })
    );
    const matConduit = track(
      new THREE.MeshStandardMaterial({ color: 0x737373, metalness: 0.62, roughness: 0.34 })
    );
    const matAccentEmissive = track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.6,
        metalness: 0.15,
        roughness: 0.22,
      })
    );

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const shadowTex = track(createContactShadowTexture());
    const shadowGeo = track(new THREE.PlaneGeometry(5.0, 5.0));
    const shadowMat = track(
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.004;
    scene.add(shadowPlane);

    const gridHelper = new THREE.GridHelper(12, 20, 0x888888, 0xd4d4d4);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.2;
    scene.add(gridHelper);

    const tagPlateA = track(createLabelPlateTexture(spec.plateLabels[0], 'Layer 01', maxAniso));
    const tagPlateB = track(createLabelPlateTexture(spec.plateLabels[1], 'Layer 02', maxAniso));
    const tagPlateC = track(createLabelPlateTexture(spec.plateLabels[2], 'Layer 03', maxAniso));

    const makeSignMesh = (tex: THREE.CanvasTexture, w = 1.25, h = 0.38) => {
      const geo = track(new THREE.PlaneGeometry(w, h));
      const mat = track(
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.24, metalness: 0.06 })
      );
      return new THREE.Mesh(geo, mat);
    };

    // Inspectable Groups mapped to partA / partB / partC
    const partA = new THREE.Group();
    const partB = new THREE.Group();
    const partC = new THREE.Group();
    partA.userData.partId = 'partA';
    partB.userData.partId = 'partB';
    partC.userData.partId = 'partC';

    const tagGroupId = (group: THREE.Group, id: 'partA' | 'partB' | 'partC') => {
      group.traverse((child) => {
        child.userData.partId = id;
        child.layers.enable(1);
      });
    };

    const baseY = { a: 0, b: 0.72, c: 1.45 };
    const curves: THREE.CatmullRomCurve3[] = [];

    // ===============================================================
    // BUILD COMPOSITE 3–12 PART HERO ASSEMBLY FOR LESSON ARCHETYPE
    // ===============================================================
    if (spec.archetype === 'css-box-grid') {
      const isGrid = lesson.id === 'css-grid';
      if (isGrid) {
        baseY.a = 0;
        baseY.b = 0.36;
        baseY.c = 0.84;

        const outerFrame = new THREE.Mesh(
          track(createBeveledPlate(2.8, 2.0, 0.14, 0.08)),
          matDarkAnodized
        );
        outerFrame.castShadow = true;
        outerFrame.receiveShadow = true;
        partA.add(outerFrame);

        const railGeo = track(new THREE.BoxGeometry(0.05, 0.08, 1.85));
        [-0.45, 0.45].forEach((rx) => {
          const rail = new THREE.Mesh(railGeo, matBrushedSteel);
          rail.position.set(rx, 0.14, 0);
          partB.add(rail);
        });
        const signB = makeSignMesh(tagPlateB, 1.15, 0.34);
        signB.rotation.x = -Math.PI / 2;
        signB.position.set(0, 0.12, 0.8);
        partB.add(signB);

        const cellGeo = track(createBeveledPlate(0.76, 1.45, 0.22, 0.05));
        [-0.86, 0, 0.86].forEach((cx, idx) => {
          const cell = new THREE.Mesh(cellGeo, idx === 1 ? matMatteClay : matBrushedSteel);
          cell.position.set(cx, 0.04, 0);
          cell.castShadow = true;
          partC.add(cell);
        });
        const signC = makeSignMesh(tagPlateA, 1.05, 0.32);
        signC.rotation.x = -Math.PI / 2;
        signC.position.set(0, 0.32, 0);
        partC.add(signC);
      } else {
        // Concentric Box Model: Margin -> Border+Padding -> Content
        baseY.a = 0;
        baseY.b = 0.48;
        baseY.c = 1.02;

        const marginRing = new THREE.Mesh(
          track(createHollowFrameGeo(2.9, 2.1, 0.36, 0.14)),
          matGraphite
        );
        marginRing.castShadow = true;
        partA.add(marginRing);
        const sA = makeSignMesh(tagPlateA, 1.05, 0.3);
        sA.position.set(0, 0.1, 1.07);
        partA.add(sA);

        const borderRing = new THREE.Mesh(
          track(createHollowFrameGeo(2.12, 1.38, 0.14, 0.24)),
          matBrushedSteel
        );
        borderRing.castShadow = true;
        partB.add(borderRing);

        const paddingRing = new THREE.Mesh(
          track(createHollowFrameGeo(1.78, 1.06, 0.24, 0.18)),
          matMatteClay
        );
        paddingRing.position.y = 0.04;
        partB.add(paddingRing);

        const contentCore = new THREE.Mesh(
          track(createBeveledPlate(1.22, 0.56, 0.3, 0.05)),
          matDarkAnodized
        );
        contentCore.castShadow = true;
        partC.add(contentCore);
        const sC = makeSignMesh(tagPlateC, 1.15, 0.35);
        sC.rotation.x = -Math.PI / 2;
        sC.position.set(0, 0.34, 0);
        partC.add(sC);
      }
    } else if (spec.archetype === 'document-shell') {
      baseY.a = 0;
      baseY.b = 0.65;
      baseY.c = 1.38;

      const footGeo = track(new THREE.CylinderGeometry(0.08, 0.1, 0.07, 16));
      (
        [
          [-0.95, -0.65],
          [0.95, -0.65],
          [-0.95, 0.65],
          [0.95, 0.65],
        ] as [number, number][]
      ).forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(footGeo, matRubber);
        foot.position.set(fx, 0.035, fz);
        partA.add(foot);
      });
      const basePlate = new THREE.Mesh(
        track(createBeveledPlate(2.3, 1.65, 0.22, 0.08)),
        matDarkAnodized
      );
      basePlate.position.y = 0.07;
      basePlate.castShadow = true;
      basePlate.receiveShadow = true;
      partA.add(basePlate);
      const sA = makeSignMesh(tagPlateA, 1.25, 0.36);
      sA.position.set(0, 0.19, 0.86);
      partA.add(sA);

      // Part B: <head> metadata bus tray + 3 anodized chips
      const headTray = new THREE.Mesh(
        track(createBeveledPlate(1.9, 1.3, 0.24, 0.07)),
        matGraphite
      );
      headTray.castShadow = true;
      partB.add(headTray);
      const chipGeo = track(new THREE.BoxGeometry(0.42, 0.1, 0.85));
      [-0.55, 0, 0.55].forEach((cx) => {
        const chip = new THREE.Mesh(chipGeo, matBrushedSteel);
        chip.position.set(cx, 0.28, 0);
        partB.add(chip);
      });
      const sB = makeSignMesh(tagPlateB, 1.2, 0.34);
      sB.position.set(0, 0.14, 0.68);
      partB.add(sB);

      // Part C: <body> DOM viewport screen monitor
      const stand = new THREE.Mesh(track(createBeveledPlate(1.0, 0.72, 0.07, 0.05)), matBrushedSteel);
      partC.add(stand);
      const neck = new THREE.Mesh(track(new THREE.BoxGeometry(0.18, 0.38, 0.07)), matDarkAnodized);
      neck.position.set(0, 0.22, -0.1);
      partC.add(neck);
      const housing = new THREE.Mesh(track(new THREE.BoxGeometry(1.75, 1.05, 0.08)), matDarkAnodized);
      housing.position.set(0, 0.74, 0.02);
      housing.castShadow = true;
      partC.add(housing);
      const sC = makeSignMesh(tagPlateC, 1.56, 0.86);
      sC.position.set(0, 0.74, 0.07);
      partC.add(sC);

      curves.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.7, 0.3, 0),
          new THREE.Vector3(-1.35, 1.15, 0.2),
          new THREE.Vector3(-0.7, 2.05, 0),
        ]),
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.7, 2.05, 0),
          new THREE.Vector3(1.35, 1.15, -0.2),
          new THREE.Vector3(0.7, 0.3, 0),
        ])
      );
    } else if (spec.archetype === 'media-conduit' || spec.archetype === 'fullstack-flow') {
      baseY.a = 0;
      baseY.b = 0.0;
      baseY.c = 0.0;

      const plinth = new THREE.Mesh(
        track(createBeveledPlate(3.2, 1.5, 0.14, 0.08)),
        matGraphite
      );
      plinth.position.y = 0.03;
      plinth.receiveShadow = true;
      scene.add(plinth);

      // Part A: Left Source Pylon / Optical Lens Lathe
      const pedestalA = new THREE.Mesh(
        track(createBeveledPlate(0.85, 0.85, 0.22, 0.06)),
        matDarkAnodized
      );
      pedestalA.position.set(-1.05, 0.18, 0);
      pedestalA.castShadow = true;
      partA.add(pedestalA);

      const lathePts = [
        new THREE.Vector2(0.01, 0.0),
        new THREE.Vector2(0.32, 0.0),
        new THREE.Vector2(0.32, 0.22),
        new THREE.Vector2(0.24, 0.38),
        new THREE.Vector2(0.28, 0.56),
        new THREE.Vector2(0.18, 0.64),
        new THREE.Vector2(0.01, 0.64),
      ];
      const latheGeo = track(new THREE.LatheGeometry(lathePts, 28));
      const barrel = new THREE.Mesh(latheGeo, matBrushedSteel);
      barrel.position.set(-1.05, 0.42, 0);
      barrel.castShadow = true;
      partA.add(barrel);
      const sA = makeSignMesh(tagPlateA, 0.82, 0.28);
      sA.position.set(-1.05, 0.3, 0.45);
      partA.add(sA);

      // Part B: Center Conduit Arch + Processor Core
      const coreHub = new THREE.Mesh(
        track(createBeveledPlate(0.75, 0.75, 0.52, 0.08)),
        matBrushedSteel
      );
      coreHub.position.set(0, 0.22, 0);
      coreHub.castShadow = true;
      partB.add(coreHub);
      const sB = makeSignMesh(tagPlateB, 0.72, 0.26);
      sB.position.set(0, 0.48, 0.4);
      partB.add(sB);

      // Part C: Right Output Monitor Frame
      const pedestalC = new THREE.Mesh(
        track(createBeveledPlate(0.95, 0.85, 0.22, 0.06)),
        matDarkAnodized
      );
      pedestalC.position.set(1.05, 0.18, 0);
      pedestalC.castShadow = true;
      partC.add(pedestalC);
      const frameC = new THREE.Mesh(track(new THREE.BoxGeometry(0.92, 0.76, 0.1)), matDarkAnodized);
      frameC.position.set(1.05, 0.82, 0);
      frameC.castShadow = true;
      partC.add(frameC);
      const sC = makeSignMesh(tagPlateC, 0.82, 0.62);
      sC.position.set(1.05, 0.82, 0.06);
      partC.add(sC);

      curves.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.05, 0.92, 0),
          new THREE.Vector3(0, 1.38, 0.18),
          new THREE.Vector3(1.05, 0.92, 0),
        ]),
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.05, 0.68, -0.08),
          new THREE.Vector3(0, 0.96, -0.22),
          new THREE.Vector3(-1.05, 0.68, -0.08),
        ])
      );
    } else if (spec.archetype === 'interactive-circuit') {
      baseY.a = 0;
      baseY.b = 0.52;
      baseY.c = 1.05;

      const deck = new THREE.Mesh(
        track(createBeveledPlate(2.4, 1.7, 0.22, 0.08)),
        matDarkAnodized
      );
      deck.castShadow = true;
      partA.add(deck);

      // 6 tactile cells/keys
      const cellGeo = track(createBeveledPlate(0.58, 0.52, 0.14, 0.04));
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const key = new THREE.Mesh(cellGeo, r === 0 ? matBrushedSteel : matMatteClay);
          key.position.set(-0.7 + c * 0.7, 0.24, -0.35 + r * 0.68);
          key.castShadow = true;
          partA.add(key);
        }
      }

      const midRail = new THREE.Mesh(
        track(createHollowFrameGeo(2.05, 1.35, 0.22, 0.18)),
        matBrushedSteel
      );
      partB.add(midRail);
      const sB = makeSignMesh(tagPlateB, 1.1, 0.32);
      sB.position.set(0, 0.1, 0.7);
      partB.add(sB);

      const actionCap = new THREE.Mesh(
        track(createBeveledPlate(1.5, 0.92, 0.22, 0.07)),
        matMatteClay
      );
      actionCap.castShadow = true;
      partC.add(actionCap);
      const buttonPlunger = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.18, 0.2, 0.14, 24)),
        matDarkAnodized
      );
      buttonPlunger.position.set(0.45, 0.26, 0);
      partC.add(buttonPlunger);
      const sC = makeSignMesh(tagPlateA, 0.9, 0.3);
      sC.rotation.x = -Math.PI / 2;
      sC.position.set(-0.22, 0.25, 0);
      partC.add(sC);

      curves.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.75, 0.35, 0.45),
          new THREE.Vector3(-1.1, 0.95, 0.45),
          new THREE.Vector3(0.45, 1.35, 0),
        ])
      );
    } else {
      // semantic-blocks: Architectural Typographic / Landmark Tiers
      baseY.a = 0;
      baseY.b = 0.56;
      baseY.c = 1.15;

      const plinth = new THREE.Mesh(
        track(createBeveledPlate(2.5, 1.75, 0.24, 0.08)),
        matDarkAnodized
      );
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      partA.add(plinth);
      const sA = makeSignMesh(tagPlateA, 1.25, 0.34);
      sA.position.set(0, 0.14, 0.9);
      partA.add(sA);

      const midSlab = new THREE.Mesh(
        track(createBeveledPlate(1.95, 1.3, 0.26, 0.07)),
        matBrushedSteel
      );
      midSlab.castShadow = true;
      partB.add(midSlab);
      const sB = makeSignMesh(tagPlateB, 1.15, 0.32);
      sB.position.set(0, 0.15, 0.68);
      partB.add(sB);

      const topCrown = new THREE.Mesh(
        track(createBeveledPlate(1.38, 0.86, 0.28, 0.06)),
        matMatteClay
      );
      topCrown.castShadow = true;
      partC.add(topCrown);
      const sC = makeSignMesh(tagPlateC, 1.1, 0.34);
      sC.rotation.x = -Math.PI / 2;
      sC.position.set(0, 0.31, 0);
      partC.add(sC);
    }

    partA.position.y = baseY.a;
    partB.position.y = baseY.b;
    partC.position.y = baseY.c;
    tagGroupId(partA, 'partA');
    tagGroupId(partB, 'partB');
    tagGroupId(partC, 'partC');
    scene.add(partA, partB, partC);

    // Optional fiber conduits + instanced packets
    let packetMesh: THREE.InstancedMesh | null = null;
    const PACKET_COUNT = 22;
    if (curves.length > 0) {
      curves.forEach((curve) => {
        const tubeGeo = track(new THREE.TubeGeometry(curve, 28, 0.02, 8, false));
        const tube = new THREE.Mesh(tubeGeo, matConduit);
        scene.add(tube);
      });
      const packetGeo = track(new THREE.OctahedronGeometry(0.05, 0));
      packetMesh = new THREE.InstancedMesh(packetGeo, matAccentEmissive, PACKET_COUNT);
      packetMesh.frustumCulled = false;
      scene.add(packetMesh);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for clicking 3D parts directly
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastMoveCheck = 0;

    const getHitPartId = (clientX: number, clientY: number): 'partA' | 'partB' | 'partC' | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([partA, partB, partC], true);
      if (hits.length === 0) return null;
      return (hits[0].object.userData.partId as 'partA' | 'partB' | 'partC') ?? null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      const hit = getHitPartId(e.clientX, e.clientY);
      if (hit) {
        selectFocus(hit);
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMoveCheck < 50) return;
      lastMoveCheck = now;
      const hit = getHitPartId(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

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
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
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

      if (stateRef.current.theme !== lastTheme) {
        lastTheme = stateRef.current.theme;
        const nextBg = lastTheme === 'dark' ? 0x111111 : 0xf5f5f5;
        scene.background = new THREE.Color(nextBg);
        scene.fog = new THREE.Fog(nextBg, 8, 22);
      }

      currentExplode = THREE.MathUtils.damp(currentExplode, stateRef.current.explode, 6.5, delta);
      if (spec.archetype === 'media-conduit' || spec.archetype === 'fullstack-flow') {
        partA.position.x = -currentExplode * 0.45;
        partC.position.x = currentExplode * 0.45;
        partB.position.y = currentExplode * 0.35;
      } else {
        partB.position.y = baseY.b + currentExplode * 0.55;
        partC.position.y = baseY.c + currentExplode * 1.1;
      }

      // Highlight selected part subtly via scale spring
      (['partA', 'partB', 'partC'] as const).forEach((pid) => {
        const grp = pid === 'partA' ? partA : pid === 'partB' ? partB : partC;
        const targetScale = stateRef.current.focusId === pid ? 1.045 : 1.0;
        const nextS = THREE.MathUtils.damp(grp.scale.x, targetScale, 8, delta);
        grp.scale.set(nextS, nextS, nextS);
      });

      if (stateRef.current.transitioning) {
        const fid = stateRef.current.focusId;
        if (fid === 'overview') {
          _targetPos.set(...spec.overviewCamera.pos);
          _targetLook.set(...spec.overviewCamera.target);
        } else {
          const partSpec = spec.parts.find((p) => p.id === fid) ?? spec.parts[0];
          _targetPos.set(...partSpec.cameraPos);
          _targetLook.set(...partSpec.cameraTarget);
        }
        const alpha = 1 - Math.exp(-5.5 * delta);
        camera.position.lerp(_targetPos, alpha);
        controls.target.lerp(_targetLook, alpha);
        if (camera.position.distanceTo(_targetPos) < 0.04) {
          stateRef.current.transitioning = false;
        }
      }

      if (packetMesh && curves.length > 0) {
        if (stateRef.current.flowActive) {
          flowTime += delta * 0.28;
        }
        for (let i = 0; i < PACKET_COUNT; i++) {
          const curve = curves[i % curves.length];
          const perCurve = Math.max(1, Math.floor(PACKET_COUNT / curves.length));
          const u = (flowTime + Math.floor(i / curves.length) / perCurve) % 1;
          curve.getPointAt(u, _vec3);
          _mat4.compose(_vec3, _quat, _scale);
          packetMesh.setMatrixAt(i, _mat4);
        }
        packetMesh.instanceMatrix.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lesson.id, spec]);

  const activePart = spec.parts.find((p) => p.id === focusId) ?? null;

  return (
    <div className="overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#191919]">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E7E7] bg-[#F5F5F5] px-4 py-2.5 dark:border-[#262626] dark:bg-[#141414]">
        <div>
          <p className="text-xs font-semibold text-[#111111] dark:text-white">{spec.title[lang]}</p>
          <p className="mt-0.5 text-[11px] text-[#777777] dark:text-[#A3A3A3]">
            {activePart ? activePart.detail[lang] : spec.subtitle[lang]}
          </p>
        </div>
        <span className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">
          {t.lesson.visual3DClickHint}
        </span>
      </div>

      {/* Interactive 3D Viewport */}
      <div className="relative h-[320px] w-full bg-[#F5F5F5] sm:h-[360px] dark:bg-[#111111]">
        {contextLost ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#777777] dark:text-[#A3A3A3]">
            {spec.subtitle[lang]}
          </div>
        ) : (
          <div ref={mountRef} className="h-full w-full" />
        )}
      </div>

      {/* Compact Non-Obstructing Inspection & Explode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E7E7E7] bg-[#F5F5F5] px-4 py-3 dark:border-[#262626] dark:bg-[#141414]">
        {/* Part Focus Selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectFocus('overview')}
            className={`h-8 whitespace-nowrap rounded border px-2.5 text-xs font-medium transition-colors ${
              focusId === 'overview'
                ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                : 'border-[#E7E7E7] bg-white text-[#555555] hover:text-[#111111] dark:border-[#333333] dark:bg-[#191919] dark:text-[#A3A3A3] dark:hover:text-white'
            }`}
          >
            {t.lesson.visual3DOverviewPart}
          </button>

          {spec.parts.map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => selectFocus(part.id)}
              className={`h-8 whitespace-nowrap rounded border px-2.5 text-xs font-medium transition-colors ${
                focusId === part.id
                  ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                  : 'border-[#E7E7E7] bg-white text-[#555555] hover:text-[#111111] dark:border-[#333333] dark:bg-[#191919] dark:text-[#A3A3A3] dark:hover:text-white'
              }`}
            >
              {part.label[lang]}
            </button>
          ))}
        </div>

        {/* Explode Slider + Flow + Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`lesson-3d-explode-${lesson.id}`}
              className="whitespace-nowrap text-xs font-medium text-[#777777] dark:text-[#A3A3A3]"
            >
              {t.lesson.visual3DExplode}
            </label>
            <input
              id={`lesson-3d-explode-${lesson.id}`}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explode}
              onChange={(e) => setExplode(parseFloat(e.target.value))}
              className="w-24 accent-[#111111] dark:accent-white"
            />
            <span className="w-8 font-mono text-xs text-[#111111] tabular-nums dark:text-white">
              {Math.round(explode * 100)}%
            </span>
          </div>

          {spec.supportsFlow && (
            <button
              type="button"
              onClick={() => setFlowActive((f) => !f)}
              className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded border border-[#E7E7E7] bg-white px-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
            >
              {flowActive ? (
                <Pause className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Play className="h-3 w-3" aria-hidden="true" />
              )}
              <span>{t.lesson.visual3DFlow}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setExplode(0.28);
              selectFocus('overview');
            }}
            className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded border border-[#E7E7E7] bg-white px-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>{t.lesson.visual3DReset}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
