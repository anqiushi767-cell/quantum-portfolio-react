import { createSceneBackground, makeTopbar, glitchBurst } from '../shared';

export function mountLab(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('lab')}
      <section class="section">
        <div class="panel">
          <div class="kicker">Experiment Bay // Lab</div>
          <h2 class="title glitch" id="labTitle" data-text="Experiment Bay">Experiment Bay</h2>
          <p class="lead">
            实验区：可触发视觉扰动、随机提示、宇宙波动等彩蛋。
          </p>
          <div class="actions">
            <button class="btn" id="btnGlitch">触发故障</button>
            <button class="btn" id="btnMessage">随机信号</button>
            <button class="btn" id="btnChaos">宇宙扰动</button>
          </div>
        </div>
      </section>

      <section class="section grid-two">
        <div class="panel">
          <h2>Control Panel</h2>
          <div class="card-list">
            <div class="stat"><strong>Mode</strong><span id="modeState">normal</span></div>
            <div class="stat"><strong>Entropy</strong><span id="entropyState">stable</span></div>
            <div class="stat"><strong>Signal</strong><span id="signalState">received</span></div>
          </div>
        </div>

        <div class="panel">
          <h2>Console</h2>
          <div class="stat" style="min-height: 190px; align-items: flex-start;">
            <span id="consoleText" style="line-height:1.8; text-transform:none; font-size:14px;">
              System ready. Awaiting user input...
            </span>
          </div>
        </div>
      </section>

      <div class="footer">EXPERIMENTS ACTIVE · EASTER EGGS ENABLED</div>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const title = document.querySelector('#labTitle');
  const bg = createSceneBackground(scene, {
    starCount: 17000,
    depth: 2600,
    layers: 4
  });

  const consoleText = document.querySelector('#consoleText');
  const modeState = document.querySelector('#modeState');
  const entropyState = document.querySelector('#entropyState');
  const signalState = document.querySelector('#signalState');

  document.querySelector('#btnGlitch').addEventListener('click', () => {
    glitchBurst(title);
    consoleText.textContent = 'Glitch burst injected into title subsystem.';
    modeState.textContent = 'glitch';
  });

  document.querySelector('#btnMessage').addEventListener('click', () => {
    const messages = [
      'A hidden route has been detected in the deep layer.',
      'The stars are not fixed; they are moving instructions.',
      'You just activated a quiet little easter egg.',
      'Entropy fluctuating... yet the system remains beautiful.'
    ];
    consoleText.textContent = messages[Math.floor(Math.random() * messages.length)];
    signalState.textContent = 'transient';
  });

  document.querySelector('#btnChaos').addEventListener('click', () => {
    document.body.style.filter = 'hue-rotate(110deg) saturate(1.2) contrast(1.08)';
    entropyState.textContent = 'chaotic';
    consoleText.textContent = 'Universe drift temporarily enabled.';
    setTimeout(() => {
      document.body.style.filter = '';
      entropyState.textContent = 'stable';
    }, 1200);
  });

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 1.2 });
  }

  animate();
}