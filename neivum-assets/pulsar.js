(() => {
  "use strict";

  const VERTEX_SHADER = `#version 300 es
  precision highp float;
  void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  }`;

  const FRAGMENT_SHADER = `#version 300 es
  precision highp float;

  out vec4 outColor;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uProgress;
  uniform float uQuality;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float a = 0.52;
    mat2 r = mat2(0.82, -0.57, 0.57, 0.82);
    for (int i = 0; i < 5; i++) {
      f += a * noise(p);
      p = r * p * 2.03 + 11.7;
      a *= 0.5;
    }
    return f;
  }

  mat2 rotate2d(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float lineMask(float distanceToLine, float width) {
    return 1.0 - smoothstep(width, width * 2.6, distanceToLine);
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    float scale = min(uResolution.x, uResolution.y);
    vec2 p = (frag - uCenter * uResolution) / scale;
    p += uPointer * vec2(-0.016, 0.012);

    float t = uTime;
    float progress = clamp(uProgress, 0.0, 1.0);
    float radial = length(p);
    float coreRadius = mix(0.043, 0.066, progress);
    vec3 color = vec3(0.0);
    float alpha = 0.0;

    /* Extremely subtle instrument-space grain; no decorative star field. */
    vec2 grid = floor(frag / mix(96.0, 64.0, uQuality));
    float dust = step(0.9925, hash21(grid + floor(t * 0.08))) * (0.25 + 0.75 * hash21(grid + 3.7));
    color += vec3(0.28, 0.34, 0.49) * dust * 0.11;
    alpha += dust * 0.12;

    /* Local gravitational lens: a restrained refractive arc around the core. */
    float lensRadius = coreRadius * 1.72;
    float lens = exp(-abs(radial - lensRadius) * 330.0) * (0.08 + progress * 0.16);
    lens *= smoothstep(0.01, coreRadius * 0.85, radial);
    color += vec3(0.55, 0.63, 0.88) * lens;
    alpha += lens;

    /* The magnetic axis is oblique and rotates, producing a real lighthouse sweep. */
    float sweep = t * mix(0.18, 0.34, uQuality);
    float axisAngle = -0.62 + sin(sweep) * 0.46 + uPointer.x * 0.10;
    vec2 magnetic = rotate2d(-axisAngle) * p;
    float along = magnetic.x;
    float across = abs(magnetic.y);
    float outsideCore = smoothstep(coreRadius * 1.05, coreRadius * 1.55, abs(along));
    float coneWidth = coreRadius * 0.19 + abs(along) * mix(0.055, 0.095, progress);
    float cone = 1.0 - smoothstep(coneWidth * 0.32, coneWidth, across);
    float beamFalloff = exp(-max(0.0, abs(along) - coreRadius) * 1.65);
    float observedPulse = 0.44 + 0.56 * pow(0.5 + 0.5 * cos(sweep * 2.0 - 0.4), 8.0);
    float beam = cone * outsideCore * beamFalloff * observedPulse * (0.18 + progress * 0.55);
    float beamSpine = lineMask(across, coreRadius * 0.028) * outsideCore * beamFalloff * observedPulse;
    color += vec3(0.48, 0.57, 0.88) * beam + vec3(0.89, 0.93, 1.0) * beamSpine * (0.14 + progress * 0.3);
    alpha += beam * 0.82 + beamSpine * 0.32;

    /* Dipolar magnetic field lines: r = L sin²(theta), aligned to the magnetic axis. */
    float theta = atan(magnetic.y, magnetic.x);
    float s2 = sin(theta) * sin(theta);
    float field = 0.0;
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float L = coreRadius * (2.25 + fi * mix(0.58, 0.84, progress));
      float expected = L * s2;
      float d = abs(radial - expected);
      float active = step(coreRadius * 1.12, radial) * (1.0 - smoothstep(L * 0.97, L * 1.03, radial));
      field += exp(-d * mix(880.0, 570.0, uQuality)) * active * (0.17 - fi * 0.011);
    }
    field *= (0.24 + progress * 0.76);
    color += vec3(0.42, 0.49, 0.72) * field;
    alpha += field * 0.72;

    /* Equatorial plasma sheet, deliberately thin and physically oriented. */
    vec2 equatorial = rotate2d(-(axisAngle + 1.5707963)) * p;
    float ringDistance = abs(length(vec2(equatorial.x, equatorial.y * 3.7)) - coreRadius * 1.72);
    float plasmaNoise = fbm(equatorial * 120.0 + vec2(t * 0.10, -t * 0.05));
    float plasma = exp(-ringDistance * 245.0) * (0.35 + plasmaNoise * 0.65) * (0.15 + progress * 0.5);
    color += vec3(0.39, 0.46, 0.72) * plasma;
    alpha += plasma * 0.75;

    /* Procedural neutron-star surface. */
    if (radial < coreRadius) {
      float z = sqrt(max(0.0, 1.0 - radial * radial / (coreRadius * coreRadius)));
      vec3 normal = normalize(vec3(p / coreRadius, z));
      vec3 lightDirection = normalize(vec3(-0.58, 0.42, 0.70));
      float diffuse = max(0.0, dot(normal, lightDirection));
      float rim = pow(1.0 - z, 2.6);
      vec2 surfaceUv = p / coreRadius;
      float rotation = t * mix(0.22, 0.5, uQuality);
      float surface = fbm(rotate2d(rotation) * surfaceUv * 7.0 + vec2(t * 0.07, 0.0));
      float striation = 0.5 + 0.5 * sin((surfaceUv.y + surface * 0.22) * 42.0 + rotation * 2.0);
      vec3 cold = mix(vec3(0.40, 0.46, 0.61), vec3(0.96, 0.975, 1.0), diffuse);
      cold *= 0.72 + surface * 0.42 + striation * 0.09;
      cold += vec3(0.55, 0.64, 0.94) * rim * 0.55;
      float limb = smoothstep(coreRadius, coreRadius * 0.62, radial);
      color += cold * limb;
      alpha = max(alpha, smoothstep(coreRadius, coreRadius * 0.965, radial));
    }

    float corona = exp(-max(0.0, radial - coreRadius) * 82.0) * smoothstep(coreRadius * 0.78, coreRadius * 1.02, radial);
    corona *= 0.16 + progress * 0.22 + observedPulse * 0.08;
    color += vec3(0.58, 0.67, 0.96) * corona;
    alpha += corona;

    /* Directed particle traces are generated procedurally, capped and sparse. */
    if (uQuality > 0.55) {
      float particles = 0.0;
      for (int i = 0; i < 18; i++) {
        float fi = float(i);
        float seed = hash21(vec2(fi, fi * 2.17));
        float side = mod(fi, 2.0) < 1.0 ? -1.0 : 1.0;
        float travel = fract(seed + t * (0.018 + seed * 0.028));
        vec2 q = vec2(side * (coreRadius * 1.5 + travel * (0.55 + seed * 0.35)), (seed - 0.5) * (0.012 + travel * 0.09));
        q = rotate2d(axisAngle) * q;
        float pd = length(p - q);
        particles += exp(-pd * 820.0) * (1.0 - travel) * 0.38;
      }
      color += vec3(0.65, 0.73, 1.0) * particles;
      alpha += particles;
    }

    color = 1.0 - exp(-color * 1.22);
    alpha = clamp(alpha, 0.0, 0.96);
    float vignette = 1.0 - smoothstep(0.42, 1.24, length((frag / uResolution - 0.5) * vec2(uResolution.x / uResolution.y, 1.0)));
    outColor = vec4(color * (0.78 + vignette * 0.22) * alpha, alpha);
  }`;

  const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Shader compilation failed";
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  const createProgram = (gl) => {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Program link failed";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    return program;
  };

  class PulsarRenderer {
    constructor(canvas, FallbackRenderer) {
      this.canvas = canvas;
      this.FallbackRenderer = FallbackRenderer;
      this.profile = window.NEIVUM_DEVICE?.profile || {};
      this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.progress = Number(canvas.dataset.progress || 0);
      this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      this.timeOrigin = performance.now();
      this.lastFrame = 0;
      this.raf = 0;
      this.disposed = false;
      this.visible = !document.hidden;
      this.center = canvas.dataset.center === "middle" ? [0.5, 0.5] : [0.715, 0.5];
      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);
      this.onPointer = this.onPointer.bind(this);
      this.onVisibility = this.onVisibility.bind(this);
      this.onContextLost = this.onContextLost.bind(this);
      this.onPageHide = this.onPageHide.bind(this);

      const eligible = !this.reduced && this.profile.quality !== "safe" && "WebGL2RenderingContext" in window;
      if (!eligible) {
        this.activateFallback();
        return;
      }

      try {
        this.initWebGL();
      } catch (_) {
        this.activateFallback(true);
      }
    }

    activateFallback(replaceCanvas = false) {
      let target = this.canvas;
      if (replaceCanvas) {
        target = this.canvas.cloneNode(false);
        target.width = 1;
        target.height = 1;
        this.canvas.replaceWith(target);
        this.canvas = target;
      }
      document.documentElement.dataset.pulsarRenderer = "canvas";
      if (typeof this.FallbackRenderer === "function") {
        this.fallback = new this.FallbackRenderer(target);
        this.fallback.setProgress?.(this.progress);
      }
    }

    initWebGL() {
      const gl = this.canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: this.profile.quality === "full" ? "high-performance" : "low-power",
        premultipliedAlpha: true,
        preserveDrawingBuffer: false
      });
      if (!gl) throw new Error("WebGL2 unavailable");
      this.gl = gl;
      this.program = createProgram(gl);
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      gl.useProgram(this.program);
      this.uniforms = {
        resolution: gl.getUniformLocation(this.program, "uResolution"),
        pointer: gl.getUniformLocation(this.program, "uPointer"),
        center: gl.getUniformLocation(this.program, "uCenter"),
        time: gl.getUniformLocation(this.program, "uTime"),
        progress: gl.getUniformLocation(this.program, "uProgress"),
        quality: gl.getUniformLocation(this.program, "uQuality")
      };
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      document.documentElement.dataset.pulsarRenderer = this.profile.quality === "mobile" ? "webgl-mobile" : "webgl-full";
      this.resize();
      addEventListener("resize", this.resize, { passive: true });
      if (this.profile.hover !== false) addEventListener("pointermove", this.onPointer, { passive: true });
      document.addEventListener("visibilitychange", this.onVisibility);
      this.canvas.addEventListener("webglcontextlost", this.onContextLost);
      addEventListener("pagehide", this.onPageHide, { once: true });
      this.render(0);
      this.raf = requestAnimationFrame(this.frame);
    }

    resize() {
      if (!this.gl || this.disposed) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, this.profile.dprCap || 1.4);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width !== this.canvas.width || height !== this.canvas.height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
      }
      const compact = rect.width < 760;
      this.center = this.canvas.dataset.center === "middle" ? [0.5, 0.5] : [compact ? 0.64 : 0.715, compact ? 0.55 : 0.5];
    }

    onPointer(event) {
      if (this.profile.coarse) return;
      this.pointer.tx = event.clientX / innerWidth - 0.5;
      this.pointer.ty = 0.5 - event.clientY / innerHeight;
    }

    onVisibility() {
      this.visible = !document.hidden;
      if (this.visible && !this.raf && !this.disposed) this.raf = requestAnimationFrame(this.frame);
    }

    onContextLost(event) {
      event.preventDefault();
      this.dispose(false);
      this.activateFallback(true);
    }

    onPageHide() { this.dispose(true); }

    setProgress(value) {
      this.progress = Math.min(1, Math.max(0, Number(value) || 0));
      this.fallback?.setProgress?.(this.progress);
    }

    frame(timestamp) {
      this.raf = 0;
      if (this.disposed || !this.visible) return;
      const interval = 1000 / (this.profile.fps || 60);
      if (timestamp - this.lastFrame >= interval) {
        this.lastFrame = timestamp;
        this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.035;
        this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.035;
        this.render((timestamp - this.timeOrigin) * 0.001);
      }
      this.raf = requestAnimationFrame(this.frame);
    }

    render(time) {
      const gl = this.gl;
      if (!gl || this.disposed) return;
      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);
      gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
      gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
      gl.uniform2f(this.uniforms.center, this.center[0], this.center[1]);
      gl.uniform1f(this.uniforms.time, time);
      gl.uniform1f(this.uniforms.progress, this.progress);
      gl.uniform1f(this.uniforms.quality, this.profile.quality === "mobile" ? 0.58 : 1.0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    dispose(loseContext = false) {
      if (this.disposed) return;
      this.disposed = true;
      cancelAnimationFrame(this.raf);
      removeEventListener("resize", this.resize);
      removeEventListener("pointermove", this.onPointer);
      document.removeEventListener("visibilitychange", this.onVisibility);
      this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
      if (this.gl) {
        if (this.vao) this.gl.deleteVertexArray(this.vao);
        if (this.program) this.gl.deleteProgram(this.program);
        if (loseContext) this.gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    }
  }

  window.NEIVUM_PULSAR = Object.freeze({ Renderer: PulsarRenderer });
})();
