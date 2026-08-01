"use client";

import { useEffect, useRef, useState } from "react";

interface Skill3D {
  name: string;
  devicon: string | null;
  color: string;
}

const skills: Skill3D[] = [
  { name: "Git",        devicon: "devicon-git-plain",          color: "#F05032" },
  { name: "GitHub",     devicon: "devicon-github-plain",       color: "#ffffff"  },
  { name: "VS Code",    devicon: "devicon-vscode-plain",       color: "#007ACC" },
  { name: "HTML5",      devicon: "devicon-html5-plain",        color: "#E34F26" },
  { name: "CSS3",       devicon: "devicon-css3-plain",         color: "#1572B6" },
  { name: "JavaScript", devicon: "devicon-javascript-plain",   color: "#F7DF1E" },
  { name: "Python",     devicon: "devicon-python-plain",       color: "#3776AB" },
  { name: "Java",       devicon: "devicon-java-plain",         color: "#007396" },
  { name: "SQLite",     devicon: "devicon-sqlite-plain",       color: "#003B57" },
  { name: "MySQL",      devicon: "devicon-mysql-plain",        color: "#4479A1" },
  { name: "Flask",      devicon: "devicon-flask-original",     color: "#ffffff"  },
  { name: "React",      devicon: "devicon-react-plain",        color: "#61DAFB" },
  { name: "Node.js",    devicon: "devicon-nodejs-plain",       color: "#339933" },
  { name: "PyTorch",    devicon: "devicon-pytorch-original",   color: "#EE4C2C" },
  { name: "scikit-learn", devicon: "devicon-scikitlearn-plain", color: "#F7931E" },
];

interface Vec3 { x: number; y: number; z: number }

function fibonacciSphere(count: number): Vec3[] {
  const phi = Math.PI * (Math.sqrt(5) - 1);
  const pts = Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * i + 1) / count;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts;
}

