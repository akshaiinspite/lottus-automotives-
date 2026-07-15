import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const HeroScrollSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // References for loaded and processed background-free assets (canvas elements)
  const assetsRef = useRef<{
    original: HTMLCanvasElement | null
    front: HTMLCanvasElement | null
    side: HTMLCanvasElement | null
    rear: HTMLCanvasElement | null
    engBlock: HTMLCanvasElement | null
    engPistons: HTMLCanvasElement | null
    engCrank: HTMLCanvasElement | null
    engValves: HTMLCanvasElement | null
    engTurbos: HTMLCanvasElement | null
    engInjectors: HTMLCanvasElement | null
    engIntake: HTMLCanvasElement | null
    engFull: HTMLCanvasElement | null
  }>({
    original: null,
    front: null,
    side: null,
    rear: null,
    engBlock: null,
    engPistons: null,
    engCrank: null,
    engValves: null,
    engTurbos: null,
    engInjectors: null,
    engIntake: null,
    engFull: null
  })

  // Animation values
  const scrollProgressRef = useRef<number>(0)
  const lerpProgressRef = useRef<number>(0)
  const animationFrameIdRef = useRef<number | null>(null)

  // Monitor screen width changes for responsive overlay positioning
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // High-performance programmatic background removal filter
  const processImageBackground = (img: HTMLImageElement, name: string): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return canvas

    ctx.drawImage(img, 0, 0)
    
    // Bypass background removal for engine assembly renders to preserve original CGI ray-traced shadows and gold paint quality
    if (name.startsWith('eng')) {
      return canvas
    }
    
    try {
      const imgData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imgData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i+1]
        const b = data[i+2]

        const maxC = Math.max(r, g, b)
        const minC = Math.min(r, g, b)
        const spread = (maxC - minC) / 255
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

        let alpha = 1

        if (maxC < 14) {
          alpha = maxC / 14
        } else if (spread < 0.09) {
          if (lum > 0.16) {
            alpha = 0
          } else if (lum > 0.08) {
            alpha = (lum - 0.08) / 0.08
            alpha = 1 - alpha
          }
        }

        data[i+3] = Math.min(data[i+3], Math.floor(alpha * 255))
      }

      ctx.putImageData(imgData, 0, 0)
    } catch (err) {
      console.error('Failed to remove background from image:', err)
    }

    return canvas
  }

  // Preload and process all assets
  useEffect(() => {
    const assets = [
      { name: 'original', url: '/pexels-miguel-mallari-3716324-5549656.jpg' },
      { name: 'front', url: '/bmw_m4_front_view.png' },
      { name: 'side', url: '/bmw_m4_side_view.png' },
      { name: 'rear', url: '/bmw_m4_rear_view.png' },
      { name: 'engBlock', url: '/engine_part_block.png' },
      { name: 'engPistons', url: '/engine_part_pistons.png' },
      { name: 'engCrank', url: '/engine_part_crankshaft.png' },
      { name: 'engValves', url: '/engine_part_valves.png' },
      { name: 'engTurbos', url: '/engine_part_turbos.png' },
      { name: 'engInjectors', url: '/engine_part_injectors.png' },
      { name: 'engIntake', url: '/engine_part_intake.png' },
      { name: 'engFull', url: '/engine_part_full.png' }
    ]

    let loadedCount = 0

    assets.forEach(asset => {
      const img = new Image()
      img.src = asset.url
      img.onload = () => {
        const processedCanvas = processImageBackground(img, asset.name)
        assetsRef.current[asset.name as keyof typeof assetsRef.current] = processedCanvas
        
        loadedCount++
        const progress = Math.round((loadedCount / assets.length) * 100)
        setLoadProgress(progress)

        if (loadedCount === assets.length) {
          setTimeout(() => {
            setLoading(false)
          }, 600)
        }
      }
      img.onerror = () => {
        console.error(`Failed to load image asset: ${asset.url}`)
        loadedCount++
        if (loadedCount === assets.length) {
          setLoading(false)
        }
      }
    })

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  // GSAP ScrollTrigger setup. Pins the 100vh container for a clean 250vh scroll span.
  useEffect(() => {
    if (loading || !containerRef.current) return

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=250%', // Reduced scroll distance for responsive speed
      pin: true,
      pinSpacing: true, // Smooth page layout spacing (no overlapping blank sections)
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
      }
    })

    return () => {
      scrollTriggerInstance.kill()
    }
  }, [loading])

  // Canvas render loop
  useEffect(() => {
    if (loading) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // Bounding polygons for vehicle breakdown view
    const hoodPoly = [
      { x: 0.43, y: 0.47 },
      { x: 0.70, y: 0.44 },
      { x: 0.90, y: 0.51 },
      { x: 0.81, y: 0.60 },
      { x: 0.55, y: 0.58 }
    ]
    const doorPoly = [
      { x: 0.21, y: 0.48 },
      { x: 0.43, y: 0.46 },
      { x: 0.40, y: 0.68 },
      { x: 0.20, y: 0.66 }
    ]
    const trunkPoly = [
      { x: 0.07, y: 0.49 },
      { x: 0.17, y: 0.45 },
      { x: 0.18, y: 0.55 },
      { x: 0.07, y: 0.55 }
    ]
    const leftMirrorPoly = [
      { x: 0.31, y: 0.41 },
      { x: 0.36, y: 0.41 },
      { x: 0.36, y: 0.46 },
      { x: 0.31, y: 0.46 }
    ]
    const rightMirrorPoly = [
      { x: 0.58, y: 0.42 },
      { x: 0.62, y: 0.42 },
      { x: 0.62, y: 0.47 },
      { x: 0.58, y: 0.47 }
    ]
    const frontWheelPoly = [
      { x: 0.42, y: 0.56 },
      { x: 0.58, y: 0.56 },
      { x: 0.58, y: 0.76 },
      { x: 0.42, y: 0.76 }
    ]
    const rearWheelPoly = [
      { x: 0.06, y: 0.53 },
      { x: 0.20, y: 0.53 },
      { x: 0.20, y: 0.72 },
      { x: 0.06, y: 0.72 }
    ]

    const getPolyCenter = (poly: { x: number; y: number }[]) => {
      let sx = 0, sy = 0
      poly.forEach(pt => {
        sx += pt.x
        sy += pt.y
      })
      return { x: sx / poly.length, y: sy / poly.length }
    }

    const drawPart = (
      img: HTMLCanvasElement | HTMLImageElement,
      drawX: number,
      drawY: number,
      drawW: number,
      drawH: number,
      poly: { x: number; y: number }[],
      dx: number,
      dy: number,
      scale = 1,
      opacity = 1
    ) => {
      ctx.save()
      ctx.globalAlpha = opacity

      ctx.beginPath()
      poly.forEach((pt, i) => {
        const px = drawX + pt.x * drawW
        const py = drawY + pt.y * drawH
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      ctx.clip()

      ctx.translate(dx, dy)
      if (scale !== 1) {
        const center = getPolyCenter(poly)
        const cx = drawX + center.x * drawW
        const cy = drawY + center.y * drawH
        ctx.translate(cx, cy)
        ctx.scale(scale, scale)
        ctx.translate(-cx, -cy)
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      ctx.restore()
    }

    const render = () => {
      const width = canvas.width
      const height = canvas.height

      // Background reset
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Smooth lag interpolation for scroll positioning
      lerpProgressRef.current += (scrollProgressRef.current - lerpProgressRef.current) * 0.08
      const p = lerpProgressRef.current

      // Frame mapping
      const totalFrames = 55
      const frameFloat = p * (totalFrames - 1) + 1
      const frame = Math.max(1, Math.min(totalFrames, Math.floor(frameFloat)))

      // References
      const originalImg = assetsRef.current.original
      const frontImg = assetsRef.current.front
      const sideImg = assetsRef.current.side
      const rearImg = assetsRef.current.rear
      
      const engBlock = assetsRef.current.engBlock
      const engPistons = assetsRef.current.engPistons
      const engCrank = assetsRef.current.engCrank
      const engValves = assetsRef.current.engValves
      const engTurbos = assetsRef.current.engTurbos
      const engInjectors = assetsRef.current.engInjectors
      const engIntake = assetsRef.current.engIntake
      const engFull = assetsRef.current.engFull

      if (!originalImg || !frontImg || !sideImg || !rearImg) {
        animationFrameIdRef.current = requestAnimationFrame(render)
        return
      }

      const imgW = originalImg.width
      const imgH = originalImg.height
      const imgAspect = imgW / imgH
      const canvasAspect = width / height

      let drawW, drawH, drawX, drawY
      
      // Professional object-fit: cover scaling logic to guarantee full viewport coverage
      if (canvasAspect > imgAspect) {
        drawW = width * 1.05
        drawH = drawW / imgAspect
      } else {
        drawH = height * 1.05
        drawW = drawH * imgAspect
      }
      drawX = (width - drawW) / 2
      drawY = (height - drawH) / 2

      // Draw subtle ambient studio lights background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * 0.45, 10,
        width / 2, height * 0.5, Math.max(width, height) * 0.65
      )
      bgGrad.addColorStop(0, 'rgba(24, 28, 35, 0.35)')
      bgGrad.addColorStop(0.5, 'rgba(10, 11, 14, 0.15)')
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 1)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // --- TIMELINE SEQUENCES ---

      if (frame >= 1 && frame <= 7) {
        // --- SEQUENCE 1: REVEAL & INTRO ---
        if (frameFloat < 2) {
          // Fade in Front View
          const revealP = frameFloat - 1
          ctx.save()
          ctx.globalAlpha = revealP * 0.75
          ctx.drawImage(frontImg, drawX, drawY, drawW, drawH)

          // Front grille focus vignette mask
          const centerG = { x: drawX + drawW * 0.5, y: drawY + drawH * 0.59 }
          const vig = ctx.createRadialGradient(
            centerG.x, centerG.y, 5,
            centerG.x, centerG.y, drawW * 0.25
          )
          vig.addColorStop(0, 'rgba(0,0,0,0)')
          vig.addColorStop(0.7, 'rgba(0,0,0,0.6)')
          vig.addColorStop(1, 'rgba(0,0,0,1)')
          ctx.fillStyle = vig
          ctx.fillRect(0, 0, width, height)
          ctx.restore()
        }
        else if (frameFloat < 3) {
          // Front -> Original beauty angle
          const transitionP = frameFloat - 2
          ctx.save()
          ctx.globalAlpha = 1 - transitionP
          ctx.drawImage(frontImg, drawX, drawY, drawW, drawH)

          ctx.globalAlpha = transitionP
          ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)
          ctx.restore()

          // Diagonal studio scanner sweep
          const sweepX = drawX + drawW * (transitionP * 1.5 - 0.25)
          const sweepGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0)
          sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
          sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)')
          sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = sweepGrad
          ctx.fillRect(drawX, drawY, drawW, drawH)
        }
        else if (frameFloat < 4) {
          // Original -> Wheel Close-up
          const detailP = frameFloat - 3
          const wheelX = 0.51, wheelY = 0.65
          const targetScale = 2.8

          ctx.save()
          const currentScale = 1 + (targetScale - 1) * detailP
          const currentX = drawX - (wheelX * drawW) * (currentScale - 1)
          const currentY = drawY - (wheelY * drawH) * (currentScale - 1)
          ctx.drawImage(originalImg, currentX, currentY, drawW * currentScale, drawH * currentScale)
          ctx.restore()
        }
        else if (frameFloat < 5) {
          // Wheel -> Headlight Close-up
          const detailP = frameFloat - 4
          const wheelX = 0.51, wheelY = 0.65
          const headX = 0.65, headY = 0.54
          const targetScale = 3.2

          const tx = wheelX + (headX - wheelX) * detailP
          const ty = wheelY + (headY - wheelY) * detailP

          ctx.save()
          const currentX = drawX - (tx * drawW) * (targetScale - 1)
          const currentY = drawY - (ty * drawH) * (targetScale - 1)
          ctx.drawImage(originalImg, currentX, currentY, drawW * targetScale, drawH * targetScale)

          if (detailP > 0.4) {
            const hx = currentX + headX * drawW * targetScale
            const hy = currentY + headY * drawH * targetScale
            const glow = ctx.createRadialGradient(hx, hy, 2, hx, hy, 40)
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
            glow.addColorStop(0.3, 'rgba(0, 180, 255, 0.45)')
            glow.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(hx, hy, 40, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
        else if (frameFloat < 6) {
          // Headlight -> Side Profile outline
          const detailP = frameFloat - 5
          const headX = 0.65, headY = 0.54
          const targetScale = 3.2

          ctx.save()
          ctx.globalAlpha = 1 - detailP
          const currentX = drawX - (headX * drawW) * (targetScale - 1) * (1 - detailP)
          const currentY = drawY - (headY * drawH) * (targetScale - 1) * (1 - detailP)
          ctx.drawImage(originalImg, currentX, currentY, drawW * (1 + (targetScale - 1) * (1 - detailP)), drawH * (1 + (targetScale - 1) * (1 - detailP)))

          ctx.globalAlpha = detailP
          ctx.drawImage(sideImg, drawX, drawY, drawW, drawH)

          // Glowing side body laser accents
          ctx.strokeStyle = '#EE7723'
          ctx.shadowColor = '#EE7723'
          ctx.shadowBlur = 10
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(drawX + 0.15 * drawW, drawY + 0.52 * drawH)
          ctx.quadraticCurveTo(drawX + 0.5 * drawW, drawY + 0.48 * drawH, drawX + 0.85 * drawW, drawY + 0.51 * drawH)
          ctx.moveTo(drawX + 0.28 * drawW, drawY + 0.47 * drawH)
          ctx.bezierCurveTo(
            drawX + 0.45 * drawW, drawY + 0.26 * drawH,
            drawX + 0.65 * drawW, drawY + 0.29 * drawH,
            drawX + 0.81 * drawW, drawY + 0.46 * drawH
          )
          ctx.moveTo(drawX + 0.21 * drawW, drawY + 0.67 * drawH)
          ctx.lineTo(drawX + 0.77 * drawW, drawY + 0.67 * drawH)
          ctx.stroke()
          ctx.shadowBlur = 0
          ctx.restore()
        }
        else {
          // Side Profile -> Full Beauty shot with floor reflection
          const beautyP = frameFloat - 6
          ctx.save()
          ctx.globalAlpha = 1 - beautyP
          ctx.drawImage(sideImg, drawX, drawY, drawW, drawH)

          ctx.globalAlpha = beautyP
          ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)

          // Premium reflective studio floor
          ctx.save()
          ctx.scale(1, -1)
          ctx.translate(0, -(drawY + drawH + drawY + drawH - 18))
          ctx.globalAlpha = 0.22 * beautyP
          ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)
          ctx.restore()

          const floorGrad = ctx.createLinearGradient(0, drawY + drawH - 10, 0, height)
          floorGrad.addColorStop(0, 'rgba(0,0,0,0.1)')
          floorGrad.addColorStop(0.2, 'rgba(0,0,0,0.5)')
          floorGrad.addColorStop(1, 'rgba(0,0,0,1)')
          ctx.fillStyle = floorGrad
          ctx.fillRect(0, drawY + drawH - 20, width, height - (drawY + drawH - 20))
          ctx.restore()
        }
      }
      else if (frame >= 8 && frame <= 13) {
        // --- SEQUENCE 2: BODY BREAKDOWN ---
        const breakP = (frameFloat - 8) / 5

        ctx.save()
        // Reflective floor
        ctx.save()
        ctx.scale(1, -1)
        ctx.translate(0, -(drawY + drawH + drawY + drawH - 18))
        ctx.globalAlpha = 0.20 * (1 - breakP * 0.5)
        ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)
        ctx.restore()

        const floorGrad = ctx.createLinearGradient(0, drawY + drawH - 10, 0, height)
        floorGrad.addColorStop(0, 'rgba(0,0,0,0.1)')
        floorGrad.addColorStop(0.2, 'rgba(0,0,0,0.5)')
        floorGrad.addColorStop(1, 'rgba(0,0,0,1)')
        ctx.fillStyle = floorGrad
        ctx.fillRect(0, drawY + drawH - 20, width, height - (drawY + drawH - 20))

        // Inner skeleton blueprint
        ctx.strokeStyle = 'rgba(238, 119, 35, ' + (breakP * 0.4) + ')'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(drawX + 0.12 * drawW, drawY + 0.63 * drawH)
        ctx.lineTo(drawX + 0.85 * drawW, drawY + 0.65 * drawH)
        ctx.lineTo(drawX + 0.81 * drawW, drawY + 0.52 * drawH)
        ctx.lineTo(drawX + 0.20 * drawW, drawY + 0.50 * drawH)
        ctx.closePath()
        ctx.stroke()

        // Distances for panels exploding outwards
        const maxOffset = 70
        const dyHood = -maxOffset * breakP
        const dxHood = -maxOffset * 0.3 * breakP
        
        const dxDoor = -maxOffset * breakP
        const dyDoor = maxOffset * 0.15 * breakP

        const dxTrunk = -maxOffset * 0.8 * breakP
        const dyTrunk = -maxOffset * 0.2 * breakP

        const dyWheels = maxOffset * 0.4 * breakP

        const dxLMirror = -maxOffset * 0.5 * breakP
        const dyLMirror = -maxOffset * 0.5 * breakP
        
        const dxRMirror = maxOffset * 0.5 * breakP
        const dyRMirror = -maxOffset * 0.5 * breakP

        ctx.globalAlpha = 1 - breakP * 0.7
        ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)

        // Draw segmented floating body parts
        drawPart(originalImg, drawX, drawY, drawW, drawH, hoodPoly, dxHood, dyHood, 1 + breakP * 0.02, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, doorPoly, dxDoor, dyDoor, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, trunkPoly, dxTrunk, dyTrunk, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, leftMirrorPoly, dxLMirror, dyLMirror, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, rightMirrorPoly, dxRMirror, dyRMirror, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, frontWheelPoly, 0, dyWheels, 1.04, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, rearWheelPoly, 0, dyWheels, 1.04, 1)

        ctx.restore()
      }
      else if (frame >= 14 && frame <= 24) {
        // --- SEQUENCE 3: TECHNICAL EXPLODED CAD ---
        const expP = (frameFloat - 14) / 10

        ctx.save()
        ctx.globalAlpha = 0.08 * (1 - expP)
        ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)

        // Draw technical background grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
        ctx.lineWidth = 1
        const gridSize = 40
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // Draw glowing CAD blueprint overlays
        ctx.strokeStyle = 'rgba(238, 119, 35, 0.75)'
        ctx.shadowColor = '#EE7723'
        ctx.shadowBlur = 8
        ctx.lineWidth = 1.6

        // Structural chassis frame outline
        ctx.beginPath()
        ctx.moveTo(drawX + 0.15 * drawW, drawY + 0.65 * drawH)
        ctx.lineTo(drawX + 0.85 * drawW, drawY + 0.67 * drawH)
        ctx.lineTo(drawX + 0.78 * drawW, drawY + 0.52 * drawH)
        ctx.lineTo(drawX + 0.22 * drawW, drawY + 0.50 * drawH)
        ctx.closePath()
        ctx.stroke()

        // Structural cross beams
        ctx.beginPath()
        ctx.moveTo(drawX + 0.35 * drawW, drawY + 0.51 * drawH)
        ctx.lineTo(drawX + 0.33 * drawW, drawY + 0.65 * drawH)
        ctx.moveTo(drawX + 0.55 * drawW, drawY + 0.51 * drawH)
        ctx.lineTo(drawX + 0.53 * drawW, drawY + 0.66 * drawH)
        ctx.stroke()

        // Adaptive suspension linkages
        const fx = drawX + 0.51 * drawW
        const fy = drawY + 0.65 * drawH
        const rx = drawX + 0.13 * drawW
        const ry = drawY + 0.61 * drawH

        ctx.strokeStyle = 'rgba(238, 119, 35, 0.85)'
        ctx.beginPath()
        ctx.moveTo(fx, fy)
        ctx.lineTo(fx - 0.05 * drawW, fy - 0.04 * drawH)
        ctx.moveTo(fx, fy + 10)
        ctx.lineTo(fx - 0.05 * drawW, fy + 0.04 * drawH)
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(fx - 0.02 * drawW, fy - 0.04 * drawH + i * 8)
          ctx.lineTo(fx - 0.05 * drawW, fy - 0.04 * drawH + i * 8 + 4)
        }
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(rx, ry)
        ctx.lineTo(rx + 0.04 * drawW, ry - 0.03 * drawH)
        ctx.moveTo(rx, ry + 8)
        ctx.lineTo(rx + 0.04 * drawW, ry + 0.04 * drawH)
        ctx.stroke()

        // Concentric brake discs
        ctx.save()
        ctx.strokeStyle = '#EE7723'
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.arc(fx, fy, 28, 0, Math.PI * 2)
        ctx.arc(fx, fy, 15, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(rx, ry, 22, 0, Math.PI * 2)
        ctx.arc(rx, ry, 11, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Drivetrain / Transmission shaft
        ctx.strokeStyle = 'rgba(0, 180, 255, 0.7)'
        ctx.shadowColor = '#00b4ff'
        const transX = drawX + 0.44 * drawW
        const transY = drawY + 0.58 * drawH
        ctx.beginPath()
        ctx.rect(transX, transY, 0.12 * drawW, 0.05 * drawH)
        ctx.moveTo(transX, transY + 0.025 * drawH)
        ctx.lineTo(rx + 0.04 * drawW, ry + 0.02 * drawH)
        ctx.stroke()

        // Engine schematic cylinder block
        const engX = drawX + 0.62 * drawW
        const engY = drawY + 0.51 * drawH
        const engW = 0.12 * drawW
        const engH = 0.09 * drawH
        ctx.strokeStyle = '#EE7723'
        ctx.shadowColor = '#EE7723'
        ctx.beginPath()
        ctx.rect(engX, engY, engW, engH)
        for (let i = 0; i < 6; i++) {
          ctx.moveTo(engX + (i + 0.6) * (engW / 6.5), engY + engH * 0.4)
          ctx.arc(engX + (i + 0.5) * (engW / 6.5), engY + engH * 0.5, 4, 0, Math.PI * 2)
        }
        ctx.stroke()

        // Interior cockpit seat outlines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.shadowBlur = 0
        const seatX = drawX + 0.33 * drawW
        const seatY = drawY + 0.50 * drawH
        ctx.beginPath()
        ctx.moveTo(seatX, seatY)
        ctx.lineTo(seatX - 10, seatY - 25)
        ctx.lineTo(seatX - 18, seatY - 20)
        ctx.lineTo(seatX - 12, seatY + 5)
        ctx.lineTo(seatX + 10, seatY + 10)
        ctx.lineTo(seatX, seatY)
        
        ctx.moveTo(seatX + 22, seatY - 5)
        ctx.lineTo(seatX + 12, seatY - 30)
        ctx.lineTo(seatX + 4, seatY - 25)
        ctx.lineTo(seatX + 10, seatY)
        ctx.lineTo(seatX + 32, seatY + 5)
        ctx.lineTo(seatX + 22, seatY - 5)
        ctx.stroke()

        // HUD Interactive Data Overlay Callouts
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.font = '500 9px monospace'
        
        const drawHUDLabel = (text: string, tx: number, ty: number, alignLeft = true) => {
          ctx.save()
          ctx.fillStyle = '#EE7723'
          ctx.beginPath()
          ctx.arc(tx, ty, 3, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = 'rgba(238, 119, 35, 0.4)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          
          const lineL = 40
          const lx = alignLeft ? tx - lineL : tx + lineL
          const ly = ty - 15
          ctx.lineTo(lx, ly)
          ctx.lineTo(alignLeft ? lx - 30 : lx + 30, ly)
          ctx.stroke()

          ctx.fillStyle = '#fff'
          ctx.textAlign = alignLeft ? 'right' : 'left'
          ctx.fillText(text, alignLeft ? lx - 35 : lx + 35, ly + 3)
          ctx.restore()
        }

        if (expP > 0.1) drawHUDLabel('3.0L TWIN-POWER I6', engX + engW/2, engY, false)
        if (expP > 0.3) drawHUDLabel('CARBON CORE CHASSIS', drawX + 0.48 * drawW, drawY + 0.50 * drawH, true)
        if (expP > 0.5) drawHUDLabel('ADAPTIVE M SUSPENSION', fx, fy, false)
        if (expP > 0.7) drawHUDLabel('CARBON CERAMIC DISCS', rx, ry, true)

        ctx.restore()
      }
      else if (frame >= 25 && frame <= 30) {
        // --- SEQUENCE 4: DETAILED ENGINE SHOWCASE (8 CGI IMAGES SCROLL SEQUENCE) ---
        const engP = (frameFloat - 25) / 5

        ctx.save()

        const engineImages = [
          { img: engBlock, name: 'STAGE 01: ENGINE BLOCK STRUCTURE' },
          { img: engPistons, name: 'STAGE 02: HIGH-COMPRESSION FORGED PISTONS' },
          { img: engCrank, name: 'STAGE 03: PRECISION-BALANCED CRANKSHAFT' },
          { img: engValves, name: 'STAGE 04: DUAL OVERHEAD CAMSHAFTS & VALVES' },
          { img: engTurbos, name: 'STAGE 05: TWIN-SCROLL M TURBOCHARGERS' },
          { img: engInjectors, name: 'STAGE 06: DFI FUEL INJECTORS & SPARK PLUGS' },
          { img: engIntake, name: 'STAGE 07: CARBON FIBER AIR INTAKE PLENUM' },
          { img: engFull, name: 'STAGE 08: FULLY ASSEMBLED M TWINPOWER TURBO ENGINE' }
        ]

        const allLoaded = engineImages.every(item => item.img !== null)
        if (allLoaded) {
          const stepsCount = engineImages.length - 1
          const rawIdx = engP * stepsCount
          const idx1 = Math.min(stepsCount, Math.floor(rawIdx))
          const idx2 = Math.min(stepsCount, idx1 + 1)
          const localP = rawIdx - idx1

          const item1 = engineImages[idx1]
          const item2 = engineImages[idx2]

          const engineW = item1.img!.width
          const engineH = item1.img!.height
          const engineAspect = engineW / engineH
          
          let eDrawW, eDrawH
          if (canvasAspect > engineAspect) {
            eDrawH = height * 0.88
            eDrawW = eDrawH * engineAspect
          } else {
            eDrawW = width * 0.95
            eDrawH = eDrawW / engineAspect
          }
          const eDrawX = (width - eDrawW) / 2
          const eDrawY = (height - eDrawH) / 2

          // Render cross-fade between sequential engine assembly stages
          ctx.save()
          ctx.globalAlpha = 1 - localP
          ctx.drawImage(item1.img!, eDrawX, eDrawY, eDrawW, eDrawH)
          ctx.restore()

          ctx.save()
          ctx.globalAlpha = localP
          ctx.drawImage(item2.img!, eDrawX, eDrawY, eDrawW, eDrawH)
          ctx.restore()

          // Draw blueprint HUD overlay marks
          ctx.strokeStyle = 'rgba(238, 119, 35, 0.4)'
          ctx.lineWidth = 1
          ctx.beginPath()
          const rx = width / 2
          const ry = height / 2
          ctx.arc(rx, ry, 60, 0, Math.PI * 2)
          ctx.stroke()
          
          ctx.beginPath()
          ctx.moveTo(rx - 80, ry)
          ctx.lineTo(rx - 40, ry)
          ctx.moveTo(rx + 40, ry)
          ctx.lineTo(rx + 80, ry)
          ctx.moveTo(rx, ry - 80)
          ctx.lineTo(rx, ry - 40)
          ctx.moveTo(rx, ry + 40)
          ctx.lineTo(rx, ry + 80)
          ctx.stroke()

          // Render assembly stages text overlay
          ctx.fillStyle = '#ffffff'
          ctx.font = '700 16px var(--font-heading)'
          ctx.letterSpacing = '3px'
          ctx.textAlign = 'center'
          ctx.fillText('ENGINE MECHANICAL ASSEMBLY', width / 2, eDrawY - 45)

          ctx.font = '600 11px monospace'
          ctx.letterSpacing = '1.5px'
          
          const activeLabel = localP < 0.5 ? item1.name : item2.name
          ctx.fillStyle = '#EE7723'
          ctx.fillText(activeLabel, width / 2, eDrawY - 25)
        }

        ctx.restore()
      }
      else if (frame >= 31 && frame <= 40) {
        // --- SEQUENCE 5: REASSEMBLY ---
        const reP = (frameFloat - 31) / 9

        ctx.save()
        // Reflective floor
        ctx.save()
        ctx.scale(1, -1)
        ctx.translate(0, -(drawY + drawH + drawY + drawH - 18))
        ctx.globalAlpha = 0.20 * reP
        ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)
        ctx.restore()

        const floorGrad = ctx.createLinearGradient(0, drawY + drawH - 10, 0, height)
        floorGrad.addColorStop(0, 'rgba(0,0,0,0.1)')
        floorGrad.addColorStop(0.2, 'rgba(0,0,0,0.5)')
        floorGrad.addColorStop(1, 'rgba(0,0,0,1)')
        ctx.fillStyle = floorGrad
        ctx.fillRect(0, drawY + drawH - 20, width, height - (drawY + drawH - 20))

        const remP = 1 - reP
        const maxOffset = 70
        const dyHood = -maxOffset * remP
        const dxHood = -maxOffset * 0.3 * remP
        
        const dxDoor = -maxOffset * remP
        const dyDoor = maxOffset * 0.15 * remP

        const dxTrunk = -maxOffset * 0.8 * remP
        const dyTrunk = -maxOffset * 0.2 * remP

        const dyWheels = maxOffset * 0.4 * remP

        const dxLMirror = -maxOffset * 0.5 * remP
        const dyLMirror = -maxOffset * 0.5 * remP
        
        const dxRMirror = maxOffset * 0.5 * remP
        const dyRMirror = -maxOffset * 0.5 * remP

        ctx.globalAlpha = 0.3 + reP * 0.7
        ctx.drawImage(originalImg, drawX, drawY, drawW, drawH)

        // Draw panels converging
        drawPart(originalImg, drawX, drawY, drawW, drawH, hoodPoly, dxHood, dyHood, 1 + remP * 0.02, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, doorPoly, dxDoor, dyDoor, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, trunkPoly, dxTrunk, dyTrunk, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, leftMirrorPoly, dxLMirror, dyLMirror, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, rightMirrorPoly, dxRMirror, dyRMirror, 1, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, frontWheelPoly, 0, dyWheels, 1.04, 1)
        drawPart(originalImg, drawX, drawY, drawW, drawH, rearWheelPoly, 0, dyWheels, 1.04, 1)

        // Draw magnetic assembly power lines
        ctx.strokeStyle = 'rgba(238, 119, 35, ' + (remP * 0.8) + ')'
        ctx.lineWidth = 1.5
        
        const drawEnergyArc = (sx: number, sy: number, tx: number, ty: number) => {
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.quadraticCurveTo((sx + tx) / 2, sy - 30, tx, ty)
          ctx.stroke()
        }

        if (remP > 0.05) {
          const origHCenter = getPolyCenter(hoodPoly)
          drawEnergyArc(
            drawX + (origHCenter.x) * drawW + dxHood, drawY + (origHCenter.y) * drawH + dyHood,
            drawX + (origHCenter.x) * drawW, drawY + (origHCenter.y) * drawH
          )

          const origDCenter = getPolyCenter(doorPoly)
          drawEnergyArc(
            drawX + (origDCenter.x) * drawW + dxDoor, drawY + (origDCenter.y) * drawH + dyDoor,
            drawX + (origDCenter.x) * drawW, drawY + (origDCenter.y) * drawH
          )

          const origWCenter = getPolyCenter(frontWheelPoly)
          drawEnergyArc(
            drawX + (origWCenter.x) * drawW, drawY + (origWCenter.y) * drawH + dyWheels,
            drawX + (origWCenter.x) * drawW, drawY + (origWCenter.y) * drawH
          )
        }

        ctx.restore()
      }
      else if (frame >= 41 && frame <= 49) {
        // --- SEQUENCE 6: HERO 360 ROTATION ---
        const rotP = (frameFloat - 41) / 8

        ctx.save()
        // Reflective floor with dynamic scale flip
        ctx.save()
        ctx.scale(1, -1)
        ctx.translate(0, -(drawY + drawH + drawY + drawH - 18))
        ctx.globalAlpha = 0.22
        ctx.translate(width/2, 0)
        if (rotP > 0.35 && rotP < 0.85) {
          ctx.scale(-1, 1)
        }
        ctx.translate(-width/2, 0)
        drawRotatedImage(ctx, rotP, originalImg, sideImg, rearImg, frontImg, drawX, drawY, drawW, drawH, width)
        ctx.restore()

        const floorGrad = ctx.createLinearGradient(0, drawY + drawH - 10, 0, height)
        floorGrad.addColorStop(0, 'rgba(0,0,0,0.1)')
        floorGrad.addColorStop(0.2, 'rgba(0,0,0,0.5)')
        floorGrad.addColorStop(1, 'rgba(0,0,0,1)')
        ctx.fillStyle = floorGrad
        ctx.fillRect(0, drawY + drawH - 20, width, height - (drawY + drawH - 20))

        // Draw active rotated frame
        drawRotatedImage(ctx, rotP, originalImg, sideImg, rearImg, frontImg, drawX, drawY, drawW, drawH, width)

        // Gloss panel light sweep
        const sweepX = drawX + drawW * (rotP * 1.6 - 0.3)
        const sweepGrad = ctx.createLinearGradient(sweepX - 100, 0, sweepX + 100, 0)
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.16)')
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = sweepGrad
        ctx.fillRect(drawX, drawY, drawW, drawH)

        ctx.restore()
      }
      else {
        // --- SEQUENCE 7: HEADLIGHT HERO ENDING (Frames 50 to 55) ---
        const endP = (frameFloat - 50) / 5

        ctx.save()
        ctx.drawImage(frontImg, drawX, drawY, drawW, drawH)

        // Reflective floor
        ctx.save()
        ctx.scale(1, -1)
        ctx.translate(0, -(drawY + drawH + drawY + drawH - 18))
        ctx.globalAlpha = 0.22 + endP * 0.15
        ctx.drawImage(frontImg, drawX, drawY, drawW, drawH)
        ctx.restore()

        const floorGrad = ctx.createLinearGradient(0, drawY + drawH - 10, 0, height)
        floorGrad.addColorStop(0, 'rgba(0,0,0,0.1)')
        floorGrad.addColorStop(0.2, 'rgba(0,0,0,0.5)')
        floorGrad.addColorStop(1, 'rgba(0,0,0,1)')
        ctx.fillStyle = floorGrad
        ctx.fillRect(0, drawY + drawH - 20, width, height - (drawY + drawH - 20))

        const hL = { x: drawX + 0.338 * drawW, y: drawY + 0.558 * drawH }
        const hR = { x: drawX + 0.662 * drawW, y: drawY + 0.558 * drawH }

        if (endP > 0.05) {
          ctx.globalCompositeOperation = 'screen'

          const glowRadius = 8 + endP * 28
          
          const drawHeadlightGlow = (hx: number, hy: number) => {
            const glow = ctx.createRadialGradient(hx, hy, 2, hx, hy, glowRadius)
            glow.addColorStop(0, '#ffffff')
            glow.addColorStop(0.2, 'rgba(0, 180, 255, 0.95)')
            glow.addColorStop(0.5, 'rgba(0, 150, 255, 0.4)')
            glow.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(hx, hy, glowRadius, 0, Math.PI * 2)
            ctx.fill()
          }
          drawHeadlightGlow(hL.x, hL.y)
          drawHeadlightGlow(hR.x, hR.y)

          ctx.save()
          const beamOpacity = endP * 0.45
          
          const drawLightBeam = (hx: number, hy: number, isLeft: boolean) => {
            const beamGrad = ctx.createLinearGradient(hx, hy, isLeft ? hx - 120 : hx + 120, height)
            beamGrad.addColorStop(0, 'rgba(255, 255, 255, ' + beamOpacity + ')')
            beamGrad.addColorStop(0.3, 'rgba(0, 180, 255, ' + (beamOpacity * 0.6) + ')')
            beamGrad.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = beamGrad

            ctx.beginPath()
            ctx.moveTo(hx, hy)
            if (isLeft) {
              ctx.lineTo(0, height * 0.95)
              ctx.lineTo(width * 0.4, height * 0.95)
            } else {
              ctx.lineTo(width * 0.6, height * 0.95)
              ctx.lineTo(width, height * 0.95)
            }
            ctx.closePath()
            ctx.fill()
          }

          drawLightBeam(hL.x, hL.y, true)
          drawLightBeam(hR.x, hR.y, false)
          ctx.restore()

          const poolGradL = ctx.createRadialGradient(hL.x - 30, drawY + drawH + 10, 10, hL.x - 50, drawY + drawH + 30, 80)
          poolGradL.addColorStop(0, 'rgba(255, 255, 255, ' + (endP * 0.3) + ')')
          poolGradL.addColorStop(0.5, 'rgba(0, 180, 255, ' + (endP * 0.1) + ')')
          poolGradL.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = poolGradL
          ctx.beginPath()
          ctx.ellipse(hL.x - 30, drawY + drawH + 20, 120, 25, 0, 0, Math.PI * 2)
          ctx.fill()

          const poolGradR = ctx.createRadialGradient(hR.x + 30, drawY + drawH + 10, 10, hR.x + 50, drawY + drawH + 30, 80)
          poolGradR.addColorStop(0, 'rgba(255, 255, 255, ' + (endP * 0.3) + ')')
          poolGradR.addColorStop(0.5, 'rgba(0, 180, 255, ' + (endP * 0.1) + ')')
          poolGradR.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = poolGradR
          ctx.beginPath()
          ctx.ellipse(hR.x + 30, drawY + drawH + 20, 120, 25, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // Draw dark radial/linear gradient on canvas for professional readability when headings are shown
      if (p > 0.8) {
        const textFade = (p - 0.8) / 0.2
        ctx.save()
        ctx.globalAlpha = textFade * 0.82
        let grad
        if (width < 768) {
          grad = ctx.createLinearGradient(0, 0, 0, height)
          grad.addColorStop(0, 'rgba(0, 0, 0, 0.95)')
          grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.65)')
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        } else {
          grad = ctx.createLinearGradient(0, 0, width * 0.58, 0)
          grad.addColorStop(0, 'rgba(0, 0, 0, 0.95)')
          grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.5)')
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        }
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
      }

      // Directly update the overlay DOM elements opacity and transform
      if (overlayRef.current) {
        if (p > 0.8) {
          const fadeProgress = (p - 0.8) / 0.2
          overlayRef.current.style.opacity = `${fadeProgress}`
          overlayRef.current.style.transform = `translateY(${(1 - fadeProgress) * 35}px)`
          overlayRef.current.style.pointerEvents = 'auto'
        } else {
          overlayRef.current.style.opacity = '0'
          overlayRef.current.style.transform = 'translateY(35px)'
          overlayRef.current.style.pointerEvents = 'none'
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    const drawRotatedImage = (
      ctx: CanvasRenderingContext2D,
      progress: number,
      original: HTMLCanvasElement | HTMLImageElement,
      sourceSide: HTMLCanvasElement | HTMLImageElement,
      rear: HTMLCanvasElement | HTMLImageElement,
      front: HTMLCanvasElement | HTMLImageElement,
      drawX: number,
      drawY: number,
      drawW: number,
      drawH: number,
      width: number
    ) => {
      ctx.save()
      
      if (progress < 0.25) {
        const localP = progress / 0.25
        
        ctx.globalAlpha = 1 - localP
        ctx.drawImage(original, drawX, drawY, drawW, drawH)
        
        ctx.globalAlpha = localP
        ctx.drawImage(sourceSide, drawX, drawY, drawW, drawH)
      }
      else if (progress < 0.5) {
        const localP = (progress - 0.25) / 0.25
        
        ctx.globalAlpha = 1 - localP
        ctx.drawImage(sourceSide, drawX, drawY, drawW, drawH)
        
        ctx.globalAlpha = localP
        ctx.drawImage(rear, drawX, drawY, drawW, drawH)
      }
      else if (progress < 0.75) {
        const localP = (progress - 0.5) / 0.25
        
        ctx.globalAlpha = 1 - localP
        ctx.drawImage(rear, drawX, drawY, drawW, drawH)
        
        ctx.globalAlpha = localP
        ctx.save()
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(sourceSide, drawX, drawY, drawW, drawH)
        ctx.restore()
      }
      else {
        const localP = (progress - 0.75) / 0.25
        
        ctx.globalAlpha = 1 - localP
        ctx.save()
        ctx.translate(width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(sourceSide, drawX, drawY, drawW, drawH)
        ctx.restore()
        
        ctx.globalAlpha = localP
        ctx.drawImage(front, drawX, drawY, drawW, drawH)
      }
      ctx.restore()
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [loading])

  return (
    <div ref={containerRef} className="scroll-hero-container" style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#000000' }}>
      {/* Immersive Preloader Screen */}
      {loading && (
        <div className="scroll-hero-preloader" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          fontFamily: "'Outfit', sans-serif"
        }}>
          <div style={{ width: '250px', position: 'relative' }}>
            <div style={{
              fontSize: '11px',
              color: '#EE7723',
              letterSpacing: '5px',
              textAlign: 'center',
              marginBottom: '15px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Initializing CGI Interface
            </div>
            
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${loadProgress}%`,
                height: '100%',
                backgroundColor: '#EE7723',
                boxShadow: '0 0 10px #EE7723',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
            
            <div style={{
              fontSize: '8px',
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
              letterSpacing: '2px',
              fontFamily: 'monospace'
            }}>
              {loadProgress}% LOADING VEHICLE DATA...
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Viewport (Pinned in Place by GSAP) */}
      <div className="scroll-hero-viewport" style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Cinematic Hero Text Overlay (Faded In at Scroll Completion) */}
        <div ref={overlayRef} className="scroll-hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          padding: isMobile ? '0 6%' : '0 8%',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: "'Outfit', sans-serif",
          boxSizing: 'border-box',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
        }}>
          <div style={{
            maxWidth: '620px',
            color: '#ffffff'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#EE7723',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontWeight: 700,
              display: 'block',
              marginBottom: '15px',
              fontFamily: 'monospace'
            }}>
              GT Autohaus
            </span>
            <h1 style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.6rem)',
              lineHeight: '1.15',
              fontWeight: 800,
              margin: '0 0 20px 0',
              textTransform: 'uppercase',
              letterSpacing: '-0.5px'
            }}>
              Drive with Confidence.<br />
              <span style={{
                background: 'linear-gradient(90deg, #EE7723 0%, #ff9d5c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Service with Excellence.
              </span>
            </h1>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.75',
              color: 'rgba(255,255,255,0.72)',
              marginBottom: '35px',
              fontWeight: 400
            }}>
              Experience complete automotive care in Kochi, from routine maintenance to advanced diagnostics
              and luxury vehicle repairs. Our skilled technicians, state-of-the-art equipment, and commitment
              to quality ensure that every journey begins with a vehicle you can trust.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: isMobile ? 'center' : 'flex-start',
              flexWrap: 'wrap'
            }}>
              <a href="/services" className="btn-primary" id="hero-cta-services">
                Explore Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="/contact" className="btn-outline" id="hero-cta-contact">
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
