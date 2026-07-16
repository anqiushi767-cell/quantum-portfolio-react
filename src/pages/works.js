import { createSceneBackground, makeTopbar, glitchBurst, setupMobile, getMobileStarConfig } from '../shared';

const works = [
  ['Stellar UI', '星空主题仪表盘界面，强调层次、光效与数据感。'],
  ['Glitch Terminal', '模拟未来控制台的交互式页面。'],
  ['Particle Lab', '粒子、背景与鼠标联动的实验项目。'],
  ['Neo Portfolio', '个人作品展示，强调科幻叙事与动效。'],
  ['Signal Map', '把项目做成节点网络，像星图一样浏览。'],
  ['Hidden Mode', '输入特定关键词后可解锁隐藏状态。']
];

export function mountWorks(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('works')}
      <section class="section">
        <div class="panel">
          <div class="kicker">Project Galaxy // Works</div>
          <h2 class="title glitch" id="worksTitle" data-text="Star Map">Star Map</h2>
          <p class="lead">
            作品以星图节点方式呈现。每个项目都是一颗星，悬停与点击都会得到反馈。
          </p>
        </div>
      </section>

      <section class="section">
        <div class="cards">
          ${works.map(([name, desc]) => `
            <div class="feature work-card">
              <h3>${name}</h3>
              <p>${desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <div class="footer">NODE LINKED · ORBITAL VIEW ENABLED</div>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const title = document.querySelector('#worksTitle');
  const bg = createSceneBackground(scene, getMobileStarConfig({
    starCount: 15000,
    depth: 2400,
    layers: 4
  }));

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => glitchBurst(title));
    card.addEventListener('click', () => {
      const p = card.querySelector('p');
      p.textContent += ' // signal locked.';
    });
  });

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 1.06 });
  }

  animate();
  setupMobile();
}