/**
 * MapComponent.jsx
 * Versi modern dengan tampilan dashboard GIS yang lebih premium:
 * - Glassmorphism sidebar
 * - Statistik ringkas
 * - Basemap switcher
 * - Floating action buttons
 * - Legend overlay
 * - Popup detail yang lebih rapi
 * - Tetap mendukung filter visibilitas, nearest neighbor, dan cuaca real-time
 */

import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  Polyline,
  Circle,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  supabase,
  getKerentananLabel,
  getKerentananColor,
} from '../lib/supabaseClient'
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Navigation,
  RefreshCw,
  CloudRain,
  Thermometer,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Layers3,
  Radar,
  LocateFixed,
  Map as MapIcon,
  Activity,
  ShieldAlert,
  Sparkles,
  Filter,
  X,
} from 'lucide-react'

// Fix untuk icon Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

/**
 * Basemap presets
 */
const MAP_THEMES = [
  {
    id: 'light',
    name: 'Light',
    icon: MapIcon,
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: Sparkles,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: 'street',
    name: 'Street',
    icon: Layers3,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    icon: Radar,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
]

/**
 * Membuat custom icon berbentuk bulat modern
 */
function createCustomIcon(dn) {
  const color = getKerentananColor(dn)
  return L.divIcon({
    className: 'custom-marker-modern',
    html: `
      <div style="
        position: relative;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: ${color};
          box-shadow: 0 0 0 4px ${color}22, 0 10px 20px rgba(0,0,0,0.25);
          border: 2px solid rgba(255,255,255,0.9);
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  })
}

/**
 * Auto-zoom ke area data
 */
function SetViewOnData({ points, userLoc }) {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return

    const coordinates = points.map((p) => [Number(p.latitude), Number(p.longitude)])
    if (userLoc) coordinates.push([userLoc.lat, userLoc.lng])

    if (coordinates.length === 1) {
      map.setView(coordinates[0], 14, { animate: true })
      return
    }

    const bounds = L.latLngBounds(coordinates)
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [points, userLoc, map])

  return null
}

/**
 * Popup detail dengan data cuaca real-time
 */
function WeatherPopupDetail({ titik }) {
  const [cuaca, setCuaca] = useState(null)
  const [loadingCuaca, setLoadingCuaca] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchWeather() {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
        if (!apiKey) throw new Error('API Key tidak ditemukan di .env.local')

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${titik.latitude}&lon=${titik.longitude}&appid=${apiKey}&units=metric&lang=id`
        )

        if (!res.ok) throw new Error('Gagal memuat cuaca')

        const data = await res.json()
        if (mounted) setCuaca(data)
      } catch (err) {
        console.error('Error Cuaca:', err)
      } finally {
        if (mounted) setLoadingCuaca(false)
      }
    }

    fetchWeather()

    return () => {
      mounted = false
    }
  }, [titik])

  const color = getKerentananColor(titik.DN)

  return (
    <div className="w-72.5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Detail Titik Longsor</h3>
          <p className="text-[11px] text-slate-500">Informasi spasial dan cuaca lokasi</p>
        </div>
        <div
          className="rounded-full px-2 py-1 text-[10px] font-bold"
          style={{
            backgroundColor: `${color}18`,
            color,
          }}
        >
          {getKerentananLabel(titik.DN)}
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Kemiringan</span>
          <span className="font-bold text-slate-800">
            {titik.slope !== null && titik.slope !== undefined
              ? `${Number(titik.slope).toFixed(2)}°`
              : '-'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Nilai NDVI</span>
          <span className="font-mono font-bold text-slate-800">
            {titik.nilai_ndvi !== null && titik.nilai_ndvi !== undefined
              ? Number(titik.nilai_ndvi).toFixed(4)
              : '-'}
          </span>
        </div>

        <div className="rounded-xl border border-sky-100 bg-linear-to-br from-sky-50 to-cyan-50 p-3">
          <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
            <CloudRain className="h-3 w-3" /> Cuaca Real-Time Lokasi
          </h4>

          {loadingCuaca ? (
            <div className="flex items-center gap-2 py-1 text-sky-600">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="text-[10px]">Mengambil data cuaca...</span>
            </div>
          ) : cuaca ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold capitalize text-sky-900">
                  {cuaca.weather?.[0]?.description || '-'}
                </span>
                <span className="text-[10px] text-sky-700">
                  Kelembapan: {cuaca.main?.humidity ?? '-'}%
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-sky-100 bg-white px-3 py-2 shadow-sm">
                <Thermometer className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-bold text-slate-700">
                  {Math.round(cuaca.main?.temp ?? 0)}°C
                </span>
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-red-500">Gagal memuat data cuaca</span>
          )}
        </div>

        <div className="border-t border-slate-100 pt-2">
          <p className="font-mono text-[10px] text-slate-500">
            FID: {titik.fid} | {Number(titik.latitude).toFixed(5)},{' '}
            {Number(titik.longitude).toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MapComponent() {
  const [titikGabungan, setTitikGabungan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Nearest neighbor mode
  const [isNearestMode, setIsNearestMode] = useState(false)
  const [nearestTitik, setNearestTitik] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)

  // Visibility filters
  const [activeFilters, setActiveFilters] = useState({
    1: true,
    2: true,
    0: true,
  })

  // Basemap
  const [selectedTheme, setSelectedTheme] = useState('light')

  const karoCenter = [3.1228, 98.3908]

  const activeMapTheme = useMemo(
    () => MAP_THEMES.find((t) => t.id === selectedTheme) || MAP_THEMES[0],
    [selectedTheme]
  )

  const toggleFilter = (dnValue) => {
    setActiveFilters((prev) => ({
      ...prev,
      [dnValue]: !prev[dnValue],
    }))
  }

  // Ambil data awal
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const [rawanRes, sedangRes] = await Promise.all([
          supabase
            .from('tingkat_rawan')
            .select('fid, longitude, latitude, DN, nilai_ndvi, slope'),
          supabase
            .from('tingkat_sedang')
            .select('fid, longitude, latitude, DN, nilai_ndvi, slope'),
        ])

        if (rawanRes.error) throw new Error(`Error Rawan: ${rawanRes.error.message}`)
        if (sedangRes.error) throw new Error(`Error Sedang: ${sedangRes.error.message}`)

        const dataRawan = (rawanRes.data || []).map((titik) => ({
          ...titik,
          DN: 1,
        }))
        const dataSedang = (sedangRes.data || []).map((titik) => ({
          ...titik,
          DN: 2,
        }))

        setTitikGabungan([...dataRawan, ...dataSedang])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Terjadi kesalahan sistem saat memuat data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Cari titik terdekat dari lokasi pengguna
  const cariLokasiTerdekat = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur Geolocation.')
      return
    }

    setIsLocating(true)
    if (!isSidebarOpen) setIsSidebarOpen(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setUserLocation({ lat, lng: lon })

        try {
          const { data, error: rpcError } = await supabase.rpc('cari_longsor_terdekat', {
            user_lat: lat,
            user_lon: lon,
            radius_meter: 100000,
          })

          if (rpcError) throw rpcError

          const formattedData = (data || []).map((t) => ({
            ...t,
            DN: t.DN === 0 || t.DN === 2 ? 2 : 1,
          }))

          setNearestTitik(formattedData)
          setIsNearestMode(true)
        } catch (err) {
          console.error('Gagal menjalankan fungsi spasial:', err)
          alert(
            'Gagal mencari titik terdekat. Pastikan fungsi RPC di Supabase sudah dibuat.'
          )
        } finally {
          setIsLocating(false)
        }
      },
      () => {
        alert('Gagal mendapatkan lokasi Anda. Aktifkan izin lokasi/GPS di browser.')
        setIsLocating(false)
      }
    )
  }

  // Reset kembali ke mode normal
  const resetPeta = () => {
    setIsNearestMode(false)
    setUserLocation(null)
    setNearestTitik([])
  }

  // Data yang dirender
  const dataToRender = isNearestMode ? nearestTitik : titikGabungan
  const filteredTitik = dataToRender.filter((titik) => activeFilters[titik.DN])

  // Statistik ringkas
  const stats = useMemo(() => {
    const total = titikGabungan.length
    const rawan = titikGabungan.filter((t) => t.DN === 1).length
    const sedang = titikGabungan.filter((t) => t.DN === 2).length
    const terlihat = filteredTitik.length

    return { total, rawan, sedang, terlihat }
  }, [titikGabungan, filteredTitik])

  if (loading) {
    return (
      <div className="absolute top-16 left-0 right-0 bottom-0 flex overflow-hidden bg-slate-950">
        <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
          <Loader2 className="relative h-10 w-10 animate-spin text-emerald-400" />
          <div className="relative text-center">
            <p className="text-sm font-medium text-white">Memuat Peta Spasial</p>
            <p className="mt-1 text-xs text-white/50">Menyiapkan layer, marker, dan data analisis</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="text-lg font-bold text-white">Gagal Memuat Peta</h3>
          <p className="mt-2 text-sm text-white/60">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-16 left-0 right-0 bottom-0 flex overflow-hidden bg-slate-950">
      {/* Sidebar kiri */}
      <aside
        className={`relative z-30 h-full shrink-0 overflow-hidden border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-88' : 'w-0'
        }`}
      >
        <div className="flex h-full w-88 flex-col bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
          {/* Header */}
          <div className="border-b border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  <Activity className="h-3 w-3" />
                  Web GIS Kerentanan Longsor
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Panel Kendali</h2>
                <p className="mt-1 text-xs text-white/50">
                  Analisis spasial, filter, dan data titik longsor
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Statistik ringkas */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Titik" value={stats.total} icon={MapPin} accent="emerald" />
              <StatCard label="Rawan" value={stats.rawan} icon={ShieldAlert} accent="red" />
              <StatCard label="Sedang" value={stats.sedang} icon={Layers3} accent="amber" />
              <StatCard
                label="Terlihat"
                value={stats.terlihat}
                icon={Eye}
                accent="cyan"
              />
            </div>

            {/* Basemap switcher */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h4 className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
                <Layers3 className="h-3 w-3" />
                Basemap
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {MAP_THEMES.map((theme) => {
                  const Icon = theme.icon
                  const active = selectedTheme === theme.id
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? 'border-emerald-400/30 bg-emerald-400/15 shadow-lg shadow-emerald-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-emerald-300' : 'text-white/60'}`} />
                      <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-white/70'}`}>
                        {theme.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Analisis spasial */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h4 className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
                <Navigation className="h-3 w-3" />
                Analisis Spasial
              </h4>

              {!isNearestMode ? (
                <button
                  onClick={cariLokasiTerdekat}
                  disabled={isLocating}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed className="h-4 w-4" />
                  )}
                  {isLocating ? 'Mencari Lokasi...' : 'Cari 10 Titik Terdekat'}
                </button>
              ) : (
                <button
                  onClick={resetPeta}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-red-500/20"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Peta
                </button>
              )}

              <p className="mt-3 text-[11px] leading-relaxed text-white/45">
                Fitur ini menggunakan GPS untuk mencari titik kerentanan terdekat dari lokasi
                Anda.
              </p>

              {isNearestMode && nearestTitik.length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <h5 className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
                    <MapPin className="h-3 w-3" />
                    Hasil 10 Titik Terdekat
                  </h5>

                  <div className="space-y-2.5">
                    {nearestTitik.map((t, i) => {
                      const color = getKerentananColor(t.DN)
                      return (
                        <div
                          key={`${t.fid}-${i}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
                        >
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-white">
                              #{i + 1} - {getKerentananLabel(t.DN)}
                            </span>
                            <div
                              className="h-2.5 w-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-white/50">
                            <span>Slope: {t.slope ? Number(t.slope).toFixed(2) : '-'}°</span>
                            <span>NDVI: {t.nilai_ndvi ? Number(t.nilai_ndvi).toFixed(3) : '-'}</span>
                          </div>
                          <div className="mt-1.5 font-mono text-[9px] text-white/35">
                            {Number(t.latitude).toFixed(4)}, {Number(t.longitude).toFixed(4)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Filter visibilitas */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h4 className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
                <Filter className="h-3 w-3" />
                Filter Visibilitas
              </h4>

              <div className="space-y-2">
                <FilterButton
                  active={activeFilters[1]}
                  label="Rawan (Tinggi)"
                  color="bg-red-500"
                  onClick={() => toggleFilter(1)}
                />
                <FilterButton
                  active={activeFilters[2]}
                  label="Tingkat Sedang"
                  color="bg-amber-500"
                  onClick={() => toggleFilter(2)}
                />
              </div>
            </section>
          </div>
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-white shadow-[0_4px_14px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/10"
        style={{ left: isSidebarOpen ? '21rem' : '1rem' }}
        title={isSidebarOpen ? 'Tutup Panel' : 'Buka Panel'}
      >
        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {/* Map area */}
      <div className="relative flex-1">
        {/* Header overlay di atas peta */}
        <div className="pointer-events-none absolute left-4 top-4 z-20">
          <div className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/20">
                <MapPin className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Peta Kerentanan Longsor</p>
                <p className="text-[11px] text-white/50">
                  Mode {isNearestMode ? 'Nearest Neighbor' : 'Semua Titik'} • {activeMapTheme.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating action buttons */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          <button
            onClick={cariLokasiTerdekat}
            disabled={isLocating}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl transition hover:bg-white/10 disabled:opacity-60"
            title="Cari titik terdekat"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
            ) : (
              <Navigation className="h-4 w-4 text-emerald-300 transition group-hover:scale-110" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>

          <button
            onClick={resetPeta}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
            title="Reset peta"
          >
            <RefreshCw className="h-4 w-4 text-cyan-300 transition group-hover:rotate-180" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-20 w-62.5 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <h4 className="text-sm font-bold">Legenda</h4>
          </div>

          <div className="space-y-2 text-xs">
            <LegendItem
              color="bg-red-500"
              label="Rawan (Tinggi)"
              desc="Titik berisiko tinggi"
            />
            <LegendItem
              color="bg-amber-500"
              label="Tingkat Sedang"
              desc="Titik berisiko sedang"
            />
            <LegendItem
              color="bg-blue-400"
              label="Lokasi Anda"
              desc="Posisi GPS pengguna"
            />
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/50">
            <span className="font-semibold text-white/75">Titik terlihat:</span> {stats.terlihat}
          </div>
        </div>

        <MapContainer
          center={karoCenter}
          zoom={10}
          scrollWheelZoom
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          className="z-0"
        >
          <TileLayer attribution={activeMapTheme.attribution} url={activeMapTheme.url} />

          {/* Auto zoom */}
          {filteredTitik.length > 0 && (
            <SetViewOnData points={filteredTitik} userLoc={userLocation} />
          )}

          {/* Radius user */}
          {userLocation && (
            <>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={250}
                pathOptions={{
                  color: '#38bdf8',
                  fillColor: '#38bdf8',
                  fillOpacity: 0.08,
                  weight: 2,
                  dashArray: '6 8',
                }}
              />
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={8}
                pathOptions={{
                  color: '#2563eb',
                  fillColor: '#60a5fa',
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <Popup className="custom-popup">
                  <div className="rounded-2xl p-2">
                    <span className="font-bold text-slate-900">Lokasi Anda Saat Ini</span>
                  </div>
                </Popup>
              </CircleMarker>
            </>
          )}

          {/* Marker titik longsor */}
          {filteredTitik.map((titik, index) => (
            <Marker
              key={`${titik.DN}-${titik.fid}-${index}`}
              position={[Number(titik.latitude), Number(titik.longitude)]}
              icon={createCustomIcon(titik.DN)}
            >
              <Popup className="custom-popup" maxWidth={320}>
                <WeatherPopupDetail titik={titik} />
              </Popup>
            </Marker>
          ))}

          {/* Garis dari user ke titik terdekat */}
          {isNearestMode && userLocation && nearestTitik.length > 0 && (
            <>
              {nearestTitik.slice(0, 10).map((t, i) => (
                <Polyline
                  key={`line-${t.fid}-${i}`}
                  positions={[
                    [userLocation.lat, userLocation.lng],
                    [Number(t.latitude), Number(t.longitude)],
                  ]}
                  pathOptions={{
                    color: i === 0 ? '#22c55e' : '#94a3b8',
                    weight: i === 0 ? 3 : 1.5,
                    opacity: i === 0 ? 0.75 : 0.35,
                    dashArray: i === 0 ? '8 8' : '4 8',
                  }}
                />
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}

/* =========================
   Komponen bantu kecil
========================= */

function StatCard({ label, value, icon: Icon, accent = 'emerald' }) {
  const accentMap = {
    emerald: 'from-emerald-500/15 to-emerald-400/5 text-emerald-300 ring-emerald-400/20',
    red: 'from-red-500/15 to-red-400/5 text-red-300 ring-red-400/20',
    amber: 'from-amber-500/15 to-amber-400/5 text-amber-300 ring-amber-400/20',
    cyan: 'from-cyan-500/15 to-cyan-400/5 text-cyan-300 ring-cyan-400/20',
  }

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-linear-to-br ${accentMap[accent]} p-4 shadow-lg backdrop-blur-xl`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-[11px] font-medium text-white/55">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
    </div>
  )
}

function FilterButton({ active, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
        active
          ? 'border-white/15 bg-white/10 shadow-inner'
          : 'border-white/5 bg-white/0 opacity-60 hover:opacity-100 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`h-3.5 w-3.5 rounded-full ${color} shadow-lg`} />
        <span className={`text-sm ${active ? 'font-medium text-white' : 'text-white/65'}`}>
          {label}
        </span>
      </div>
      {active ? (
        <Eye className="h-4 w-4 text-emerald-300" />
      ) : (
        <EyeOff className="h-4 w-4 text-white/40" />
      )}
    </button>
  )
}

function LegendItem({ color, label, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
      <span className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full ${color}`} />
      <div>
        <p className="text-xs font-semibold text-white">{label}</p>
        <p className="text-[11px] text-white/45">{desc}</p>
      </div>
    </div>
  )
}