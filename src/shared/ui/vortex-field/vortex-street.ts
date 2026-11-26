/*
 * A von Kármán vortex street drawn on a 2D canvas.
 *
 * An invisible driver drifts along a slow Lissajous orbit and sheds vortices
 * of alternating sign behind itself. Each vortex drifts with the ambient
 * current and fades over a few seconds. Tracers are carried by the summed
 * Lamb–Oseen field and drawn as short streaks whose opacity follows their
 * speed. Nothing reacts to the pointer: the field just keeps flowing.
 *
 * Trails fade towards transparency (destination-out), so the page surface and
 * its grain show through the canvas.
 */

const MAX_TRACERS = 600;
/** One tracer per this many px² of canvas, so phones get fewer. */
const TRACER_AREA = 2200;
const MIN_TRACERS = 220;

const MAX_VORTICES = 24;
/** Lamb–Oseen core radius, px */
const CORE_R = 34;
/** Ambient current, px/s */
const AMBIENT_X = 22;
const AMBIENT_Y = -7;

/** px of driver travel per shed vortex */
const SHED_SPACING = 44;
const SHED_GAMMA_PER_SPEED = 140;
const SHED_SPEED_LO = 120;
const SHED_SPEED_HI = 800;
/** s, exponential strength decay of shed vortices */
const SHED_TAU = 2.2;
/** |Γ| below this is negligible and the slot is freed */
const GAMMA_PRUNE = 1500;

/** Driver orbit: fractions of the canvas and angular speeds, rad/s */
const ORBIT_AX = 0.36;
const ORBIT_AY = 0.34;
const ORBIT_WX = 0.5;
const ORBIT_WY = 0.34;
/** Minimum orbit speed, px/s, so narrow screens still shed */
const ORBIT_MIN_SPEED = 150;

/** s, streak length = |v| * K */
const STREAK_K = 0.055;
/** px/s, faster tracers get a soft wide pass under the streak */
const GLOW_SPEED = 150;
/** Streak opacity ceiling — the field sits under text */
const MAX_ALPHA = 0.5;
/** Share of the trail erased each frame */
const FADE = 0.3;

const TWO_PI = Math.PI * 2;

type Ink = { line: string; ring: string };

function readInk(): Ink {
    const cs = getComputedStyle(document.documentElement);
    return {
        line: cs.getPropertyValue("--text").trim() || "#f2efe9",
        ring: cs.getPropertyValue("--text-3").trim() || "#8a847a",
    };
}

