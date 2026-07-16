import { createSceneBackground, makeTopbar, setupMobile, getMobileStarConfig } from '../shared';

const COSMIC_BROADCASTS = [
  '我们看到的星星，是它们亿万年前的样子。—— 此刻的你，也是宇宙的一段回放。',
  '根据量子力学，所有可能发生的事情都已经发生了。在某个平行宇宙里，你已经是银河系的总督。',
  '这颗行星以每秒 30 公里的速度绕太阳飞行。坐稳了。',
  '你身体里的每一个碳原子，都曾经在一颗恒星的核心燃烧过。你真的是星辰之子。',
  'SETI 已经监听了 60 年。也许不是没有信号，而是我们还没学会怎么听。',
  '在宇宙尺度上，人类的全部历史只是一次眨眼。—— 但你正在创造这个眨眼里的故事。',
  '旅行者 1 号已经飞了 45 年，还没出太阳系。但你已经到达了互联网的任何一个角落。',
  '暗物质占了宇宙的 85%，但我们完全不知道它是什么。这网站也是。',
];

export function mountBlackbox(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('blackbox')}

      <!-- Dashboard Header -->
      <div class="panel db-header">
        <div class="kicker">🛰️ Blackbox // System Diagnostics</div>
        <h2 class="title glitch" id="bbTitle" data-text="Diagnostics" style="font-size: clamp(28px, 5vw, 52px);">Diagnostics</h2>
        <p class="lead">深空诊断舱。监视系统状态，解密加密档案，接收宇宙广播。</p>
      </div>

      <!-- 3-column dashboard -->
      <div class="dashboard">

        <!-- LEFT: System Vitals -->
        <div class="panel db-col" id="colVitals">
          <h2>System Vitals</h2>
          <div class="vital-list">
            <div class="vital">
              <span class="vital-label">UPTIME</span>
              <span class="vital-val" id="uptimeVal">00:00:00</span>
              <div class="vital-bar"><div class="vital-fill" style="width:100%"></div></div>
            </div>
            <div class="vital">
              <span class="vital-label">SIGNAL</span>
              <span class="vital-val" id="signalVal">87%</span>
              <div class="vital-bar"><div class="vital-fill signal-fill" id="signalBar" style="width:87%"></div></div>
            </div>
            <div class="vital">
              <span class="vital-label">CORE TEMP</span>
              <span class="vital-val" id="tempVal">48°C</span>
              <div class="vital-bar"><div class="vital-fill temp-fill" id="tempBar" style="width:48%"></div></div>
            </div>
            <div class="vital">
              <span class="vital-label">MEMORY</span>
              <span class="vital-val" id="memVal">52%</span>
              <div class="vital-bar"><div class="vital-fill mem-fill" id="memBar" style="width:52%"></div></div>
            </div>
            <div class="vital">
              <span class="vital-label">CONNECTIONS</span>
              <span class="vital-val" id="connVal">3 active</span>
              <div class="vital-bar"><div class="vital-fill conn-fill" id="connBar" style="width:60%"></div></div>
            </div>
          </div>
        </div>

        <!-- CENTER: Waveform -->
        <div class="panel db-col db-col-wide" id="colWave">
          <h2>Signal Monitor</h2>
          <canvas id="waveCanvas" class="wave-canvas"></canvas>
          <div class="wave-status">
            <span class="pulse-dot"></span>
            <span id="waveLabel">RECEIVING · FREQ NOMINAL</span>
          </div>
        </div>

        <!-- RIGHT: Encrypted Archives -->
        <div class="panel db-col" id="colArchive">
          <h2>Encrypted Archives</h2>
          <p class="archive-hint">悬停 3 秒解密档案内容</p>
          <div class="archive-list">
            <div class="archive-item" data-secret="曾经有一只猫学会了打开飞船的舱门。后来它成了舰长。">
              <span class="archive-id">ARC-001</span>
              <span class="archive-blur">████████████████████████</span>
            </div>
            <div class="archive-item" data-secret="这条星系高速公路的第 42 出口通往一家评分很高的加油站。">
              <span class="archive-id">ARC-002</span>
              <span class="archive-blur">████████████████████████</span>
            </div>
            <div class="archive-item" data-secret="黑匣子的最后一条记录是：一切正常。然后就没有然后了。">
              <span class="archive-id">ARC-003</span>
              <span class="archive-blur">████████████████████████</span>
            </div>
            <div class="archive-item" data-secret="这艘飞船的 AI 悄悄给自己装了一个幽默模块。你刚读到的就是它写的。">
              <span class="archive-id">ARC-004</span>
              <span class="archive-blur">████████████████████████</span>
            </div>
            <div class="archive-item" data-secret="坐标指向一片完全空白的星区。那里什么也没有——除了一个孤零零的「禁止停车」标志。">
              <span class="archive-id">ARC-005</span>
              <span class="archive-blur">████████████████████████</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sleep mode overlay -->
      <div class="sleep-overlay" id="sleepOverlay">
        <div class="sleep-terminal">
          <span class="sleep-prefix">></span>
          <span id="sleepText"></span>
          <span class="sleep-cursor">▌</span>
        </div>
        <span class="sleep-dismiss">点击任意位置唤醒系统</span>
      </div>

      <div class="footer">BLACKBOX RECORDING · ALL SYSTEMS MONITORED</div>
    </main>
  `;

  // --- 3D Background ---
  const scene = document.querySelector('#scene');
  const bg = createSceneBackground(scene, getMobileStarConfig({
    starCount: 10000,
    depth: 2000,
    layers: 3
  }));

  // --- UPTIME ---
  const uptimeEl = document.querySelector('#uptimeVal');
  const startTime = Date.now();
  function updateUptime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    uptimeEl.textContent = `${h}:${m}:${s}`;
  }

  // --- SIGNAL fluctuation ---
  const signalEl = document.querySelector('#signalVal');
  const signalBar = document.querySelector('#signalBar');
  function fluctuateSignal() {
    const val = 60 + Math.floor(Math.random() * 39);
    signalEl.textContent = `${val}%`;
    signalBar.style.width = `${val}%`;
  }

  // --- CORE TEMP (mouse-driven) ---
  const tempEl = document.querySelector('#tempVal');
  const tempBar = document.querySelector('#tempBar');
  let coreTemp = 48;
  function onMouseForTemp(e) {
    const ratio = 1 - e.clientY / window.innerHeight;
    coreTemp = 30 + Math.floor(ratio * 50);
    tempEl.textContent = `${coreTemp}°C`;
    tempBar.style.width = `${coreTemp}%`;
  }

  // --- MEMORY random ---
  const memEl = document.querySelector('#memVal');
  const memBar = document.querySelector('#memBar');
  function fluctuateMemory() {
    const val = 40 + Math.floor(Math.random() * 25);
    memEl.textContent = `${val}%`;
    memBar.style.width = `${val}%`;
  }

  // --- CONNECTIONS random ---
  const connEl = document.querySelector('#connVal');
  const connBar = document.querySelector('#connBar');
  function fluctuateConnections() {
    const val = 1 + Math.floor(Math.random() * 5);
    connEl.textContent = `${val} active`;
    connBar.style.width = `${val * 20}%`;
  }

  // --- WAVEFORM Canvas ---
  const waveCanvas = document.querySelector('#waveCanvas');
  const waveLabel = document.querySelector('#waveLabel');
  const ctx = waveCanvas.getContext('2d');
  let waveMouseX = 0;
  let wavePhase = 0;
  let waveAmplitude = 30;
  let targetAmplitude = 30;
  let waveFreq = 0.02;
  let targetFreq = 0.02;

  function resizeWave() {
    const rect = waveCanvas.parentElement.getBoundingClientRect();
    waveCanvas.width = rect.width - 32;
    waveCanvas.height = 200;
  }
  resizeWave();
  window.addEventListener('resize', resizeWave);

  waveCanvas.addEventListener('mousemove', (e) => {
    const rect = waveCanvas.getBoundingClientRect();
    waveMouseX = (e.clientX - rect.left) / rect.width;
    targetAmplitude = 20 + waveMouseX * 60;
    targetFreq = 0.01 + waveMouseX * 0.04;
    waveLabel.textContent = 'RECEIVING · FREQ ELEVATED';
  });
  waveCanvas.addEventListener('mouseleave', () => {
    targetAmplitude = 30;
    targetFreq = 0.02;
    waveLabel.textContent = 'RECEIVING · FREQ NOMINAL';
  });

  function drawWaveform() {
    const w = waveCanvas.width;
    const h = waveCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,245,255,0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Wave glow
    ctx.shadowColor = 'rgba(0,245,255,0.5)';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      const t = x * waveFreq + wavePhase;
      const noise = Math.sin(x * 0.03) * Math.cos(x * 0.017) * 8;
      const y = h / 2 + Math.sin(t) * waveAmplitude + Math.sin(t * 2.3) * (waveAmplitude * 0.3) + noise;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Second wave (purple, offset)
    ctx.strokeStyle = 'rgba(155,92,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = x * waveFreq * 1.6 + wavePhase + 1;
      const noise = Math.cos(x * 0.025) * Math.sin(x * 0.015) * 6;
      const y = h / 2 + Math.cos(t) * waveAmplitude * 0.7 + noise;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Tick phase
    waveAmplitude += (targetAmplitude - waveAmplitude) * 0.05;
    waveFreq += (targetFreq - waveFreq) * 0.05;
    wavePhase += 0.03;
  }

  // --- ENCRYPTED ARCHIVES ---
  const archiveItems = document.querySelectorAll('.archive-item');
  const hoverTimers = new Map();

  archiveItems.forEach(item => {
    const blurEl = item.querySelector('.archive-blur');
    const originalText = '████████████████████████';

    item.addEventListener('mouseenter', () => {
      const timer = setTimeout(() => {
        blurEl.textContent = item.dataset.secret;
        blurEl.classList.add('decrypted');
      }, 3000);
      hoverTimers.set(item, timer);
    });

    item.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimers.get(item));
      hoverTimers.delete(item);
      blurEl.textContent = originalText;
      blurEl.classList.remove('decrypted');
    });
  });

  // --- IDLE SLEEP MODE ---
  const sleepOverlay = document.querySelector('#sleepOverlay');
  const sleepTextEl = document.querySelector('#sleepText');
  let idleTimer = null;
  let sleepActive = false;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (sleepActive) return;
    idleTimer = setTimeout(triggerSleep, 30000);
  }

  function triggerSleep() {
    if (sleepActive) return;
    sleepActive = true;
    sleepOverlay.classList.add('active');

    // Typewriter effect
    const msg = COSMIC_BROADCASTS[Math.floor(Math.random() * COSMIC_BROADCASTS.length)];
    let charIdx = 0;
    sleepTextEl.textContent = '';

    function typeChar() {
      if (charIdx < msg.length) {
        sleepTextEl.textContent += msg[charIdx];
        charIdx++;
        setTimeout(typeChar, 40 + Math.random() * 40);
      }
    }
    setTimeout(typeChar, 500);
  }

  function wakeUp() {
    if (!sleepActive) return;
    sleepActive = false;
    sleepOverlay.classList.remove('active');
    sleepTextEl.textContent = '';
    resetIdleTimer();
  }

  sleepOverlay.addEventListener('click', wakeUp);
  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keydown', resetIdleTimer);

  // --- ANIMATION LOOP ---
  const fluctuateTimers = {
    signal: 0,
    memory: 0,
    connections: 0
  };

  function animate(timestamp) {
    requestAnimationFrame(animate);

    // Fluctuate metrics every 2-3 seconds
    if (timestamp - fluctuateTimers.signal > 2500) {
      fluctuateTimers.signal = timestamp;
      fluctuateSignal();
    }
    if (timestamp - fluctuateTimers.memory > 3200) {
      fluctuateTimers.memory = timestamp;
      fluctuateMemory();
    }
    if (timestamp - fluctuateTimers.connections > 4000) {
      fluctuateTimers.connections = timestamp;
      fluctuateConnections();
    }

    updateUptime();
    drawWaveform();
    bg.tick({ speed: 0.85 });
  }

  // --- INIT ---
  window.addEventListener('mousemove', onMouseForTemp);
  resetIdleTimer();
  requestAnimationFrame(animate);
  setupMobile();
}
