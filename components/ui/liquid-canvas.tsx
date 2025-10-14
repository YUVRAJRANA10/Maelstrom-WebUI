"use client";

import { useEffect, useRef, useState } from "react";

interface LiquidCanvasProps {
  mousePosition: { x: number; y: number };
  className?: string;
}

export function LiquidCanvas({
  mousePosition,
  className = "",
}: LiquidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
  const [program, setProgram] = useState<WebGLProgram | null>(null);
  const [positionBuffer, setPositionBuffer] = useState<WebGLBuffer | null>(
    null
  );
  const [positionLocation, setPositionLocation] = useState<number>(-1);
  const [timeLocation, setTimeLocation] = useState<WebGLUniformLocation | null>(
    null
  );
  const [resolutionLocation, setResolutionLocation] =
    useState<WebGLUniformLocation | null>(null);
  const [mouseLocation, setMouseLocation] =
    useState<WebGLUniformLocation | null>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support
    const glContext = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!glContext) {
      setIsWebGLSupported(false);
      return;
    }
    setGl(glContext);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Simple WebGL liquid effect
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;
        
        // Create flowing liquid effect
        float wave1 = sin(st.x * 10.0 + u_time * 0.5) * 0.1;
        float wave2 = sin(st.y * 8.0 + u_time * 0.3) * 0.1;
        float wave3 = sin(distance(st, mouse) * 20.0 - u_time * 2.0) * 0.05;
        
        float intensity = wave1 + wave2 + wave3;
        
        // Deep blue to cyan gradient with liquid movement
        vec3 color1 = vec3(0.02, 0.08, 0.17); // Deep blue
        vec3 color2 = vec3(0.0, 0.85, 1.0);   // Cyan
        vec3 color3 = vec3(0.17, 0.85, 1.0);  // Light cyan
        
        vec3 finalColor = mix(color1, color2, intensity + 0.3);
        finalColor = mix(finalColor, color3, max(0.0, intensity));
        
        // Add mouse interaction glow
        float mouseDistance = distance(st, mouse);
        float glow = 1.0 - smoothstep(0.0, 0.3, mouseDistance);
        finalColor += glow * vec3(0.0, 0.5, 1.0) * 0.3;
        
        gl_FragColor = vec4(finalColor, 0.8);
      }
    `;

    // Create shader program
    const createShader = (
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(
      glContext,
      glContext.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = createShader(
      glContext,
      glContext.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = glContext.createProgram();
    if (!shaderProgram) return;

    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);
    setProgram(shaderProgram);

    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      positions,
      glContext.STATIC_DRAW
    );
    setPositionBuffer(positionBuffer);

    const positionLocation = glContext.getAttribLocation(
      shaderProgram,
      "a_position"
    );
    setPositionLocation(positionLocation);

    const timeLocation = glContext.getUniformLocation(shaderProgram, "u_time");
    setTimeLocation(timeLocation);

    const resolutionLocation = glContext.getUniformLocation(
      shaderProgram,
      "u_resolution"
    );
    setResolutionLocation(resolutionLocation);

    const mouseLocation = glContext.getUniformLocation(
      shaderProgram,
      "u_mouse"
    );
    setMouseLocation(mouseLocation);
  }, [mousePosition]);

  useEffect(() => {
    if (
      !gl ||
      !program ||
      !positionBuffer ||
      positionLocation === -1 ||
      !timeLocation ||
      !resolutionLocation ||
      !mouseLocation
    )
      return;

    const render = () => {
      const currentTime = (Date.now() - startTime.current) / 1000;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(
        mouseLocation,
        mousePosition.x,
        gl.canvas.height - mousePosition.y
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    gl,
    program,
    positionBuffer,
    positionLocation,
    timeLocation,
    resolutionLocation,
    mouseLocation,
    startTime,
    mousePosition,
  ]);

  // Fallback SVG animation for non-WebGL browsers
  if (!isWebGLSupported) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="liquidGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 216, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(43, 211, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(4, 19, 43, 0.8)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#liquidGradient)" />
          <circle
            cx="500"
            cy="500"
            r="200"
            fill="none"
            stroke="rgba(0, 216, 255, 0.3)"
            strokeWidth="2"
            filter="url(#glow)"
            className="animate-pulse"
          />
          <circle
            cx="300"
            cy="300"
            r="100"
            fill="rgba(43, 211, 255, 0.1)"
            className="animate-float"
          />
          <circle
            cx="700"
            cy="700"
            r="150"
            fill="rgba(0, 216, 255, 0.1)"
            className="animate-float"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>
    );
  }

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className}`} />;
}
