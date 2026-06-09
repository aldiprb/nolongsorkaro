'use client'

import { useEffect, useRef, useState } from 'react'
import { TreePine, Mountain, Layers, Database, Calculator, MapPin, ChevronRight, ArrowRight } from 'lucide-react'

/* ── Reveal on scroll ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ── Mono label ───────────────────────────────────────────────── */
function Label({ children, color = '#10b981' }) {
  return (
    <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color }}>
      {children}
    </p>
  )
}

/* ── Section divider ──────────────────────────────────────────── */
function Divider({ tag }) {
  return (
    <div className="flex items-center gap-4 my-20">
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {tag && <span className="text-xs font-mono tracking-widest text-white/20 uppercase">{tag}</span>}
      <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">

      {/* Topographic grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
        backgroundSize: '80px 80px', zIndex: 0,
      }} />

      <div className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 border-b overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Ghost text bg */}
          <div className="absolute right-0 bottom-0 pointer-events-none select-none leading-none font-black uppercase"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(120px, 20vw, 220px)', color: 'rgba(16,185,129,0.03)', lineHeight: 0.85 }}>
            SIG
          </div>

          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <div className="flex items-center gap-2 text-xs font-mono text-white/25 uppercase tracking-widest mb-10">
              <span>Beranda</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-emerald-400">Tentang Proyek</span>
            </div>

            <Label>Dokumentasi Ilmiah</Label>
            <h1 className="font-black uppercase leading-none mb-6"
              style={{ fontFamily: '"Bebas Neue", "Arial Narrow", sans-serif', fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.01em' }}>
              <span className="block text-white/90">Metodologi</span>
              <span className="block" style={{ WebkitTextStroke: '1px rgba(16,185,129,0.5)', color: 'transparent' }}>Pemetaan</span>
              <span className="block text-emerald-400">Kerentanan</span>
            </h1>

            <p className="text-sm text-white/40 leading-relaxed max-w-lg">
              Pendekatan Sistem Informasi Geografis berbasis analisis{' '}
              <span className="text-emerald-400">NDVI</span> dan{' '}
              <span className="text-emerald-400">Kemiringan Lereng</span> untuk
              identifikasi zona longsor di Kabupaten Karo, Sumatera Utara.
            </p>
          </div>
        </section>


        {/* ── LATAR BELAKANG ────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <Label>01 — Konteks</Label>
              <h2 className="text-3xl font-bold text-white mb-8"
                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' }}>
                Latar Belakang
              </h2>
            </Reveal>

            <div className="grid lg:grid-cols-5 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {/* Main text */}
              <Reveal delay={80} className="lg:col-span-3">
                <div className="bg-[#0a0f0d] p-8 h-full">
                  <p className="text-sm text-white/50 leading-relaxed">
                    Kabupaten Karo merupakan wilayah dataran tinggi di Sumatera Utara dengan
                    topografi berbukit dan bergunung yang memiliki potensi longsor tinggi.
                    Proyek ini bertujuan untuk mengidentifikasi dan memetakan zona-zona
                    kerentanan longsor menggunakan pendekatan Sistem Informasi Geografis (SIG)
                    dengan parameter NDVI dan Kemiringan Lereng.
                  </p>
                  <p className="text-sm text-white/35 leading-relaxed mt-4">
                    Pendekatan ini menggabungkan data penginderaan jauh dari citra satelit
                    dengan model elevasi digital untuk menghasilkan peta kerentanan yang
                    akurat dan dapat diperbarui secara berkala.
                  </p>
                </div>
              </Reveal>
              {/* Stat cards */}
              <Reveal delay={160} className="lg:col-span-2">
                <div className="bg-[#0a0f0d] p-8 h-full space-y-4">
                  {[
                    { val: '17', unit: 'Kecamatan', desc: 'Area kajian' },
                    { val: '2', unit: 'Parameter', desc: 'NDVI + Slope' },
                    { val: '3', unit: 'Zona', desc: 'Tingkat risiko' },
                  ].map(({ val, unit, desc }) => (
                    <div key={unit} className="flex items-baseline gap-3">
                      <span className="text-3xl font-black font-mono text-emerald-400">{val}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{unit}</p>
                        <p className="text-xs text-white/30 font-mono">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Divider tag="Metodologi Analisis" />

        {/* ── PARAMETER CARDS ───────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <Label>02 — Parameter</Label>
              <h2 className="text-3xl font-bold text-white mb-12"
                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' }}>
                Analisis Parameter
              </h2>
            </Reveal>

            {/* NDVI */}
            <Reveal delay={60}>
              <div className="grid lg:grid-cols-2 gap-px mb-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="bg-[#0a0f0d] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 flex items-center justify-center"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 4 }}>
                      <TreePine className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Parameter 01</p>
                      <h3 className="text-base font-semibold text-white">NDVI</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed mb-6">
                    Normalized Difference Vegetation Index digunakan untuk menganalisis tingkat
                    kerapatan vegetasi. Vegetasi lebat memiliki sistem perakaran kuat yang
                    menstabilkan lereng dan mengurangi risiko longsor.
                  </p>
                  {/* Formula box */}
                  <div className="p-4" style={{
                    background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderLeft: '3px solid #10b981',
                    borderRadius: 3,
                  }}>
                    <p className="text-sm font-mono text-emerald-300 mb-1">
                      NDVI = (NIR − RED) / (NIR + RED)
                    </p>
                    <p className="text-xs text-white/30">Rentang nilai: −1 hingga +1 · Nilai tinggi = vegetasi lebat</p>
                  </div>
                </div>

                {/* NDVI scale visual */}
                <div className="bg-[#0d1410] p-8 flex flex-col justify-center">
                  <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-5">Skala Nilai NDVI</p>
                  {[
                    { range: '0.6 – 1.0', label: 'Vegetasi Sangat Lebat', color: '#10b981', w: '100%' },
                    { range: '0.4 – 0.6', label: 'Vegetasi Lebat', color: '#34d399', w: '78%' },
                    { range: '0.2 – 0.4', label: 'Vegetasi Sedang', color: '#f59e0b', w: '55%' },
                    { range: '0.0 – 0.2', label: 'Vegetasi Jarang', color: '#ef4444', w: '32%' },
                    { range: '< 0.0', label: 'Non-Vegetasi', color: '#6b7280', w: '15%' },
                  ].map(({ range, label, color, w }) => (
                    <div key={range} className="flex items-center gap-3 mb-2">
                      <div className="h-1.5 rounded-sm" style={{ width: w, background: color, minWidth: 8, flexShrink: 0 }} />
                      <span className="text-xs text-white/35 shrink-0">{label}</span>
                      <span className="text-xs font-mono text-white/20 ml-auto shrink-0">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Kemiringan Lereng */}
            <Reveal delay={100}>
              <div className="grid lg:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="bg-[#0a0f0d] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 flex items-center justify-center"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 4 }}>
                      <Mountain className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Parameter 02</p>
                      <h3 className="text-base font-semibold text-white">Kemiringan Lereng</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">
                    Kemiringan lereng merupakan faktor utama yang mempengaruhi potensi longsor.
                    Semakin curam kemiringan, semakin tinggi potensi material tanah bergerak
                    ke bawah akibat gaya gravitasi.
                  </p>
                </div>

                {/* Slope table */}
                <div className="bg-[#0d1410] p-8">
                  <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-5">Tabel Klasifikasi Lereng</p>
                  <div className="space-y-1">
                    {[
                      { range: '0 – 8%',  klas: 'Datar',       risk: 'Rendah',       color: '#10b981', pct: 15 },
                      { range: '8 – 15%', klas: 'Landai',      risk: 'Rendah–Sedang', color: '#34d399', pct: 28 },
                      { range: '15–25%',  klas: 'Agak Curam',  risk: 'Sedang',        color: '#f59e0b', pct: 50 },
                      { range: '25–45%',  klas: 'Curam',       risk: 'Tinggi',        color: '#f97316', pct: 75 },
                      { range: '> 45%',   klas: 'Sangat Curam',risk: 'Sangat Tinggi', color: '#ef4444', pct: 100 },
                    ].map(({ range, klas, risk, color, pct }) => (
                      <div key={range} className="flex items-center gap-3 py-1.5"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="text-xs font-mono text-white/30 w-16 shrink-0">{range}</span>
                        <div className="flex-1 h-1 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="text-xs text-white/40 w-20 shrink-0 text-right">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Divider tag="Alur Proses" />

        {/* ── DATA FLOW ─────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <Label>03 — Pipeline</Label>
              <h2 className="text-3xl font-bold text-white mb-12"
                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' }}>
                Alur Pemrosesan Data
              </h2>
            </Reveal>

            {/* Pipeline horizontal */}
            <Reveal delay={80}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {[
                  { icon: Database,   label: 'Data Input',     sub: 'Citra Sentinel-2\n& DEM SRTM', color: '#10b981', num: '01' },
                  { icon: TreePine,   label: 'Hitung NDVI',    sub: 'Band NIR & RED\nSentinel-2',   color: '#10b981', num: '02' },
                  { icon: Mountain,   label: 'Ekstrak Slope',  sub: 'DEM → Kemiringan\nderajat/persen', color: '#f59e0b', num: '03' },
                  { icon: Layers,     label: 'Overlay Spasial',sub: 'Weighted overlay\ndua parameter', color: '#f59e0b', num: '04' },
                  { icon: MapPin,     label: 'Peta Output',    sub: 'Zona kerentanan\nRendah–Tinggi',  color: '#ef4444', num: '05' },
                ].map(({ icon: Icon, label, sub, color, num }, i) => (
                  <div key={num} className="group relative bg-[#0a0f0d] p-6 hover:bg-[#0e1511] transition-colors duration-300">
                    <div className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: color }} />
                    <span className="text-4xl font-black font-mono block mb-5" style={{ color: `${color}18` }}>{num}</span>
                    <div className="w-8 h-8 flex items-center justify-center mb-4"
                      style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 3 }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">{label}</p>
                    <p className="text-xs text-white/30 leading-relaxed whitespace-pre-line">{sub}</p>
                    {i < 4 && (
                      <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/10 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Overlay explanation */}
            <Reveal delay={120}>
              <div className="mt-px p-6 lg:p-8" style={{
                background: 'rgba(16,185,129,0.04)',
                border: '1px solid rgba(16,185,129,0.10)',
                borderTop: 'none',
              }}>
                <div className="flex items-start gap-3">
                  <Layers className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/40 leading-relaxed">
                    <span className="text-white/70 font-medium">Weighted Overlay — </span>
                    Peta NDVI dan Kemiringan Lereng digabungkan menggunakan teknik weighted overlay
                    di QGIS. Setiap parameter diberi bobot sesuai tingkat pengaruhnya terhadap
                    potensi longsor untuk menghasilkan skor kerentanan akhir.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Divider tag="Klasifikasi Akhir" />

        {/* ── CLASSIFICATION ────────────────────────────────────── */}
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <Label>04 — Output</Label>
              <h2 className="text-3xl font-bold text-white mb-12"
                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' }}>
                Klasifikasi Kerentanan
              </h2>
            </Reveal>

            <div className="space-y-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {[
                {
                  dn: 'DN = 1',
                  level: 'Tinggi',
                  desc: 'Area dengan NDVI rendah dan kemiringan lereng curam. Vegetasi jarang, lereng > 25°. Memerlukan perhatian dan intervensi khusus.',
                  action: 'Prioritas Mitigasi',
                  color: '#ef4444',
                  bg: 'rgba(239,68,68,0.06)',
                  pct: 17,
                },
                {
                  dn: 'DN = 2',
                  level: 'Menengah',
                  desc: 'Area dengan kombinasi NDVI dan kemiringan moderat. Lereng 15–25°, vegetasi sedang. Perlu monitoring berkala dan penguatan vegetasi.',
                  action: 'Monitoring Berkala',
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.06)',
                  pct: 45,
                },
                {
                  dn: 'DN = 3',
                  level: 'Rendah',
                  desc: 'Area dengan vegetasi baik dan kemiringan landai. NDVI tinggi, lereng < 15°. Relatif aman, tetap dipantau saat musim hujan.',
                  action: 'Pemantauan Rutin',
                  color: '#10b981',
                  bg: 'rgba(16,185,129,0.06)',
                  pct: 38,
                },
              ].map(({ dn, level, desc, action, color, bg, pct }, i) => (
                <Reveal key={dn} delay={i * 80}>
                  <div className="group relative overflow-hidden flex flex-col md:flex-row gap-6 p-6 lg:p-8 hover:brightness-110 transition-all duration-300"
                    style={{ background: bg }}>
                    {/* Fill bar behind */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />

                    <div className="relative shrink-0">
                      <span className="text-xs font-mono text-white/25 uppercase tracking-widest">{dn}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                        <span className="text-lg font-bold text-white" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em', fontSize: '1.5rem' }}>
                          {level}
                        </span>
                      </div>
                      <div className="text-2xl font-black font-mono mt-1" style={{ color: `${color}80` }}>
                        {pct}%
                      </div>
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <p className="text-sm text-white/45 leading-relaxed mb-3">{desc}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-widest"
                        style={{ background: `${color}15`, border: `1px solid ${color}30`, color, borderRadius: 2 }}>
                        <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                        {action}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </div>
  )
}