'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLSceneProps {
  activeCommodityIndex: number;
  stageIndex: number;
  processProgress: number;
}

export function WebGLScene({
  activeCommodityIndex,
  stageIndex,
  processProgress,
}: WebGLSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store mutable state accessible to the RAF render loop
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
      console.warn('WebGL not supported', e);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    // Compatibility for three.js color space
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

    function cv(w: number, h: number) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function tex(c: HTMLCanvasElement, srgb: boolean) {
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

    // Environment reflection
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
      // Ignore if environment creation fails
    }

    const key = new THREE.DirectionalLight(0xffe4c8, 1.5);
    key.position.set(-3, 4, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x9fbfff, 1.0);
    rim.position.set(4, 1, -3);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    const emberA = new THREE.PointLight(0xff6a1f, 0, 7, 2);
    scene.add(emberA);
    const emberB = new THREE.PointLight(0xff6a1f, 0, 7, 2);
    scene.add(emberB);

    // Procedural Textures
    const T: Record<string, THREE.CanvasTexture> = {};
    (function () {
      const R = rng(7);
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

      c = cv(256, 256);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#8a4a22';
        x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 260; i++) {
          const l = R() > 0.5 ? 0 : 255;
          x.fillStyle = `rgba(${l},${l ? 200 : 0},${l ? 150 : 0},${0.05 + R() * 0.12})`;
          x.fillRect(R() * 256, 0, 1 + R() * 4, 256);
        }
        T.cin = tex(c, true);
        T.cin.wrapS = T.cin.wrapT = THREE.RepeatWrapping;
      }

      c = cv(1024, 256);
      x = c.getContext('2d');
      if (x) {
        x.fillStyle = '#2a2d32';
        x.fillRect(0, 0, 1024, 256);
        for (let i = 0; i < 1024; i += 16) {
          x.fillStyle = '#353940';
          x.fillRect(i, 14, 8, 228);
          x.fillStyle = '#1e2024';
          x.fillRect(i + 8, 14, 8, 228);
        }
        x.fillStyle = '#3d4249';
        x.fillRect(0, 0, 1024, 14);
        x.fillRect(0, 242, 1024, 14);
        x.fillStyle = 'rgba(232,230,224,0.88)';
        x.font = '600 46px Geist, Arial, sans-serif';
        x.fillText('NUSANTARA ORIGIN', 70, 150);
        x.fillStyle = '#E8742A';
        x.fillRect(70, 176, 74, 6);
        T.side = tex(c, true);
      }

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

    function hexGeo() {
      const s = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * 6.283 + 0.5236;
        if (i) s.lineTo(Math.cos(a) * 0.5, Math.sin(a) * 0.5);
        else s.moveTo(Math.cos(a) * 0.5, Math.sin(a) * 0.5);
      }
      const h = new THREE.Path();
      h.absarc(0, 0, 0.14, 0, 6.283, true);
      s.holes.push(h);
      const g = new THREE.ExtrudeGeometry(s, {
        depth: 0.8,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.035,
        bevelSegments: 2,
        curveSegments: 18,
      });
      g.center();
      g.scale(0.8, 0.8, 0.8);
      return g;
    }

    function beanGeo() {
      const g = new THREE.SphereGeometry(0.5, 36, 28);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i) * 1.0;
        const y = p.getY(i) * 0.66;
        let z = p.getZ(i) * 0.8;
        if (z > 0) {
          const yc = 0.05 * Math.sin(x * 7);
          const dy = y - yc;
          const depth =
            0.09 *
            Math.exp(-(dy * dy) / (2 * 0.04 * 0.04)) *
            Math.max(0, 1 - Math.pow(x / 0.5, 2));
          z -= depth;
        }
        p.setXYZ(i, x, y, z);
      }
      g.computeVertexNormals();
      return g;
    }

    const GEO = {
      cube: cubeGeo(),
      hex: hexGeo(),
      bean: beanGeo(),
      quill: new THREE.CylinderGeometry(0.07, 0.07, 1, 24, 1, true),
      quillIn: new THREE.CylinderGeometry(0.04, 0.04, 1, 16, 1, true),
      twine: new THREE.TorusGeometry(0.17, 0.014, 8, 36),
      head: new THREE.SphereGeometry(0.035, 12, 10),
      stem: new THREE.CylinderGeometry(0.014, 0.005, 0.2, 10),
      sepal: new THREE.ConeGeometry(0.012, 0.05, 6),
    };

    const MAT = {
      cube: charMat(0.55),
      hero: charMat(0.7),
      proc: charMat(0.1),
      hex: charMat(0.35),
      bean: new THREE.MeshStandardMaterial({
        color: 0x93ad6c,
        roughness: 0.5,
        metalness: 0.0,
        bumpMap: T.noise,
        bumpScale: 0.6,
        envMapIntensity: 0.9,
      }),
      quill: new THREE.MeshStandardMaterial({
        map: T.cin,
        bumpMap: T.cin,
        bumpScale: 1.5,
        roughness: 0.75,
        metalness: 0,
        side: THREE.DoubleSide,
        envMapIntensity: 0.5,
      }),
      quillIn: new THREE.MeshStandardMaterial({
        color: 0x4a2410,
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
      twine: new THREE.MeshStandardMaterial({
        color: 0xc9b27a,
        roughness: 0.9,
      }),
      clove: new THREE.MeshStandardMaterial({
        color: 0x4a2314,
        roughness: 0.55,
        envMapIntensity: 0.7,
      }),
      cnt: [
        new THREE.MeshStandardMaterial({
          map: T.door,
          roughness: 0.55,
          metalness: 0.7,
        }),
        new THREE.MeshStandardMaterial({
          map: T.door,
          roughness: 0.55,
          metalness: 0.7,
        }),
        new THREE.MeshStandardMaterial({
          map: T.side,
          roughness: 0.55,
          metalness: 0.7,
        }),
        new THREE.MeshStandardMaterial({
          color: 0x1b1c1f,
          roughness: 0.8,
          metalness: 0.5,
        }),
        new THREE.MeshStandardMaterial({
          map: T.side,
          roughness: 0.55,
          metalness: 0.7,
        }),
        new THREE.MeshStandardMaterial({
          map: T.side,
          roughness: 0.55,
          metalness: 0.7,
        }),
      ],
    };

    function mesh(g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[]) {
      return new THREE.Mesh(g, m);
    }

    function mkCube(m: THREE.Material) {
      return mesh(GEO.cube, m);
    }
    function mkHex() {
      return mesh(GEO.hex, MAT.hex);
    }
    function mkBean() {
      return mesh(GEO.bean, MAT.bean);
    }

    function mkClove() {
      const g = new THREE.Group();
      const s = mesh(GEO.stem, MAT.clove);
      const h = mesh(GEO.head, MAT.clove);
      h.position.y = 0.11;
      g.add(s, h);
      for (let i = 0; i < 4; i++) {
        const c = mesh(GEO.sepal, MAT.clove);
        const a = (i / 4) * 6.283;
        c.position.set(Math.cos(a) * 0.03, 0.095, Math.sin(a) * 0.03);
        c.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
        g.add(c);
      }
      g.scale.setScalar(3.4);
      return g;
    }

    function mkBundle() {
      const g = new THREE.Group();
      const R = rng(11);
      const pos = [
        [0, 0],
        [0.11, 0.05],
        [-0.11, 0.05],
        [0.055, -0.1],
        [-0.055, -0.1],
        [0, 0.14],
      ];
      pos.forEach((p) => {
        const q = new THREE.Group();
        const len = 0.9 + R() * 0.18;
        const a = mesh(GEO.quill, MAT.quill);
        a.scale.y = len;
        const b = mesh(GEO.quillIn, MAT.quillIn);
        b.scale.y = len * 0.98;
        q.add(a, b);
        q.position.set(p[0], 0, p[1]);
        q.rotation.set(
          Math.PI / 2 + (R() - 0.5) * 0.08,
          0,
          (R() - 0.5) * 0.08
        );
        g.add(q);
      });
      const t = mesh(GEO.twine, MAT.twine);
      t.rotation.y = Math.PI / 2;
      t.position.set(0, 0.02, 0.0);
      t.scale.set(1, 1.15, 1.15);
      const t2 = t.clone();
      t2.position.x = 0.2;
      g.add(t, t2);
      g.scale.setScalar(1.0);
      return g;
    }

    function mkContainer() {
      const g = new THREE.Group();
      const b = mesh(new THREE.BoxGeometry(1, 0.26, 0.26), MAT.cnt);
      g.add(b);
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.004, 0.264, 0.264)),
        new THREE.LineBasicMaterial({ color: 0x4a4f57 })
      );
      g.add(edge);
      return g;
    }

    function mkBeanCluster() {
      const g = new THREE.Group();
      const R = rng(5);
      for (let i = 0; i < 6; i++) {
        const b = mkBean();
        const a = (i / 6) * 6.283;
        b.position.set(
          Math.cos(a) * 0.3,
          Math.sin(a * 1.3) * 0.18,
          Math.sin(a) * 0.22
        );
        b.rotation.set(R() * 3, R() * 3, R() * 3);
        b.scale.setScalar(0.55);
        g.add(b);
      }
      return g;
    }

    function mkSpices() {
      const g = new THREE.Group();
      const b = mkBundle();
      b.scale.setScalar(0.95);
      g.add(b);
      const R = rng(3);
      for (let i = 0; i < 7; i++) {
        const c = mkClove();
        const a = (i / 7) * 6.283;
        c.position.set(
          Math.cos(a) * 0.42,
          -0.2 + R() * 0.1,
          Math.sin(a) * 0.3
        );
        c.rotation.set(R() * 3, R() * 3, R() * 3);
        c.scale.setScalar(2.4);
        g.add(c);
      }
      return g;
    }

    interface Entity {
      obj: THREE.Object3D;
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
    }

    function ent(obj: THREE.Object3D, o: Partial<Entity> = {}): Entity {
      const e: Entity = {
        obj,
        nx: o.nx || 0,
        ny: o.ny || 0,
        z: o.z || 0,
        size: o.size || 1,
        spin: o.spin == null ? 0.12 : o.spin,
        ph: o.ph || 0,
        rx: o.rx || 0,
        ry: o.ry || 0,
        rz: o.rz || 0,
        pd: o.pd == null ? 0.2 : o.pd,
        a: 0,
      };
      scene.add(obj);
      return e;
    }

    // Hero cluster
    const heroCube = ent(mkCube(MAT.hero), {
      nx: 0.06,
      ny: 0.1,
      z: 0.5,
      size: 0.62,
      spin: 0.16,
      rx: 0.4,
      rz: 0.2,
      ph: 0.5,
      pd: 0.35,
    });

    const hero: Entity[] = [
      ent(mkContainer(), {
        nx: 0.02,
        ny: -0.3,
        z: -1.4,
        size: 1.15,
        spin: 0.0,
        rx: 0.12,
        ry: -0.5,
        ph: 1.1,
        pd: 0.08,
      }),
      heroCube,
      ent(mkBundle(), {
        nx: -0.32,
        ny: 0.34,
        z: 0.3,
        size: 0.55,
        spin: 0.05,
        ry: 0.3,
        rz: 0.7,
        ph: 2.0,
        pd: 0.4,
      }),
      ent(mkBean(), {
        nx: -0.34,
        ny: -0.05,
        z: 0.9,
        size: 0.2,
        spin: 0.3,
        ph: 3.0,
        pd: 0.5,
      }),
      ent(mkBean(), {
        nx: 0.4,
        ny: -0.02,
        z: 0.6,
        size: 0.17,
        spin: -0.25,
        rx: 1,
        ph: 4.0,
        pd: 0.45,
      }),
      ent(mkBean(), {
        nx: 0.34,
        ny: 0.4,
        z: 1.2,
        size: 0.24,
        spin: 0.2,
        rz: 2,
        ph: 5.0,
        pd: 0.6,
      }),
      ent(mkBean(), {
        nx: -0.06,
        ny: 0.44,
        z: -0.2,
        size: 0.15,
        spin: 0.3,
        rx: 2,
        ph: 6.0,
        pd: 0.3,
      }),
      ent(mkClove(), {
        nx: 0.28,
        ny: 0.22,
        z: 0.4,
        size: 0.45,
        spin: 0.4,
        rz: 1,
        ph: 1.0,
        pd: 0.5,
      }),
      ent(mkClove(), {
        nx: -0.2,
        ny: 0.1,
        z: 1.0,
        size: 0.38,
        spin: -0.3,
        rz: 2,
        ph: 2.0,
        pd: 0.55,
      }),
    ];

    // Commodities Stage
    const com: Entity[] = [
      ent(mkCube(MAT.cube), { size: 0.7, spin: 0.2, rx: 0.4, rz: 0.15 }),
      ent(mkHex(), { size: 0.75, spin: 0.2, rx: 0.9 }),
      ent(mkBeanCluster(), { size: 0.95, spin: 0.2, rx: 0.3 }),
      ent(mkSpices(), { size: 0.8, spin: 0.18, rx: 0.5 }),
    ];
    com.forEach((e) => {
      e.obj.visible = false;
    });

    const procCube = ent(mkCube(MAT.proc), {
      size: 0.78,
      spin: 0.14,
      rx: 0.4,
      rz: 0.15,
    });
    const closeCnt = ent(mkContainer(), {
      size: 1.5,
      spin: 0.0,
      rx: 0.2,
      ry: -0.6,
    });

    let vw = window.innerWidth;
    let vh = window.innerHeight;
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

    const onPointerMove = (e: PointerEvent) => {
      ptr.tx = (e.clientX / vw - 0.5) * 2;
      ptr.ty = (e.clientY / vh - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function slotInfo(el: HTMLElement | null) {
      if (!el) {
        return { cx: 0, cy: 0, w: 0, h: 0, top: 9999, bottom: 9999 };
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

    function clamp(v: number, a: number, b: number) {
      return Math.min(b, Math.max(a, v));
    }
    function ease(t: number) {
      t = clamp(t, 0, 1);
      return t * t * (3 - 2 * t);
    }

    function place(e: Entity, s: any, vis: number, t: number, spinMul = 1) {
      const f = (D - e.z) / D;
      const sx = s.cx + e.nx * s.w;
      const sy = s.cy + e.ny * s.h;
      const X = (sx / vw - 0.5) * visW * f;
      const Y = -(sy / vh - 0.5) * visH * f;
      const unit = (Math.min(s.w, s.h) / vh) * visH;
      const k = reduce ? 0 : 1;

      e.obj.position.set(
        X + ptr.x * e.pd * 0.4,
        Y - ptr.y * e.pd * 0.25 + Math.sin(t * 0.7 + e.ph) * 0.05 * k,
        e.z
      );
      e.obj.scale.setScalar(Math.max(0.0001, e.size * unit * vis));
      e.obj.rotation.set(
        e.rx + Math.sin(t * 0.4 + e.ph) * 0.12 * k + ptr.y * 0.18,
        e.ry + t * e.spin * k * (spinMul || 1) + ptr.x * 0.35,
        e.rz
      );
    }

    function secVis(r: DOMRect | null) {
      if (!r) return 0;
      return ease((vh - r.top) / (vh * 0.6)) * ease(r.bottom / (vh * 0.6));
    }

    const glowTargets = [0.12, 0.2, 0.35, 1.0, 0.5];
    let procGlow = 0.12;

    let animId: number;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (document.hidden) return;

      const t = reduce ? 1.2 : ms / 1000;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;

      const planSec = document.getElementById('planner');
      if (planSec) {
        const pr = planSec.getBoundingClientRect();
        if (pr.top <= 0 && pr.bottom >= vh) {
          // Pause rendering when planner paper band fills viewport
          return;
        }
      }

      // Hero Slot
      const heroSlotEl = document.getElementById('slot-hero');
      const sh = slotInfo(heroSlotEl);
      const heroOn = sh.bottom > -vh * 0.5 && sh.top < vh * 1.2;
      hero.forEach((e) => {
        e.obj.visible = heroOn;
        if (heroOn) place(e, sh, 1, t);
      });
      emberA.intensity = heroOn ? 2.2 : 0;
      if (heroOn) {
        emberA.position.set(
          heroCube.obj.position.x,
          heroCube.obj.position.y + 0.2,
          1.6
        );
      }

      // Commodities Slot
      const comSec = document.getElementById('commodities');
      const comSlotEl = document.getElementById('slot-com');
      const rc = comSec ? comSec.getBoundingClientRect() : null;
      const cv_ = secVis(rc);
      const sc = slotInfo(comSlotEl);

      com.forEach((e, i) => {
        const target = i === stateRef.current.activeCom ? 1 : 0;
        e.a += (target - e.a) * 0.1;
        const show = cv_ > 0.001 && e.a > 0.005;
        e.obj.visible = show;
        if (show) {
          place(e, sc, ease(cv_) * ease(e.a), t);
          e.obj.rotation.y += (1 - e.a) * 2.2;
        }
      });

      // Process Slot
      const procSec = document.getElementById('process');
      const procSlotEl = document.getElementById('slot-proc');
      const rp = procSec ? procSec.getBoundingClientRect() : null;
      const pv = secVis(rp);
      const sp = slotInfo(procSlotEl);

      procCube.obj.visible = pv > 0.001;
      if (pv > 0.001) {
        const targetGlow = glowTargets[stateRef.current.stageIdx] || 0.12;
        procGlow += (targetGlow - procGlow) * 0.06;
        MAT.proc.emissiveIntensity = procGlow;
        place(procCube, sp, pv, t, 1 + stateRef.current.procP * 4);
        emberB.intensity = procGlow * 2.4 * pv;
        emberB.position.set(
          procCube.obj.position.x - 0.4,
          procCube.obj.position.y + 0.3,
          1.6
        );
      } else {
        emberB.intensity = 0;
      }

      // Closing Slot
      const closeSec = document.getElementById('contact');
      const closeSlotEl = document.getElementById('slot-close');
      const rcl = closeSec ? closeSec.getBoundingClientRect() : null;
      const cvis = secVis(rcl);
      const scl = slotInfo(closeSlotEl);

      closeCnt.obj.visible = cvis > 0.001;
      if (cvis > 0.001) {
        place(closeCnt, scl, cvis, t);
        closeCnt.obj.rotation.y =
          -0.6 + Math.sin(t * 0.3) * 0.5 + ptr.x * 0.3;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="gl" aria-hidden="true" />;
}
