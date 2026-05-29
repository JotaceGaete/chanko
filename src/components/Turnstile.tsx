"use client"

import { useCallback, useEffect, useRef } from "react"
import Script from "next/script"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string
      remove: (id: string) => void
    }
  }
}

export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>("")

  const render = useCallback(() => {
    if (!siteKey || !ref.current || !window.turnstile || widgetId.current) return
    widgetId.current = window.turnstile.render(ref.current, { sitekey: siteKey, callback: onVerify })
  }, [onVerify, siteKey])

  useEffect(() => {
    render()
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = ""
    }
  }, [render])

  if (!siteKey) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        Verificacion anti-bot pendiente de configurar.
      </div>
    )
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer onLoad={render} />
      <div ref={ref} />
    </>
  )
}
