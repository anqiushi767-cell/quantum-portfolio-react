import { createSceneBackground, makeTopbar, setupMobile, getMobileStarConfig } from '../shared';

function buildAdvancedGlitchTitle(text) {
  return `
    <div class="glitch-advanced" id="heroGlitch">
      <span class="glitch-layer layer-violet" aria-hidden="true">${text}</span>
      <span class="glitch-layer layer-red" aria-hidden="true">${text}</span>
      <span class="glitch-layer layer-cyan" aria-hidden="true">${text}</span>
      <span class="glitch-layer layer-main">${text}</span>
    </div>
  `;
}

function burstAdvancedGlitch(el, intensity = 1) {
  if (!el) return;

  const layers = el.querySelectorAll('.glitch-layer');
  el.classList.remove('burst');
  void el.offsetWidth;
  el.classList.add('burst');

  layers.forEach((layer) => {
    const dx = (Math.random() - 0.5) * 10 * intensity;
    const dy = (Math.random() - 0.5) * 6 * intensity;
    const skew = (Math.random() - 0.5) * 8 * intensity;
    const hue = Math.floor((Math.random() - 0.5) * 40);

    layer.style.transform = `translate3d(${dx}px, ${dy}px, 0) skewX(${skew}deg)`;
    layer.style.filter = `hue-rotate(${hue}deg)`;

    const randTop = Math.floor(Math.random() * 75);
    const h = 8 + Math.floor(Math.random() * 20);
    layer.style.clipPath = `polygon(0 ${randTop}%, 100% ${randTop}%, 100% ${Math.min(100, randTop + h)}%, 0 ${Math.min(100, randTop + h)}%)`;
  });

  setTimeout(() => {
    layers.forEach((layer) => {
      layer.style.transform = '';
      layer.style.filter = '';
      layer.style.clipPath = '';
    });
    el.classList.remove('burst');
  }, 160);
}

export function mountHome(app) {
  app.innerHTML = `
    <div class="scene scene-shake" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('home')}
      <section class="hero">
        <div class="grid-two">
          <div class="panel">
            <div class="kicker">Quantum Signal // Interactive Portfolio</div>

            ${buildAdvancedGlitchTitle("Hello, I’m [Your Name]")}

            <p class="subtitle" id="subtitleText">
              这是一个面向未来的数字空间站首页。它不仅展示内容，还会对你的鼠标、点击和停留时间做出反馈。
              星空是真 3D 的，标题会在故障中分裂，页面像一块会呼吸的电子宇宙面板。
            </p>

            <div class="actions">
              <a class="btn neon-pulse" href="/about.html">进入档案</a>
              <a class="btn neon-pulse" href="/works.html">查看星图</a>
              <button class="btn neon-pulse" id="btnBurst">触发 glitch</button>
            </div>

            <div class="glitch-hover-note">tip: move mouse near the title / click it repeatedly</div>
          </div>

          <div class="panel">
            <div class="orbit-ring"></div>
          </div>
        </div>

        <div class="cards">
          <div class="feature">
            <h3>Deep Space UI</h3>
            <p>多层透明面板、扫描线、微发光、极光色块，整体更像未来控制舱。</p>
          </div>
          <div class="feature">
            <h3>True 3D Universe</h3>
            <p>透视相机、星层深度、鼠标转头式旋转、深度漂移，形成真实空间感。</p>
          </div>
          <div class="feature" id="easterHome">
            <h3>Hidden Signal</h3>
            <p>点击若干次标题或按钮可触发彩蛋，系统会短暂进入异常模式。</p>
          </div>
        </div>
      </section>

      <div class="footer">SYSTEM ONLINE · SIGNAL STABLE · READY FOR TRANSMISSION</div>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const title = document.querySelector('#heroGlitch');
  const homeFeature = document.querySelector('#easterHome');
  const btnBurst = document.querySelector('#btnBurst');
  const subtitle = document.querySelector('#subtitleText');

  const bg = createSceneBackground(scene, getMobileStarConfig({
    starCount: 22000,
    depth: 3800,
    layers: 6
  }));

  let clickCount = 0;
  const glitchMessages = [
    'glitch burst injected.',
    'RGB separation active.',
    'fragment shards deployed.',
    'signal layer unstable.',
    'hidden channel opened.',
    'orbit decoupled.'
  ];

  function triggerGlitch(intensity = 1) {
    burstAdvancedGlitch(title, intensity);
    subtitle.textContent = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
    document.body.style.filter = 'contrast(1.08) saturate(1.15) brightness(1.02)';
    setTimeout(() => (document.body.style.filter = ''), 240);
  }

  title.addEventListener('mouseenter', () => triggerGlitch(1));
  title.addEventListener('mousemove', () => triggerGlitch(0.5));
  title.addEventListener('click', () => {
    clickCount++;
    triggerGlitch(1.2);
    if (clickCount >= 5) {
      homeFeature.querySelector('p').textContent =
        'EASTER EGG: 你连续点击了标题 5 次。欢迎进入隐藏引导模式。';
      homeFeature.classList.add('flicker');
      clickCount = 0;
    }
  });

  btnBurst.addEventListener('click', () => triggerGlitch(1.1));

  homeFeature.addEventListener('click', () => {
    homeFeature.querySelector('p').textContent =
      '彩蛋已激活：页面可能会在短时间内出现轻微色差和故障闪烁。';
    triggerGlitch(0.9);
  });

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 1.2 });
  }

  animate();
  setupMobile();
}