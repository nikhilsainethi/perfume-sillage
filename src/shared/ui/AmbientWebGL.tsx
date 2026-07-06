// ============================================================
// SILLAGE — AmbientWebGL ("the living sillage")
// A fixed full-viewport fragment shader painting slow,
// domain-warped champagne & rose wisps over the ivory base —
// scent trails drifting through the room. Dependency-free raw
// WebGL2 (no three.js in the main path), lazy-loaded, gated,
// ~30fps, DPR-capped, paused when the tab is hidden.
// The CSS AmbientBackground stays underneath as base + grain.
// ============================================================

import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
void main() {
  // fullscreen triangle
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // 0..1, smoothed
uniform float uScroll; // px
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 2.2;
  float t = uTime * 0.03;

  // gentle reactivity: cursor tilts the field, scroll drifts it
  p += (uMouse - 0.5) * 0.22;
  p.y += uScroll * 0.00035;

  // domain-warped wisps
  vec2 warp = vec2(fbm(p + t), fbm(p + 13.7 - t * 0.8));
  float n = fbm(p * 1.5 + warp * 0.9 - t * 0.5);
  float wisp = smoothstep(0.48, 0.78, n);

  // two metallic tints chosen by a slower second field
  float pick = fbm(p * 0.6 + 4.2 + t * 0.4);
  vec3 champagne = vec3(0.77, 0.62, 0.37);
  vec3 rose = vec3(0.79, 0.60, 0.56);
  vec3 tint = mix(champagne, rose, smoothstep(0.35, 0.7, pick));

  // fade at the top edge (keep the hero airy) and keep it whisper-quiet
  float edge = smoothstep(1.0, 0.72, uv.y) * smoothstep(0.0, 0.15, uv.y);
  float alpha = wisp * 0.085 * edge;

  outColor = vec4(tint, alpha);
}`;

export default function AmbientWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // fail silently — the CSS atmosphere below still carries the page
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');

    const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * DPR);
      canvas.height = Math.round(window.innerHeight * DPR);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // smoothed cursor
    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let last = 0;
    let hidden = document.hidden;
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVis);

    const start = performance.now();
    const frame = (now: number) => {
      if (hidden) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // ~30fps is plenty for weather
      last = now;
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
