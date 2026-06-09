'use client'

import { useState } from 'react'
import { MapComponent } from '../components/MapComponent'
import {
  Layers,
  ChevronDown,
  Info,
  MapPin,
  AlertTriangle,
  Activity,
  X,
  TreePine,
  Mountain,
} from 'lucide-react'

/* ── Legend pill ────────────────────────────────────────────────── */
function RiskPill({ color, label, pct }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-xs text-white/50 flex-1">{label}</span>
      <span className="text-xs font-mono text-white/30">{pct}%</span>
    </div>
  )
}

export default function PetaPage() {
  const [legendOpen, setLegendOpen] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100vh - 4rem)', background: '#0a0f0d' }}
    >

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div
        className="relative shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b"
        style={{
          background: '#0a0f0d',
          borderColor: 'rgba(255,255,255,0.06)',
          zIndex: 20,
        }}
      >
        {/* Left — title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>

          <div className="min-w-0">
            <h1
              className="text-sm font-black uppercase tracking-widest text-white leading-none"
              style={{ fontFamily: '"Bebas Neue", "Arial Narrow", sans-serif', fontSize: '1.1rem' }}
            >
              Peta Kerentanan Longsor
            </h1>
            <p className="text-xs text-white/30 font-mono mt-0.5 truncate">
              Kabupaten Karo, Sumatera Utara
            </p>
          </div>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Info toggle */}
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors duration-200"
            style={{
              background: infoOpen ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${infoOpen ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: infoOpen ? '#10b981' : 'rgba(255,255,255,0.4)',
              borderRadius: 3,
            }}
          >
            <Info className="h-3 w-3" />
            <span className="hidden sm:inline">Info</span>
          </button>

          {/* Legend toggle */}
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors duration-200"
            style={{
              background: legendOpen ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${legendOpen ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: legendOpen ? '#10b981' : 'rgba(255,255,255,0.4)',
              borderRadius: 3,
            }}
          >
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Legenda</span>
            <ChevronDown
              className="h-3 w-3 transition-transform duration-200"
              style={{ transform: legendOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
      </div>

      {/* ── INFO BANNER (collapsible) ────────────────────────────── */}
      <div
        style={{
          maxHeight: infoOpen ? 120 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
          background: 'rgba(16,185,129,0.05)',
          borderBottom: infoOpen ? '1px solid rgba(16,185,129,0.12)' : 'none',
          zIndex: 15,
          flexShrink: 0,
        }}
      >
        <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-6">
          {[
            { icon: MapPin, label: '17 Kecamatan', sub: 'Wilayah Dipetakan' },
            { icon: Activity, label: '3 Zona Risiko', sub: 'Tingkat Kerentanan' },
            { icon: TreePine, label: 'NDVI + DEM', sub: 'Parameter Analisis' },
            { icon: Mountain, label: '< 2000 mdpl', sub: 'Rentang Elevasi' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-xs text-white/35 font-mono">{sub}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-white/30 self-center ml-auto hidden lg:block">
            Klik marker untuk melihat detail titik kerentanan
          </p>
        </div>
      </div>

      {/* ── MAP AREA ────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0">

        {/* Map fills full area */}
        <div className="absolute inset-0">
          <MapComponent />
        </div>

        {/* Topographic grid overlay (top-left fade) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right, rgba(10,15,13,0.35) 0%, transparent 25%),
              linear-gradient(to bottom, rgba(10,15,13,0.2) 0%, transparent 15%)
            `,
            zIndex: 5,
          }}
        />

        {/* ── LEGEND PANEL (floating, collapsible) ──────────────── */}
        <div
          className="absolute bottom-4 left-4 pointer-events-auto"
          style={{ zIndex: 10 }}
        >
          <div
            style={{
              background: 'rgba(10,15,13,0.92)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              overflow: 'hidden',
              width: 200,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: legendOpen ? 1 : 0,
              transform: legendOpen ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: legendOpen ? 'auto' : 'none',
            }}
          >
            {/* Legend header */}
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs font-mono tracking-widest text-white/40 uppercase">
                Zona Risiko
              </span>
              <button
                onClick={() => setLegendOpen(false)}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Legend items */}
            <div className="px-4 py-3 space-y-2.5">
              <RiskPill color="#10b981" label="Rendah"   pct={38} />
              <RiskPill color="#f59e0b" label="Menengah" pct={45} />
              <RiskPill color="#ef4444" label="Tinggi"   pct={17} />
            </div>

            {/* Mini divider + parameter note */}
            <div
              className="px-4 py-2.5 space-y-1.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-1.5">
                <TreePine className="h-2.5 w-2.5 text-emerald-500" />
                <span className="text-xs text-white/30">NDVI Vegetasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mountain className="h-2.5 w-2.5 text-emerald-500" />
                <span className="text-xs text-white/30">Kemiringan Lereng</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RISK BADGE — bottom right ─────────────────────────── */}
        <div
          className="absolute bottom-4 right-4 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/30"
            style={{
              background: 'rgba(10,15,13,0.85)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 3,
              backdropFilter: 'blur(8px)',
            }}
          >
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            Klik marker untuk detail
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </div>
  )
}