import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import { makeTopbar, setupMobile } from '../shared';

const VERTEX = /*glsl*/`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = /*glsl*/`
precision mediump float;
varying vec2 vUv;
uniform float iTime, uScale, uDigitSize, uScanlineIntensity, uGlitchAmount, uFlickerAmount, uNoiseAmp;
uniform float uChromaticAberration, uDither, uCurvature, uMouseStrength, uUseMouse, uBrightness;
uniform vec3 iResolution, uTint;
uniform vec2 uGridMul, uMouse;
float time;

float hash21(vec2 p){ p=fract(p*234.56); p+=dot(p,p+34.56); return fract(p.x*p.y); }
float noise(vec2 p){ return sin(p.x*10.0)*sin(p.y*(3.0+sin(time*0.090909)))+0.2; }
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

float fbm(vec2 p){
  p*=1.1; float f=0.0,amp=0.5*uNoiseAmp;
  f+=amp*noise(p); p=rot(time*0.02)*p*2.0; amp*=0.454545;
  f+=amp*noise(p); p=rot(time*0.02)*p*2.0; amp*=0.454545;
  f+=amp*noise(p); return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r){
  q=vec2(fbm(p+1.0),fbm(rot(0.1*time)*p+1.0));
  r=vec2(fbm(rot(0.1)*q+1.0),fbm(q+1.0));
  return fbm(p+r);
}

float digit(vec2 p){
  vec2 grid=uGridMul*15.0, s=floor(p*grid)/grid; p=p*grid;
  vec2 q,r; float i=pattern(s*0.1,q,r)*1.3-0.03;
  if(uUseMouse>0.5){
    vec2 mw=uMouse*uScale; float d=exp(-distance(s,mw)*8.0)*uMouseStrength*10.0;
    i+=d+sin(distance(s,mw)*20.0-iTime*5.0)*0.1*d;
  }
  p=fract(p); p*=uDigitSize;
  float px=p.x*5.0, py=(1.0-p.y)*5.0;
  float j=floor(px-2.0), k=floor(py-2.0);
  float fVal=j*j+k*k, on=step(0.1,i-fVal*0.0625);
  float b=on*(0.2+fract(py)*0.8)*(0.75+fract(px)*0.25);
  return step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0)*b;
}

float onOff(float a,float b,float c){ return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount; }

float displace(vec2 look){
  float y=look.y-mod(iTime*0.25,1.0);
  return sin(look.y*20.0+iTime)*0.0125*onOff(4.0,2.0,0.8)*(1.0+cos(iTime*60.0))/(1.0+50.0*y*y);
}

vec3 getColor(vec2 p){
  float bar=step(mod(p.y+time*20.0,1.0),0.2)*0.4+1.0; bar*=uScanlineIntensity;
  float d=displace(p); p.x+=d;
  if(uGlitchAmount!=1.0) p.x+=d*(uGlitchAmount-1.0);
  float mid=digit(p);
  const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.0,-off))+digit(p+vec2(off,-off))
          +digit(p+vec2(-off,0.0))+mid+digit(p+vec2(off,0.0))
          +digit(p+vec2(-off,off))+digit(p+vec2(0.0,off))+digit(p+vec2(off,off));
  return vec3(0.9)*mid+sum*0.1*bar;
}

vec2 barrel(vec2 uv){
  vec2 c=uv*2.0-1.0; float r2=dot(c,c);
  c*=1.0+uCurvature*r2; return c*0.5+0.5;
}

void main(){
  time=iTime*0.333333;
  vec2 uv=vUv;
  if(uCurvature!=0.0) uv=barrel(uv);
  vec2 p=uv*uScale;
  vec3 col=getColor(p);
  if(uChromaticAberration!=0.0){
    vec2 ca=vec2(uChromaticAberration)/iResolution.xy;
    col.r=getColor(p+ca).r; col.b=getColor(p-ca).b;
  }
  col*=uTint*uBrightness;
  if(uDither>0.0){ float rnd=hash21(gl_FragCoord.xy); col+=(rnd-0.5)*(uDither*0.003922); }
  gl_FragColor=vec4(col,1.0);
}`;

function hexToRgb(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

export function mountTerminal(app) {
  app.innerHTML = `
    <div id="termBg" style="position:fixed;inset:0;z-index:0;"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>
    <main class="page">
      ${makeTopbar('terminal')}
      <section class="section" style="position:relative;z-index:2;">
        <div class="panel" style="background:rgba(0,0,0,0.6);">
          <div class="kicker">Faulty Terminal // Glitch Console</div>
          <h2 class="title glitch" data-text="TERMINAL" style="color:#33ff33;text-shadow:0 0 18px rgba(51,255,51,0.4);">TERMINAL</h2>
          <p class="lead" style="color:rgba(51,255,51,0.7);">
            故障终端背景——字符会随鼠标交互，扫描线滚动，信号干扰实时渲染。
          </p>
        </div>
      </section>
      <div class="footer" style="color:rgba(51,255,51,0.4);">TERMINAL ACTIVE · SIGNAL DEGRADED · BACKUP POWER ON</div>
    </main>
  `;

  const container = document.querySelector('#termBg');
  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 1);

  const geometry = new Triangle(gl);
  const tint = hexToRgb('#33ff33');

  const mouse = { x: 0.5, y: 0.5 };
  const smooth = { x: 0.5, y: 0.5 };

  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Color(1, 1, 1) },
      uScale: { value: 1 },
      uGridMul: { value: new Float32Array([2, 1]) },
      uDigitSize: { value: 1.5 },
      uScanlineIntensity: { value: 0.3 },
      uGlitchAmount: { value: 1 },
      uFlickerAmount: { value: 1 },
      uNoiseAmp: { value: 1 },
      uChromaticAberration: { value: 0 },
      uDither: { value: 1 },
      uCurvature: { value: 0.2 },
      uTint: { value: new Color(tint[0], tint[1], tint[2]) },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uMouseStrength: { value: 0.2 },
      uUseMouse: { value: 1 },
      uBrightness: { value: 1 },
    }
  });

  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    program.uniforms.iResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
  }

  new ResizeObserver(resize).observe(container);
  resize();

  container.addEventListener('mousemove', (e) => {
    const r = container.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = 1 - (e.clientY - r.top) / r.height;
  });

  container.appendChild(gl.canvas);

  const timeOffset = Math.random() * 100;
  function animate(t) {
    requestAnimationFrame(animate);
    program.uniforms.iTime.value = (t * 0.001 + timeOffset) * 0.3;
    smooth.x += (mouse.x - smooth.x) * 0.08;
    smooth.y += (mouse.y - smooth.y) * 0.08;
    const mu = program.uniforms.uMouse.value;
    mu[0] = smooth.x;
    mu[1] = smooth.y;
    renderer.render({ scene: mesh });
  }

  requestAnimationFrame(animate);
  setupMobile();
}
