import { createSceneBackground, makeTopbar, glitchBurst } from '../shared';

export function mountContact(app) {
  app.innerHTML = `
    <div class="scene" id="scene"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>

    <main class="page">
      ${makeTopbar('contact')}
      <section class="section">
        <div class="panel">
          <div class="kicker">Transmission Channel // Contact</div>
          <h2 class="title glitch" id="contactTitle" data-text="Send Signal">Send Signal</h2>
          <p class="lead">
            联系页面做成信号发射台。提交不仅是表单提交，更像一次向宇宙发出连接请求。
          </p>
        </div>
      </section>

      <section class="section grid-two">
        <div class="panel">
          <h2>Signal Form</h2>
          <div class="matrix">
            <input class="input" id="nameInput" placeholder="你的名字" />
            <input class="input" id="emailInput" placeholder="邮箱 / 信道地址" />
          </div>
          <div style="height:14px;"></div>
          <textarea class="textarea" id="msgInput" placeholder="写下你想发送的内容..."></textarea>
          <div style="height:14px;"></div>
          <button class="btn" id="submitBtn">Transmit</button>
        </div>

        <div class="panel">
          <h2>Status</h2>
          <div class="card-list">
            <div class="stat"><strong>Endpoint</strong><span>open</span></div>
            <div class="stat"><strong>Latency</strong><span>minimal</span></div>
            <div class="stat"><strong>Channel</strong><span id="channelState">ready</span></div>
            <div class="stat"><strong>Message</strong><span id="txState">waiting for transmission</span></div>
          </div>
        </div>
      </section>

      <div class="footer">READY TO RECEIVE YOUR SIGNAL</div>
    </main>
  `;

  const scene = document.querySelector('#scene');
  const title = document.querySelector('#contactTitle');
  const bg = createSceneBackground(scene, {
    starCount: 12000,
    depth: 2200,
    layers: 4
  });

  const txState = document.querySelector('#txState');
  const channelState = document.querySelector('#channelState');

  document.querySelector('#submitBtn').addEventListener('click', () => {
    const name = document.querySelector('#nameInput').value.trim() || '匿名信号';
    txState.textContent = `Signal transmitted by ${name}.`;
    channelState.textContent = 'transmitted';
    glitchBurst(title);
  });

  function animate() {
    requestAnimationFrame(animate);
    bg.tick({ speed: 0.96 });
  }

  animate();
}