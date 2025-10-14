export const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const simulationFragmentShader = `
  uniform sampler2D textureA;
  uniform vec2 mouse;
  uniform vec2 resolution;
  uniform float time;
  uniform int frame;
  varying vec2 vUv;

  const float delta = 1.4;

  void main() {
    vec2 uv = vUv;

    // Initialize the texture to black on the first frame
    if (frame == 0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y;

    // texelSize is 1.0 / resolution
    vec2 texelSize = 1.0 / resolution;

    // Get the pressure from neighboring pixels
    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left = texture2D(textureA, uv - vec2(texelSize.x, 0.0)).x;
    float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down = texture2D(textureA, uv - vec2(0.0, texelSize.y)).x;

    // Handle boundary conditions
    if (uv.x < texelSize.x) p_left = p_right;
    if (uv.x > 1.0 - texelSize.x) p_right = p_left;
    if (uv.y < texelSize.y) p_down = p_up;
    if (uv.y > 1.0 - texelSize.y) p_up = p_down;

    // Wave equation
    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

    pressure += delta * pVel;

    pVel *= 0.99; // Damping
    pressure *= 0.99; // Decay

    // Use mouse coordinates directly, but flip Y for WebGL coordinate system
    vec2 mouseUV = vec2(mouse.x, 1.0 - mouse.y);
    
    // Calculate distance to mouse in UV space
    float dist = distance(uv, mouseUV);
    float rippleRadius = 0.02; // Smaller radius for more precise ripples
    
    if (dist < rippleRadius) {
        float rippleStrength = 1.0 - (dist / rippleRadius);
        rippleStrength = pow(rippleStrength, 2.0); // Smooth falloff
        pressure += 2.0 * rippleStrength;
    }

    gl_FragColor = vec4(pressure, pVel,
                       (p_right - p_left) / 2.0,
                       (p_up - p_down) / 2.0);
  }
`;

export const renderVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const renderFragmentShader = `
  uniform sampler2D textureA;
  uniform sampler2D textureB;
  varying vec2 vUv;

  void main() {
    vec4 data = texture2D(textureA, vUv);
    vec2 distortion = 0.3 * data.zw;
    vec4 color = texture2D(textureB, vUv + distortion);

    // Basic lighting model for a glass effect
    vec3 normal = normalize(vec3(data.z * -2.0, 0.5, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

    gl_FragColor = color + vec4(specular, specular, specular, 1.0);
  }
`;
