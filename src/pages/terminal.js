import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

const VERTEX = `attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}`;

const FRAGMENT = `precision mediump float;
varying vec2 vUv;
uniform float iTime,uScale,uDigitSize,uScanlineIntensity,uGlitchAmount,uFlickerAmount,uNoiseAmp;
uniform float uChromaticAberration,uDither,uCurvature,uMouseStrength,uUseMouse,uBrightness;
uniform vec3 iResolution,uTint;
uniform vec2 uGridMul,uMouse;
float time;

float hash21(vec2 p){p=fract(p*234.56);p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){return sin(p.x*10.0)*sin(p.y*(3.0+sin(time*0.09)))+0.2;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

float fbm(vec2 p){
  p*=1.1;float f=0.0,amp=0.5*uNoiseAmp;
  f+=amp*noise(p);p=rot(time*0.02)*p*2.0;amp*=0.454545;
  f+=amp*noise(p);p=rot(time*0.02)*p*2.0;amp*=0.454545;
  f+=amp*noise(p);return f;
}

float pattern(vec2 p,out vec2 q,out vec2 r){
  q=vec2(fbm(p+1.0),fbm(rot(0.1*time)*p+1.0));
  r=vec2(fbm(rot(0.1)*q+1.0),fbm(q+1.0));
  return fbm(p+r);
}

float digit(vec2 p){
  vec2 grid=uGridMul*15.0,s=floor(p*grid)/grid;p=p*grid;
  vec2 q,r;float i=pattern(s*0.1,q,r)*1.3-0.03;
  if(uUseMouse>0.5){
    vec2 mw=uMouse*uScale;
    float d=exp(-distance(s,mw)*8.0)*uMouseStrength*10.0;
    i+=d+sin(distance(s,mw)*20.0-iTime*5.0)*0.1*d;
  }
  p=fract(p);p*=uDigitSize;
  float j=floor(p.x*5.0-2.0),k=floor((1.0-p.y)*5.0-2.0);
  float fVal=j*j+k*k,b=step(0.1,i-fVal*0.0625);
  float br=b*(0.2+fract(p.y)*0.8)*(0.75+fract(p.x)*0.25);
  return step(0.0,p.x)*step(p.x,1.0)*step(0.0,p.y)*step(p.y,1.0)*br;
}

float onOff(float a,float b,float c){return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount;}

float displace(vec2 look){
  float y=look.y-mod(iTime*0.25,1.0);
  return sin(look.y*20.0+iTime)*0.0125*onOff(4.0,2.0,0.8)*(1.0+cos(iTime*60.0))/(1.0+50.0*y*y);
}

vec3 getColor(vec2 p){
  float bar=step(mod(p.y+time*20.0,1.0),0.2)*0.4+1.0;bar*=uScanlineIntensity;
  float d=displace(p);p.x+=d;
  if(uGlitchAmount!=1.0)p.x+=d*(uGlitchAmount-1.0);
  float mid=digit(p);
  const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.0,-off))+digit(p+vec2(off,-off))
          +digit(p+vec2(-off,0.0))+mid+digit(p+vec2(off,0.0))
          +digit(p+vec2(-off,off))+digit(p+vec2(0.0,off))+digit(p+vec2(off,off));
  return vec3(0.9)*mid+sum*0.1*bar;
}

vec2 barrel(vec2 uv){
  vec2 c=uv*2.0-1.0;float r2=dot(c,c);
  c*=1.0+uCurvature*r2;return c*0.5+0.5;
}

void main(){
  time=iTime*0.333333;
  vec2 uv=vUv;
  if(uCurvature!=0.0)uv=barrel(uv);
  vec2 p=uv*uScale;
  vec3 col=getColor(p);
  if(uChromaticAberration!=0.0){
    vec2 ca=vec2(uChromaticAberration)/iResolution.xy;
    col.r=getColor(p+ca).r;col.b=getColor(p-ca).b;
  }
  col*=uTint*uBrightness;
  if(uDither>0.0){float rnd=hash21(gl_FragCoord.xy);col+=(rnd-0.5)*(uDither*0.003922);}
  gl_FragColor=vec4(col,1.0);
}`;

export function mountTerminal(app) {
  app.innerHTML = `
    <div id="termBg" style="position:fixed;inset:0;z-index:0;"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>
    <div class="terminal-hud">
      <a href="/" class="term-back">← EXIT</a>
      <div class="term-info">
        <span class="term-label">FAULTY TERMINAL</span>
        <span class="term-sub">SIGNAL DEGRADED · BACKUP POWER ON · MOVE MOUSE TO BOOST</span>
      </div>
    </div>
  `;

  const container = document.querySelector('#termBg');
  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2) });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 1);

  const geometry = new Triangle(gl);
  const tint = [0.15, 0.38, 0.18]; // muted phosphor green

  const mouse = { x: 0.5, y: 0.5 };
  const smooth = { x: 0.5, y: 0.5 };

  const program = new Program(gl, {
    vertex: VERTEX,
    fragment: FRAGMENT,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Color(1, 1, 1) },
      uScale: { value: 0.8 },
      uGridMul: { value: new Float32Array([2.5, 1.4]) },
      uDigitSize: { value: 2.0 },
      uScanlineIntensity: { value: 0.25 },
      uGlitchAmount: { value: 1.0 },
      uFlickerAmount: { value: 0.6 },
      uNoiseAmp: { value: 0.8 },
      uChromaticAberration: { value: 0 },
      uDither: { value: 1 },
      uCurvature: { value: 0.15 },
      uTint: { value: new Color(tint[0], tint[1], tint[2]) },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uMouseStrength: { value: 0.35 },
      uUseMouse: { value: 1 },
      uBrightness: { value: 1.2 },
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
}
