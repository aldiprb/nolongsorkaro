'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Home,
  Phone,
  Radio,
  ShieldCheck,
  Users,
  Ban,
  CheckCircle2,
  Siren,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

/* ── Reveal on scroll ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── Phase badge ──────────────────────────────────────────────── */
function PhaseBadge({ label, color }) {
  const colors = {
    amber:  { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  text: '#f59e0b' },
    red:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444' },
    emerald:{ bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)', text: '#10b981' },
  }
  const c = colors[color]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono tracking-widest uppercase"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 2 }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.text }} />
      {label}
    </span>
  )
}

export default function MitigasiPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">

      {/* ── Topographic grid bg ─────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          zIndex: 0,
        }}
      />

      <div className="relative z-10">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 overflow-hidden border-b border-white/5">
          {/* big decorative shield outline */}
          <div
            className="absolute right-[-8%] top-[-20%] opacity-[0.04] pointer-events-none select-none"
            style={{ fontSize: 'clamp(280px, 40vw, 520px)', lineHeight: 1 }}
          >
            🛡
          </div>

          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-white/25 uppercase tracking-widest mb-10">
              <span>Beranda</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-emerald-400">Mitigasi Bencana</span>
            </div>

            <div className="flex items-end gap-6 flex-wrap">
              <div>
                <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-4">
                  Panduan Kesiapsiagaan
                </p>
                <h1
                  className="font-black uppercase leading-none"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 7rem)',
                    fontFamily: '"Bebas Neue", "Arial Narrow", sans-serif',
                    letterSpacing: '0.01em',
                  }}
                >
                  <span className="block text-white/90">Mitigasi</span>
                  <span
                    className="block"
                    style={{ WebkitTextStroke: '1px rgba(16,185,129,0.5)', color: 'transparent' }}
                  >
                    Bencana
                  </span>
                  <span className="block text-emerald-400">Longsor</span>
                </h1>
              </div>
              <div className="max-w-xs mb-2 ml-auto">
                <p className="text-sm text-white/40 leading-relaxed">
                  Panduan kesiapsiagaan dan tindakan yang harus dilakukan masyarakat
                  sebelum, saat, dan setelah terjadi longsor di Kabupaten Karo.
                </p>
              </div>
            </div>

            {/* Phase timeline pills */}
            <div className="flex gap-3 mt-10 flex-wrap">
              {[
                { label: 'Fase 01 — Sebelum', color: 'emerald' },
                { label: 'Fase 02 — Saat Terjadi', color: 'red' },
                { label: 'Fase 03 — Setelah', color: 'amber' },
              ].map((p) => (
                <PhaseBadge key={p.label} {...p} />
              ))}
            </div>
          </div>
        </section>


        {/* ── WARNING SIGNS ───────────────────────────────────────── */}
        <section className="py-20 border-b border-white/5">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <div className="flex items-center gap-4 mb-12">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 4,
                  }}
                >
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-mono tracking-widest text-amber-400 uppercase">Deteksi Dini</p>
                  <h2 className="text-2xl font-bold text-white mt-0.5">Tanda-Tanda Peringatan Longsor</h2>
                </div>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {[
                'Munculnya retakan-retakan baru di tanah atau dinding rumah',
                'Tiang listrik, pohon, atau pagar tampak miring',
                'Air tanah / mata air tiba-tiba muncul atau berhenti mengalir',
                'Terdengar suara gemuruh dari arah lereng',
                'Hujan deras yang berlangsung lama (beberapa jam)',
                'Tanah di sekitar terasa basah dan lunak tidak wajar',
              ].map((text, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div
                    className="group relative bg-[#0a0f0d] p-6 hover:bg-[#0f1812] transition-colors duration-300"
                  >
                    <div
                      className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: '#f59e0b' }}
                    />
                    <span className="text-3xl font-black font-mono text-white/4 absolute top-4 right-4">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="w-1.5 h-1.5 rounded-full mb-4"
                      style={{ background: '#f59e0b' }}
                    />
                    <p className="text-sm text-white/60 leading-relaxed">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>


        {/* ── BEFORE ──────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/5">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <div className="flex items-center gap-4 mb-3">
                <PhaseBadge label="Fase 01" color="emerald" />
              </div>
              <div className="flex items-center gap-4 mb-12">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 4,
                  }}
                >
                  <Home className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Sebelum Terjadi Longsor</h2>
              </div>
            </Reveal>

            <div className="space-y-px bg-white/5">
              {[
                {
                  num: '01',
                  title: 'Kenali Lingkungan Sekitar',
                  desc: 'Pelajari kondisi topografi dan riwayat longsor di sekitar tempat tinggal. Gunakan peta kerentanan untuk mengetahui tingkat risiko wilayah Anda.',
                },
                {
                  num: '02',
                  title: 'Siapkan Tas Siaga Bencana',
                  desc: 'Isi dengan dokumen penting, obat-obatan, pakaian, makanan/minuman, senter, radio, dan uang tunai secukupnya untuk setidaknya 72 jam.',
                },
                {
                  num: '03',
                  title: 'Tentukan Jalur Evakuasi',
                  desc: 'Buat rencana evakuasi keluarga dan tentukan titik kumpul yang aman. Pastikan semua anggota keluarga mengetahui jalur ini di luar kepala.',
                },
                {
                  num: '04',
                  title: 'Ikuti Pelatihan Kesiapsiagaan',
                  desc: 'Ikuti simulasi evakuasi dan pelatihan tanggap bencana yang diselenggarakan oleh BPBD atau komunitas setempat secara rutin.',
                },
              ].map(({ num, title, desc }, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="group flex gap-6 bg-[#0a0f0d] p-6 lg:p-8 hover:bg-[#0e1511] transition-colors duration-300">
                    <div
                      className="text-4xl font-black font-mono shrink-0 leading-none"
                      style={{ color: 'rgba(16,185,129,0.20)' }}
                    >
                      {num}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">{title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start mt-1 ml-auto"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>


        {/* ── DURING ──────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/5">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <div className="mb-3">
                <PhaseBadge label="Fase 02" color="red" />
              </div>
              <div className="flex items-center gap-4 mb-12">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 4,
                  }}
                >
                  <Siren className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Saat Terjadi Longsor</h2>
              </div>
            </Reveal>

            {/* Urgent alert banner */}
            <Reveal>
              <div
                className="flex items-center gap-3 p-4 mb-8 text-sm font-mono text-red-300"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderLeft: '3px solid #ef4444',
                }}
              >
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                PERINGATAN — Jangan tunda tindakan evakuasi. Setiap detik sangat berarti.
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-px bg-white/5">
              {[
                {
                  icon: CheckCircle2,
                  type: 'DO',
                  title: 'Segera Evakuasi',
                  desc: 'Jika melihat atau mendengar tanda-tanda longsor, segera lari ke tempat yang lebih tinggi atau menjauhi jalur longsor. Jangan menunggu perintah.',
                  color: '#ef4444',
                  bg: 'rgba(239,68,68,0.08)',
                  border: 'rgba(239,68,68,0.20)',
                },
                {
                  icon: CheckCircle2,
                  type: 'DO',
                  title: 'Lindungi Kepala',
                  desc: 'Jika tidak sempat menghindar, lindungi kepala dengan tangan atau benda keras. Cari perlindungan di bawah furnitur kokoh jika di dalam rumah.',
                  color: '#ef4444',
                  bg: 'rgba(239,68,68,0.08)',
                  border: 'rgba(239,68,68,0.20)',
                },
                {
                  icon: Ban,
                  type: 'DON\'T',
                  title: 'Jangan Kembali',
                  desc: 'Jangan kembali ke lokasi longsor sampai dinyatakan aman oleh petugas. Longsor susulan dapat terjadi setelah longsor pertama.',
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.08)',
                  border: 'rgba(245,158,11,0.20)',
                },
              ].map(({ icon: Icon, type, title, desc, color, bg, border }, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div
                    className="h-full p-6 lg:p-8"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <div
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono tracking-widest mb-5"
                      style={{ background: `${color}20`, color, borderRadius: 2 }}
                    >
                      {type}
                    </div>
                    <Icon className="h-5 w-5 mb-4" style={{ color }} />
                    <h3 className="font-semibold text-white mb-3">{title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>


        {/* ── AFTER ───────────────────────────────────────────────── */}
        <section className="py-20 border-b border-white/5">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <div className="mb-3">
                <PhaseBadge label="Fase 03" color="amber" />
              </div>
              <div className="flex items-center gap-4 mb-12">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 4,
                  }}
                >
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Setelah Terjadi Longsor</h2>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-px bg-white/5">
              {[
                {
                  title: 'Periksa Kondisi',
                  desc: 'Periksa kondisi diri sendiri dan orang di sekitar. Berikan pertolongan pertama jika diperlukan dan hubungi layanan medis segera.',
                  n: '01',
                },
                {
                  title: 'Tetap di Tempat Aman',
                  desc: 'Tetap di lokasi yang aman dan pantau informasi dari petugas atau media resmi tentang kondisi terkini sebelum bergerak.',
                  n: '02',
                },
                {
                  title: 'Laporkan ke Petugas',
                  desc: 'Laporkan kejadian longsor dan korban (jika ada) kepada petugas atau posko bencana terdekat sesegera mungkin.',
                  n: '03',
                },
                {
                  title: 'Hindari Area Terdampak',
                  desc: 'Jangan mendekati area terdampak longsor. Tunggu izin resmi dari petugas BPBD sebelum kembali ke rumah.',
                  n: '04',
                },
              ].map(({ title, desc, n }, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div className="group relative bg-[#0a0f0d] p-6 lg:p-8 hover:bg-[#0e1511] transition-colors duration-300 h-full">
                    <div
                      className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: '#10b981' }}
                    />
                    <span className="text-5xl font-black font-mono text-white/3 absolute bottom-4 right-4 leading-none">{n}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-5" />
                    <h3 className="font-semibold text-white mb-3">{title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>


        {/* ── EMERGENCY CONTACTS ──────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-12">
            <Reveal>
              <div className="flex items-center gap-4 mb-12">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 4,
                  }}
                >
                  <Phone className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-mono tracking-widest text-red-400 uppercase">Hubungi Segera</p>
                  <h2 className="text-2xl font-bold text-white mt-0.5">Kontak Darurat</h2>
                </div>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-px bg-white/5 mb-6">
              {[
                { label: 'BPBD Kabupaten Karo', number: '(0628) 20111', primary: true },
                { label: 'Basarnas', number: '115', primary: false },
                { label: 'PMI', number: '119', primary: false },
                { label: 'Polisi', number: '110', primary: false },
              ].map(({ label, number, primary }, i) => (
                <Reveal key={i} delay={i * 60}>
                  <a
                    href={`tel:${number.replace(/\D/g, '')}`}
                    className="group flex items-center justify-between bg-[#0a0f0d] px-6 py-5 hover:bg-[#0e1511] transition-colors duration-300"
                  >
                    <div>
                      <p className="text-xs text-white/35 font-mono uppercase tracking-wider mb-1">{label}</p>
                      <p
                        className="text-xl font-bold font-mono"
                        style={{ color: primary ? '#ef4444' : 'white' }}
                      >
                        {number}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: primary ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${primary ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 4,
                      }}
                    >
                      <Phone className="h-3.5 w-3.5" style={{ color: primary ? '#ef4444' : 'white' }} />
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            {/* Radio info bar */}
            <Reveal>
              <div
                className="flex items-center gap-3 px-6 py-4 text-sm text-white/35"
                style={{
                  background: 'rgba(16,185,129,0.05)',
                  border: '1px solid rgba(16,185,129,0.1)',
                  borderRadius: 4,
                }}
              >
                <Radio className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-mono text-xs tracking-wide">
                  Pantau informasi melalui radio atau media sosial resmi BPBD Kabupaten Karo
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </div>
  )
}