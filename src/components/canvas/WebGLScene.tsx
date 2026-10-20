'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLSceneProps {
  activeCommodityIndex: number;
  stageIndex: number;
  processProgress: number;
}

interface PhotoData {
  tex: THREE.Texture;
  w: number;
  h: number;
}

interface Entity {
  obj: THREE.Object3D;
  photo: boolean;
  nx: number;
  ny: number;
  z: number;
  size: number;
  spin: number;
  ph: number;
  rx: number;
  ry: number;
  rz: number;
  pd: number;
  a: number;
  fade: number;
  delay: number;
}

export function WebGLScene({
  activeCommodityIndex,
  stageIndex,
  processProgress,
}: WebGLSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable state accessible synchronously to the RAF render loop
  const stateRef = useRef({
    activeCom: activeCommodityIndex,
    stageIdx: stageIndex,
    procP: processProgress,
  });

  useEffect(() => {
    stateRef.current.activeCom = activeCommodityIndex;
    stateRef.current.stageIdx = stageIndex;
    stateRef.current.procP = processProgress;
  }, [activeCommodityIndex, stageIndex, processProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    if ('outputColorSpace' in renderer) {
      (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    } else {
      (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const D = 8;
    const FOV = 35;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, D);

    function rng(a: number) {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function cv(w: number, h: number): HTMLCanvasElement {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function tex(c: HTMLCanvasElement, srgb: boolean): THREE.CanvasTexture {
      const t = new THREE.CanvasTexture(c);
      if (srgb) {
        if ('colorSpace' in t) {
          (t as any).colorSpace = THREE.SRGBColorSpace;
        } else {
          (t as any).encoding = (THREE as any).sRGBEncoding;
        }
      }
      t.anisotropy = 4;
      return t;
    }

    // 1. Studio-like reflection environment for the metal container
    try {
      const c = cv(512, 256);
      const x = c.getContext('2d');
      if (x) {
        const g = x.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, '#2a2622');
        g.addColorStop(0.5, '#151515');
        g.addColorStop(1, '#0a0a0b');
        x.fillStyle = g;
        x.fillRect(0, 0, 512, 256);
        x.fillStyle = '#fff1dd';
        x.fillRect(60, 40, 120, 44);
        x.fillStyle = '#cfe0ff';
        x.fillRect(340, 70, 90, 30);
        x.fillStyle = '#ffb27a';
        x.fillRect(220, 150, 70, 18);
        const t = tex(c, true);
        t.mapping = THREE.EquirectangularReflectionMapping;
        const pm = new THREE.PMREMGenerator(renderer);
        scene.environment = pm.fromEquirectangular(t).texture;
        t.dispose();
        pm.dispose();
      }
    } catch {
      // Ignore fallback if environment creation fails
    }

    const keyLight = new THREE.DirectionalLight(0xffe4c8, 1.5);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9fbfff, 1.0);
    rimLight.position.set(4, 1, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const emberA = new THREE.PointLight(0xff6a1f, 0, 6, 2);
    scene.add(emberA);
    const emberB = new THREE.PointLight(0xff6a1f, 0, 6, 2);
    scene.add(emberB);

    // 2. Procedural Textures for 3D Container & 3D Coal Cube
    const T: Record<string, THREE.CanvasTexture> = {};
    (function () {
      const R = rng(7);

      // Noise bump map
      let c = cv(256, 256);
      let x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#808080';
        x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 2200; i++) {
          const v = (40 + R() * 175) | 0;
          x.fillStyle = `rgba(${v},${v},${v},0.2)`;
          x.beginPath();
          x.arc(R() * 256, R() * 256, 0.8 + R() * 5, 0, 6.283);
          x.fill();
        }
        T.noise = tex(c, false);
        T.noise.wrapS = T.noise.wrapT = THREE.RepeatWrapping;
      }

      // Charcoal surface texture
      c = cv(512, 512);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#1b1917';
        x.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 70; i++) {
          const gx = x.createRadialGradient(0, 0, 0, 0, 0, 14 + R() * 40);
          gx.addColorStop(0, `rgba(190,186,178,${0.05 + R() * 0.12})`);
          gx.addColorStop(1, 'rgba(190,186,178,0)');
          x.save();
          x.translate(R() * 512, R() * 512);
          x.fillStyle = gx;
          x.fillRect(-60, -60, 120, 120);
          x.restore();
        }
        for (let i = 0; i < 700; i++) {
          x.fillStyle = `rgba(230,226,218,${R() * 0.25})`;
          x.fillRect(R() * 512, R() * 512, 1 + R() * 2, 1 + R() * 2);
        }
        T.char = tex(c, true);
      }

      // Glowing Ember heat cracks texture
      c = cv(512, 512);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#000';
        x.fillRect(0, 0, 512, 512);
        x.lineCap = 'round';
        x.lineJoin = 'round';
        for (let i = 0; i < 16; i++) {
          let px = R() * 512;
          let py = R() * 512;
          let ang = R() * 6.283;
          x.beginPath();
          x.moveTo(px, py);
          for (let s = 0; s < 8; s++) {
            ang += (R() - 0.5) * 1.5;
            px += Math.cos(ang) * (22 + R() * 34);
            py += Math.sin(ang) * (22 + R() * 34);
            x.lineTo(px, py);
          }
          x.shadowColor = '#ff3d00';
          x.shadowBlur = 16;
          x.strokeStyle = '#ff7a24';
          x.lineWidth = 1.5 + R() * 3.5;
          x.stroke();
        }
        for (let i = 0; i < 12; i++) {
          x.shadowBlur = 24;
          x.fillStyle = '#ff5a10';
          x.beginPath();
          x.arc(R() * 512, R() * 512, 2 + R() * 5, 0, 6.283);
          x.fill();
        }
        T.crack = tex(c, true);
      }

      // Shipping container corrugated side wall with Nusantara branding
      c = cv(1024, 256);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#2a2d32';
        x.fillRect(0, 0, 1024, 256);
        for (let i = 0; i < 1024; i += 32) {
          x.fillStyle = '#383c43';
          x.fillRect(i, 14, 16, 228);
          x.fillStyle = '#212328';
          x.fillRect(i + 16, 14, 16, 228);
        }
        x.fillStyle = '#3d4249';
        x.fillRect(0, 0, 1024, 14);
        x.fillRect(0, 242, 1024, 14);
        x.fillStyle = 'rgba(232,230,224,0.9)';
        x.font = '600 46px Geist, Arial, sans-serif';
        x.fillText('NUSANTARA ORIGIN', 70, 150);
        x.fillStyle = '#E8742A';
        x.fillRect(70, 176, 74, 6);
        T.side = tex(c, true);
      }

      // Shipping container lock door
      c = cv(256, 256);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#2a2d32';
        x.fillRect(0, 0, 256, 256);
        [50, 100, 156, 206].forEach((px) => {
          if (!x) return;
          x.fillStyle = '#3a3f46';
          x.fillRect(px - 5, 16, 10, 224);
          x.fillStyle = '#17181b';
          x.fillRect(px + 5, 16, 3, 224);
        });
        x.fillStyle = '#3d4249';
        x.fillRect(0, 0, 256, 14);
        x.fillRect(0, 242, 256, 14);
        x.fillStyle = '#111317';
        x.fillRect(125, 16, 6, 224);
        T.door = tex(c, true);
      }
    })();

    // 3. 3D Cube Geometry (Coconut charcoal briquette cube 25mm)
    function sn(x: number, y: number, z: number) {
      return (
        (Math.sin(x * 5 + 1.3) * Math.sin(y * 6 + 0.7) +
          Math.sin(z * 7 + 2.1) * Math.sin(x * 9 + y * 3)) *
          0.25 +
        0.5
      );
    }

    function cubeGeo() {
      const g = new THREE.BoxGeometry(1, 1, 1, 14, 14, 14);
      const p = g.attributes.position;
      const v = new THREE.Vector3();
      const n = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        n.copy(v).normalize().multiplyScalar(0.64);
        v.lerp(n, 0.22);
        const d = (sn(v.x, v.y, v.z) - 0.5) * 0.06;
        n.copy(v).normalize();
        v.addScaledVector(n, d);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return g;
    }

    function charMat(glow: number) {
      return new THREE.MeshStandardMaterial({
        map: T.char,
        bumpMap: T.noise,
        bumpScale: 3.5,
        roughness: 0.88,
        metalness: 0.04,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: T.crack,
        emissiveIntensity: glow,
        envMapIntensity: 0.45,
      });
    }

    const GEO = {
      cube: cubeGeo(),
    };

    const MAT = {
      cube: charMat(0.55),
      hero: charMat(0.7),
      proc: charMat(0.1),
    };

    function cm(t: THREE.CanvasTexture) {
      return new THREE.MeshStandardMaterial({
        map: t,
        bumpMap: t,
        bumpScale: 0.8,
        roughness: 0.55,
        metalness: 0.6,
      });
    }

    const cntMats = [
      cm(T.door),
      cm(T.door),
      cm(T.side),
      new THREE.MeshStandardMaterial({
        color: 0x1b1c1f,
        roughness: 0.8,
        metalness: 0.5,
      }),
      cm(T.side),
      cm(T.side),
    ];

    function mkContainer() {
      const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.26, 0.26), cntMats);
      g.add(b);
      g.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(1.004, 0.264, 0.264)),
          new THREE.LineBasicMaterial({ color: 0x4a4f57 })
        )
      );
      return g;
    }

    function mkCube(m: THREE.Material) {
      return new THREE.Mesh(GEO.cube, m);
    }

    // 4. Photographic Shader Planes (from updated template code)
    const VERT =
      'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';

    const FRAG = [
      'uniform sampler2D map; uniform vec2 texel; uniform vec2 uTilt; uniform vec2 uSize; uniform vec2 uPan; uniform vec3 uGlow;',
      'uniform float uGlowAmt; uniform float uExp; uniform float uOp; uniform float uRound; uniform float uVig; uniform float uZoom;',
      'varying vec2 vUv;',
      'void main(){',
      '  vec2 uv = (vUv - 0.5) / uZoom + 0.5 + uPan;',
      '  vec3 c0 = texture2D(map, uv).rgb;',
      '  float l0 = dot(c0, vec3(0.299, 0.587, 0.114));',
      '  uv += uTilt * (l0 - 0.5) * 0.02;',
      '  vec4 c = texture2D(map, uv);',
      '  float a = c.a;',
      '  vec2 o = texel * 2.0;',
      '  float am = a;',
      '  am = min(am, texture2D(map, uv + vec2(o.x, 0.0)).a);',
      '  am = min(am, texture2D(map, uv - vec2(o.x, 0.0)).a);',
      '  am = min(am, texture2D(map, uv + vec2(0.0, o.y)).a);',
      '  am = min(am, texture2D(map, uv - vec2(0.0, o.y)).a);',
      '  float edge = clamp(a - am, 0.0, 1.0);',
      '  vec3 col = c.rgb;',
      '  float lum = dot(col, vec3(0.299, 0.587, 0.114));',
      '  col = mix(vec3(lum), col, 1.06);',
      '  col = pow(col, vec3(1.1)) * uExp;',
      '  col *= mix(0.78, 1.08, clamp(vUv.y * 0.65 + (1.0 - vUv.x) * 0.35, 0.0, 1.0));',
      '  col *= 1.0 - 0.6 * edge;',
      '  col += uGlow * edge * uGlowAmt;',
      '  float m = 1.0;',
      '  if (uRound > 0.0) {',
      '    vec2 p = (vUv - 0.5) * uSize; vec2 q = abs(p) - uSize * 0.5 + vec2(uRound);',
      '    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRound;',
      '    m = 1.0 - smoothstep(-0.004, 0.004, d);',
      '  }',
      '  float vg = 1.0;',
      '  if (uVig > 0.0) { vec2 vq = abs(vUv - 0.5) * 2.0; vg = 1.0 - uVig * smoothstep(0.55, 1.05, max(vq.x, vq.y)); }',
      '  gl_FragColor = vec4(col * vg, a * m * uOp);',
      '}',
    ].join('\n');

    const GLOW = (function () {
      const c = cv(128, 128);
      const x = c.getContext('2d');
      if (!x) return null;
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(0.35, 'rgba(255,255,255,0.28)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
      return tex(c, false);
    })();

    const PHOTO: Record<string, PhotoData> = {};

    interface PhotoOptions {
      glow?: number;
      glowAmt?: number;
      halo?: number;
      haloOp?: number;
      haloSize?: number;
      exp?: number;
      round?: number;
      vig?: number;
    }

    function mkPhoto(name: string, o: PhotoOptions = {}): THREE.Group | null {
      const ph = PHOTO[name];
      if (!ph) return null;
      const asp = ph.w / ph.h;
      const w = asp >= 1 ? 1 : asp;
      const h = asp >= 1 ? 1 / asp : 1;

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: ph.tex },
          texel: { value: new THREE.Vector2(1 / ph.w, 1 / ph.h) },
          uTilt: { value: new THREE.Vector2() },
          uSize: { value: new THREE.Vector2(w, h) },
          uPan: { value: new THREE.Vector2() },
          uGlow: { value: new THREE.Color(o.glow || 0xffffff) },
          uGlowAmt: { value: o.glowAmt || 0 },
          uExp: { value: o.exp || 1 },
          uOp: { value: 0 },
          uRound: { value: o.round || 0 },
          uVig: { value: o.vig || 0 },
          uZoom: { value: 1 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
      });

      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat));

      let halo: THREE.Mesh | null = null;
      if (o.halo && GLOW) {
        halo = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({
            map: GLOW,
            color: o.halo,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0,
          })
        );
        halo.position.z = -0.02;
        const hs = Math.max(w, h) * (o.haloSize || 1.7);
        halo.scale.set(hs, hs, 1);
        g.add(halo);
      }

      g.userData = { mat, halo, haloOp: o.haloOp || 0.25 };
      return g;
    }

    function applyPhoto(obj: THREE.Object3D, op: number, tx: number, ty: number) {
      const parts: THREE.Object3D[] = obj.userData.parts || [obj];
      parts.forEach((p) => {
        const d = p.userData;
        if (!d?.mat) return;
        d.mat.uniforms.uOp.value = op;
        d.mat.uniforms.uTilt.value.set(tx, ty);
        if (d.halo) d.halo.material.opacity = d.haloOp * op;
      });
    }

    function ent(obj: THREE.Object3D, o: Partial<Entity> = {}): Entity {
      scene.add(obj);
      return {
        obj,
        photo: !!o.photo,
        nx: o.nx || 0,
        ny: o.ny || 0,
        z: o.z || 0,
        size: o.size || 1,
        spin: o.spin || 0,
        ph: o.ph || 0,
        rx: o.rx || 0,
        ry: o.ry || 0,
        rz: o.rz || 0,
        pd: o.pd == null ? 0.3 : o.pd,
        a: 0,
        fade: 0,
        delay: o.delay || 0,
      };
    }

    // 5. Assets Mapping from public/img/assets/
    const ASSETS: Record<string, string> = {
      charcoal: '/img/assets/charcoal-hex.webp',
      coffee: '/img/assets/coffee.webp',
      cinnamon: '/img/assets/cinnamon.webp',
      cloves: '/img/assets/cloves.webp',
      rack: '/img/assets/drying-rack.webp',
    };

    const narrow = typeof window !== 'undefined' && window.innerWidth < 720;
    const S = narrow ? 0.74 : 1;

    // Entities collections
    const hero: Entity[] = [];
    const com: (Entity | null)[] = [];
    let rackEnt: Entity | null = null;
    let closeCnt: Entity | null = null;
    let heroCnt: Entity | null = null;
    let heroCube: Entity | null = null;
    let built = false;

    // Create 3D Container & 3D Charcoal Cube (Retained as requested!)
    heroCnt = ent(mkContainer(), {
      nx: -0.04,
      ny: -0.42,
      z: -2.0,
      size: 1.05 * S,
      ry: -0.55,
      rx: 0.3,
      ph: 1.1,
      pd: 0.08,
      delay: 0.1,
    });
    heroCnt.obj.visible = false;

    // Centerpiece 3D Glowing Coal Cube in Hero
    heroCube = ent(mkCube(MAT.hero), {
      nx: 0.02,
      ny: 0.04,
      z: 0.3,
      size: 0.82 * S,
      rz: -0.05,
      ry: -0.15,
      ph: 0.5,
      pd: 0.35,
      delay: 0.4,
    });
    heroCube.obj.visible = false;

    closeCnt = ent(mkContainer(), {
      size: 1.5,
      rx: 0.2,
      ry: -0.6,
    });
    closeCnt.obj.visible = false;

    function build() {
      const P = function (n: string, o: PhotoOptions, e: Partial<Entity>) {
        const g = mkPhoto(n, o);
        if (!g) return null;
        return ent(g, { ...e, photo: true });
      };

      let e: Entity | null;

      // Hero floating photo planes
      if (
        (e = P(
          'cinnamon',
          { glow: 0xffa860, glowAmt: 0.14, exp: 1.0 },
          {
            nx: -0.32,
            ny: 0.38,
            z: 0.9,
            size: 0.58 * S,
            rz: -0.3,
            ry: 0.2,
            ph: 2.0,
            pd: 0.5,
            delay: 0.75,
          }
        ))
      )
        hero.push(e);

      if (
        (e = P(
          'coffee',
          { glow: 0xc9d99a, glowAmt: 0.14, exp: 1.0 },
          {
            nx: 0.38,
            ny: 0.34,
            z: 1.0,
            size: 0.44 * S,
            rz: 0.3,
            ph: 3.0,
            pd: 0.55,
            delay: 0.95,
          }
        ))
      )
        hero.push(e);

      if (
        !narrow &&
        (e = P(
          'cloves',
          { glow: 0xffa860, glowAmt: 0.14, exp: 1.05 },
          {
            nx: -0.02,
            ny: 0.47,
            z: 1.1,
            size: 0.3,
            rz: 0.5,
            ry: -0.2,
            ph: 4.0,
            pd: 0.45,
            delay: 1.1,
          }
        ))
      )
        hero.push(e);

      if (heroCnt) heroCnt.obj.visible = true;
      if (heroCube) heroCube.obj.visible = true;

      // Commodities Section (Corresponding to index 0..3):
      // Index 0: 3D Asset Cube Coal (Retained! Genuine 3D glowing cube 25mm)
      const comCube = ent(mkCube(MAT.cube), {
        size: 0.88,
        ry: -0.15,
        rz: -0.04,
        ph: 1.0,
        pd: 0.3,
      });
      com.push(comCube);

      // Index 1: BBQ Charcoal Hexagonal photo-plane
      if (
        (e = P(
          'charcoal',
          {
            glow: 0xff6a1f,
            glowAmt: 0.5,
            halo: 0xff6a1f,
            haloOp: 0.3,
            haloSize: 1.5,
            exp: 1.75,
          },
          { size: 0.98, ry: -0.1, rz: -0.04, ph: 1.0, pd: 0.3 }
        ))
      )
        com.push(e);
      else com.push(null);

      // Index 2: Green Coffee Beans photo-plane
      if (
        (e = P(
          'coffee',
          { glow: 0xc9d99a, glowAmt: 0.1 },
          { size: 0.9, rz: 0.15, ph: 2.0, pd: 0.3 }
        ))
      )
        com.push(e);
      else com.push(null);

      // Index 3: Spices Composite (Cinnamon + Cloves photo-planes)
      const a = mkPhoto('cinnamon', { glow: 0xffa860, glowAmt: 0.1, exp: 0.95 });
      const b = mkPhoto('cloves', { glow: 0xffa860, glowAmt: 0.1, exp: 0.95 });
      if (a && b) {
        const g = new THREE.Group();
        a.position.set(-0.1, 0.12, 0);
        a.scale.setScalar(0.92);
        a.rotation.z = -0.18;
        b.position.set(0.2, -0.26, 0.05);
        b.scale.setScalar(0.5);
        b.rotation.z = 0.35;
        g.add(a, b);
        g.userData = { parts: [a, b] };
        e = ent(g, { photo: true, size: 0.98, ph: 3.0, pd: 0.3 });
        com.push(e);
      } else {
        com.push(null);
      }

      com.forEach((c) => {
        if (c) c.obj.visible = false;
      });

      // Process Section: Drying Rack with reactive zoom & exposure
      const rp = mkPhoto('rack', { round: 0.03, vig: 0.45, exp: 1.1 });
      if (rp) {
        rackEnt = ent(rp, { photo: true, size: 1.0, ry: 0.06, ph: 0.8, pd: 0.2 });
        rackEnt.obj.visible = false;
      }

      built = true;
    }

    // Load textures
    const keys = Object.keys(ASSETS);
    let pending = keys.length;
    const loader = new THREE.TextureLoader();

    function onDone() {
      pending--;
      if (pending === 0) {
        try {
          build();
        } catch (err) {
          console.warn('Failed to build 3D photo scene:', err);
        }
      }
    }

    keys.forEach((k) => {
      loader.load(
        ASSETS[k],
        (t) => {
          t.premultiplyAlpha = false;
          t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          PHOTO[k] = { tex: t, w: t.image.width || 512, h: t.image.height || 512 };
          onDone();
        },
        undefined,
        onDone
      );
    });

    // Viewport & Pointer math
    let vw = 1;
    let vh = 1;
    let visH = 1;
    let visW = 1;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      visH = 2 * D * Math.tan((FOV * Math.PI) / 360);
      visW = visH * camera.aspect;
    }
    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e: MouseEvent) => {
      ptr.tx = (e.clientX / vw - 0.5) * 2;
      ptr.ty = (e.clientY / vh - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function slotInfo(el: Element | null) {
      if (!el) {
        return { cx: vw * 0.5, cy: vh * 0.5, w: 200, h: 200, top: 0, bottom: vh };
      }
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: r.width,
        h: r.height,
        top: r.top,
        bottom: r.bottom,
      };
    }

    function ease(t: number) {
      const c = Math.min(1, Math.max(0, t));
      return c * c * (3 - 2 * c);
    }

    function secVis(r: DOMRect) {
      return ease((vh - r.top) / (vh * 0.6)) * ease(r.bottom / (vh * 0.6));
    }

    let dt = 0.016;
    let lastT = 0;
    const rackExp = [0.9, 1.0, 1.3, 1.2, 1.0];
    let rackExpNow = 0.9;

    function place(e: Entity, s: ReturnType<typeof slotInfo>, vis: number, t: number) {
      const f = (D - e.z) / D;
      const sx = s.cx + e.nx * s.w;
      const sy = s.cy + e.ny * s.h;
      const X = (sx / vw - 0.5) * visW * f;
      const Y = -(sy / vh - 0.5) * visH * f;
      const unit = (Math.min(s.w, s.h) / vh) * visH;
      const k = reduce ? 0 : 1;

      if (t > e.delay && e.fade < 1) {
        e.fade = Math.min(1, e.fade + (reduce ? 1 : dt / 0.9));
      }

      e.obj.position.set(
        X + ptr.x * e.pd * 0.3,
        Y - ptr.y * e.pd * 0.2 + Math.sin(t * 0.7 + e.ph) * 0.04 * k,
        e.z
      );

      if (e.photo) {
        e.obj.scale.setScalar(Math.max(0.0001, e.size * unit * (0.92 + 0.08 * vis)));
        e.obj.rotation.set(
          e.rx - ptr.y * 0.16 + Math.sin(t * 0.45 + e.ph) * 0.05 * k,
          e.ry + ptr.x * 0.28 + Math.sin(t * 0.33 + e.ph) * 0.1 * k,
          e.rz + Math.sin(t * 0.5 + e.ph) * 0.03 * k
        );
        applyPhoto(e.obj, vis * e.fade, ptr.x * e.pd * 2, -ptr.y * e.pd * 2);
      } else {
        // 3D Geometry (Container & Coal Cube)
        e.obj.scale.setScalar(Math.max(0.0001, e.size * unit * vis * (e.fade > 0 ? 1 : 0)));
        e.obj.rotation.set(
          e.rx + Math.sin(t * 0.4 + e.ph) * 0.06 * k + ptr.y * 0.12,
          e.ry + Math.sin(t * 0.3 + e.ph) * 0.12 * k + ptr.x * 0.3,
          e.rz
        );
      }
    }

    let animationId: number;

    const renderLoop = (timeMs: number) => {
      animationId = requestAnimationFrame(renderLoop);
      const t = reduce ? 1.2 : timeMs / 1000;
      dt = Math.min(0.1, Math.max(0.001, t - lastT));
      lastT = t;

      const kp = 1 - Math.exp(-dt * 4);
      ptr.x += (ptr.tx - ptr.x) * kp;
      ptr.y += (ptr.ty - ptr.y) * kp;

      const slots = {
        hero: document.getElementById('slot-hero'),
        com: document.getElementById('slot-com'),
        proc: document.getElementById('slot-proc'),
        close: document.getElementById('slot-close'),
      };

      const secs = {
        com: document.getElementById('commodities'),
        proc: document.getElementById('process'),
        close: document.getElementById('contact'),
        plan: document.getElementById('planner'),
      };

      // 1. Planner Occlusion Optimization
      if (secs.plan) {
        const pr = secs.plan.getBoundingClientRect();
        if (pr.top <= 0 && pr.bottom >= vh) {
          // Completely covered by light paper band
          return;
        }
      }

      // 2. Hero Cluster (3D Container + 3D Glowing Coal Cube + Floating Photo Planes)
      const sh = slotInfo(slots.hero);
      const heroOn = sh.bottom > -vh * 0.5 && sh.top < vh * 1.2;
      if (heroCnt) heroCnt.obj.visible = heroOn && built;
      if (heroCube) heroCube.obj.visible = heroOn && built;
      hero.forEach((entItem) => {
        entItem.obj.visible = heroOn;
      });

      if (heroOn && built) {
        if (heroCnt) place(heroCnt, sh, 1, t);
        if (heroCube) {
          place(heroCube, sh, 1, t);
          // Ember light following glowing cube
          emberA.intensity = 1.2 + Math.sin(t * 3.0) * 0.3;
          emberA.position
            .copy(heroCube.obj.position)
            .add(new THREE.Vector3(0.2, 0.2, 0.4));
        }
        hero.forEach((entItem) => {
          place(entItem, sh, 1, t);
        });
      }

      // 3. Commodities Showcase (#slot-com)
      if (secs.com && slots.com) {
        const rc = secs.com.getBoundingClientRect();
        const cv_ = secVis(rc);
        const sc = slotInfo(slots.com);
        const currentActive = stateRef.current.activeCom;

        com.forEach((entItem, i) => {
          if (!entItem) return;
          const target = i === currentActive ? 1 : 0;
          entItem.a += (target - entItem.a) * (1 - Math.exp(-dt * 8));
          const show = cv_ > 0.001 && entItem.a > 0.005;
          entItem.obj.visible = show;

          if (show) {
            entItem.fade = 1;
            place(entItem, sc, ease(cv_) * ease(entItem.a), t);
            entItem.obj.rotation.y += (1 - entItem.a) * 0.7;

            // When Shisha charcoal (Index 0 - 3D Cube) is active, boost ember warmth
            if (i === 0 && !entItem.photo) {
              emberB.intensity = (1.5 + Math.sin(t * 3.5) * 0.4) * entItem.a;
              emberB.position
                .copy(entItem.obj.position)
                .add(new THREE.Vector3(0.3, 0.2, 0.4));
            }
          }
        });
      }

      // 4. Process Section (#slot-proc) - Drying Rack photo-plane
      if (secs.proc && slots.proc && rackEnt) {
        const rp = secs.proc.getBoundingClientRect();
        const pv = secVis(rp);
        const sp = slotInfo(slots.proc);
        const stage = stateRef.current.stageIdx;
        const pProgress = stateRef.current.procP;

        rackEnt.obj.visible = pv > 0.001;
        if (pv > 0.001) {
          rackEnt.fade = 1;
          place(rackEnt, sp, pv, t);

          const targetExp = rackExp[stage] || 1.0;
          rackExpNow += (targetExp - rackExpNow) * (1 - Math.exp(-dt * 4));
          const u = rackEnt.obj.userData.mat.uniforms;
          u.uExp.value = rackExpNow;
          u.uZoom.value = 1.02 + pProgress * 0.26;
          u.uPan.value.set((0.5 - pProgress) * 0.05, (pProgress - 0.5) * 0.03);
        }
      }

      // 5. Closing Section (#slot-close) - 3D Shipping Container
      if (secs.close && slots.close && closeCnt) {
        const rcl = secs.close.getBoundingClientRect();
        const cvis = secVis(rcl);
        const scl = slotInfo(slots.close);

        closeCnt.obj.visible = cvis > 0.001;
        if (cvis > 0.001) {
          closeCnt.fade = 1;
          place(closeCnt, scl, cvis, t);
          closeCnt.obj.rotation.y = -0.6 + Math.sin(t * 0.3) * 0.5 + ptr.x * 0.3;
        }
      }

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      Object.keys(T).forEach((k) => T[k]?.dispose());
      Object.keys(PHOTO).forEach((k) => PHOTO[k]?.tex.dispose());
      GEO.cube.dispose();
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
