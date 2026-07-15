import * as THREE from 'three';

function makeStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.12, 'rgba(255,255,255,0.96)');
  g.addColorStop(0.28, 'rgba(160,240,255,0.6)');
  g.addColorStop(0.5, 'rgba(0,245,255,0.25)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function makeRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.02)');
  g.addColorStop(0.6, 'rgba(0,245,255,0.18)');
  g.addColorStop(0.8, 'rgba(177,0,255,0.06)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function createSceneBackground(container, options = {}) {
  const {
    starCount = 18000,
    depth = 3200,
    layers = 5
  } = options;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04060c, 0.00026);

  const camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / window.innerHeight,
    0.1,
    8000
  );
  camera.position.set(0, 0, 300);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const starTex = makeStarTexture();
  const ringTex = makeRingTexture();

  const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    zoomPulse: 0,
    time: 0
  };

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    state.targetX = state.mouseX * 0.7;
    state.targetY = state.mouseY * 0.45;
  }

  function onClick() {
    state.zoomPulse = 1;
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);

  const layersGroup = new THREE.Group();
  scene.add(layersGroup);

  function createParticleLayer({
    count,
    size,
    spread,
    zBias,
    opacity,
    hueStart,
    hueEnd,
    swirl = 0.0002,
    drift = 0.02
  }) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = spread * (0.15 + Math.random() * 0.85);
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() - 0.5) * 1.2;

      positions[i3] = Math.cos(a) * r + (Math.random() - 0.5) * spread * 0.18;
      positions[i3 + 1] = Math.sin(a) * r * b + (Math.random() - 0.5) * spread * 0.24;
      positions[i3 + 2] = (Math.random() - 0.5) * zBias;

      const c = new THREE.Color().setHSL(
        THREE.MathUtils.lerp(hueStart, hueEnd, Math.random()),
        0.85,
        0.7 + Math.random() * 0.15
      );

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = 0.5 + Math.random() * 2.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      map: starTex,
      size,
      transparent: true,
      opacity,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const pts = new THREE.Points(geo, mat);
    pts.userData = { swirl, drift };
    return pts;
  }

  const particleLayers = [
    createParticleLayer({
      count: Math.floor(starCount * 0.28),
      size: 1.8,
      spread: 360,
      zBias: depth * 0.8,
      opacity: 0.95,
      hueStart: 0.52,
      hueEnd: 0.72,
      swirl: 0.00018,
      drift: 0.03
    }),
    createParticleLayer({
      count: Math.floor(starCount * 0.38),
      size: 1.35,
      spread: 620,
      zBias: depth * 1.0,
      opacity: 0.85,
      hueStart: 0.50,
      hueEnd: 0.95,
      swirl: 0.00024,
      drift: 0.05
    }),
    createParticleLayer({
      count: Math.floor(starCount * 0.42),
      size: 0.95,
      spread: 980,
      zBias: depth * 1.2,
      opacity: 0.65,
      hueStart: 0.54,
      hueEnd: 0.84,
      swirl: 0.00032,
      drift: 0.07
    })
  ];

  particleLayers.forEach((layer, idx) => {
    layer.rotation.x = -0.18 - idx * 0.08;
    layer.rotation.y = idx * 0.24;
    layersGroup.add(layer);
  });

  const nebula = new THREE.Group();
  const nebulaItems = [];
  for (let i = 0; i < layers; i++) {
    const geo = new THREE.SphereGeometry(180 + i * 80, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00f5ff : 0x9b5cff,
      transparent: true,
      opacity: 0.035 + i * 0.012,
      side: THREE.BackSide
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(
      (Math.random() - 0.5) * 160,
      (Math.random() - 0.5) * 120,
      -300 - i * 150
    );
    nebula.add(sphere);
    nebulaItems.push(sphere);
  }
  scene.add(nebula);

  const ringGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.PlaneGeometry(620 + i * 240, 620 + i * 240);
    const mat = new THREE.MeshBasicMaterial({
      map: ringTex,
      transparent: true,
      opacity: 0.16 - i * 0.03,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.position.z = -800 - i * 240;
    plane.rotation.z = i * 0.35;
    ringGroup.add(plane);
  }
  scene.add(ringGroup);

  const coreGeo = new THREE.TorusKnotGeometry(30, 8, 180, 16);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xff2bd6,
    wireframe: true,
    transparent: true,
    opacity: 0.14
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0, -180);
  scene.add(core);

  function tick(extra = {}) {
    const { speed = 1, shake = 0 } = extra;
    state.time += 0.01 * speed;

    const easedX = state.targetX;
    const easedY = state.targetY;

    camera.rotation.y += (easedX - camera.rotation.y) * 0.032;
    camera.rotation.x += (-easedY - camera.rotation.x) * 0.032;

    camera.position.x += (easedX * 60 - camera.position.x) * 0.015;
    camera.position.y += (-easedY * 40 - camera.position.y) * 0.015;
    camera.position.z += ((300 + Math.sin(state.time * 0.8) * 10) - camera.position.z) * 0.02;

    if (state.zoomPulse > 0.001) {
      camera.position.z -= state.zoomPulse * 18;
      state.zoomPulse *= 0.9;
    }

    particleLayers.forEach((layer, i) => {
      const swirl = layer.userData.swirl;
      const drift = layer.userData.drift;

      layer.rotation.y += swirl * speed * (i + 1) * 3.2;
      layer.rotation.x += swirl * speed * 0.6;
      layer.position.x = Math.sin(state.time * (0.7 + i * 0.2)) * drift * 20;
      layer.position.y = Math.cos(state.time * (0.6 + i * 0.18)) * drift * 16;
      layer.position.z = Math.sin(state.time * (0.5 + i * 0.12)) * (i + 1) * 4;
    });

    nebula.rotation.y += 0.0009 * speed;
    nebula.rotation.x += 0.00032 * speed;
    ringGroup.rotation.z += 0.0008 * speed;
    ringGroup.rotation.x += 0.00025 * speed;

    core.rotation.x += 0.0035 * speed;
    core.rotation.y += 0.0042 * speed;
    core.position.z = -180 + Math.sin(state.time * 1.4) * 12;

    nebulaItems.forEach((s, idx) => {
      s.rotation.y += 0.0001 * (idx + 1);
      s.rotation.x += 0.00005 * (idx + 1);
    });

    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
    }

    renderer.render(scene, camera);
  }

  function destroy() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('click', onClick);
    renderer.dispose();
    container.innerHTML = '';
  }

  return { scene, camera, renderer, tick, destroy, state };
}

export function glitchBurst(el) {
  if (!el) return;
  el.classList.remove('burst');
  void el.offsetWidth;
  el.classList.add('burst');
  setTimeout(() => el.classList.remove('burst'), 180);
}

export function makeTopbar(active = '') {
  const links = [
    ['home', 'Home', '/'],
    ['about', 'About Me', '/about.html'],
    ['works', 'Works', '/works.html'],
    ['lab', 'Lab', '/lab.html'],
    ['contact', 'Contact', '/contact.html']
  ];

  return `
    <div class="topbar">
      <a class="logo" href="/">
        <span class="logo-mark"></span>
        <span>Quantum Signal</span>
      </a>
      <nav class="nav">
        ${links.map(([key, text, href]) => `
          <a href="${href}" style="${key === active ? 'border-color: rgba(0,245,255,0.5); box-shadow: 0 0 18px rgba(0,245,255,0.1);' : ''}">${text}</a>
        `).join('')}
      </nav>
    </div>
  `;
}