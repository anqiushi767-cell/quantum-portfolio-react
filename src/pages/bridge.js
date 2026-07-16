import * as THREE from 'three';

// ─── Bridge Station Definitions ───
const STATIONS = [
  {
    id: 'helm',
    label: 'HELM · 主驾驶',
    desc: '舰桥中央，前方是深空舷窗',
    pos: [0, 1.2, 4],
    lookAt: [0, 0.5, -8],
    color: 0x00f5ff,
  },
  {
    id: 'nav',
    label: 'NAV · 导航星图',
    desc: '左舷全息星图投影台',
    pos: [-5, 1.2, 1],
    lookAt: [-3, 0.8, -3],
    color: 0x9b5cff,
  },
  {
    id: 'eng',
    label: 'ENG · 工程面板',
    desc: '右舷系统监控阵列',
    pos: [5, 1.2, 1],
    lookAt: [3, 0.8, -3],
    color: 0xff6b35,
  },
  {
    id: 'comm',
    label: 'COMM · 通讯台',
    desc: '右后舷信号收发站',
    pos: [4.5, 1.1, 4.5],
    lookAt: [3.5, 0.7, 2],
    color: 0x00e676,
  },
  {
    id: 'archive',
    label: 'ARCH · 档案库',
    desc: '左后舷加密数据终端',
    pos: [-4.5, 1.1, 4.5],
    lookAt: [-3.5, 0.7, 2],
    color: 0xff2bd6,
  },
];

// ─── Materials ───
function mkMat(hex, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: hex,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.7,
    ...opts,
  });
}

// ─── Helper: glowing edge box ───
function addEdgeGlow(mesh, color = 0x00f5ff, opacity = 0.3) {
  const edgeGeo = new THREE.EdgesGeometry(mesh.geometry);
  const edgeLine = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity })
  );
  mesh.add(edgeLine);
}

