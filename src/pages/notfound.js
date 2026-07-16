import { createSceneBackground, makeTopbar, setupMobile, getMobileStarConfig } from '../shared';

export function mountNotFound(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('')}
      <section class="section">
        <div class="error-box panel flicker">
          <p class="error-note">SIGNAL LOST · DIMENSION ERROR · ERR_SPACEFLOW_404</p>
          <h1 class="error-code glitch shake" data-text="404">404</h1>
          <h2 class="title glitch" data-text="Page Not Found" style="font-size: clamp(28px, 5vw, 64px); margin: 12px auto 0;">
            Page Not Found
          </h2>
          <p class="lead" style="margin: 18px auto 0;">
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

  setInterval(() => {
    document.body.style.filter = Math.random() > 0.5
      ? 'brightness(1.15) contrast(1.15) hue-rotate(20deg)'
      : '';
  }, 120);

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 1.3, shake: 0.8 });
  }

  animate();
  setupMobile();
}