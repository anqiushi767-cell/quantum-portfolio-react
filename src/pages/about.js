import { createSceneBackground, makeTopbar, glitchBurst, setupMobile, getMobileStarConfig } from '../shared';

export function mountAbout(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('about')}
      <section class="section">
        <div class="panel">
          <div class="kicker">Identity Module // About Me</div>
          <h2 class="title glitch" id="aboutTitle" data-text="Bio Log">Bio Log</h2>
          <p class="lead">
            这里不是传统简介，而是一份未来档案。它把个人信息、技能和审美偏好包装成一个交互式系统界面。
          </p>
        </div>
      </section>

      <section class="section grid-two">
        <div class="panel">
          <h2>Profile Data</h2>
          <div class="card-list">
            <div class="stat"><strong>Name</strong><span>YZTXA</span></div>
            <div class="stat"><strong>Role</strong><span>Front-end Creator</span></div>
            <div class="stat"><strong>Focus</strong><span>Interactive UI / Motion / 3D Web</span></div>
            <div class="stat"><strong>Mode</strong><span>Experimental / Curious / Futuristic</span></div>
          </div>
        </div>

        <div class="panel">
          <h2>Ability Matrix</h2>
          <div class="card-list">
            <div class="stat"><strong>UI Motion</strong><span>92%</span></div>
            <div class="stat"><strong>Three.js</strong><span>88%</span></div>
            <div class="stat"><strong>Interaction</strong><span>95%</span></div>
            <div class="stat"><strong>Visual Design</strong><span>89%</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="cards">
          <div class="feature">
            <h3>What I Like</h3>
            <p>故障美学、粒子宇宙、空间层次、会回应用户的网站、像游戏一样能探索的网页。</p>
          </div>
          <div class="feature" id="secretAbout">
            <h3>Hidden Memory</h3>
            <p>点击后会切换成一段更私密的自述文本。</p>
          </div>
          <div class="feature">
            <h3>Interaction Philosophy</h3>
            <p>网页不是海报，而是一个会呼吸、有情绪、可被探索的数字空间。</p>
          </div>
        </div>
      </section>

      <div class="footer">ARCHIVE ACCESS GRANTED · ID VERIFIED</div>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const title = document.querySelector('#aboutTitle');
  const secret = document.querySelector('#secretAbout');
  const bg = createSceneBackground(scene, getMobileStarConfig({
    starCount: 13000,
    depth: 2200,
    layers: 4
  }));

  title.addEventListener('click', () => glitchBurst(title));

  secret.addEventListener('click', () => {
    secret.querySelector('p').textContent =
      '我更喜欢把前端做成一个“场景”而不是“页面”。如果它能让用户停下来探索一下，那就对了。';
    glitchBurst(title);
  });

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 0.92 });
  }

  animate();
  setupMobile();
}