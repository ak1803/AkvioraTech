import React, { useEffect, useRef } from 'react';

export const WebGLBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = cv.getContext('webgl');
    if (!gl) return;

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs =
      'precision mediump float;uniform vec2 r,m;uniform float t;void main(){vec2 q=(gl_FragCoord.xy/r-.5)*vec2(r.x/r.y,1.);vec2 w=q*2.2+(m-.5)*.5;for(int i=1;i<5;i++){float f=float(i);w+=.45/f*vec2(sin(w.y*f+t*.35+f),cos(w.x*f-t*.3+f));}float n=.5+.5*sin(w.x+w.y+t*.2);vec3 col=mix(vec3(.02,.04,.09),vec3(.04,.42,.55),smoothstep(.25,.95,n));col=mix(col,vec3(.33,.36,.95),smoothstep(.6,1.,.5+.5*sin(w.x*1.3-w.y+t*.15))*.5);col*=.35+.65*smoothstep(1.3,.1,length(q));gl_FragColor=vec4(col,1.);}';

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const pr = gl.createProgram();
    const vShader = compileShader(gl.VERTEX_SHADER, vs);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!pr || !vShader || !fShader) return;

    gl.attachShader(pr, vShader);
    gl.attachShader(pr, fShader);
    gl.linkProgram(pr);

    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;

    gl.useProgram(pr);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const lp = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(lp);
    gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);

    const ur = gl.getUniformLocation(pr, 'r');
    const um = gl.getUniformLocation(pr, 'm');
    const ut = gl.getUniformLocation(pr, 't');

    let mx = 0.5;
    let my = 0.5;
    let sx = 0.5;
    let sy = 0.5;
    let animFrameId = 0;
    let lastRenderTime = 0;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const d = isMobile ? 0.4 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      cv.width = Math.floor(window.innerWidth * d);
      cv.height = Math.floor(window.innerHeight * d);
      gl.viewport(0, 0, cv.width, cv.height);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const renderLoop = (ts: number) => {
      const isMobile = window.innerWidth < 768;
      // On mobile, cap canvas refresh interval (~33ms / 30fps) to save battery and leave main thread completely free for touch scrolling
      if (isMobile && ts - lastRenderTime < 32) {
        animFrameId = requestAnimationFrame(renderLoop);
        return;
      }
      lastRenderTime = ts;

      sx += (mx - sx) * 0.04;
      sy += (my - sy) * 0.04;
      const sp = window.scrollY / Math.max(window.innerHeight, 1);
      gl.uniform2f(ur, cv.width, cv.height);
      gl.uniform2f(um, sx, sy);
      gl.uniform1f(ut, reduce ? 3 : ts / 1000 + (isMobile ? sp * 0.4 : sp * 1.8));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gl"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-85 transition-opacity duration-700"
    />
  );
};
