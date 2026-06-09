import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Mountain,
  TreePine,
  ArrowRight,
  Shield,
  AlertTriangle,
  Eye,
  ChevronDown,
  Activity,
} from 'lucide-react';

// Import untuk preview peta kecil
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Topographic grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translateY(${parallaxOffset * 0.3}px)`,
          }}
        />

        {/* Topographic contour rings — large decorative element */}
        <div
          className="absolute right-[-10%] top-[-10%] w-[70vw] h-[70vw] pointer-events-none"
          style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-emerald-500/10"
              style={{
                inset: `${i * 6}%`,
                borderWidth: '1px',
                opacity: 1 - i * 0.07,
              }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              inset: '35%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Diagonal accent line */}
        <div
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          style={{ overflow: 'hidden' }}
        >
          <div
            className="absolute bg-emerald-500/5"
            style={{
              width: '200%',
              height: '1px',
              top: '60%',
              left: '-50%',
              transform: 'rotate(-15deg)',
              transformOrigin: 'center',
              boxShadow: '0 0 60px 20px rgba(16,185,129,0.06)',
            }}
          />
        </div>

        {/* Noise / grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Status badge */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-12">
          <div className="flex items-center gap-2 mb-8 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
              Sistem Aktif — Kabupaten Karo, Sumatera Utara
            </span>
          </div>

          <div className="relative">
            <h1
              className="font-black uppercase leading-none tracking-tighter"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                fontFamily: '"Bebas Neue", "Arial Narrow", sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block text-white/90">Sistem</span>
              <span
                className="block"
                style={{ WebkitTextStroke: '1px rgba(16,185,129,0.6)', color: 'transparent' }}
              >
                Informasi
              </span>
              <span className="block text-emerald-400">Geografis</span>
            </h1>

            <div className="mt-6 lg:mt-0 lg:absolute lg:bottom-4 lg:right-0 max-w-sm">
              
              {/* --- START: PREVIEW PETA KECIL KOTAK SAMA SISI --- */}
              <div 
                className="relative mb-6 rounded-xl overflow-hidden border border-emerald-500/30 opacity-80 hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                style={{ width: '350px', height: '350px' }} // FIX: Ukuran pasti kotak (240x240) pada wrapper
              >
                <MapContainer 
                  center={[3.1228, 98.3908]} // Koordinat Kabupaten Karo
                  zoom={9} 
                  zoomControl={false}       // Sembunyikan tombol zoom (+ / -)
                  scrollWheelZoom={false}   // Matikan zoom dengan scroll mouse
                  dragging={false}          // Matikan fitur geser peta
                  doubleClickZoom={false}   // Matikan zoom dengan klik ganda
                  style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} // FIX: Memaksa MapContainer mengisi div secara absolut
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" 
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />
                </MapContainer>

                {/* Lapisan transparan di atas peta agar interaktif mati */}
                <div className="absolute inset-0 z-1000 pointer-events-auto"></div>
              </div>
              {/* --- END: PREVIEW PETA KECIL --- */}

              <p className="text-slate-400 text-base leading-relaxed font-light">
                Pemetaan zona kerentanan longsor berbasis analisis{' '}
                <span className="text-emerald-300 font-medium">NDVI</span> &{' '}
                <span className="text-emerald-300 font-medium">Kemiringan Lereng</span>{' '}
                untuk mendukung mitigasi bencana.
              </p>

              <div className="flex gap-3 mt-6">
                <Link
                  to="/peta"
                  className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 bg-emerald-400 text-black text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-emerald-300"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Lihat Peta
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/tentang"
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/70 text-sm font-medium uppercase tracking-widest hover:border-emerald-400/50 hover:text-white transition-all duration-300"
                >
                  Metodologi
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* ─── STATS TICKER ─────────────────────────────────────────────── */}
      <div className="relative border-y border-white/5 bg-[#0d1410] overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/3" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {[
            { value: 2000, suffix: 'm+', label: 'Elevasi Tertinggi', icon: Mountain },
            { value: 3, suffix: ' Zona', label: 'Tingkat Risiko', icon: AlertTriangle },
            { value: 96, suffix: '%', label: 'Akurasi Analisis', icon: Activity },
            { value: 17, suffix: ' Kec.', label: 'Wilayah Dipetakan', icon: MapPin },
          ].map(({ value, suffix, label, icon: Icon }, i) => (
            <div
              key={i}
              className="flex flex-col items-start px-0 md:px-8 md:border-l border-white/8 first:border-0"
            >
              <Icon className="h-4 w-4 text-emerald-500 mb-2 opacity-70" />
              <p className="text-2xl font-bold text-white font-mono">
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-emerald-500/20 to-transparent"
          style={{ left: 'calc(50% - 1px)' }}
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs font-mono tracking-widest text-white/30 uppercase">Metodologi Analisis</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              {
                icon: TreePine,
                tag: '01',
                title: 'Analisis NDVI',
                desc: 'Memanfaatkan citra satelit Sentinel-2 untuk menganalisis tingkat kerapatan vegetasi. NDVI yang rendah mengindikasikan vegetasi tipis dan stabilitas lereng yang berkurang.',
                accent: '#10b981',
              },
              {
                icon: Mountain,
                tag: '02',
                title: 'Kemiringan Lereng',
                desc: 'Menggunakan data DEM (Digital Elevation Model) resolusi tinggi untuk menghitung kemiringan lereng sebagai faktor utama penentu potensi longsor di kawasan pegunungan.',
                accent: '#f59e0b',
              },
              {
                icon: Shield,
                tag: '03',
                title: 'Zona Kerentanan',
                desc: 'Overlay spasial dari dua parameter menghasilkan peta zona kerentanan tiga tingkat: Rendah, Menengah, dan Tinggi — untuk mendukung tindakan mitigasi terukur.',
                accent: '#ef4444',
              },
            ].map(({ icon: Icon, tag, title, desc, accent }, i) => (
              <div
                key={i}
                className="group relative bg-[#0a0f0d] p-8 lg:p-10 hover:bg-[#0e1511] transition-colors duration-500"
              >
                <div
                  className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                  style={{ background: accent }}
                />
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <span className="text-5xl font-black opacity-5 font-mono">{tag}</span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>

                <div
                  className="mt-8 flex items-center gap-2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: accent }}
                >
                  <span>Lihat di peta</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RISK LEGEND VISUALIZATION ────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-4">
                Klasifikasi Risiko
              </p>
              <h2
                className="text-4xl lg:text-5xl font-black uppercase leading-none mb-6"
                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' }}
              >
                Tiga Tingkat
                <br />
                <span className="text-white/30">Zona Bahaya</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">
                Kombinasi analisis NDVI dan kemiringan lereng menghasilkan klasifikasi
                kerentanan yang membantu perencana wilayah dan tim tanggap darurat
                memprioritaskan intervensi.
              </p>

              <Link
                to="/peta"
                className="group inline-flex items-center gap-3 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Eksplorasi peta interaktif</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Zona Rendah',
                  desc: 'Vegetasi lebat, lereng < 15°',
                  pct: 38,
                  color: '#10b981',
                  bg: 'rgba(16,185,129,0.12)',
                  border: 'rgba(16,185,129,0.25)',
                },
                {
                  label: 'Zona Menengah',
                  desc: 'Vegetasi sedang, lereng 15–30°',
                  pct: 45,
                  color: '#f59e0b',
                  bg: 'rgba(245,158,11,0.10)',
                  border: 'rgba(245,158,11,0.22)',
                },
                {
                  label: 'Zona Tinggi',
                  desc: 'Vegetasi jarang, lereng > 30°',
                  pct: 17,
                  color: '#ef4444',
                  bg: 'rgba(239,68,68,0.10)',
                  border: 'rgba(239,68,68,0.22)',
                },
              ].map(({ label, desc, pct, color, bg, border }, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden p-5"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 opacity-20"
                    style={{
                      width: `${pct}%`,
                      background: color,
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold font-mono" style={{ color }}>{pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(16,185,129,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <p className="text-xs font-mono tracking-widest text-emerald-500 uppercase mb-6">
            Mulai Eksplorasi
          </p>
          <h2
            className="text-5xl lg:text-7xl font-black uppercase text-white leading-none mb-8"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            Buka Peta
            <br />
            <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)', color: 'transparent' }}>
              Kerentanan
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
            Akses peta interaktif berbasis analisis spasial untuk mendukung
            perencanaan wilayah dan kesiapsiagaan bencana di Kabupaten Karo.
          </p>

          <Link
            to="/peta"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
          >
            <MapPin className="h-4 w-4" />
            Lihat Peta Interaktif
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </div>
  );
}