/** Starts the field on `canvas`; returns a function that stops it. */
export function startVortexStreet(canvas: HTMLCanvasElement): () => void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const ink = readInk();

    let w = 0;
    let h = 0;
    let tracerCount = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let onScreen = true;

    // Tracers: typed arrays mutated in place, no per-frame allocation.
    const tx = new Float32Array(MAX_TRACERS);
    const ty = new Float32Array(MAX_TRACERS);
    let seeded = 0;

    // Vortices: fixed capacity, slots reused.
    const vActive = new Uint8Array(MAX_VORTICES);
    const vx = new Float32Array(MAX_VORTICES);
    const vy = new Float32Array(MAX_VORTICES);
    const vg = new Float32Array(MAX_VORTICES);
    const vBirth = new Float32Array(MAX_VORTICES);
    const vEff = new Float32Array(MAX_VORTICES);
    const activeIdx = new Int32Array(MAX_VORTICES);

    const spawnVortex = (x: number, y: number, gamma: number, now: number) => {
        let slot = 0;
        let oldest = Infinity;
        for (let i = 0; i < MAX_VORTICES; i++) {
            if (!vActive[i]) {
                slot = i;
                break;
            }
            if (vBirth[i] < oldest) {
                oldest = vBirth[i];
                slot = i;
            }
        }
        vActive[slot] = 1;
        vx[slot] = x;
        vy[slot] = y;
        vg[slot] = gamma;
        vBirth[slot] = now;
    };

    // Driver. A random phase so each visit starts from a different spot;
    // orbit time runs only while frames are drawn, so pausing doesn't jump.
    let orbitT = Math.random() * 60;
    let orbitScale = 1;
    let driverX = 0;
    let driverY = 0;
    let driverInit = false;
    let shedSign = 1;
    let travel = 0;

    const orbitX = (t: number) => w * (0.5 + ORBIT_AX * Math.sin(ORBIT_WX * t + 1.3));
    const orbitY = (t: number) => h * (0.5 + ORBIT_AY * Math.sin(ORBIT_WY * t));

    const step = (now: number, dt: number) => {
        // Decay and prune vortices, collect the live ones.
        let nActive = 0;
        for (let i = 0; i < MAX_VORTICES; i++) {
            if (!vActive[i]) continue;
            const eff = vg[i] * Math.exp(-(now - vBirth[i]) / SHED_TAU);
            if (eff > -GAMMA_PRUNE && eff < GAMMA_PRUNE) {
                vActive[i] = 0;
                continue;
            }
            vEff[i] = eff;
            activeIdx[nActive++] = i;
        }

        // Move the driver along its orbit.
        orbitT += dt * orbitScale;
        const nextX = orbitX(orbitT);
        const nextY = orbitY(orbitT);
        if (!driverInit) {
            driverX = nextX;
            driverY = nextY;
            driverInit = true;
        }
        const dvx = nextX - driverX;
        const dvy = nextY - driverY;
        driverX = nextX;
        driverY = nextY;
        const dist = Math.sqrt(dvx * dvx + dvy * dvy);
        const speed = dt > 0 ? dist / dt : 0;

        // Shed every SHED_SPACING px of travel, alternating sides and sign:
        // the two rows of the street.
        travel += dist;
        if (travel >= SHED_SPACING && dist > 0) {
            travel -= SHED_SPACING;
            const ux = dvx / dist;
            const uy = dvy / dist;
            const s = Math.min(SHED_SPEED_HI, Math.max(SHED_SPEED_LO, speed));
            spawnVortex(
                driverX - ux * 12 - uy * 10 * shedSign,
                driverY - uy * 12 + ux * 10 * shedSign,
                shedSign * SHED_GAMMA_PER_SPEED * s,
                now,
            );
            shedSign = -shedSign;
        }

        // Fade the previous frame towards transparency.
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = FADE;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";

        // Faint turning rings mark the vortex centres. They are redrawn on
        // the fading trail each frame, so they read ~3x stronger than alpha.
        ctx.strokeStyle = ink.ring;
        ctx.lineWidth = 1;
        const r = CORE_R * 0.85;
        for (let a = 0; a < nActive; a++) {
            const i = activeIdx[a];
            const eff = vEff[i];
            const mag = eff < 0 ? -eff : eff;
            const alpha = 0.04 * Math.min(1, mag / 40000);
            if (alpha < 0.005) continue;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(vx[i], vy[i], r, 0, TWO_PI);
            const ang = (eff > 0 ? 1 : -1) * now * 1.4 + i * 1.7;
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            ctx.moveTo(vx[i] + ca * r, vy[i] + sa * r);
            ctx.lineTo(vx[i] + ca * (r + 5), vy[i] + sa * (r + 5));
            ctx.stroke();
        }

        // Advect tracers and draw them as velocity-aligned streaks.
        const coreR2 = CORE_R * CORE_R;
        ctx.strokeStyle = ink.line;
        for (let p = 0; p < tracerCount; p++) {
            const x = tx[p];
            const y = ty[p];
            let velX = AMBIENT_X;
            let velY = AMBIENT_Y;
            for (let a = 0; a < nActive; a++) {
                const i = activeIdx[a];
                const dx = x - vx[i];
                const dy = y - vy[i];
                const r2 = Math.max(dx * dx + dy * dy, 1e-6);
                // Lamb–Oseen: v_θ = Γ(1 − e^{−r²/rc²}) / 2πr, as a factor on (−dy, dx)
                const f = (vEff[i] * (1 - Math.exp(-r2 / coreR2))) / (TWO_PI * r2);
                velX -= dy * f;
                velY += dx * f;
            }

            let nx = x + velX * dt;
            let ny = y + velY * dt;
            if (nx < -6) nx = w + 6;
            else if (nx > w + 6) nx = -6;
            if (ny < -6) ny = h + 6;
            else if (ny > h + 6) ny = -6;
            tx[p] = nx;
            ty[p] = ny;

            const sp = Math.sqrt(velX * velX + velY * velY);
            const x0 = nx - velX * STREAK_K;
            const y0 = ny - velY * STREAK_K;

            if (sp > GLOW_SPEED) {
                ctx.lineWidth = 3;
                ctx.globalAlpha = Math.min(0.16, (sp - GLOW_SPEED) * 0.0008 + 0.04);
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(nx, ny);
                ctx.stroke();
            }
            ctx.lineWidth = 1.1;
            ctx.globalAlpha = Math.min(MAX_ALPHA, sp * 0.0025 + 0.07);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(nx, ny);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
        const dt = Math.min((t - (last || t)) / 1000, 1 / 30);
        last = t;
        step(t / 1000, dt);
        raf = requestAnimationFrame(loop);
    };

    const wake = () => {
        if (running || w === 0 || !onScreen || document.hidden) return;
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
    };

    const sleep = () => {
        cancelAnimationFrame(raf);
        running = false;
    };

    // Reduced motion: one still frame of streamlines through a fixed street.
    const drawStatic = () => {
        ctx.clearRect(0, 0, w, h);
        const sx = [0.3, 0.44, 0.58, 0.72];
        const sg = [52000, -52000, 52000, -52000];
        const cy = (i: number) => h * (i % 2 === 0 ? 0.44 : 0.56);
        const coreR2 = CORE_R * CORE_R;

        ctx.strokeStyle = ink.line;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.22;
        const seeds = 26;
        for (let s = 0; s < seeds; s++) {
            let x = -4;
            let y = (h * (s + 0.5)) / seeds;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (let k = 0; k < 300; k++) {
                let ux = AMBIENT_X * 2.4;
                let uy = 0;
                for (let i = 0; i < 4; i++) {
                    const dx = x - sx[i] * w;
                    const dy = y - cy(i);
                    const r2 = Math.max(dx * dx + dy * dy, 1e-6);
                    const f = (sg[i] * (1 - Math.exp(-r2 / coreR2))) / (TWO_PI * r2);
                    ux -= dy * f;
                    uy += dx * f;
                }
                x += ux * 0.02;
                y += uy * 0.02;
                if (x < -8 || x > w + 8 || y < -8 || y > h + 8) break;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        ctx.strokeStyle = ink.ring;
        ctx.globalAlpha = 0.25;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(sx[i] * w, cy(i), CORE_R * 0.85, 0, TWO_PI);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    const applyMode = () => {
        if (w === 0) return;
        if (reduced) {
            sleep();
            drawStatic();
        } else {
            wake();
        }
    };

    const onMotionPref = () => {
        reduced = mq.matches;
        ctx.clearRect(0, 0, w, h);
        applyMode();
    };

    const resize = () => {
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        // Zero size: hidden by display:none (a cached page) or not laid out yet.
        if (cw < 4 || ch < 4) {
            w = 0;
            h = 0;
            sleep();
            return;
        }
        w = cw;
        h = ch;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        tracerCount = Math.min(
            MAX_TRACERS,
            Math.max(MIN_TRACERS, Math.round((w * h) / TRACER_AREA)),
        );
        // Seed only the tracers that have never been placed; keep the rest.
        for (let p = seeded; p < tracerCount; p++) {
            tx[p] = Math.random() * w;
            ty[p] = Math.random() * h;
        }
        seeded = Math.max(seeded, tracerCount);

        // The orbit's peak speed scales with the canvas; on narrow screens
        // speed time up so the driver still sheds a street.
        const peak = Math.hypot(w * ORBIT_AX * ORBIT_WX, h * ORBIT_AY * ORBIT_WY);
        orbitScale = Math.max(1, ORBIT_MIN_SPEED / peak);
        // The orbit moved with the size: don't count the jump as travel.
        driverInit = false;
        travel = 0;

        applyMode();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Off screen (scrolled past the hero) there's nothing to draw.
    const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !reduced) wake();
        else sleep();
    });
    io.observe(canvas);

    const onVisibility = () => {
        if (document.hidden) sleep();
        else if (!reduced) wake();
    };

    mq.addEventListener("change", onMotionPref);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return () => {
        ro.disconnect();
        io.disconnect();
        mq.removeEventListener("change", onMotionPref);
        document.removeEventListener("visibilitychange", onVisibility);
        sleep();
    };
}