function buildGeodesic(subdivisions: number): { vertices: Vec3[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const norm = (v: Vec3): Vec3 => {
    const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return { x: v.x / l, y: v.y / l, z: v.z / l };
  };
  const verts: Vec3[] = [
    { x: -1, y:  t, z:  0 }, { x:  1, y:  t, z:  0 },
    { x: -1, y: -t, z:  0 }, { x:  1, y: -t, z:  0 },
    { x:  0, y: -1, z:  t }, { x:  0, y:  1, z:  t },
    { x:  0, y: -1, z: -t }, { x:  0, y:  1, z: -t },
    { x:  t, y:  0, z: -1 }, { x:  t, y:  0, z:  1 },
    { x: -t, y:  0, z: -1 }, { x: -t, y:  0, z:  1 },
  ].map(norm);
  let faces: [number, number, number][] = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  for (let s = 0; s < subdivisions; s++) {
    const next: [number, number, number][] = [];
    const cache: Record<string, number> = {};
    const mid = (a: number, b: number): number => {
      const key = Math.min(a, b) + "_" + Math.max(a, b);
      if (key in cache) return cache[key];
      verts.push(norm({
        x: (verts[a].x + verts[b].x) / 2,
        y: (verts[a].y + verts[b].y) / 2,
        z: (verts[a].z + verts[b].z) / 2,
      }));
      return (cache[key] = verts.length - 1);
    };
    for (const [a, b, c] of faces) {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    for (const [i, j] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const k = Math.min(i, j) + "_" + Math.max(i, j);
      if (!seen.has(k)) { seen.add(k); edges.push([i, j]); }
    }
  }
  return { vertices: verts, edges };
}

function project(
  v: Vec3, cx: number, cy: number, radius: number,
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number,
) {
  const x = m00 * v.x + m01 * v.y + m02 * v.z;
  const y = m10 * v.x + m11 * v.y + m12 * v.z;
  const z = m20 * v.x + m21 * v.y + m22 * v.z;
  return { sx: x * radius + cx, sy: y * radius + cy, sz: z };
}

function rx(a: number): number[][] {
  const c = Math.cos(a), s = Math.sin(a);
  return [[1,0,0],[0,c,-s],[0,s,c]];
}

function ry(a: number): number[][] {
  const c = Math.cos(a), s = Math.sin(a);
  return [[c,0,s],[0,1,0],[-s,0,c]];
}

function matMul(a: number[][], b: number[][]): number[][] {
  const r: number[][] = [[0,0,0],[0,0,0],[0,0,0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i][j] = a[i][0]*b[0][j] + a[i][1]*b[1][j] + a[i][2]*b[2][j];
  return r;
}

/**
 * sz ranges from -1 (dead back) to +1 (dead front).
 * FADE_IN  = threshold above which icon is fully visible
 * FADE_OUT = threshold below which icon is completely hidden
 * Between them: smooth cubic (ease-in-out) fade.
 */
function depthOpacity(sz: number): number {
  const FADE_IN  =  0.20;
  const FADE_OUT = -0.15;
  if (sz >= FADE_IN)  return 1;
  if (sz <= FADE_OUT) return 0;
  const t = (sz - FADE_OUT) / (FADE_IN - FADE_OUT);
  return t * t * (3 - 2 * t); // smoothstep
}

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const nodesRef     = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const geoRef      = useRef<ReturnType<typeof buildGeodesic> | null>(null);
  const skillPosRef = useRef<Vec3[]>([]);

  useEffect(() => {
    geoRef.current      = buildGeodesic(1);
    skillPosRef.current = fibonacciSphere(skills.length);
  }, []);

  // Devicon icon font CSS is only used by this globe — load it asynchronously
  // (non-render-blocking) instead of in the head, so first paint is never
  // blocked by a CDN stylesheet. Icons settle in before the user scrolls here.
  useEffect(() => {
    const existing = document.querySelector('link[data-devicon]');
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
    link.dataset.devicon = "true";
    link.media = "print"; // non-blocking until load completes
    link.onload = () => {
      link.media = "all";
    };
    document.head.appendChild(link);
    return () => {
      link.onload = null;
      link.remove();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    const nodesEl   = nodesRef.current;
    if (!container || !canvas || !nodesEl || !geoRef.current) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const rect = container.getBoundingClientRect();
    let W = Math.round(rect.width);
    let H = Math.round(rect.height);

    let cx     = W / 2;
    let cy     = H / 2;
    let radius = Math.min(W, H) * 0.4;

    const resize = () => {
      const r = container.getBoundingClientRect();
      W = Math.round(r.width);
      H = Math.round(r.height);
      if (W === 0 || H === 0) return;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      cx     = W / 2;
      cy     = H / 2;
      radius = Math.min(W, H) * 0.4;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    const { vertices, edges } = geoRef.current;
    const skillPos = skillPosRef.current;

    let rotMat = matMul(rx(0.4), ry(0.2));
    let tiltAngle = 0.4;
    let velX = 0, velY = 0.005;
    let dragging = false;
    let lastMX = 0, lastMY = 0;
    let animId  = 0;
    let visible = true;
    let lastTime = performance.now();
    const prevOps = new Float64Array(skillPos.length).fill(1);

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      rotMat = matMul(rx(-velX * dt), matMul(ry(velY * dt), rotMat));
      const [m00,m01,m02] = rotMat[0];
      const [m10,m11,m12] = rotMat[1];
      const [m20,m21,m22] = rotMat[2];

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      /* outer glow atmosphere ring — drawn before clip so it extends outside */
      const glowRadius = radius * 1.18;
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, glowRadius);
      glow.addColorStop(0, "rgba(230, 83, 32, 0)");
      glow.addColorStop(0.35, "rgba(230, 83, 32, 0.02)");
      glow.addColorStop(0.65, "rgba(230, 83, 32, 0.07)");
      glow.addColorStop(1, "rgba(230, 83, 32, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* outer ring stroke with soft glow */
      ctx.save();
      ctx.shadowColor = "rgba(230, 83, 32, 0.25)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(230, 83, 32, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      /* filled globe background + clip to circle */
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(28,26,26,0.88)";
      ctx.fill();
      ctx.clip();

      /* project geodesic vertices */
      const proj = vertices.map(v =>
        project(v, cx, cy, radius, m00, m01, m02, m10, m11, m12, m20, m21, m22)
      );

      /* edges back→front */
      const drawEdges = edges
        .map(([i, j]) => ({ p1: proj[i], p2: proj[j], d: (proj[i].sz + proj[j].sz) / 2 }))
        .sort((a, b) => a.d - b.d);

      for (const { p1, p2, d } of drawEdges) {
        const alpha = 0.06 + 0.29 * ((d + 1) / 2);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = `rgba(230,83,32,${alpha.toFixed(2)})`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }

      /* equatorial ring */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.06, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(230,83,32,0.12)";
      ctx.lineWidth   = 2;
      ctx.stroke();

      /* tilted ring */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 7);
      ctx.scale(1, 0.32);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.10, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(230,83,32,0.07)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      ctx.restore();

      /* position + fade skill nodes — projected at slightly larger radius to float above surface */
      const elems = nodesEl.children;
      for (let i = 0; i < Math.min(elems.length, skillPos.length); i++) {
        const p  = project(skillPos[i], cx, cy, radius * 1.2, m00, m01, m02, m10, m11, m12, m20, m21, m22);
        const el = elems[i] as HTMLDivElement;
        const rawOp = depthOpacity(p.sz);

        /* frame-to-frame exponential smoothing to prevent pop-in during fast rotation */
        prevOps[i] = prevOps[i] * 0.7 + rawOp * 0.3;
        const op = prevOps[i];

        /* position */
        el.style.transform = `translate(calc(-50% + ${p.sx - cx}px), calc(-50% + ${p.sy - cy}px))`;

        /* fade driven by depth — smooth interpolated per frame */
        el.style.opacity       = op.toFixed(3);
        el.style.pointerEvents = rawOp > 0.08 ? "auto" : "none";
        el.style.zIndex        = p.sz > 0 ? "10" : "1";

        /* slight shrink as icon wraps to back edge — reinforces depth illusion */
        const sc = 0.55 + 0.45 * op;
        el.style.transform += ` scale(${sc.toFixed(3)})`;
      }

      if (!dragging) {
        velY += (0.005 - velY) * 0.03 * dt;
        velX *= 0.85;
      }
      tiltAngle += velX * dt;
      const TILT_LIMIT = Math.PI / 3;
      if (tiltAngle > TILT_LIMIT) { tiltAngle = TILT_LIMIT; velX = 0; }
      if (tiltAngle < -TILT_LIMIT) { tiltAngle = -TILT_LIMIT; velX = 0; }

      animId = visible ? requestAnimationFrame(draw) : 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          // only restart if the loop is not already self-scheduling —
          // otherwise a resume would spawn a second concurrent rAF loop
          if (animId === 0) {
            lastTime = performance.now();
            animId = requestAnimationFrame(draw);
          }
        } else {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    // Only self-start when we actually have a size. If the container is
    // zero-sized at mount (e.g. display:none during the loading screen),
    // RO/IO are still registered, so the loop starts later via the resume
    // path once the container gains size and becomes visible.
    if (W > 0 && H > 0) {
      animId = requestAnimationFrame(draw);
    }

    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      const pt = "touches" in e ? e.touches[0] : e;
      lastMX = pt.clientX; lastMY = pt.clientY;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const pt = "touches" in e ? e.touches[0] : e;
      const rawY = (pt.clientX - lastMX) * 0.04;
      const rawX = (pt.clientY - lastMY) * 0.04;
      velY = velY * 0.15 + rawY * 0.85;
      velX = velX * 0.15 + rawX * 0.85;
      velY = Math.min(0.12, Math.max(-0.12, velY));
      velX = Math.min(0.12, Math.max(-0.12, velX));
      lastMX = pt.clientX; lastMY = pt.clientY;
    };
    const onUp = () => { dragging = false; };

    canvas.addEventListener("mousedown",  onDown as EventListener);
    canvas.addEventListener("touchstart", onDown as EventListener, { passive: true });
    canvas.addEventListener("touchmove",  onMove as EventListener, { passive: true });
    canvas.addEventListener("touchend",   onUp);
    window.addEventListener("mousemove",  onMove as EventListener);
    window.addEventListener("mouseup",    onUp);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown",  onDown as EventListener);
      canvas.removeEventListener("touchstart", onDown as EventListener);
      canvas.removeEventListener("touchmove",  onMove as EventListener);
      canvas.removeEventListener("touchend",   onUp);
      window.removeEventListener("mousemove",  onMove as EventListener);
      window.removeEventListener("mouseup",    onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none", color: "#e6edf3", lineHeight: "24px" }}
      />

      <div
        ref={nodesRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="absolute left-1/2 top-1/2 select-none"
            style={{
              pointerEvents: "auto",
              transition: "none",
              willChange: "transform, opacity",
            }}
            onMouseEnter={() => setHovered(skill.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex flex-col items-center" style={{ gap: "var(--globe-icon-gap, 0.5rem)", willChange: "transform" }}>
              {skill.devicon ? (
                  <i
                    className={`${skill.devicon} colored`}
                    style={{
                      fontSize: "var(--globe-icon-base)",
                      display: "block",
                      filter: hovered === skill.name
                        ? "drop-shadow(0 0 10px rgba(230,83,32,0.9)) brightness(1.3)"
                        : "none",
                      transform: hovered === skill.name
                        ? "translateY(calc(-0.7 * var(--globe-icon-base))) scale(2.2)"
                        : "scale(1.9)",
                      transition: "transform 200ms ease-out, filter 200ms ease-out",
                    }}
                  />
              ) : (
                <span
                  style={{
                    color: skill.color,
                    fontSize: "calc(var(--globe-icon-base) * 0.7)",
                    fontWeight: 700,
                  }}
                >
                  {skill.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span
                className="font-mono leading-none whitespace-nowrap rounded"
                style={{
                  fontSize: "var(--globe-label-size)",
                  padding: "2px 6px",
                  color:           hovered === skill.name ? "#fed7aa" : "#d1d5db",
                  backgroundColor: hovered === skill.name ? "rgba(234,88,12,0.18)" : "transparent",
                  transition: "color 150ms, background-color 150ms",
                }}
              >
                {skill.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
