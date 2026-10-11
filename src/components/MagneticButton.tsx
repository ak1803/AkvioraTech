'use client';

import React, { useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'gradient' | 'light' | 'outline';
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
  magnetic?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'gradient',
  type = 'button',
  disabled = false,
  ariaLabel,
  magnetic,
}) => {
  const isMagnetic = magnetic ?? variant === 'gradient';

  const variantClasses = {
    gradient:
      'akviora-btn-gradient text-[#04121c] font-medium px-7 py-3.5 rounded-full shadow-[0_0_30px_rgba(92,225,230,0.22)]',
    light:
      'bg-[#EAF4F8] text-[#06101a] font-medium px-5 py-2.5 rounded-full hover:bg-[#5CE1E6] transition-colors',
    outline:
      'border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.03)] text-[#EAF4F8] hover:border-[#5CE1E6] hover:text-[#5CE1E6] px-6 py-3 rounded-full transition-colors',
  }[variant];

  const magneticClasses = isMagnetic
    ? 'transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-[0_0_44px_rgba(92,225,230,0.48)] will-change-transform'
    : '';

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMagnetic || disabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMagnetic) return;
    e.currentTarget.style.transform = '';
  };

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={isMagnetic ? handlePointerMove : undefined}
      onPointerLeave={isMagnetic ? handlePointerLeave : undefined}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${magneticClasses} ${className}`}
    >
      {children}
    </button>
  );
};

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  removeBackground?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  removeBackground = false,
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  React.useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  React.useEffect(() => {
    if (!removeBackground || !src) {
      setProcessedSrc(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const samplePatch = (sx: number, sy: number, pw: number, ph: number) => {
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          let count = 0;
          const xEnd = Math.min(w, sx + pw);
          const yEnd = Math.min(h, sy + ph);
          for (let y = Math.max(0, sy); y < yEnd; y++) {
            for (let x = Math.max(0, sx); x < xEnd; x++) {
              const p = (y * w + x) * 4;
              rSum += data[p];
              gSum += data[p + 1];
              bSum += data[p + 2];
              count++;
            }
          }
          return count > 0
            ? [rSum / count, gSum / count, bSum / count]
            : [8, 12, 20];
        };

        const patchSize = Math.max(6, Math.round(Math.min(w, h) * 0.04));
        const tl = samplePatch(0, 0, patchSize, patchSize);
        const tr = samplePatch(w - patchSize, 0, patchSize, patchSize);
        const bl = samplePatch(0, h - patchSize, patchSize, patchSize);
        const br = samplePatch(
          w - patchSize,
          h - patchSize,
          patchSize,
          patchSize
        );

        const bgR = (tl[0] + tr[0] + bl[0] + br[0]) * 0.25;
        const bgG = (tl[1] + tr[1] + bl[1] + br[1]) * 0.25;
        const bgB = (tl[2] + tr[2] + bl[2] + br[2]) * 0.25;

        const getExpectedBg = (x: number, y: number) => {
          const u = w > 1 ? x / (w - 1) : 0;
          const v = h > 1 ? y / (h - 1) : 0;
          const topR = tl[0] * (1 - u) + tr[0] * u;
          const topG = tl[1] * (1 - u) + tr[1] * u;
          const topB = tl[2] * (1 - u) + tr[2] * u;
          const botR = bl[0] * (1 - u) + br[0] * u;
          const botG = bl[1] * (1 - u) + br[1] * u;
          const botB = bl[2] * (1 - u) + br[2] * u;
          return [
            topR * (1 - v) + botR * v,
            topG * (1 - v) + botG * v,
            topB * (1 - v) + botB * v,
          ];
        };

        const getDistToBg = (idx: number) => {
          const cx = idx % w;
          const cy = (idx - cx) / w;
          const p = idx * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const [er, eg, eb] = getExpectedBg(cx, cy);
          const distLocal = Math.hypot(r - er, g - eg, b - eb);
          const distGlobal = Math.hypot(r - bgR, g - bgG, b - bgB);
          return Math.min(distLocal, distGlobal);
        };

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        let head = 0;
        let tail = 0;

        const canSeedBorder = (idx: number) => {
          const p = idx * 4;
          const maxC = Math.max(data[p], data[p + 1], data[p + 2]);
          const distBg = getDistToBg(idx);
          return maxC < 75 || distBg < 80;
        };

        const enqueueSeed = (x: number, y: number) => {
          const idx = y * w + x;
          if (!visited[idx] && canSeedBorder(idx)) {
            visited[idx] = 1;
            queue[tail++] = idx;
          }
        };

        for (let x = 0; x < w; x++) {
          enqueueSeed(x, 0);
          enqueueSeed(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          enqueueSeed(0, y);
          enqueueSeed(w - 1, y);
        }

        const tryFlood = (currIdx: number, nextIdx: number) => {
          if (visited[nextIdx]) return;
          const cp = currIdx * 4;
          const np = nextIdx * 4;
          const r = data[np];
          const g = data[np + 1];
          const b = data[np + 2];
          const maxC = Math.max(r, g, b);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const stepDist = Math.hypot(
            r - data[cp],
            g - data[cp + 1],
            b - data[cp + 2]
          );
          const distBg = getDistToBg(nextIdx);

          const isDarkBg = maxC < 44;
          const isMatchedBg = distBg < 62;
          const isSmoothVignette =
            stepDist < 16 && distBg < 96 && lum < 105;

          if (isDarkBg || isMatchedBg || isSmoothVignette) {
            visited[nextIdx] = 1;
            queue[tail++] = nextIdx;
          }
        };

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = (curr - cx) / w;
          if (cx > 0) tryFlood(curr, curr - 1);
          if (cx < w - 1) tryFlood(curr, curr + 1);
          if (cy > 0) tryFlood(curr, curr - w);
          if (cy < h - 1) tryFlood(curr, curr + w);
        }

        for (let i = 0; i < w * h; i++) {
          const p = i * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const maxC = Math.max(r, g, b);
          const distBg = getDistToBg(i);

          if (visited[i] || maxC <= 18 || distBg <= 28) {
            data[p + 3] = 0;
          } else {
            const cx = i % w;
            const cy = (i - cx) / w;
            const touchesBg =
              (cx > 0 && visited[i - 1]) ||
              (cx < w - 1 && visited[i + 1]) ||
              (cy > 0 && visited[i - w]) ||
              (cy < h - 1 && visited[i + w]) ||
              (cx > 1 && visited[i - 2]) ||
              (cx < w - 2 && visited[i + 2]) ||
              (cy > 1 && visited[i - w * 2]) ||
              (cy < h - 2 && visited[i + w * 2]);

            if (touchesBg && (distBg < 92 || maxC < 88)) {
              const alphaRatio = Math.min(
                1,
                Math.max(0, (Math.max(distBg, maxC) - 28) / 64)
              );
              const alpha = Math.round(alphaRatio * 255);
              data[p + 3] = alpha;
              if (alpha > 0 && alphaRatio > 0.08) {
                const [er, eg, eb] = getExpectedBg(cx, cy);
                data[p] = Math.min(
                  255,
                  Math.max(0, Math.round((r - er * (1 - alphaRatio)) / alphaRatio))
                );
                data[p + 1] = Math.min(
                  255,
                  Math.max(0, Math.round((g - eg * (1 - alphaRatio)) / alphaRatio))
                );
                data[p + 2] = Math.min(
                  255,
                  Math.max(0, Math.round((b - eb * (1 - alphaRatio)) / alphaRatio))
                );
              }
            } else if (distBg < 44) {
              const alphaRatio = Math.max(0, (distBg - 28) / 16);
              data[p + 3] = Math.round(alphaRatio * 255);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        if (!cancelled) {
          setProcessedSrc(canvas.toDataURL('image/png'));
        }
      } catch {
        // Fallback to CSS blend mode if canvas extraction fails
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, removeBackground]);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0B1526] via-[#0F1F38] to-[#060B14] border border-[rgba(255,255,255,0.11)] ${className}`}
      >
        <div className="w-10 h-10 rounded-full border border-[#5CE1E6]/40 flex items-center justify-center mb-3 text-[#5CE1E6] font-display font-bold">
          A
        </div>
        <span className="font-display text-sm text-[#EAF4F8]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  const blendFallback =
    removeBackground && !processedSrc ? 'opacity-0' : '';

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} ${blendFallback} ${
        !loaded && !removeBackground ? 'akviora-shimmer' : ''
      }`.trim()}
      loading="lazy"
    />
  );
};