// ─── Build the Bridge ───
function buildBridge(scene) {
  const group = new THREE.Group();
  group.name = 'bridge';

  const floorMat = mkMat(0x1a1a2e, { roughness: 0.3, metalness: 0.9 });
  const wallMat = mkMat(0x16213e, { roughness: 0.4, metalness: 0.8 });
  const panelMat = mkMat(0x0f3460, { roughness: 0.35, metalness: 0.85 });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    roughness: 0.2,
    metalness: 0.3,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.5,
  });

  // ── Floor ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  // Floor grid lines
  const gridHelper = new THREE.PolarGridHelper(9, 32, 24, 64, 0x00f5ff, 0x00f5ff);
  gridHelper.position.y = 0.01;
  group.add(gridHelper);

  // ── Back Wall ──
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(18, 6), wallMat);
  backWall.position.set(0, 3, -8);
  group.add(backWall);

  // Back wall panels
  for (let x = -7; x <= 7; x += 3.5) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.2), panelMat);
    panel.position.set(x, 4.2, -7.99);
    group.add(panel);
    addEdgeGlow(panel, 0x00f5ff, 0.25);

    // Small accent light
    const lightBar = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.06),
      accentMat
    );
    lightBar.position.set(0, -0.55, 0.01);
    panel.add(lightBar);
  }

  // ── Left Wall ──
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMat);
  leftWall.position.set(-9, 3, 0);
  leftWall.rotation.y = Math.PI / 2;
  group.add(leftWall);

  // Left wall panels
  for (let z = -6; z <= 4; z += 3) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), panelMat);
    panel.position.set(-8.99, 3.5, z);
    panel.rotation.y = Math.PI / 2;
    group.add(panel);
    addEdgeGlow(panel, 0x9b5cff, 0.2);
  }

  // ── Right Wall ──
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMat);
  rightWall.position.set(9, 3, 0);
  rightWall.rotation.y = -Math.PI / 2;
  group.add(rightWall);

  // Right wall panels
  for (let z = -6; z <= 4; z += 3) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), panelMat);
    panel.position.set(8.99, 3.5, z);
    panel.rotation.y = -Math.PI / 2;
    group.add(panel);
    addEdgeGlow(panel, 0xff6b35, 0.2);
  }

  // ── Ceiling ──
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), wallMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  group.add(ceiling);

  // Ceiling lights
  for (let x = -6; x <= 6; x += 4) {
    for (let z = -5; z <= 5; z += 5) {
      const lightPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.6),
        new THREE.MeshStandardMaterial({
          color: 0x00f5ff,
          roughness: 0.1,
          metalness: 0.2,
          emissive: 0x00f5ff,
          emissiveIntensity: 0.8,
        })
      );
      lightPanel.rotation.x = -Math.PI / 2;
      lightPanel.position.set(x, 5.99, z);
      group.add(lightPanel);
    }
  }

  // ── Central Console ──
  const consoleBase = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.6, 2.2),
    mkMat(0x1a1a2e, { roughness: 0.25, metalness: 0.9 })
  );
  consoleBase.position.set(0, 0.9, 1.2);
  group.add(consoleBase);

  // Console top (angled)
  const consoleTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.15, 2),
    mkMat(0x0f3460, { roughness: 0.2, metalness: 0.85 })
  );
  consoleTop.position.set(0, 1.25, 1.3);
  consoleTop.rotation.x = -0.3;
  group.add(consoleTop);
  addEdgeGlow(consoleTop, 0x00f5ff, 0.35);

  // Console hologram projector
  const holoRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.03, 16, 32),
    accentMat
  );
  holoRing.position.set(0, 1.6, 1.0);
  holoRing.rotation.x = Math.PI / 2.5;
  group.add(holoRing);

  // ── Side Consoles ──
  const sideConsoleGeom = new THREE.BoxGeometry(1.8, 0.4, 1.2);
  [-5.5, 5.5].forEach((x) => {
    const sc = new THREE.Mesh(sideConsoleGeom, mkMat(0x16213e, { roughness: 0.3, metalness: 0.8 }));
    sc.position.set(x, 0.8, 2);
    group.add(sc);
    addEdgeGlow(sc, x < 0 ? 0x9b5cff : 0xff6b35, 0.25);
  });

  // ── Viewport Frame (front opening ring) ──
  const frameMat = mkMat(0x1a1a2e, { roughness: 0.2, metalness: 0.95 });
  const framePieces = [
    // Top
    { pos: [0, 5.5, -7.99], size: [18, 0.5, 0.3] },
    // Bottom
    { pos: [0, 0.5, -7.99], size: [18, 0.5, 0.3] },
    // Left
    { pos: [-8.85, 3, -7.99], size: [0.3, 5, 0.3] },
    // Right
    { pos: [8.85, 3, -7.99], size: [0.3, 5, 0.3] },
  ];

  framePieces.forEach(({ pos, size }) => {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(...size), frameMat);
    piece.position.set(...pos);
    group.add(piece);
  });

  // ── Station Markers ──
  const stationGroup = new THREE.Group();
  stationGroup.name = 'stations';

  STATIONS.forEach((st) => {
    // Glowing sphere marker
    const markerGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const markerMat = new THREE.MeshStandardMaterial({
      color: st.color,
      roughness: 0.1,
      metalness: 0.1,
      emissive: st.color,
      emissiveIntensity: 1.2,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(...st.pos);
    marker.userData = { stationId: st.id, baseY: st.pos[1] };
    stationGroup.add(marker);

    // Halo ring
    const ringGeo = new THREE.TorusGeometry(0.28, 0.03, 16, 24);
    const ring = new THREE.Mesh(ringGeo, markerMat.clone());
    ring.material.emissiveIntensity = 0.6;
    ring.position.copy(marker.position);
    ring.userData = { halo: true, stationId: st.id };
    stationGroup.add(ring);
  });

  group.add(stationGroup);
  scene.add(group);
  return { group, stationGroup };
}

// ─── Starfield through viewport ───
function createStarfield() {
  const count = 8000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = 60 + Math.random() * 300;
    const theta = Math.random() * Math.PI * 0.7;
    const phi = Math.random() * Math.PI * 2;

    positions[i3] = Math.sin(theta) * Math.cos(phi) * r;
    positions[i3 + 1] = Math.sin(theta) * Math.sin(phi) * r;
    positions[i3 + 2] = -Math.cos(theta) * r;

    const c = new THREE.Color().setHSL(
      0.5 + Math.random() * 0.3,
      0.7,
      0.5 + Math.random() * 0.5
    );
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(geo, mat);
  stars.position.z = -20;
  stars.name = 'starfield';
  return stars;
}

// ─── Station Label Sprites ───
function createLabel(text, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#00000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 36px "Orbitron", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow
  ctx.shadowColor = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 256, 44);

  ctx.shadowBlur = 0;
  ctx.font = '18px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(236,248,255,0.7)';
  ctx.fillText(text.includes('·') ? text.split('·')[1].trim() : '', 256, 80);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;

  const spriteMat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3, 0.75, 1);
  return sprite;
}

