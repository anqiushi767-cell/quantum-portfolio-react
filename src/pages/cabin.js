import * as THREE from 'three';

export function mountCabin(app) {
  const isMobile = window.innerWidth <= 768;

  app.innerHTML = `
    <div id="cabinCanvas" style="position:fixed;inset:0;z-index:0;"></div>
    <div class="cctv-overlay" id="cctvOverlay"></div>
    <div class="cabin-hud">
      <span class="cabin-rec">● REC</span>
      <span class="cabin-title">EMERGENCY CABIN · CCTV FEED</span>
      <span class="cabin-sub">LIGHTING SYSTEM FAILURE · BACKUP POWER ACTIVE</span>
      <span class="cabin-ts" id="cabinTS">00:00:00</span>
    </div>
    <a href="/" class="cabin-back" title="返回">← EXIT</a>
    <div class="cabin-hint">拖拽旋转视角 · 滚轮缩放</div>
  `;

  const container = document.querySelector('#cabinCanvas');

  // ─── Scene ───
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 30);
  camera.position.set(1.8, 2.2, 1.6);
  camera.lookAt(0, 0.8, -0.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // ─── Materials ───
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2a32, roughness: 0.5, metalness: 0.6 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e1e26, roughness: 0.35, metalness: 0.7 });
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0x24242e, roughness: 0.45, metalness: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.6, metalness: 0.5 });

  const group = new THREE.Group();

  // ── Room: 4x4x3 (w×d×h) ──
  const W = 4, D = 3.5, H = 2.8;

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  group.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  group.add(ceiling);

  // Walls
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
  backWall.position.set(0, H / 2, -D / 2);
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), wallMat);
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), wallMat);
  rightWall.position.set(W / 2, H / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  group.add(rightWall);

  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
  frontWall.position.set(0, H / 2, D / 2);
  frontWall.rotation.y = Math.PI;
  group.add(frontWall);

  // ── Wall panels / details ──
  function addPanel(x, y, z, rx, ry, w, h) {
    const g = new THREE.PlaneGeometry(w, h);
    const p = new THREE.Mesh(g, darkMat);
    p.position.set(x, y, z);
    if (rx) p.rotation.x = rx;
    if (ry) p.rotation.y = ry;
    group.add(p);
  }
  addPanel(0, 1.2, -D / 2 + 0.01, 0, 0, 2, 1.4);
  addPanel(0, 2.2, D / 2 - 0.01, 0, Math.PI, 1.8, 1);
  addPanel(-W / 2 + 0.01, 1.5, 0.8, 0, Math.PI / 2, 1.8, 1);
  addPanel(W / 2 - 0.01, 1.5, -0.5, 0, -Math.PI / 2, 1.8, 1);

  // ── Pipes on ceiling ──
  const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, W, 8);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.9 });
  for (let z = -1; z <= 1; z += 1.5) {
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, H - 0.08, z);
    group.add(pipe);
  }

  // ── Dead ceiling light ──
  const deadLight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.3 })
  );
  deadLight.position.set(0, H - 0.05, 0);
  group.add(deadLight);

  // ── Emergency red light (wall-mounted, right side) ──
  const emLightBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.12, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9 })
  );
  emLightBase.position.set(W / 2 - 0.06, H - 0.5, -0.5);
  group.add(emLightBase);

  const emLightBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.1, emissive: 0xff0000, emissiveIntensity: 0 })
  );
  emLightBulb.position.copy(emLightBase.position);
  emLightBulb.position.x -= 0.06;
  group.add(emLightBulb);

  // Red point light (will animate)
  const redLight = new THREE.PointLight(0xff0000, 0, 8);
  redLight.position.copy(emLightBase.position);
  redLight.position.x -= 0.06;
  group.add(redLight);

  // ── 404 Screen (back wall) ──
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 512;
  screenCanvas.height = 256;
  const sctx = screenCanvas.getContext('2d');
  sctx.fillStyle = '#000a0a';
  sctx.fillRect(0, 0, 512, 256);
  sctx.fillStyle = '#00ffcc';
  sctx.font = 'bold 120px "Orbitron", monospace';
  sctx.textAlign = 'center';
  sctx.textBaseline = 'middle';
  sctx.shadowColor = '#00ffcc';
  sctx.shadowBlur = 30;
  sctx.fillText('404', 256, 100);
  sctx.shadowBlur = 0;
  sctx.font = '20px "Inter", sans-serif';
  sctx.fillStyle = '#008866';
  sctx.fillText('EMERGENCY · BACKUP DISPLAY ACTIVE', 256, 200);

  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.minFilter = THREE.LinearFilter;

  const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.95, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.2, metalness: 0.95 })
  );
  screenFrame.position.set(0, 1.5, -D / 2 + 0.05);
  group.add(screenFrame);

  const screenPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.8),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screenPanel.position.set(0, 1.5, -D / 2 + 0.09);
  group.add(screenPanel);

  // Screen glow
  const screenLight = new THREE.PointLight(0x004433, 0.3, 3);
  screenLight.position.set(0, 1.5, -D / 2 + 0.3);
  group.add(screenLight);

  // ── Small console below screen ──
  const consoleGeo = new THREE.BoxGeometry(1.2, 0.3, 0.4);
  const consoleMesh = new THREE.Mesh(consoleGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 }));
  consoleMesh.position.set(0, 0.5, -D / 2 + 0.25);
  group.add(consoleMesh);

  // Console blinking light
  const blinkLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.1, emissive: 0x00ff00, emissiveIntensity: 0.8 })
  );
  blinkLight.position.set(0.4, 0.68, -D / 2 + 0.45);
  group.add(blinkLight);

  scene.add(group);

  // ─── Ambient (very dim) ───
  const ambient = new THREE.AmbientLight(0x1a1a2e, 0.55);
  scene.add(ambient);

  // ─── CCTV stripe glitch ───
  const cctvOverlay = document.querySelector('#cctvOverlay');
  const stripeColors = ['#00f5ff', '#ff2bd6', '#ff0000', '#00ff44', '#ffff00', '#fff'];
  function spawnCCTVStripes() {
    if (Math.random() > 0.5) return;
    const count = 1 + Math.floor(Math.random() * 6);
    let html = '';
    for (let i = 0; i < count; i++) {
      const top = Math.floor(Math.random() * 100);
      const h = 1 + Math.floor(Math.random() * 3);
      const color = stripeColors[Math.floor(Math.random() * stripeColors.length)];
      const alpha = 0.15 + Math.random() * 0.35;
      html += `<div style="top:${top}%;height:${h}px;background:${color};opacity:${alpha};position:absolute;left:0;right:0;mix-blend-mode:screen;pointer-events:none;"></div>`;
    }
    cctvOverlay.innerHTML = html;
    setTimeout(() => cctvOverlay.innerHTML = '', 60 + Math.random() * 100);
  }
  setInterval(spawnCCTVStripes, 250);

  // ─── CCTV timestamp ───
  const tsEl = document.querySelector('#cabinTS');
  const startTime = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    tsEl.textContent = `${h}:${m}:${s}`;
  }, 1000);

  // ─── Orbit controls ───
  let isDragging = false, prevMX = 0, prevMY = 0;
  let orbitTheta = -0.5, orbitPhi = 0.9;
  let orbitRadius = 3;
  const orbitTarget = new THREE.Vector3(0, 0.8, -0.5);

  renderer.domElement.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevMX = e.clientX;
    prevMY = e.clientY;
  });
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    orbitTheta -= (e.clientX - prevMX) * 0.005;
    orbitPhi -= (e.clientY - prevMY) * 0.005;
    orbitPhi = Math.max(-0.5, Math.min(1.2, orbitPhi));
    prevMX = e.clientX;
    prevMY = e.clientY;
  });
  window.addEventListener('pointerup', () => { isDragging = false; });
  renderer.domElement.addEventListener('wheel', (e) => {
    orbitRadius += e.deltaY * 0.01;
    orbitRadius = Math.max(1.2, Math.min(6, orbitRadius));
  });

  // Touch (mobile)
  renderer.domElement.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      orbitTheta -= (e.touches[0].clientX - prevMX) * 0.005;
      orbitPhi -= (e.touches[0].clientY - prevMY) * 0.005;
      orbitPhi = Math.max(-0.5, Math.min(1.2, orbitPhi));
      prevMX = e.touches[0].clientX;
      prevMY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation ───
  let emTimer = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.1);
    emTimer += dt;

    // Emergency light strobe: on ~0.35s, off ~0.65s
    const strobePhase = emTimer % 1.0;
    const emIntensity = strobePhase < 0.35 ? 2.5 : 0.05;
    redLight.intensity += (emIntensity - redLight.intensity) * 0.3;
    emLightBulb.material.emissiveIntensity = redLight.intensity * 0.4;

    // Blinking console light
    blinkLight.material.emissiveIntensity = Math.sin(emTimer * 4) > 0 ? 0.8 : 0.1;

    // Camera orbit
    const x = orbitRadius * Math.sin(orbitPhi) * Math.cos(orbitTheta);
    const y = orbitRadius * Math.cos(orbitPhi);
    const z = orbitRadius * Math.sin(orbitPhi) * Math.sin(orbitTheta);
    camera.position.lerp(
      new THREE.Vector3(orbitTarget.x + x, orbitTarget.y + y, orbitTarget.z + z),
      1 - Math.exp(-2 * dt)
    );
    camera.lookAt(orbitTarget);

    renderer.render(scene, camera);
  }

  animate();
}
