import { useEffect } from 'react'
import '../styles/motion.css'

export default function MotionEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let pointerFrameId = 0
    let progressFrameId = 0
    const cursor = document.querySelector('.cursor-glow')
    const cursorDot = document.querySelector('.cursor-dot')
    const progress = document.querySelector('.scroll-progress')
    const updatePointer = (event) => {
      if (pointerFrameId) return
      pointerFrameId = window.requestAnimationFrame(() => {
        cursor?.style.setProperty('--cursor-x', `${event.clientX}px`)
        cursor?.style.setProperty('--cursor-y', `${event.clientY}px`)
        cursorDot?.style.setProperty('--cursor-x', `${event.clientX}px`)
        cursorDot?.style.setProperty('--cursor-y', `${event.clientY}px`)
        cursor?.classList.add('is-active')
        cursorDot?.classList.add('is-active')
        cursor?.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, select, .product-card')))
        pointerFrameId = 0
      })
    }
    const updateProgress = () => {
      if (!progress || progressFrameId) return
      progressFrameId = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const percentage = scrollable > 0 ? window.scrollY / scrollable : 0
        progress.style.transform = `scaleX(${percentage})`
        progressFrameId = 0
      })
    }
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(updateProgress) : null
    resizeObserver?.observe(document.body)
    document.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
    updateProgress()
    return () => {
      document.removeEventListener('pointermove', updatePointer)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      resizeObserver?.disconnect()
      if (pointerFrameId) window.cancelAnimationFrame(pointerFrameId)
      if (progressFrameId) window.cancelAnimationFrame(progressFrameId)
    }
  }, [])

  return <><div className="scroll-progress" aria-hidden="true" /><div className="cursor-glow" aria-hidden="true" /><div className="cursor-dot" aria-hidden="true" /></>
}