// ─── Main Export ───
export function mountBridge(app) {
  const isMobile = window.innerWidth <= 768;

  // HTML overlay (minimal)
  app.innerHTML = `
    <div id="bridgeCanvas" class="bridge-fullscreen"></div>

    <!-- Station indicator -->
    <div class="bridge-hud" id="bridgeHud">
      <span class="bridge-station-name" id="stationName">HELM · 主驾驶</span>
      <span class="bridge-station-desc" id="stationDesc">舰桥中央，前方是深空舷窗</span>
    </div>

    <!-- Station selector buttons -->
    <div class="bridge-nav" id="bridgeNav">
      ${STATIONS.map((s, i) => `
        <button class="bridge-nav-btn" data-station="${s.id}" data-idx="${i}">
          <span class="nav-dot" style="background:${'#' + s.color.toString(16).padStart(6, '0')}"></span>
          <span class="nav-label">${s.label}</span>
        </button>
      `).join('')}
    </div>

    <!-- Back to home -->
    <a href="/" class="bridge-home-btn" title="返回首页">⌂</a>

    <!-- Info hint -->
    <div class="bridge-hint" id="bridgeHint">点击导航按钮切换站点 · 拖拽旋转视角</div>
  `;

  const container = document.querySelector('#bridgeCanvas');

  // ─── Scene Setup ───
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02030a, 0.0004);

  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 1.8, 7);
  camera.lookAt(0, 0.6, -8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // ─── Lighting ───
  const ambient = new THREE.AmbientLight(0x1a2a4a, 0.8);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xccddff, 1.2);
  mainLight.position.set(0, 8, 3);
  scene.add(mainLight);

  // Cyan accent light (ceiling)
  const cyanLight = new THREE.PointLight(0x00f5ff, 3, 12);
  cyanLight.position.set(0, 5.5, 0);
  scene.add(cyanLight);

  // Purple accent (left)
  const purpleLight = new THREE.PointLight(0x9b5cff, 2, 10);
  purpleLight.position.set(-5, 3, 0);
  scene.add(purpleLight);

  // Orange accent (right)
  const orangeLight = new THREE.PointLight(0xff6b35, 2, 10);
  orangeLight.position.set(5, 3, 0);
  scene.add(orangeLight);

  // ─── Build Scene ───
  const { stationGroup } = buildBridge(scene);
  const starfield = createStarfield();
  scene.add(starfield);

  // ─── State ───
  let currentStation = 'helm';
  const camTarget = {
    pos: new THREE.Vector3(...STATIONS[0].pos),
    look: new THREE.Vector3(...STATIONS[0].lookAt),
  };
  let userDragging = false;
  let orbitTarget = new THREE.Vector3(0, 1.5, 0);
  let orbitTheta = 0;
  let orbitPhi = Math.PI / 4;
  let orbitRadius = 10;

  // ─── Navigation ───
  function navigateTo(stationId) {
    const st = STATIONS.find((s) => s.id === stationId);
    if (!st) return;
    currentStation = stationId;

    camTarget.pos.set(...st.pos);
    camTarget.look.set(...st.lookAt);

    document.querySelector('#stationName').textContent = st.label;
    document.querySelector('#stationDesc').textContent = st.desc;

    // Highlight active button
    document.querySelectorAll('.bridge-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.station === stationId);
    });
  }

  // Button clicks
  document.querySelectorAll('.bridge-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.station));
  });

  // Raycaster click on 3D markers
  const raycaster = new THREE.Raycaster();
  raycaster.far = 20;

  renderer.domElement.addEventListener('click', (e) => {
    if (userDragging) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(stationGroup.children, true);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      const sid = obj.userData?.stationId;
      if (sid) navigateTo(sid);
    }
  });

  // ─── Orbit Controls (simple drag-to-rotate) ───
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };

  renderer.domElement.addEventListener('pointerdown', (e) => {
    isDragging = true;
    userDragging = false;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) userDragging = true;

    orbitTheta -= dx * 0.005;
    orbitPhi -= dy * 0.005;
    orbitPhi = Math.max(0.1, Math.min(Math.PI / 2, orbitPhi));
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
    setTimeout(() => (userDragging = false), 100);
  });

  // Scroll to zoom
  renderer.domElement.addEventListener('wheel', (e) => {
    orbitRadius += e.deltaY * 0.01;
    orbitRadius = Math.max(3, Math.min(20, orbitRadius));
  });

  // ─── Resize ───
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation Loop ───
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.1);
    const t = performance.now() * 0.001;

    // Smooth camera towards target
    const lerpFactor = 1 - Math.exp(-3 * dt);

    if (!userDragging) {
      camera.position.lerp(camTarget.pos, lerpFactor);
      // Smooth lookAt
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      const targetLook = camTarget.look.clone().sub(camera.position).normalize();
      const smoothedLook = currentLook.lerp(targetLook, lerpFactor).normalize();
      const lookPoint = camera.position.clone().add(smoothedLook.multiplyScalar(10));
      camera.lookAt(lookPoint);
    } else {
      // Free orbit
      const x = orbitRadius * Math.sin(orbitPhi) * Math.cos(orbitTheta);
      const y = orbitRadius * Math.cos(orbitPhi);
      const z = orbitRadius * Math.sin(orbitPhi) * Math.sin(orbitTheta);
      camera.position.lerp(
        new THREE.Vector3(
          orbitTarget.x + x,
          orbitTarget.y + y,
          orbitTarget.z + z
        ),
        lerpFactor
      );
      camera.lookAt(orbitTarget);
    }

    // Animate station markers
    stationGroup.children.forEach((child) => {
      if (child.userData?.stationId) {
        if (child.userData.halo) {
          child.rotation.x += 0.02;
          child.rotation.y += 0.03;
          child.material.emissiveIntensity =
            child.userData.stationId === currentStation ? 1.2 : 0.4;
        } else {
          // Float
          child.position.y =
            child.userData.baseY + Math.sin(t * 2 + child.userData.stationId.length) * 0.12;
          child.material.emissiveIntensity =
            child.userData.stationId === currentStation ? 1.4 : 0.6;
        }
      }
    });

    // Rotate starfield slowly
    starfield.rotation.y += 0.0003;
    starfield.rotation.x += 0.0001;

    // Flicker ceiling lights
    cyanLight.intensity = 2.8 + Math.sin(t * 3.7) * 0.4;

    renderer.render(scene, camera);
  }

  // ─── Keyboard shortcuts ───
  window.addEventListener('keydown', (e) => {
    const keys = ['1', '2', '3', '4', '5'];
    const idx = keys.indexOf(e.key);
    if (idx >= 0 && idx < STATIONS.length) {
      navigateTo(STATIONS[idx].id);
    }
    if (e.key === '0' || e.key === '`') {
      navigateTo('helm');
    }
  });

  // ─── Init ───
  navigateTo('helm');
  animate();

  // Hide hint after 8s
  setTimeout(() => {
    const hint = document.querySelector('#bridgeHint');
    if (hint) hint.style.opacity = '0';
  }, 8000);
}
