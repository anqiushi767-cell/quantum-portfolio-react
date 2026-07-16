import { createSceneBackground, makeTopbar, setupMobile, getMobileStarConfig } from '../shared';

export function mountNotFound(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <!-- Glitch overlays -->
    <div class="glitch-bar-overlay" id="glitchBars"></div>
    <div class="static-overlay" id="staticOverlay"></div>
    <div class="rgb-split-overlay" id="rgbSplit"></div>
    <div class="screen-tear" id="screenTear"></div>

    <main class="page">
      ${makeTopbar('')}
      <section class="section">
        <div class="error-box panel flicker">
          <p class="error-note" id="errorNote">SIGNAL LOST · DIMENSION ERROR · ERR_SPACEFLOW_404</p>
          <h1 class="error-code glitch shake" data-text="404" id="errorCode">404</h1>
          <h2 class="title glitch" data-text="Page Not Found" style="font-size: clamp(28px, 5vw, 64px); margin: 12px auto 0;" id="errorTitle">
            Page Not Found
          </h2>
          <p class="lead" style="margin: 18px auto 0;" id="errorDesc">
            你正在查看一个缺失的坐标。这里像被宇宙边缘吞掉了一样，不断闪烁、抖动、偏移。
          </p>
          <div class="actions" style="justify-content:center; margin-top: 20px;">
            <a class="btn" href="/">返回主航道</a>
          </div>
        </div>
      </section>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const bg = createSceneBackground(scene, getMobileStarConfig({
    starCount: 18000,
    depth: 2800,
    layers: 4
  }));

  // ─── DOM refs ───
  const errorCode = document.querySelector('#errorCode');
  const errorNote = document.querySelector('#errorNote');
  const errorTitle = document.querySelector('#errorTitle');
  const errorDesc = document.querySelector('#errorDesc');
  const glitchBars = document.querySelector('#glitchBars');
  const staticOverlay = document.querySelector('#staticOverlay');
  const rgbSplit = document.querySelector('#rgbSplit');
  const screenTear = document.querySelector('#screenTear');

  // ─── Body flash (more aggressive) ───
  const flashPatterns = [
    '',
    'brightness(1.3) contrast(1.3) hue-rotate(30deg)',
    'brightness(0.7) contrast(1.5) saturate(2) hue-rotate(-20deg)',
    'brightness(1.2) contrast(1.1) hue-rotate(60deg)',
    'brightness(1.4) contrast(1.4) saturate(0.5) invert(0.05)',
    'contrast(1.8) brightness(0.8)',
    'hue-rotate(120deg) saturate(1.5)',
    'brightness(1.5) contrast(1.5) hue-rotate(-50deg) invert(0.08)',
  ];

  function bodyFlash() {
    const pattern = flashPatterns[Math.floor(Math.random() * flashPatterns.length)];
    document.body.style.filter = pattern;
  }

  // ─── Glitch bars ───
  function spawnGlitchBars() {
    if (Math.random() > 0.4) return;
    const count = 1 + Math.floor(Math.random() * 4);
    let html = '';
    for (let i = 0; i < count; i++) {
      const top = Math.floor(Math.random() * 100);
      const h = 2 + Math.floor(Math.random() * 30);
      const colors = ['#00f5ff', '#ff2bd6', '#9b5cff', '#ff3b3b', '#fff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const alpha = 0.3 + Math.random() * 0.5;
      html += `<div style="top:${top}%;height:${h}px;background:${color};opacity:${alpha};position:absolute;left:0;right:0;mix-blend-mode:screen;pointer-events:none;"></div>`;
    }
    glitchBars.innerHTML = html;
    setTimeout(() => glitchBars.innerHTML = '', 80 + Math.random() * 120);
  }

  // ─── Static noise burst ───
  function spawnStatic() {
    if (Math.random() > 0.25) return;
    staticOverlay.style.opacity = (0.3 + Math.random() * 0.5).toString();
    setTimeout(() => staticOverlay.style.opacity = '0', 50 + Math.random() * 80);
  }

  // ─── RGB split ───
  function spawnRGBSplit() {
    if (Math.random() > 0.3) return;
    const dx = (Math.random() - 0.5) * 12;
    const dy = (Math.random() - 0.5) * 8;
    rgbSplit.style.transform = `translate(${dx}px, ${dy}px)`;
    rgbSplit.style.opacity = (0.6 + Math.random() * 0.4).toString();
    setTimeout(() => {
      rgbSplit.style.transform = 'translate(0, 0)';
      rgbSplit.style.opacity = '0';
    }, 60 + Math.random() * 80);
  }

  // ─── Screen tear ───
  function spawnScreenTear() {
    if (Math.random() > 0.2) return;
    const offset = (Math.random() - 0.5) * 40;
    const top = 20 + Math.floor(Math.random() * 60);
    screenTear.style.top = top + '%';
    screenTear.style.transform = `translateX(${offset}px)`;
    screenTear.style.opacity = '1';
    setTimeout(() => {
      screenTear.style.opacity = '0';
    }, 50 + Math.random() * 60);
  }

  // ─── Text corruption ───
  const corruptChars = '!@#$%^&*<>?/\\|{}[]▮▯▰▱▓▒░█▄▀■□▪▫◘◙◦☢☣⚠⚡⌁⌂⍟⎔⏣⬡';
  function corruptText() {
    if (Math.random() > 0.35) return;

    // Corrupt 404 number
    const original = '404';
    let corrupted = '';
    for (let i = 0; i < 3; i++) {
      corrupted += Math.random() < 0.5
        ? corruptChars[Math.floor(Math.random() * corruptChars.length)]
        : original[i];
    }
    errorCode.setAttribute('data-text', corrupted);
    errorCode.textContent = corrupted;

    // Corrupt subtitle note
    const noteMsgs = [
      'S1GN4L L0ST · D1MEN$10N ERR0R',
      'SIGN@L L0ST · DIMENSI0N FA1L',
      'SIG_NAL LOST · ERR_SPACEFLOW',
      'S1GNAL L0ST · DIMENS10N ERR0R · ERR_SPACEFLOW_404',
    ];
    errorNote.textContent = noteMsgs[Math.floor(Math.random() * noteMsgs.length)];

    setTimeout(() => {
      errorCode.setAttribute('data-text', '404');
      errorCode.textContent = '404';
      errorNote.textContent = 'SIGNAL LOST · DIMENSION ERROR · ERR_SPACEFLOW_404';
    }, 100 + Math.random() * 150);
  }

  // ─── Intense shake ───
  function intenseShake() {
    if (Math.random() > 0.2) return;
    errorCode.classList.add('shake-hard');
    setTimeout(() => errorCode.classList.remove('shake-hard'), 80 + Math.random() * 100);
  }

  // ─── Timers ───
  setInterval(bodyFlash, 100);
  setInterval(spawnGlitchBars, 200);
  setInterval(spawnStatic, 400);
  setInterval(spawnRGBSplit, 350);
  setInterval(spawnScreenTear, 500);
  setInterval(corruptText, 600);
  setInterval(intenseShake, 700);

  // ─── Starfield chaos spikes ───
  let chaosLevel = 1;
  setInterval(() => {
    chaosLevel = 1 + Math.random() * 3;
  }, 2000);

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 1.3 * chaosLevel, shake: 0.8 * chaosLevel });
  }

  animate();
  setupMobile();
}
