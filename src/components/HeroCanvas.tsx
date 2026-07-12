import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface HeroCanvasProps {
  images: string[]
}

const HeroCanvas = ({ images }: HeroCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
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

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)

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

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      uniform float progress;
      uniform float time;
      uniform vec2 scale;
      
      void main() {
        // Apply object-fit cover texture scaling
        vec2 uv = (vUv - 0.5) * scale + 0.5;
        
        // Liquid wave wave-distortion equations
        float wave = sin(uv.y * 10.0 + time * 1.5) * 0.03;
        float wave2 = cos(uv.x * 10.0 - time * 1.5) * 0.03;
        
        // Distort UV coordinates based on transition progress
        vec2 distortedUv1 = vec2(uv.x + progress * wave, uv.y + progress * wave2);
        vec2 distortedUv2 = vec2(uv.x - (1.0 - progress) * wave, uv.y - (1.0 - progress) * wave2);
        
        // Prevent UV clamping/bleeding at edges
        distortedUv1 = clamp(distortedUv1, 0.0, 1.0);
        distortedUv2 = clamp(distortedUv2, 0.0, 1.0);
        
        // Liquid ripple blend
        vec4 color1 = texture2D(texture1, distortedUv1);
        vec4 color2 = texture2D(texture2, distortedUv2);
        
        gl_FragColor = mix(color1, color2, progress);
      }
    `

    // Helper to calculate object-fit: cover scaling factors
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
        scaleY = imageAspect / containerAspect;
      } else {
        scaleX = containerAspect / imageAspect;
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
      transparent: true
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
      <canvas ref={canvasRef} className="hero-canvas" />
      
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
