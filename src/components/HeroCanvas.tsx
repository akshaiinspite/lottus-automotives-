import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

interface HeroCanvasProps {
  images: string[]
}

const HeroCanvas = ({ images }: HeroCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipRotation, setFlipRotation] = useState(0)
  const animRef = useRef<{ progress: number }>({ progress: 0 })
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const texturesRef = useRef<THREE.Texture[]>([])

  // Cycle index automatically
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length
      triggerTransition(nextIndex)
    }, 5500)
    return () => clearInterval(timer)
  }, [currentIndex, images.length])

  const triggerTransition = (nextIndex: number) => {
    if (!materialRef.current || texturesRef.current.length === 0) return

    // Trigger the 3D flip spin rotation
    setFlipRotation(prev => prev + 360)

    // Set next texture to texture2 uniform
    materialRef.current.uniforms.texture2.value = texturesRef.current[nextIndex]
    materialRef.current.uniforms.texture2.value.needsUpdate = true

    // Animate progress from 0 to 1
    animRef.current.progress = 0
    gsap.to(animRef.current, {
      progress: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (materialRef.current) {
          materialRef.current.uniforms.progress.value = animRef.current.progress
        }
      },
      onComplete: () => {
        if (materialRef.current) {
          // Once complete, set texture1 to the finished texture and reset progress to 0
          materialRef.current.uniforms.texture1.value = texturesRef.current[nextIndex]
          materialRef.current.uniforms.texture1.value.needsUpdate = true
          materialRef.current.uniforms.progress.value = 0
          setCurrentIndex(nextIndex)
        }
      }
    })
  }

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    let width = container.clientWidth
    let height = container.clientHeight

    // Scene Setup
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    )
    camera.position.z = 1

    // Renderer — alpha: true + premultipliedAlpha: false for clean PNG transparency
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // fully transparent clear

    // Load Textures
    const textureLoader = new THREE.TextureLoader()
    const textures = images.map((src) => {
      const tex = textureLoader.load(src, () => {
        if (typeof handleResize === 'function') {
          handleResize()
        }
      })
      tex.minFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
    texturesRef.current = textures

    // Shader Material code
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    // Fragment shader with aggressive background removal (white, grey, checkerboard patterns)
    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      uniform float progress;
      uniform float time;
      uniform vec2 scale;
      
      // Aggressive background removal — strips white, grey, and baked checkerboard patterns
      float removeBackground(vec3 rgb) {
        float lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
        
        // Channel spread — how different R, G, B are from each other
        // Checkerboard/grey/white bg pixels have R ≈ G ≈ B (spread ≈ 0)
        // Real car paint always has SOME color tint (spread > 0.03)
        float maxC = max(max(rgb.r, rgb.g), rgb.b);
        float minC = min(min(rgb.r, rgb.g), rgb.b);
        float spread = maxC - minC;
        
        // Perfectly achromatic pixels (R=G=B) at any brightness → background
        // This catches both white squares AND grey squares of the checkerboard
        float achromaticMask = smoothstep(0.04, 0.008, spread);
        
        // Only apply to mid-to-high luminance (don't remove dark car parts like tires/grille)
        float lumGate = smoothstep(0.25, 0.42, lum);
        
        // Combined: achromatic + not too dark = background
        float bgMask = achromaticMask * lumGate;
        
        // Also catch any very bright pixels regardless (near-white highlights in bg)
        float brightWhite = smoothstep(0.88, 0.96, lum);
        
        return max(bgMask, brightWhite);
      }
      
      void main() {
        // Apply object-fit contain texture scaling
        vec2 uv = (vUv - 0.5) * scale + 0.5;
        
        // Discard pixels outside the texture bounds
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          discard;
        }
        
        // Subtle wave distortion during transitions
        float wave = sin(uv.y * 10.0 + time * 1.5) * 0.015;
        float wave2 = cos(uv.x * 10.0 - time * 1.5) * 0.015;
        
        vec2 distortedUv1 = clamp(vec2(uv.x + progress * wave, uv.y + progress * wave2), 0.0, 1.0);
        vec2 distortedUv2 = clamp(vec2(uv.x - (1.0 - progress) * wave, uv.y - (1.0 - progress) * wave2), 0.0, 1.0);
        
        // Sample textures
        vec4 color1 = texture2D(texture1, distortedUv1);
        vec4 color2 = texture2D(texture2, distortedUv2);
        
        // Blend during transitions
        vec4 result = mix(color1, color2, progress);
        
        // Apply aggressive background removal
        float bgMask = removeBackground(result.rgb);
        result.a *= (1.0 - bgMask);
        
        // Discard transparent pixels
        if (result.a < 0.05) {
          discard;
        }
        
        gl_FragColor = result;
      }
    `

    // Helper to calculate object-fit: contain scaling factors
    const getScale = (w: number, h: number) => {
      let imageAspect = 1.0;
      const loadedTex = texturesRef.current.find((t) => t && t.image && (t.image as any).width);
      if (loadedTex && loadedTex.image) {
        const img = loadedTex.image as HTMLImageElement;
        imageAspect = img.width / img.height;
      }
      const containerAspect = w / h;
      let scaleX = 1;
      let scaleY = 1;
      if (containerAspect > imageAspect) {
        scaleX = containerAspect / imageAspect;
      } else {
        scaleY = imageAspect / containerAspect;
      }
      return new THREE.Vector2(scaleX, scaleY);
    }

    // Create a plane that fills the viewport
    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        texture1: { value: textures[0] },
        texture2: { value: textures[0] },
        progress: { value: 0 },
        time: { value: 0 },
        scale: { value: getScale(width, height) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Render loop
    let animationId: number
    const startTime = performance.now()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = (performance.now() - startTime) * 0.001
      }
      renderer.render(scene, camera)
    }
    animate()

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return
      width = containerRef.current.clientWidth
      height = containerRef.current.clientHeight

      camera.left = width / -2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = height / -2
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)

      if (materialRef.current) {
        materialRef.current.uniforms.scale.value.copy(getScale(width, height))
      }

      // Recreate geometry to match new dimensions
      mesh.geometry.dispose()
      mesh.geometry = new THREE.PlaneGeometry(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Clean up
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      textures.forEach((t) => t.dispose())
    }
  }, [images])

  return (
    <div ref={containerRef} className="hero-canvas-container">
      <motion.div
        className="hero-canvas-3d-wrapper"
        animate={{ rotateY: flipRotation }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.div
          className="hero-canvas-motion-wrapper"
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [-10, 0, 10, 0, -10],
            rotate: [0, 2, 0, -2, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <canvas ref={canvasRef} className="hero-canvas" />
        </motion.div>
      </motion.div>
      
      {/* Navigation Indicators */}
      <div className="hero-canvas-nav">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => triggerTransition(i)}
            className={`hero-canvas-dot ${i === currentIndex ? 'hero-canvas-dot--active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCanvas
