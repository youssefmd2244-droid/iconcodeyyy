import { useEffect, useRef } from "react";

/**
 * Canvas-based animated holographic background with floating hexagons,
 * subtle particles, and scanline effects for a 5D/6D aesthetic.
 */
export function HolographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    // Hexagons
    interface Hex {
      x: number;
      y: number;
      size: number;
      alpha: number;
      rotation: number;
      rotSpeed: number;
      pulsePhase: number;
      color: string;
    }

    const colors = [
      "0, 240, 255",   // cyan
      "123, 47, 255",  // purple
      "255, 0, 170",   // magenta
      "0, 255, 136",   // green
    ];

    let particles: Particle[] = [];
    let hexagons: Hex[] = [];

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width;
      canvas!.height = height;
      initObjects();
    }

    function initObjects() {
      const particleCount = Math.min(Math.floor((width * height) / 25000), 60);
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      }));

      const hexCount = Math.min(Math.floor((width * height) / 120000), 12);
      hexagons = Array.from({ length: hexCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 20 + Math.random() * 50,
        alpha: 0.02 + Math.random() * 0.04,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function drawHexagon(cx: number, cy: number, size: number, rotation: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.closePath();
    }

    let time = 0;

    function animate() {
      time += 0.016;
      ctx!.clearRect(0, 0, width, height);

      // Draw hexagons
      for (const hex of hexagons) {
        hex.rotation += hex.rotSpeed;
        hex.pulsePhase += 0.01;
        const pulseAlpha = hex.alpha * (0.7 + 0.3 * Math.sin(hex.pulsePhase));

        drawHexagon(hex.x, hex.y, hex.size, hex.rotation);
        ctx!.strokeStyle = `rgba(${hex.color}, ${pulseAlpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        // Inner glow
        drawHexagon(hex.x, hex.y, hex.size * 0.6, hex.rotation);
        ctx!.strokeStyle = `rgba(${hex.color}, ${pulseAlpha * 0.5})`;
        ctx!.lineWidth = 0.3;
        ctx!.stroke();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx!.fill();

        // Glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fill();
      }

      // Draw connection lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.06;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      // Subtle scanline
      const scanY = (time * 30) % (height + 100) - 50;
      const scanGrad = ctx!.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, "rgba(0, 240, 255, 0)");
      scanGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.015)");
      scanGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx!.fillStyle = scanGrad;
      ctx!.fillRect(0, scanY - 30, width, 60);

      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
